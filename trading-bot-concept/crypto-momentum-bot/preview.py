#!/usr/bin/env python3
"""
Local preview of the momentum bot – simulates one scan cycle with fake data.
No API keys or network required. Run: python3 preview.py
"""

import logging
from datetime import datetime

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger(__name__)

def main():
    logger.info("Momentum bot started: scan every 5 min, trade 100 USDT, leverage 20x")
    logger.info("Scan at %s", datetime.now().isoformat())
    # Simulate: no current position, fetch gainers, check entry
    logger.info("Fetching top hourly gainers from CoinGecko (volume_desc, 1h change > 5%)...")
    fake_gainers = ["PEPE/USDT", "WIF/USDT", "BONK/USDT", "FLOKI/USDT", "DOGE/USDT"]
    logger.info("Top gainers: %s", ", ".join(fake_gainers[:5]))
    logger.info("Checking entry: PEPE/USDT – fetch OHLCV 5m, compute RSI/MACD...")
    logger.info("PEPE/USDT: RSI=58, MACD crossover=yes, hist>0 – ENTRY signal")
    logger.info("ENTERED LONG PEPE/USDT @ 0.00001234 qty=8103725 order=abc123")
    logger.info("(Next scan in 5 min. Current position: PEPE/USDT)")
    logger.info("")
    logger.info("Preview done. Run the real bot: pip install -r requirements.txt && python momentum_bot.py")

if __name__ == "__main__":
    main()
