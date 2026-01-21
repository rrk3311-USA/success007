# 📁 Project Structure Explained

## 🗂️ Your Two Main Locations

### 1. **LOCAL DEVELOPMENT** (Where You Work)
```
/Users/r-kammer/CascadeProjects/Success Chemistry/
├── deploy-site/          ← Your working files
│   ├── shop/
│   ├── product/
│   ├── images/
│   └── ...
├── local-server.js      ← Runs localhost:8080
└── ...
```

**Purpose:**
- ✅ Edit and test your files here
- ✅ Run `node local-server.js` to test
- ✅ View at `http://localhost:8080/shop`
- ❌ NOT automatically deployed
- ❌ GitHub Desktop doesn't watch this

---

### 2. **PRODUCTION REPO** (What Gets Deployed)
```
/Users/r-kammer/Documents/GitHub/success007/
├── deploy-site/          ← What goes to successchemistry.com
├── .git/                 ← Git repository
├── sync-selective.sh     ← Sync tool
└── ...
```

**Purpose:**
- ✅ This is what GitHub Desktop sees
- ✅ This is what gets deployed to .com
- ✅ Managed by git
- ❌ Don't edit directly (use sync instead)

---

## 🔄 How They Work Together

```
┌─────────────────────────────────────┐
│  LOCAL DEV (CascadeProjects)        │
│  - Edit files here                  │
│  - Test at localhost:8080           │
└──────────────┬──────────────────────┘
               │
               │ Run: ./sync-selective.sh
               │
               ▼
┌─────────────────────────────────────┐
│  PRODUCTION REPO (GitHub/success007)│
│  - GitHub Desktop watches this      │
│  - Git tracks changes here          │
└──────────────┬──────────────────────┘
               │
               │ Run: git push
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

**Q: Why two folders?**
A: Keeps your work separate from deployment. You can test locally without affecting production.

**Q: Which one does GitHub Desktop see?**
A: Only the **Production Repo** (`/Users/r-kammer/Documents/GitHub/success007/`)

**Q: Where should I edit files?**
A: **Local Dev** (`CascadeProjects/Success Chemistry/deploy-site/`)

**Q: How do I get changes to .com?**
A: 
1. Edit in Local Dev
2. Run `./sync-selective.sh` (copies to Production Repo)
3. Run `git push` (deploys to .com)

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
