# 🚀 LIFE JET - Quick Start Guide

## Starting the Development Server

### Option 1: Using the Start Script (Easiest)
```bash
cd deploy-site/life-jet
./start.sh
```

### Option 2: Using npx directly
```bash
cd deploy-site/life-jet
npx vite --host --port 5174
```

### Option 3: Using npm script from project root
```bash
# From project root (/Users/r-kammer/Documents/GitHub/success007)
npm run life-jet
```

## Access the App

Once the server starts, open your browser and go to:
**http://localhost:5174**

You should see:
- ✅ "VITE" in the terminal output
- ✅ A URL like "Local: http://localhost:5174"
- ✅ The LIFE JET interface in your browser

## Troubleshooting

### If you get "404 Not Found":
1. Make sure you're in the correct directory: `deploy-site/life-jet`
2. Check that `index.html` exists in that directory
3. Verify Vite is installed: `npx vite --version`
4. Try running: `npx vite --host --port 5174` directly

### If you get "Cannot find module":
1. Make sure dependencies are installed: `npm install` (from project root)
2. Check that React is installed: `npm list react`

### If port 5174 is already in use:
1. Kill the process: `lsof -ti:5174 | xargs kill -9`
2. Or use a different port: `npx vite --port 5175`

## What You Should See

When the server starts successfully, you'll see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5174/
  ➜  Network: use --host to expose
```

Then open http://localhost:5174 in your browser to see the LIFE JET interface!
