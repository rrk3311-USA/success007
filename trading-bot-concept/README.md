# Trading Bot Concept

This folder is **not deployed** with the Success Chemistry site. It stays in the repo for your own use.

## Contents

- **crypto-momentum-bot/** – Python bot: Bybit perpetuals, CoinGecko gainers, MACD/RSI, APScheduler. Run locally or on a VPS.
- **workflow-builder/** – Visual workflow UI (React Flow). Run with `npm run dev` for local use only.

## Run locally

**Crypto momentum bot:**
```bash
cd crypto-momentum-bot
pip install -r requirements.txt
# set BYBIT_API_KEY, BYBIT_SECRET in .env (use testnet first)
python momentum_bot.py
```

**Workflow Builder:**
```bash
cd workflow-builder
npm install
npm run dev
```
Then open http://localhost:5174

## Deploy

This folder is ignored by Vercel (see root `.vercelignore`). To deploy the trading bot or workflow builder elsewhere, use a separate project or copy this folder to its own repo.
