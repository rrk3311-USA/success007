# Real (hosted) Medusa setup – Supabase + Redis + backend

Use this when you want orders in the cloud, Admin from any device, and SCV2 talking to a real backend (not local).

**Install size (local):** A full Medusa backend (`create-medusa-app` + `npm install`) is **large**—often **500 MB–1 GB+** for `node_modules`. The backend pulls in Postgres/TypeORM, Redis, Bull queues, Admin (React), and many plugins, so the first download can take several minutes. Normal.

**Backend inside SCV2:** You can keep the Medusa backend in this repo under `SCV2/medusa-backend`. To create it there and start it:

1. From your machine, go to the SCV2 folder:
   ```bash
   cd ~/Documents/GitHub/success007/SCV2
   ```
2. Create the backend (run locally; the CLI will create a new subfolder):
   ```bash
   npx create-medusa-app@latest
   ```
   When it asks for the **project name** or **directory**, enter: **`medusa-backend`**. It will create `SCV2/medusa-backend` and install there.
3. After it finishes, start the backend:
   ```bash
   cd medusa-backend
   npm run dev
   ```
4. Open Admin: **http://localhost:9000/app**

---

You need **three** things:

1. **PostgreSQL** (Supabase free tier)
2. **Redis** (Upstash free tier – for Medusa sessions, events, workflows)
3. **Medusa backend** (Render or Railway – runs API + Admin)

Then point **SCV2** at the deployed backend.

---

## 1. Supabase (Postgres)

**Project ref (this repo):** `ncwubhefvxmojxseryjo`. Cursor MCP config: see [SUPABASE_MCP.md](./SUPABASE_MCP.md).

1. Go to [supabase.com](https://supabase.com) → Sign in → **New project**.
2. Pick org, name (e.g. `medusa-scv2`), database password (save it), region → **Create**.
3. In the project: **Settings** → **Database**.
4. Copy the **Connection string** → **URI**. It looks like:
   ```text
   postgresql://postgres.[ref]:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres
   ```
5. Replace `[YOUR-PASSWORD]` with your DB password. This is your **`DATABASE_URL`** (keep it secret).

---

## 2. Redis (Upstash)

Medusa needs Redis for sessions, event bus, workflow engine, caching, locking.

1. Go to [upstash.com](https://upstash.com) → Sign in → **Create database**.
2. Name (e.g. `medusa-redis`), region (pick one near your backend), **Free** tier → **Create**.
3. Open the database → **REST API** or **Connect**.
4. Copy the **Redis URL** (e.g. `rediss://default:xxx@xxx.upstash.io:6379`). This is your **`REDIS_URL`**.

If Upstash only shows REST URL/token, check their docs for “Redis URL” or use **Redis Cloud** free tier and get a `redis://` or `rediss://` URL instead.

---

## 3. Medusa backend (Render or Railway)

You need a **Medusa v2** backend repo. Two paths:

### Option A: Railway (simplest)

1. Go to [railway.app](https://railway.app) → Sign in (e.g. GitHub).
2. **New Project** → **Deploy from GitHub repo**.
3. Use Medusa’s template or a repo from [create-medusa-app](https://docs.medusajs.com/create-medusa-app):
   - Or: **“Deploy medusajs”** template if available (adds Postgres + Redis on Railway).
4. In the deployed service, set **Environment Variables**:
   - `DATABASE_URL` = Supabase URI from step 1
   - `REDIS_URL` = Upstash (or Redis) URL from step 2
   - `COOKIE_SECRET` = long random string (e.g. `openssl rand -hex 32`)
   - `JWT_SECRET` = another long random string
   - `MEDUSA_WORKER_MODE` = `server` (for the main API+Admin instance)
   - `STORE_CORS` = your SCV2 URL (e.g. `https://scv2-success-chemistry.vercel.app`)
   - `ADMIN_CORS` = same as backend URL (e.g. `https://your-medusa-backend.up.railway.app`)
   - `AUTH_CORS` = `https://scv2-...,https://your-medusa-backend...`
5. Redeploy. Backend URL = e.g. `https://your-app.up.railway.app`.
6. **Worker**: Add a second service/instance with same repo, env:
   - `MEDUSA_WORKER_MODE` = `worker`
   - `DISABLE_MEDUSA_ADMIN` = `true`
   - Same `DATABASE_URL`, `REDIS_URL`, `COOKIE_SECRET`, `JWT_SECRET`.

### Option B: Render

1. [render.com](https://render.com) → Sign in → **New** → **Web Service**.
2. Connect your GitHub and select (or create) a Medusa backend repo.
3. **Environment**:
   - `DATABASE_URL` = Supabase URI
   - `REDIS_URL` = Upstash/Redis URL
   - `COOKIE_SECRET`, `JWT_SECRET` = random secrets
   - `MEDUSA_WORKER_MODE` = `server`
   - `STORE_CORS`, `ADMIN_CORS`, `AUTH_CORS` as above
4. **Build**: `npm install && npm run build` (or your Medusa build).
5. **Start**: run from `.medusa/server` – e.g. `cd .medusa/server && npm install && npm run start`, or use Render’s “Predeploy” to run `medusa db:migrate`.
6. Create a **second** service for the worker (same repo, `MEDUSA_WORKER_MODE=worker`, `DISABLE_MEDUSA_ADMIN=true`).

Official details: [Medusa – General Deployment](https://docs.medusajs.com/learn/deployment/general).

---

## 4. Create admin user and get publishable key

1. Open backend URL, e.g. `https://your-backend.up.railway.app/health` → should return OK.
2. Admin: `https://your-backend.up.railway.app/app`.
3. Create admin user (if your host allows CLI):
   ```bash
   npx medusa user -e admin@yourdomain.com -p YourSecurePassword
   ```
   Or use the seed/setup flow if the template provides it.
4. Log in to Admin → **Settings** → **Sales Channels** → create or open the channel for SCV2.
5. Copy the **Publishable Key** (e.g. `pk_...`). SCV2 will use this.

---

## 5. Point SCV2 at the real backend

In **SCV2** (Vercel env vars or `.env.local`):

```env
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://your-medusa-backend.up.railway.app
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_xxxx
NEXT_PUBLIC_MEDUSA_ADMIN_URL=https://your-medusa-backend.up.railway.app/app
```

Redeploy SCV2. Storefront will use the live API; Admin link will open the real Medusa Admin.

---

## Summary

| Piece        | Free option   | Purpose                    |
|-------------|---------------|----------------------------|
| Postgres    | Supabase      | Products, orders, data     |
| Redis       | Upstash       | Sessions, events, workflows|
| Medusa API  | Railway/Render| Backend + Admin            |
| SCV2        | Vercel        | Your storefront (already)  |

Everything lives in the cloud; no dependency on your PC. Orders and Admin are available from any device.
