# What to decide next (SCV2)

Current stack: **Medusa font (Inter)** + **Phosphor icons** + **one header/footer** + **live ProductCard** + **BodyProse** for blog/body.

## Decisions to make

1. **Medusa backend**
   - Run Medusa locally (`http://localhost:9000`) or deploy backend first (e.g. Render)?
   - Connect SCV2 to backend via `NEXT_PUBLIC_MEDUSA_BACKEND_URL` and use `@medusajs/js-sdk` for products, cart, checkout.

2. **Product & cart**
   - Product detail page: layout, add-to-cart, variants (if any).
   - Cart: persist in Medusa (customer/session) or local state until checkout.
   - Checkout: Medusa checkout flow or custom (Stripe, etc.).

3. **Payments**
   - Stripe (or other) via Medusa; set up webhooks and order notifications (email/Slack).

4. **Content & blog**
   - Keep static blog samples or add CMS (e.g. Markdown, headless CMS) for real posts.
   - Policy pages: Terms, Shipping, Privacy, Contact – static or CMS.

5. **Deploy**
   - Deploy SCV2: Vercel, Render static, or same host as Medusa.
   - Medusa backend: Render, Railway, or VPS; Postgres + Redis as required.

6. **Fulfillment**
   - ShipStation (or other) integration with Medusa for orders and tracking.

7. **Admin**
   - Use Medusa Admin as-is at `/admin` (or separate URL); no custom admin unless needed.

---

*Update this file as decisions are made.*
