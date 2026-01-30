# Medusa official add-ons: Stripe, PayPal, subscriptions, and more

This doc lists the main **official** (or recommended) Medusa add-ons and how to install/configure them in `SCV2/medusa-backend`. Subscriptions are built via a **recipe** (no single package).

**Payment Module reference:** [Payment Module](https://docs.medusajs.com/resources/commerce-modules/payment) – authorize/capture/refund, payment collections, providers (Stripe, etc.), saved payment methods, webhooks. Admin: [Orders – Payments](https://docs.medusajs.com/user-guide/orders/payments).

---

## 1. Stripe (already wired)

**Status:** Already added in `medusa-config.ts` as a Payment module provider.

- **No extra npm install** – Stripe is part of `@medusajs/medusa` (payment-stripe).
- **Config:** In `medusa-backend/.env` add:
  ```env
  STRIPE_API_KEY=sk_test_...
  STRIPE_WEBHOOK_SECRET=whsec_...   # optional for local; required for production
  ```
- **Admin:** In Medusa Admin → **Settings** → **Regions** → edit a region → **Payment providers** → enable **Stripe**.
- **Docs:** [Stripe Module Provider](https://docs.medusajs.com/resources/commerce-modules/payment/payment-provider/stripe).

---

## 2. PayPal (payments for Medusa v2)

**Status:** Not in core. Use a community package and register it as a **Payment Module Provider** in `medusa-config.ts`.

- **v2 option – `medusa-payment-paypal` (v2 testing):**  
  [GitHub discussion](https://github.com/medusajs/medusa/discussions/9346) · [npm](https://www.npmjs.com/package/medusa-payment-paypal) (e.g. 6.0.5)  
  ```bash
  cd ~/Documents/GitHub/success007/SCV2/medusa-backend
  npm install medusa-payment-paypal
  ```
  Then add its **provider** to the Payment module in `medusa-config.ts` (same `modules` → `payment` → `providers` array as Stripe). Use the package’s README or repo for the exact `resolve` path and `options` (v2 uses the Payment Module provider API, not the v1 `plugins` array).  
  **Note:** Still beta for v2; some config/tsconfig and webhook issues reported. Medusa may ship an official v2 PayPal provider later.

- **Alternative – `@alphabite/medusa-paypal`:**  
  If that package exposes a v2 Payment Module Provider, install it and add it to `providers` in `medusa-config.ts` with the options it documents.

- **Env (typical):**  
  ```env
  PAYPAL_SANDBOX=true
  PAYPAL_CLIENT_ID=...
  PAYPAL_CLIENT_SECRET=...
  PAYPAL_AUTH_WEBHOOK_ID=...   # if the provider uses webhooks
  ```

- **Official (v1) reference:** [PayPal plugin](https://docs.medusajs.com/plugins/payment/paypal) – env and flow are similar; v2 config is via `modules` + `providers`, not `plugins`.

---

## 3. Subscriptions

**Status:** No single “subscriptions” package. You build it using Medusa’s framework (recipe).

- **Docs:** [Subscriptions Recipe](https://docs.medusajs.com/resources/recipes/subscriptions).
- **Two approaches:**
  1. **Custom logic (any payment provider):** Subscription module + data model, workflows (complete cart → create subscription), API route, and **scheduled jobs** to run renewals and handle expired subscriptions. Works with Stripe, PayPal, or manual.
  2. **Stripe Subscriptions:** Use Stripe’s subscription/billing; build a custom Stripe Subscription provider that plugs into the Payment module. Stripe-only.
- **Free:** The recipe and framework are part of Medusa (no extra license). You only pay your payment provider (Stripe/PayPal) for processing.

---

## 4. Other official / useful add-ons

| Add-on | Purpose | Install / doc |
|--------|--------|----------------|
| **Redis** | Sessions, events, workflows (production) | Set `REDIS_URL` in `.env`; already referenced in `medusa-config.ts`. Use Upstash or your host’s Redis. |
| **Stripe** | Card + many payment methods | Already in config; add `STRIPE_API_KEY` (see above). |
| **Notifications (e.g. Sendgrid)** | Emails (order confirmation, etc.) | [Notification Module](https://docs.medusajs.com/resources/commerce-modules/notification) – add a provider (e.g. Sendgrid) in `modules` in `medusa-config.ts`. |
| **File storage (S3)** | Product images, files | [File Module](https://docs.medusajs.com/resources/commerce-modules/file) – use S3 provider for production uploads. |
| **Cache (Redis)** | Performance | [Caching Module](https://docs.medusajs.com/resources/infrastructure-modules/caching/providers/redis) – add Redis cache provider in `modules`. |
| **Search (e.g. MeiliSearch)** | Product search | Community / integrations; see [medusajs.com/plugins](https://medusajs.com/plugins). |
| **Translation** | Locales, multi-language products/regions/etc. | Already added in `medusa-config.ts` + `featureFlags.translation: true`. Run `npx medusa db:migrate`. [Translation Module](https://docs.medusajs.com/resources/commerce-modules/translation). |

---

## 5. Quick reference: install commands

Run from **`SCV2/medusa-backend`**:

```bash
# Stripe – no install; add STRIPE_API_KEY to .env and enable in Admin.
# PayPal (official-style)
npm install medusa-payment-paypal

# PayPal (community, if v2-compatible)
npm install @alphabite/medusa-paypal
```

After installing a PayPal provider, add it to the Payment module’s `providers` array in `medusa-config.ts` (and set the required env vars). Subscriptions are implemented by following the [Subscriptions Recipe](https://docs.medusajs.com/resources/recipes/subscriptions); no “subscription package” to install.
