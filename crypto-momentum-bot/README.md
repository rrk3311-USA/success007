# Crypto Momentum Trading Bot

Bybit perpetual futures bot: top hourly gainers (CoinGecko) + MACD/RSI entry and exit, 20x leveraged longs, one position at a time, stop-loss -2%.

## Setup

```bash
pip install -r requirements.txt
cp .env.example .env
# Edit .env: set BYBIT_API_KEY and BYBIT_SECRET (use testnet first)
```

## Config (in `momentum_bot.py`)

- **LEVERAGE** – 20x
- **SCAN_INTERVAL_MIN** – 5
- **MIN_HOURLY_GAIN_PCT** – 5% (only consider coins with >5% 1h gain)
- **RSI_OVERBOUGHT** – 70 (exit when RSI > 70)
- **TRADE_AMOUNT_USDT** – 100 per trade
- **STOP_LOSS_PCT** – -2%

## Entry

- Symbol in top 10 hourly gainers (>5% 1h from CoinGecko).
- Bullish MACD crossover (MACD crosses above signal).
- RSI < 70.

## Exit

- Stop-loss: PnL ≤ -2%.
- RSI > 70.
- Bearish MACD (MACD < signal or histogram turning down).

## Run

```bash
python momentum_bot.py
```

Stops with Ctrl+C. Use **Bybit testnet** and backtest before live.

## Deploy (VPS)

Run in a screen/tmux or as a service; logs go to stdout. For 24/7, use systemd or cron with `python momentum_bot.py`.
