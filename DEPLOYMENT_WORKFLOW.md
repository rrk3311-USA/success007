# 🚀 Deployment Workflow Guide

## Understanding Your Setup

You have **TWO separate locations**:

### 1. **Local Development** (Where you work)
- **Location**: `/Users/r-kammer/CascadeProjects/Success Chemistry/`
- **Server**: `local-server.js` (runs on port 8080)
- **URL**: `http://localhost:8080/shop`
- **Purpose**: This is where you make changes and test them

### 2. **Production Repository** (What gets deployed)
- **Location**: `/Users/r-kammer/Documents/GitHub/success007/`
- **Deploy Folder**: `deploy-site/`
- **URL**: `https://successchemistry.com`
- **Purpose**: This is what gets deployed to production via Render/Vercel

## ⚠️ The Problem

When you edit files in the **CascadeProjects** folder, those changes:
- ✅ Show up on `localhost:8080` (local testing)
- ❌ Do NOT automatically appear on `successchemistry.com` (production)

**Why?** Because production deploys from the **GitHub repo**, not from CascadeProjects!

## ✅ The Solution: Selective Sync Workflow

### Step 1: Make Changes Locally
Work in: `/Users/r-kammer/CascadeProjects/Success Chemistry/deploy-site/`
- Edit files
- Test at `http://localhost:8080/shop`
- Make sure everything works

### Step 2: Sync Selectively (À La Carte)

You have **two sync options**:

#### Option A: Quick Sync (for common files)
```bash
cd /Users/r-kammer/Documents/GitHub/success007

# Sync just the shop page
./quick-sync.sh shop

# Sync just the home page
./quick-sync.sh home

# Sync cart, products, images, etc.
./quick-sync.sh cart
./quick-sync.sh product
./quick-sync.sh images
./quick-sync.sh config
```

#### Option B: Interactive Selective Sync
```bash
cd /Users/r-kammer/Documents/GitHub/success007
./sync-selective.sh
```

This gives you a menu to:
- See what's changed
- Sync specific files
- Sync specific folders
- Or sync everything

### Step 3: Deploy to Production
```bash
cd /Users/r-kammer/Documents/GitHub/success007
git add .
git commit -m "Update: [what you changed]"
git push
```

Your hosting (Render/Vercel) will automatically deploy the changes!

## 📋 Quick Reference

| What | Where | URL |
|------|-------|-----|
| **Work/Edit** | CascadeProjects/Success Chemistry/deploy-site/ | localhost:8080 |
| **Deploy From** | Documents/GitHub/success007/deploy-site/ | successchemistry.com |

## 🔄 Complete Workflow Example

```bash
# 1. Start local server (in CascadeProjects folder)
cd "/Users/r-kammer/CascadeProjects/Success Chemistry"
node local-server.js

# 2. Make your changes, test at localhost:8080/shop

# 3. Sync to production repo
cd /Users/r-kammer/Documents/GitHub/success007
./sync-to-production.sh

# 4. Commit and push
git add .
git commit -m "Your update message"
git push

# 5. Wait for deployment (usually 1-2 minutes)
# Check your hosting dashboard for status
```

## 🎯 Pro Tips

1. **Always test locally first** - Make sure it works on localhost:8080 before syncing
2. **Use descriptive commit messages** - Helps track what changed
3. **Check git status** - After syncing, review what changed: `git status`
4. **Keep both folders in sync** - Run sync script regularly

## ❓ FAQ

**Q: Why do I have two folders?**
A: CascadeProjects is your working directory. The GitHub repo is what gets deployed to production.

**Q: Can I work directly in the GitHub repo?**
A: Yes! But then you'd need to run the local server from there. The current setup keeps your work separate from deployment.

**Q: How often should I sync?**
A: Whenever you make changes you want to deploy. Could be after each feature, or daily, or whenever you're ready.

**Q: What if I forget to sync?**
A: Your localhost:8080 will have the latest, but production won't. Just run the sync script when you remember!
