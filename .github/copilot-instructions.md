# GitHub Copilot / AI Agent Instructions for Success Chemistry repo

This file gives targeted, actionable guidance for AI coding agents to become productive in this repository quickly.

1. Quick summary
- Purpose: static, conversion-optimized e-commerce site served from `deploy-site/` with developer tooling and many maintenance scripts at the repo root.
- Main runtime: `local-server.js` (Express static server serving `deploy-site/`) — use `npm start` (port 8080).

2. First commands to run
- Install: `npm install`
- Start local dev server: `npm start` (serves `deploy-site/` on `http://localhost:8080`).
- Start Vite (only for React work): `npm run dev` (ports 5173/5174) — stop if not used.

3. Where to look first (key files & folders)
- `deploy-site/` — full static site source; edit pages, includes, assets here.
- `deploy-site/includes/universal-header.html` and `deploy-site/includes/universal-footer.html` — universal components used across pages.
- `deploy-site/products-data.js` — single-source product data; functions like `window.getAllProducts()` are consumed by pages.
- `local-server.js` — local Express server, routing, and debug-log behavior.
- `package.json` — install/start/build scripts.

4. Important repo conventions and patterns
- Single Source of Truth: edit only in this repo; do not copy files between folders or external CMS.
- Product data versioning: when modifying `deploy-site/products-data.js`, update the `?v=XX` query param where the script is referenced to force clients to pick up changes.
- Universal header/footer: pages are expected to include the universal files; ensure edits preserve structure and CSS classes used across pages.
- Debug logs: local debug output is written to `.cursor/debug.log` in NDJSON — use that for reproducing issues.

5. Common maintenance and automation scripts (examples)
- `sync-to-production.sh` — manual sync path for production content.
- `update-woocommerce-products.js`, `update-woocommerce-skip-images.js` — scripts that interact with WooCommerce; inspect before changing remote behavior.
- `upload-bundle-images.js`, `update-bundles-with-correct-hero-images.js` — bundle/image maintenance scripts; rely on CSV/JSON inputs in repo root.

6. Data flows & integration points
- Static site pages read `products-data.js` (client-side JS) for catalog content; updates to that file are the primary way to change product listings.
- Several Node scripts in the repo root read/write CSV/JSON (e.g., `bundle-data-extracted.json`, `product_export_*.csv`) — inspect these files when debugging data issues.
- External services: PayPal, Stripe, Google Ads integrations referenced in docs and dependencies — do not change auth flows without checking GOV/ops docs in repo.

7. Testing, debugging, and ports
- Main dev server: `http://localhost:8080` (run `npm start`).
- API server (optional): port 3001 (started via `npm run server` / `server/index.js`).
- Stop conflicting servers with `lsof -ti:<port> | xargs kill -9` (documented in README).

8. Editing safety notes for AI agents
- Preserve HTML structure in universal includes — breaking markup will affect many pages.
- When modifying product data, update the version query param and validate `getAllProducts()` remains available to pages.
- For scripts interacting with external APIs (WooCommerce, PayPal, Google Ads), avoid running writes against production without an operator-approved checklist.

9. Where to add unit/e2e tests (if requested)
- There are no built-in test frameworks in this repo. If adding tests, place them in a top-level `tests/` folder and add scripts to `package.json`.

10. Contact / follow-ups
- If anything is unclear: point to `README.md`, `DEPLOYMENT_WORKFLOW.md`, and `.cursor/debug.log` for runtime clues.

Edit this file if you add CI, tests, or change the deployment (Vercel/Render) workflow.
