# PayPal from Success project

SCV2 uses the **same PayPal client ID** and **dynamic buttons** (Venmo, Pay Later, funding-eligibility) as the success project.

## Credentials

- **Source:** `deploy-site/config.js` (or `secrets-personal` if you moved them).
- **Production client ID:** `CONFIG.PAYPAL.PRODUCTION_CLIENT_ID`
- **Sandbox client ID:** `CONFIG.PAYPAL.SANDBOX_CLIENT_ID`

## SCV2 setup

1. In **`SCV2/.env.local`** add:
   ```env
   NEXT_PUBLIC_PAYPAL_CLIENT_ID=<paste PRODUCTION_CLIENT_ID or SANDBOX_CLIENT_ID from deploy-site/config.js>
   ```
2. Restart the dev server. The cart page will load the PayPal SDK with:
   - **Venmo** and **Pay Later** enabled
   - **Credit** disabled
   - **Funding eligibility** so the right buttons show

## Where it’s used

- **Cart:** `src/app/cart/page.tsx` uses `PayPalButtons` (gold, vertical, rect, height 55).
- **SDK URL:** `src/lib/paypal-sdk.ts` builds the script URL with the same query params as success cart (`enable-funding=venmo,paylater`, `disable-funding=credit`, `components=buttons,funding-eligibility`).

No server-side PayPal API is required for the current flow; create/capture use the JS SDK (same as success cart).
