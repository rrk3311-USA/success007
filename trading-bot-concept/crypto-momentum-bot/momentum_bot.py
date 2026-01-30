#!/usr/bin/env python3
"""
Crypto momentum trading bot – Bybit perpetual futures (20x leveraged longs).
Fetches top hourly gainers from CoinGecko, uses MACD + RSI for entry/exit,
scans every 5 minutes via APScheduler. One position at a time, stop-loss -2%.
"""

import os
import time
import logging
from datetime import datetime

import ccxt
import pandas as pd
from pycoingecko import CoinGeckoAPI
from apscheduler.schedulers.background import BackgroundScheduler

# -----------------------------------------------------------------------------
# Config (override via env: BYBIT_API_KEY, BYBIT_SECRET, optional .env)
# -----------------------------------------------------------------------------
EXCHANGE_ID = "bybit"
LEVERAGE = 20
SCAN_INTERVAL_MIN = 5
MIN_HOURLY_GAIN_PCT = 5.0
RSI_PERIOD = 14
RSI_OVERBOUGHT = 70
MACD_FAST = 12
MACD_SLOW = 26
MACD_SIGNAL = 9
TRADE_AMOUNT_USDT = 100
STOP_LOSS_PCT = -2.0  # exit long if PnL <= -2%
TOP_GAINERS_LIMIT = 100
TOP_GAINERS_USE = 10  # consider top N for entry
OHLCV_TIMEFRAME = "5m"
OHLCV_LIMIT = 100

# Load env from .env if python-dotenv is available
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

# -----------------------------------------------------------------------------
# Logging
# -----------------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger(__name__)

# -----------------------------------------------------------------------------
# Exchange (Bybit USDT perpetuals) and CoinGecko
# -----------------------------------------------------------------------------
_bybit_options = {"defaultType": "future"}
if os.environ.get("BYBIT_TESTNET", "").lower() in ("1", "true", "yes"):
    _bybit_options["sandbox"] = True  # Use Bybit testnet

exchange = ccxt.bybit({
    "apiKey": os.environ.get("BYBIT_API_KEY", "YOUR_API_KEY"),
    "secret": os.environ.get("BYBIT_SECRET", "YOUR_SECRET"),
    "enableRateLimit": True,
    "options": _bybit_options,
})
cg = CoinGeckoAPI()

# Track current long position (one at a time)
current_position = None


def symbol_ccxt(symbol_coingecko: str) -> str:
    """Convert CoinGecko symbol (e.g. 'btc') to CCXT symbol for Bybit futures (e.g. 'BTC/USDT')."""
    base = symbol_coingecko.upper().strip()
    return f"{base}/USDT"


def compute_rsi(closes: list, period: int = RSI_PERIOD) -> float:
    """Compute RSI from list of close prices. Returns last RSI value or NaN if insufficient data."""
    df = pd.DataFrame({"close": closes})
    delta = df["close"].diff()
    gain = delta.where(delta > 0, 0.0).rolling(window=period).mean()
    loss = (-delta.where(delta < 0, 0.0)).rolling(window=period).mean()
    rs = gain / loss
    rsi = 100 - (100 / (1 + rs))
    return float(rsi.iloc[-1]) if len(rsi.dropna()) else float("nan")


def compute_macd(
    closes: list,
    fast: int = MACD_FAST,
    slow: int = MACD_SLOW,
    signal: int = MACD_SIGNAL,
):
    """Compute MACD line, signal line, and histogram. Returns (macd_line, signal_line, histogram) for last bar."""
    df = pd.DataFrame({"close": closes})
    ema_fast = df["close"].ewm(span=fast, adjust=False).mean()
    ema_slow = df["close"].ewm(span=slow, adjust=False).mean()
    macd_line = ema_fast - ema_slow
    signal_line = macd_line.ewm(span=signal, adjust=False).mean()
    histogram = macd_line - signal_line
    return (
        float(macd_line.iloc[-1]),
        float(signal_line.iloc[-1]),
        float(histogram.iloc[-1]),
    )


def get_top_gainers(limit: int = TOP_GAINERS_LIMIT) -> list:
    """
    Fetch coins from CoinGecko with 1h price change, filter by MIN_HOURLY_GAIN_PCT,
    sort by 1h gain, return CCXT symbols (e.g. 'BTC/USDT') for up to TOP_GAINERS_USE.
    """
    try:
        coins = cg.get_coins_markets(
            vs_currency="usd",
            order="volume_desc",
            per_page=limit,
            page=1,
            sparkline=False,
            price_change_percentage="1h",
        )
    except Exception as e:
        logger.warning("CoinGecko get_coins_markets failed: %s", e)
        return []

    # Extract 1h change (API field may vary) and build (symbol_ccxt, change_1h)
    candidates = []
    for coin in coins:
        change_1h = (
            coin.get("price_change_percentage_1h_in_currency")
            or coin.get("price_change_percentage_1h")
        )
        if change_1h is None:
            change_1h = coin.get("price_change_percentage_24h")
        if change_1h is None:
            continue
        try:
            pct = float(change_1h)
        except (TypeError, ValueError):
            continue
        if pct > MIN_HOURLY_GAIN_PCT:
            sym = coin.get("symbol") or ""
            if sym:
                candidates.append((symbol_ccxt(sym), pct))
    # Sort by 1h gain descending, take top N
    candidates.sort(key=lambda x: -x[1])
    return [s for s, _ in candidates[:TOP_GAINERS_USE]]


def should_enter(symbol: str) -> bool:
    """
    Entry: bullish MACD crossover (MACD crosses above signal) + RSI < 70 + histogram > 0.
    Assumes symbol is already in top hourly gainers (>5%).
    """
    try:
        ohlcv = exchange.fetch_ohlcv(symbol, timeframe=OHLCV_TIMEFRAME, limit=OHLCV_LIMIT)
        if len(ohlcv) < MACD_SLOW + MACD_SIGNAL:
            return False
        closes = [c[4] for c in ohlcv]
        rsi = compute_rsi(closes)
        if pd.isna(rsi) or rsi >= RSI_OVERBOUGHT:
            return False
        macd, signal, hist = compute_macd(closes)
        prev_macd, prev_signal, _ = compute_macd(closes[:-1])
        # Bullish crossover: previous bar MACD <= signal, current bar MACD > signal
        crossover = prev_macd <= prev_signal and macd > signal and hist > 0
        return crossover
    except Exception as e:
        logger.debug("should_enter %s: %s", symbol, e)
        return False


def should_exit(symbol: str) -> bool:
    """
    Exit on: stop-loss (PnL <= -2%), or RSI > 70, or bearish MACD (MACD < signal or histogram turning down).
    """
    try:
        ohlcv = exchange.fetch_ohlcv(symbol, timeframe=OHLCV_TIMEFRAME, limit=OHLCV_LIMIT)
        if len(ohlcv) < 2:
            return False
        closes = [c[4] for c in ohlcv]
        current_price = closes[-1]

        # Check stop-loss: compare position entry to current price
        positions = exchange.fetch_positions([symbol])
        for pos in positions:
            if pos.get("symbol") != symbol or pos.get("side") != "long":
                continue
            entry_price = pos.get("entryPrice")
            contracts = pos.get("contracts") or pos.get("contractSize") or 0
            if entry_price and contracts and float(contracts) != 0:
                pnl_pct = (float(current_price) - float(entry_price)) / float(entry_price) * 100
                if pnl_pct <= STOP_LOSS_PCT:
                    logger.info("Stop-loss triggered %s: PnL %.2f%%", symbol, pnl_pct)
                    return True

        rsi = compute_rsi(closes)
        macd, signal, hist = compute_macd(closes)
        _, _, prev_hist = compute_macd(closes[:-1])

        if not pd.isna(rsi) and rsi > RSI_OVERBOUGHT:
            return True
        if macd < signal:
            return True
        if hist < 0 and hist < prev_hist:
            return True
        return False
    except Exception as e:
        logger.debug("should_exit %s: %s", symbol, e)
        return False


def enter_long(symbol: str) -> None:
    """Set leverage, then open market long for TRADE_AMOUNT_USDT. One position at a time."""
    global current_position
    if current_position:
        logger.debug("Already in position %s, skip entry", current_position)
        return
    try:
        exchange.set_leverage(LEVERAGE, symbol)
        ticker = exchange.fetch_ticker(symbol)
        price = ticker["last"]
        if not price or price <= 0:
            logger.warning("Invalid price for %s", symbol)
            return
        # Amount in base currency (e.g. BTC) for ~TRADE_AMOUNT_USDT
        quantity = TRADE_AMOUNT_USDT / float(price)
        order = exchange.create_market_buy_order(symbol, quantity)
        logger.info("ENTERED LONG %s @ %s qty=%s order=%s", symbol, price, quantity, order.get("id"))
        current_position = symbol
    except Exception as e:
        logger.exception("Entry failed %s: %s", symbol, e)


def close_position() -> None:
    """Close current long by market sell. Clears current_position on success."""
    global current_position
    if not current_position:
        return
    symbol = current_position
    try:
        positions = exchange.fetch_positions([symbol])
        for pos in positions:
            if pos.get("symbol") != symbol or pos.get("side") != "long":
                continue
            qty = pos.get("contracts") or pos.get("contractSize") or pos.get("contracts", 0)
            if qty is None:
                qty = pos.get("amount") or 0
            qty = float(qty)
            if qty > 0:
                exchange.create_market_sell_order(symbol, qty)
                logger.info("CLOSED LONG %s qty=%s", symbol, qty)
            break
        current_position = None
    except Exception as e:
        logger.exception("Exit failed %s: %s", symbol, e)


def trading_loop() -> None:
    """Run every SCAN_INTERVAL_MIN: exit if conditions met, else scan gainers and enter one long."""
    logger.info("Scan at %s", datetime.now().isoformat())
    try:
        if current_position:
            if should_exit(current_position):
                close_position()
            return

        gainers = get_top_gainers()
        if not gainers:
            logger.debug("No gainers above %.1f%%", MIN_HOURLY_GAIN_PCT)
            return
        for symbol in gainers:
            if should_enter(symbol):
                enter_long(symbol)
                break
    except Exception as e:
        logger.exception("Trading loop error: %s", e)


def main() -> None:
    scheduler = BackgroundScheduler()
    scheduler.add_job(trading_loop, "interval", minutes=SCAN_INTERVAL_MIN)
    scheduler.start()
    logger.info("Momentum bot started: scan every %s min, trade %s USDT, leverage %sx", SCAN_INTERVAL_MIN, TRADE_AMOUNT_USDT, LEVERAGE)
    try:
        while True:
            time.sleep(1)
    except (KeyboardInterrupt, SystemExit):
        scheduler.shutdown()
        logger.info("Bot stopped.")


if __name__ == "__main__":
    main()
