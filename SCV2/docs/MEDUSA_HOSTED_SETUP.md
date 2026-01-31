# Real (hosted) Medusa setup – Supabase + Redis + backend

Use this when you want orders in the cloud, Admin from any device, and SCV2 talking to a real backend (not local).

---

## What to do next to have Admin work online (checklist)

1. **Deploy the Medusa backend** (Railway or Render)  
   - Repo: this repo (`success007`).  
   - **Root directory:** `deploy-site/medusa-backend`.  
   - Set env vars (see “Using your existing Supabase + Upstash” below and “3. Medusa backend”):  
     `DATABASE_URL`, `REDIS_URL`, `COOKIE_SECRET`, `JWT_SECRET`, `STORE_CORS`, `ADMIN_CORS`, `AUTH_CORS`, `MEDUSA_WORKER_MODE=server`.  
   - After deploy you get a URL like `https://your-app.up.railway.app`.

2. **Open Admin in the browser**  
   - Go to `https://your-app.up.railway.app/app` (or your Render URL + `/app`).  
   - If the backend asks for a user, create one (see “4. Create admin user” below).

3. **Get the publishable key**  
   - In Admin: **Settings → Sales Channels** → open your channel → copy **Publishable Key** (`pk_...`).

4. **Point SCV2 (Vercel) at the backend**  
   - In Vercel → your SCV2 project → **Settings → Environment Variables** add:  
     - `NEXT_PUBLIC_MEDUSA_BACKEND_URL` = `https://your-app.up.railway.app`  
     - `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` = `pk_...`  
   - Redeploy SCV2. Your storefront will use the live API; the Admin link on the site can point to the same backend URL.

Details for each step are in the sections below.

---

## Finish setup in Railway (click-by-click)

1. **Railway dashboard** → Your project (e.g. the one with SCV2).
2. **New** (or **+ New**) → **GitHub Repo** (or **Empty Service** then connect repo).
3. Choose repo: **rrk3311-USA/success007**.
4. **Settings** (or **Configure**) for the new service:
   - **Root Directory:** set to `deploy-site/medusa-backend` (so this service runs the backend, not the Next.js app).
   - **Build:** leave default (`npm install && npm run build`).
   - **Start:** leave default (`npm run start` or `medusa start`).
5. **Variables** → Add:
   - `DATABASE_URL` = your Supabase Postgres URI  
   - `REDIS_URL` = your Upstash Redis URL  
   - `COOKIE_SECRET` = run `openssl rand -hex 32` and paste  
   - `JWT_SECRET` = run `openssl rand -hex 32` again and paste  
   - `MEDUSA_WORKER_MODE` = `server`  
   - `STORE_CORS` = `https://scv2-success-chemistry.vercel.app`  
   - After first deploy, set `ADMIN_CORS` and `AUTH_CORS` to your backend URL (e.g. `https://your-svc.up.railway.app`).
6. **Deploy** (or push to trigger deploy). Copy the generated URL (e.g. `https://xxx.up.railway.app`).
7. Admin: open **`https://xxx.up.railway.app/app`** in the browser.

---

## Using your existing Supabase + Upstash credentials

You already have Supabase (Postgres) and Upstash (Redis). The Medusa backend uses the same credentials via two env vars:

| Medusa backend env var | Use your existing |
|------------------------|--------------------|
| `DATABASE_URL`         | Supabase **Postgres connection URI** — see “DATABASE_URL for Render” below. **Use Session pooler (port 6543), not Direct (5432).** Direct is not IPv4-compatible and will timeout on Render. |
| `REDIS_URL`            | Upstash **Redis URL** (e.g. `rediss://default:xxx@xxx.upstash.io:6379`) |

- **Local:** Put these in `deploy-site/medusa-backend/.env` (create from `deploy-site/medusa-backend/.env.template` and fill `DATABASE_URL`, `REDIS_URL`).
- **Production (Railway/Render):** Set the same `DATABASE_URL` and `REDIS_URL` in the service’s environment variables.

**Install size (local):** A full Medusa backend (`create-medusa-app` + `npm install`) is **large**—often **500 MB–1 GB+** for `node_modules`. The backend pulls in Postgres/TypeORM, Redis, Bull queues, Admin (React), and many plugins, so the first download can take several minutes. Normal.

**Backend in this repo:** `deploy-site/medusa-backend`. To run locally:

```bash
cd deploy-site/medusa-backend
cp .env.template .env
# Edit .env: set DATABASE_URL (Supabase) and REDIS_URL (Upstash) from repo root .env
npm install
npm run dev
```

Admin locally: **http://localhost:9000/app**

---

You need **three** things:

1. **PostgreSQL** (Supabase free tier)
2. **Redis** (Upstash free tier – for Medusa sessions, events, workflows)
3. **Medusa backend** (Render or Railway – runs API + Admin)

Then point **SCV2** at the deployed backend.

---

## 1. Supabase (Postgres)

**Project ref (this repo):** `ncwubhefvxmojxseryjo`. Cursor MCP config: see [SUPABASE_MCP.md](./SUPABASE_MCP.md).

### DATABASE_URL for Render (required: Session pooler, IPv4)

Render is IPv4-only. Supabase’s **Direct connection** (port 5432) is **not IPv4 compatible** and will cause `Pg connection failed` / `KnexTimeoutError`. You must use the **Session pooler** (or Transaction pooler) URI.

1. Supabase → your project → **Settings** → **Database**.
2. In **Connection string** (or “Connect to your project”):
   - **Method:** choose **Session pooler** (or **Transaction pooler**), **not** “Direct connection”.
   - **Type:** URI.
3. Copy the URI. It should look like:
   ```text
   postgresql://postgres.ncwubhefvxmojxseryjo:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres
   ```
   - Port must be **6543** (pooler), not 5432.
   - Host must be **`*.pooler.supabase.com`**, not `db.*.supabase.co`.
4. Replace `[YOUR-PASSWORD]` with your real DB password (no brackets). If the password has special characters (`+`, `?`, `@`, `#`, `/`, etc.), URL-encode them (e.g. `+` → `%2B`, `@` → `%40`).
5. Set that full string as **`DATABASE_URL`** in Render (no quotes, no spaces). Redeploy.

If you still get timeouts, in Supabase check **Settings → Database** for any “Restrict connections” or IP allowlist and ensure the pooler is enabled.

---

1. Go to [supabase.com](https://supabase.com) → Sign in → **New project**.
2. Pick org, name (e.g. `medusa-scv2`), database password (save it), region → **Create**.
3. In the project: **Settings** → **Database**.
4. Copy the **Connection string** → **URI** (use **Session pooler** as above). It looks like:
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

**Note:** Railway **free plan** has a **5-minute build timeout**. Medusa backend often exceeds that (large `npm ci` + build). Use **Railway Pro** ($5/mo, 60 min timeout) or deploy to **Render** (Option B) instead.

1. Go to [railway.app](https://railway.app) → Sign in (e.g. GitHub).
2. **New Project** → **Deploy from GitHub repo** → select this repo (`success007`).
3. Set **Root Directory** to `deploy-site/medusa-backend` (so Railway builds and runs that folder).
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
2. Connect GitHub and select this repo (`success007`). Set **Root Directory** to `deploy-site/medusa-backend`.
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
