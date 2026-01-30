# SCV2 – Success Chemistry V2

Medusa storefront from the start. Header and footer styled like the current Success Chemistry site. Uses **Phosphor icons** and **shadcn-style** utilities (Tailwind + `cn`).

## Stack

- **Next.js 14** (App Router)
- **Medusa** – storefront talks to Medusa backend (`@medusajs/js-sdk`)
- **Phosphor Icons** – `@phosphor-icons/react`
- **Tailwind CSS** – styling; header/footer match current site
- **Vercel** – deploy this folder as a separate project (e.g. project name **SCV2**)

## Setup

1. **Install and run (local)**

   ```bash
   cd SCV2
   npm install
   npm run dev
   ```

   Open [http://localhost:8000](http://localhost:8000).

2. **Medusa backend**

   Run a Medusa backend (e.g. `create-medusa-app` or Medusa Cloud). Set in `.env`:

   - `NEXT_PUBLIC_MEDUSA_BACKEND_URL` – backend URL (e.g. `http://localhost:9000`)
   - `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` – publishable key from Medusa Admin

3. **Admin**

   - **This app:** [http://localhost:8000/admin](http://localhost:8000/admin) – links to Medusa Admin.
   - **Medusa Admin:** runs with your backend (e.g. `http://localhost:7001`).

## Deploy to Vercel

1. In Vercel, create a new project.
2. Set **Root Directory** to `SCV2` (if this repo is the whole repo, point at the repo and set root to `SCV2`).
3. Build command: `npm run build`. Output: default Next.js.
4. Add env vars: `NEXT_PUBLIC_MEDUSA_BACKEND_URL`, `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`, `NEXT_PUBLIC_BASE_URL` (your Vercel URL).

## Pages

- **/** – Home (hero + Shop / Admin CTAs).
- **/admin** – Link to Medusa Admin.
- **/store** – Shop (add later; will use Medusa products).
- **/cart** – Cart (add later; will use Medusa cart).
