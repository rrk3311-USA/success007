# Zia AI Chat Widget

Floating chat widget that uses your **trained ZiaAgents Success Chemistry assistant** on the site. It appears on every page and acts as a main conversion/support tool.

## What it does
- **Animated bot** – Floating button (bottom-right) with pulse animation and friendly bot face (eyes + smile).
- **Follows the user** – Same widget on all pages; conversation persists via session.
- **Trained agent** – Uses the same knowledge base and tools you trained (products, orders, CRM, guidelines).
- **Conversion tool** – Great for product questions, shipping, support, and moving visitors toward purchase.

## Where it’s loaded
- **Homepage** (`deploy-site/index.html`) – Script added before `</body>`.
- **Any page using** `deploy-site/includes/footer.html` – Footer includes the widget script.

To add it to another page, add before `</body>`:
```html
<script src="/includes/zia-chat-widget.js" defer></script>
```

## Local (development)
1. Start the server: `npm run start` (or `node local-server.js`).
2. Open e.g. `http://localhost:8080` – the widget loads and talks to `POST /api/zia/chat` on the same server.
3. The server uses `zia-chat-proxy.js` (with your `.env` Zoho/ZiaAgents credentials) to call the ZiaAgents API.

## Production (deployed site)
- **Option A – Same server as frontend**  
  Deploy `local-server.js` (or equivalent) with the same routes and env. The widget will call `/api/zia/chat` on the same origin; no extra config.

- **Option B – API on a different origin**  
  Before the widget script, set:
  ```html
  <script>window.ZIA_CHAT_API_BASE = 'https://your-api-server.com';</script>
  <script src="/includes/zia-chat-widget.js" defer></script>
  ```
  Then the widget will call `https://your-api-server.com/api/zia/chat`. That server must expose `POST /api/zia/chat` and use `zia-chat-proxy.js` (or the same logic) with Zoho OAuth and ZiaAgents env vars.

## Files
- `deploy-site/includes/zia-chat-widget.js` – Self-contained widget (injects button + panel + logic).
- `deploy-site/includes/zia-chat-widget.html` – Optional full HTML/CSS/JS snippet if you prefer to paste into a single page.
- `zia-chat-proxy.js` (project root) – Server-side proxy used by `local-server.js`; keep OAuth and ZiaAgents credentials on the server.

## Customization
- **API base URL**: Set `window.ZIA_CHAT_API_BASE` (see Production Option B).
- **Styling**: Edit the CSS inside `zia-chat-widget.js` (or in `zia-chat-widget.html` if you use that). Variables like `--zia-accent` and `--zia-bg` control colors.
