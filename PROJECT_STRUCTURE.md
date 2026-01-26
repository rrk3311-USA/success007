# 📁 Project Structure Explained

## 🎯 **SINGLE SOURCE OF TRUTH**

### **YOUR WORKSPACE** (Edit Here!)
```
/Users/r-kammer/Documents/GitHub/success007/
├── deploy-site/          ← Your website files
│   ├── shop/            ← Shop page
│   ├── product/         ← Product pages
│   ├── cart/            ← Shopping cart
│   ├── images/           ← Product images
│   └── ...
├── local-server.js      ← Runs localhost:8080
├── .git/                ← Git repository
└── ...
```

**This is your single source of truth:**
- ✅ Edit files directly here
- ✅ Run `node local-server.js` to test at `http://localhost:8080`
- ✅ GitHub Desktop watches this
- ✅ Git tracks changes here
- ✅ Auto-deploys to successchemistry.com on `git push`

---

## 🔄 **SIMPLE WORKFLOW**

```
┌─────────────────────────────────────┐
│  YOUR WORKSPACE                     │
│  /Users/r-kammer/Documents/         │
│  GitHub/success007/                 │
│  - Edit files here                  │
│  - Test at localhost:8080           │
└──────────────┬──────────────────────┘
               │
               │ Run: git add . && git commit -m "message"
               │
               ▼
┌─────────────────────────────────────┐
│  Git Push                           │
│  - Commits changes                  │
└──────────────┬──────────────────────┘
               │
               │ Auto-deploys
               │
               ▼
┌─────────────────────────────────────┐
│  successchemistry.com               │
│  - Live website                     │
│  - Auto-deploys from repo           │
└─────────────────────────────────────┘
```

---

## 🎯 Common Questions

**Q: Where should I edit files?**
A: **Directly in this repo** (`/Users/r-kammer/Documents/GitHub/success007/deploy-site/`)

**Q: How do I test changes?**
A: Run `node local-server.js` and visit `http://localhost:8080`

**Q: How do I deploy?**
A: 
1. Edit files in `deploy-site/`
2. Run `git add . && git commit -m "Description"`
3. Run `git push` (auto-deploys to .com)

**Q: Which one does GitHub Desktop see?**
A: This repo! (`/Users/r-kammer/Documents/GitHub/success007/`)

---

## 📋 File Types

### HTML Files (Pages)
- `index.html` - Home page
- `shop/index.html` - Shop page
- `product/index.html` - Product pages
- `cart/index.html` - Shopping cart

### Images
- `images/products/` - Product photos
- `images/Catagory Thumbnail Images/` - Category thumbnails
- `images/home/` - Home page images

### Config Files
- `config.js` - PayPal, Analytics settings
- `products-data.js` - Product database

---

## 🧹 What to Clean Up

### ❌ Remove These (Not Needed on Website):
- `images/UGC & Review/` - User reviews (78MB)
- `images/SC backgrounds/` - Unused backgrounds (20MB)
- `images/GMP proccess images/` - Process photos (18MB)
- `images/Great images to sort/` - Unsorted images (9MB)

### ✅ Keep These:
- `images/products/` - Product images
- `images/Catagory Thumbnail Images/` - Category images
- `images/home/` - Home page images (but optimize large ones)

---

## 🔍 Finding Dead Files

Run the audit script:
```bash
./full-audit.sh
```

This will show you:
- Empty files
- Orphaned files
- Duplicate files
- Large files
- All URLs in your code
