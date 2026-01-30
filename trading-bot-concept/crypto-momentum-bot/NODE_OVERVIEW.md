# Momentum Bot – Node / n8n Overview

Visual and node-based overview of the flow. Use the **Mermaid** diagram in any Markdown viewer (GitHub, VS Code, [mermaid.live](https://mermaid.live)) or the **n8n node list** to recreate the logic in n8n or another automation tool.

---

## Mermaid flowchart

```mermaid
flowchart TB
    subgraph trigger["⏱ Trigger"]
        T[Schedule every 5 min]
    end

    subgraph exit["Exit path (has position)"]
        E1{Current position?}
        E2[Fetch OHLCV + positions]
        E3[Compute RSI, MACD]
        E4{PnL ≤ -2% OR RSI>70 OR MACD bearish?}
        E5[Market sell – close long]
        E6[Clear position]
    end

    subgraph entry["Entry path (no position)"]
        A1[CoinGecko: get coins/markets]
        A2[Filter 1h change > 5%]
        A3[Sort by 1h gain, take top 10]
        A4[For each symbol]
        A5[Bybit: fetch OHLCV 5m]
        A6[Compute RSI & MACD]
        A7{Bullish MACD cross AND RSI<70?}
        A8[Set leverage 20x]
        A9[Market buy ~100 USDT]
        A10[Set current position]
    end

    T --> E1
    E1 -->|Yes| E2
    E1 -->|No| A1
    E2 --> E3
    E3 --> E4
    E4 -->|Yes| E5
    E5 --> E6
    E4 -->|No| T
    E6 --> T

    A1 --> A2
    A2 --> A3
    A3 --> A4
    A4 --> A5
    A5 --> A6
    A6 --> A7
    A7 -->|Yes| A8
    A7 -->|No| A4
    A8 --> A9
    A9 --> A10
    A10 --> T
```

---

## n8n-style node overview

Map each step to n8n (or similar) nodes:

| # | Node name        | Type / action        | Notes |
|---|------------------|----------------------|--------|
| 1 | **Schedule**     | Schedule Trigger     | Every 5 minutes. |
| 2 | **Has position?** | IF                  | Branch on “current position” (store in static data or DB). True → exit branch, False → entry branch. |
| 3 | **Exit – Get OHLCV** | HTTP Request / Bybit API | GET kline/candles 5m for position symbol. |
| 4 | **Exit – Get positions** | HTTP Request / Bybit API | GET position list for symbol. |
| 5 | **Exit – RSI/MACD** | Code (JavaScript) | Compute RSI(14) and MACD(12,26,9) from closes; get last values. |
| 6 | **Exit – Check conditions** | IF | PnL ≤ -2% OR RSI > 70 OR (MACD < signal OR histogram turning down). |
| 7 | **Close position** | HTTP Request / Bybit API | POST market sell (quantity = position size). Then clear “current position”. |
| 8 | **Entry – Top gainers** | HTTP Request | CoinGecko `GET /coins/markets?vs_currency=usd&order=volume_desc&per_page=100&price_change_percentage=1h`. |
| 9 | **Entry – Filter & sort** | Code (JavaScript) | Filter 1h change > 5%, sort by 1h gain desc, take top 10, map to symbols like `BTC/USDT`. |
| 10 | **Entry – Loop symbols** | Loop / SplitInBatches | Iterate over top 10 symbols. |
| 11 | **Entry – OHLCV** | HTTP Request / Bybit API | GET kline 5m for current symbol. |
| 12 | **Entry – RSI/MACD** | Code (JavaScript) | Same RSI/MACD logic; check bullish crossover (prev MACD ≤ signal, curr MACD > signal, hist > 0) and RSI < 70. |
| 13 | **Entry – Enter?** | IF | “Enter signal” true for this symbol. |
| 14 | **Set leverage** | HTTP Request / Bybit API | POST set leverage 20x for symbol. |
| 15 | **Market buy** | HTTP Request / Bybit API | POST market buy, size ≈ 100 USDT / price. |
| 16 | **Set position** | Set / Store | Save current symbol as “current position”; exit loop. |

**Data to persist:** `current_position` (symbol or null). Use n8n static data, Redis, or a small DB.

---

## Simplified Mermaid (high-level)

```mermaid
flowchart LR
    A[⏱ Every 5 min] --> B{Position?}
    B -->|Yes| C[Check exit: RSI, MACD, PnL]
    B -->|No| D[CoinGecko gainers >5%]
    C -->|Exit| E[Close long]
    D --> F[Bybit OHLCV → RSI + MACD]
    F -->|Signal| G[Open long 20x]
    E --> A
    G --> A
```

---

## Node list (flat, for copy-paste)

1. **Schedule** – every 5 min  
2. **IF** – has current position  
3. **Exit:** Get OHLCV + positions → RSI/MACD → IF (stop-loss or RSI>70 or bearish MACD) → Close position → clear position  
4. **Entry:** CoinGecko markets → filter/sort gainers → Loop symbols → OHLCV → RSI/MACD → IF (bullish cross, RSI<70) → Set leverage → Market buy → set position  

Use **NODE_OVERVIEW.md** as the single reference for both the diagram and the n8n-style node mapping.
