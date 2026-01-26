# 🚀 Deployment Setup - Vercel & Render

Your project is now configured to deploy to both **Vercel** and **Render** automatically!

## ✅ What's Configured

### Vercel (`vercel.json`)
- ✅ Builds LIFE JET React app automatically
- ✅ Serves static files from `deploy-site/`
- ✅ Handles React routing for `/life-jet`
- ✅ Optimized caching headers
- ✅ Clean URL rewrites

### Render (`render.yaml`)
- ✅ Builds LIFE JET React app automatically
- ✅ Serves static files from `deploy-site/`
- ✅ Handles React routing
- ✅ Optimized caching headers

## 🔄 Automatic Deployment

Both platforms will automatically:
1. **Install dependencies** (`npm install`)
2. **Build LIFE JET** (`npm run build:all`)
3. **Deploy** the entire `deploy-site/` folder

## 📋 Deployment Process

### Option 1: Automatic (Recommended)
Just push to GitHub:
```bash
git add .
git commit -m "Update: Your changes"
git push
```

Vercel and Render will automatically:
- Detect the push
- Run the build command
- Deploy your site

### Option 2: Manual Build First
If you want to test the build locally:
```bash
./build-deploy.sh
git add .
git commit -m "Build: Updated project"
git push
```

## 🌐 Platform-Specific Setup

### Vercel Setup
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository: `rrk3311-USA/success007`
3. Vercel will auto-detect `vercel.json`
4. Deploy!

**Settings:**
- Framework Preset: Other
- Root Directory: `.` (root)
- Build Command: `npm run build:all`
- Output Directory: `deploy-site`

### Render Setup
1. Go to [render.com](https://render.com)
2. Create a new Static Site
3. Connect your GitHub repository: `rrk3311-USA/success007`
4. Render will auto-detect `render.yaml`
5. Deploy!

**Settings:**
- Build Command: `npm install && npm run build:all`
- Publish Directory: `deploy-site`

## 📁 Project Structure After Build

```
deploy-site/
├── index.html              # Main site
├── shop/                   # Shop pages
├── product/                # Product pages
├── life-jet/               # LIFE JET React app
│   ├── index.html          # React app entry
│   └── assets/             # Built React assets
│       ├── [hash].js
│       └── [hash].css
└── images/                 # Static images
```

## 🎯 URLs After Deployment

### Vercel
- Main site: `https://your-project.vercel.app`
- LIFE JET: `https://your-project.vercel.app/life-jet`

### Render
- Main site: `https://your-project.onrender.com`
- LIFE JET: `https://your-project.onrender.com/life-jet`

## 🔍 Verify Deployment

After pushing, check:
1. **Vercel Dashboard**: https://vercel.com/dashboard
2. **Render Dashboard**: https://dashboard.render.com
3. **GitHub Actions** (if configured)

## ⚙️ Build Scripts

- `npm run build:all` - Builds LIFE JET and prepares for deployment
- `npm run life-jet:build` - Builds only LIFE JET
- `./build-deploy.sh` - Complete build and prepare script

## 🐛 Troubleshooting

### Build Fails
1. Check Node.js version (needs 18+)
2. Verify all dependencies: `npm install`
3. Check build logs in platform dashboard

### LIFE JET Not Loading
1. Verify build completed: Check for `life-jet/assets/` folder
2. Check browser console for errors
3. Verify routing in `vercel.json` or `render.yaml`

### Static Files Not Serving
1. Verify `outputDirectory` is `deploy-site`
2. Check file paths are correct
3. Verify `.vercelignore` isn't excluding needed files

## 📝 Notes

- Both platforms will run `npm run build:all` which builds LIFE JET
- The built React app is placed in `deploy-site/life-jet/`
- Static files are served directly from `deploy-site/`
- React routing is handled via rewrites in both configs

## 🚀 Quick Deploy

```bash
# 1. Make your changes
# 2. Commit and push
git add .
git commit -m "Deploy: Updated project"
git push

# 3. Wait 1-3 minutes
# 4. Check your deployed site!
```

That's it! Your project will automatically deploy to both platforms! 🎉
