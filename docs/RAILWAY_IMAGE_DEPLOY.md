# Medusa backend: Deploy from GHCR image (Option 2)

This setup builds the Medusa backend Docker image in **GitHub Actions** (no 5-min limit), pushes to **GitHub Container Registry (GHCR)**, and triggers **Railway** to redeploy from that image. Railway only pulls the image (no build on Railway), so the free-tier build timeout is avoided.

## One-time setup

### 1. GitHub Actions workflow

The workflow `.github/workflows/medusa-build-push-railway.yml` runs on push to `main` when `deploy-site/medusa-backend/` changes. It:

- Builds the Docker image
- Pushes to `ghcr.io/<your-github-username>/success007/medusa-backend:latest`
- Triggers Railway redeploy (if secrets are set)

### 2. Make the GHCR package visible to Railway

After the first workflow run:

1. GitHub → Your repo → **Packages** (right sidebar) or go to **github.com/users/YOUR_USERNAME/packages**
2. Open package **success007/medusa-backend** (or `medusa-backend` under the repo)
3. **Package settings** → **Change visibility** → **Public** (so Railway can pull without auth)

If you keep it **private**, add GHCR credentials in Railway (see Railway docs: deploy from private registry).

### 3. Switch Railway to “Deploy from image”

1. Railway → Project **reliable-nurturing** (or your project) → Service **heartfelt-cooperation**
2. **Settings** → **Source** (or **Deploy**)
3. Change from **GitHub** to **Docker Image** (or **Image**)
4. **Image URL:**  
   `ghcr.io/rrk3311-usa/success007/medusa-backend:latest`  
   (Use your GitHub username in lowercase if different from `rrk3311-usa`.)
5. Save. Railway will deploy from this image (no build step on Railway).

### 4. GitHub secrets for auto-redeploy

So each push triggers a redeploy on Railway after the image is pushed:

1. **Railway token:** Railway → **Account** → **Tokens** (or Project → Settings → **Tokens**) → **Create token** → copy.
2. **Project ID & Service ID:** Railway → Project → **heartfelt-cooperation** → **Settings**. Use **Copy Service ID** (and project ID from project settings if shown), or from the URL: `railway.app/project/<PROJECT_ID>/service/<SERVICE_ID>`.

Then in GitHub:

1. Repo → **Settings** → **Secrets and variables** → **Actions**
2. Add:
   - `RAILWAY_TOKEN` = the token from step 1
   - `RAILWAY_PROJECT_ID` = your Railway project ID
   - `RAILWAY_SERVICE_ID` = your Railway service ID (heartfelt-cooperation)

After this, every successful push that builds the image will also trigger a Railway redeploy.

### 5. Environment variables on Railway

On the **heartfelt-cooperation** service, set the same env vars as before (Railway only runs the image; it doesn’t build, so env is unchanged):

- `DATABASE_URL` (Supabase Session Pooler, port 6543)
- `REDIS_URL` (e.g. Upstash)
- `ADMIN_CORS`, `AUTH_CORS`, `STORE_CORS`
- `COOKIE_SECRET`, `JWT_SECRET`
- `MEDUSA_WORKER_MODE` = `server`

## Flow after setup

1. You push to `main` (with changes under `deploy-site/medusa-backend/`).
2. GitHub Actions builds the Docker image and pushes to GHCR.
3. The workflow triggers Railway redeploy (if secrets are set).
4. Railway pulls `ghcr.io/.../medusa-backend:latest` and runs it.

No build runs on Railway, so the 5-minute build timeout no longer applies.
