# SCV2 todo

- [ ] **Classic Medusa store (foundation)**  
  Get the core store done: Medusa backend deployed, SCV2 wired to it (cart, checkout, products). Don’t mess up this base.

- [ ] **Companion (side project page)**  
  See `docs/COMPANION_VISION.md`. Core conversion product: chat + voice, pulls up items, live-generated feel. Build on a **dedicated page** (e.g. `/experience`) so the foundational store stays stable. Lazy-loaded, edge, RAG, journeys—tune later.

- [ ] **Product images – card-hero and mobile sizes**
  - Add 750px images to `public/images/products-card-hero/` (mirror structure of `public/images/products/`, e.g. `52274-401/01.png`). Used for: product cards, store grid, bundles, upsell, recently viewed.
  - Add ~400px images to `public/images/products-mobile/` (same structure). Used for: product page main image on mobile (below 768px), product page thumbnails.
  - Optional: add a script (e.g. Sharp) to generate card-hero and mobile from current `public/images/products/` images.


Postgress what it is fins out
