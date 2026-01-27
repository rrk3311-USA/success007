# 🚀 Render Auto-Deploy Setup Guide

## Current Status

Your Render service is **already connected to GitHub** and should auto-deploy! 

- **Service ID**: `srv-d5m8hjlactks73bn8v00`
- **Repository**: `rrk3311-USA / success007`
- **Branch**: `main`
- **Status**: Should auto-deploy on every `git push`

## ✅ Option 1: Auto-Deploy from GitHub (Recommended - Already Set Up!)

This is the **easiest** method and should already be working:

1. **Make your changes**
2. **Commit and push**:
   ```bash
   git add .
   git commit -m "Your changes"
   git push
   ```
3. **Render automatically deploys** (usually 1-3 minutes)

### Verify Auto-Deploy is Enabled

1. Go to: https://dashboard.render.com/web/srv-d5m8hjlactks73bn8v00
2. Click **Settings** → **Build & Deploy**
3. Make sure **Auto-Deploy** is set to **"Yes"**
4. Verify **Branch** is set to **"main"**

If it's not enabled:
- Toggle **Auto-Deploy** to **"Yes"**
- Save changes

## 🔧 Option 2: Direct API Deployment (For Manual Triggers)

If you want to trigger deployments directly via API (without git push):

### Step 1: Get Render API Key

1. Go to: https://dashboard.render.com/account/api-keys
2. Click **"New API Key"**
3. Give it a name (e.g., "Deployment Script")
4. Copy the API key (you'll only see it once!)

### Step 2: Add to .env

```bash
# Add this to your .env file
RENDER_API_KEY=your_api_key_here
```

### Step 3: Use the Deployment Script

```bash
# Trigger a deployment
node deploy-to-render.js trigger

# Check deployment status
node deploy-to-render.js status

# Monitor deployment progress
node deploy-to-render.js monitor
```

## 📊 Quick Commands

### Standard Workflow (Auto-Deploy)
```bash
cd /Users/r-kammer/Documents/GitHub/success007
git add .
git commit -m "Update: Fixed hero image"
git push
# Render auto-deploys automatically!
```

### Direct Deployment (API)
```bash
# After adding RENDER_API_KEY to .env
node deploy-to-render.js trigger
```

## 🔍 Troubleshooting

### Render Not Auto-Deploying?

1. **Check GitHub connection**:
   - Go to Render dashboard → Settings → Build & Deploy
   - Verify GitHub repo is connected
   - Reconnect if needed

2. **Check Auto-Deploy setting**:
   - Settings → Build & Deploy → Auto-Deploy should be "Yes"

3. **Check branch**:
   - Make sure you're pushing to `main` branch
   - Render should be set to deploy from `main`

4. **Check webhook**:
   - Render creates a GitHub webhook automatically
   - If missing, disconnect and reconnect GitHub

### Manual Deployment Not Working?

1. **Verify API key**:
   ```bash
   # Check if API key is set
   grep RENDER_API_KEY .env
   ```

2. **Test API connection**:
   ```bash
   node deploy-to-render.js status
   ```

3. **Check service ID**:
   - Verify `srv-d5m8hjlactks73bn8v00` is correct in `deploy-to-render.js`

## 💡 Best Practice

**Use Auto-Deploy (Option 1)** - It's simpler and more reliable:
- ✅ No API keys needed
- ✅ Automatic on every push
- ✅ Works with your existing git workflow
- ✅ Shows deployment status in GitHub

**Use Direct API (Option 2)** only if:
- You need to trigger deployments without git commits
- You want to deploy from CI/CD pipelines
- You need programmatic control

## 📝 Summary

**For automatic deployment**: Just use `git push` - Render will auto-deploy!

**For direct deployment**: Get API key → Add to .env → Run `node deploy-to-render.js trigger`
