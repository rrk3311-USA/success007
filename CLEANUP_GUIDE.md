# 🧹 Cleanup Guide - Understanding Your Files

## 📍 Your Setup Explained Simply

### **LOCAL DEV** (10GB - Where You Work)
```
/Users/r-kammer/CascadeProjects/Success Chemistry/
```
- **Size**: 10GB (huge!)
- **Purpose**: Your workspace
- **GitHub Desktop**: ❌ Doesn't see this
- **Deployment**: ❌ Not deployed

### **PRODUCTION REPO** (697MB - What Gets Deployed)
```
/Users/r-kammer/Documents/GitHub/success007/
```
- **Size**: 697MB
- **Purpose**: What goes to successchemistry.com
- **GitHub Desktop**: ✅ Watches this folder
- **Deployment**: ✅ Auto-deploys when you push

---

## 🔍 Understanding the Audit

Run this to see everything:
```bash
./full-audit.sh
```

This shows:
- ✅ All folders and sizes
- ✅ What git is tracking
- ✅ What GitHub Desktop sees
- ✅ All URLs in your code
- ✅ Large files
- ✅ Dead/broken files

---

## 🗑️ Finding Dead Files

Run this to find files you can delete:
```bash
./find-dead-files.sh
```

This finds:
- Empty files (0 bytes)
- Files with no extension
- Duplicate files
- Broken image references
- Very old files (might be unused)

---

## 📋 What GitHub Desktop Sees

**GitHub Desktop ONLY watches:**
- `/Users/r-kammer/Documents/GitHub/success007/`

**It does NOT see:**
- `/Users/r-kammer/CascadeProjects/Success Chemistry/` (your local dev)

**Why?** Because only the production repo has a `.git` folder.

---

## 🧹 Cleanup Checklist

### ✅ Safe to Delete (Already Excluded):
- [x] `images/UGC & Review/` (78MB)
- [x] `images/SC backgrounds/` (20MB)
- [x] `images/GMP proccess images/` (18MB)
- [x] `images/Great images to sort/` (9MB)

### ⚠️ Review These (Might Delete):
- [ ] Empty files (run `find-dead-files.sh`)
- [ ] Duplicate files
- [ ] Very old files (over 1 year)
- [ ] Files with no extension

### ✅ Keep These:
- [x] `images/products/` - Product photos
- [x] `images/Catagory Thumbnail Images/` - Category images
- [x] All HTML files
- [x] All JS files
- [x] Config files

---

## 🎯 Quick Actions

### See Everything:
```bash
./full-audit.sh > audit-report.txt
cat audit-report.txt
```

### Find Dead Files:
```bash
./find-dead-files.sh
```

### Check What Git Sees:
```bash
cd /Users/r-kammer/Documents/GitHub/success007
git status
```

### Check What GitHub Desktop Would See:
```bash
cd /Users/r-kammer/Documents/GitHub/success007
git ls-files | head -20
```

---

## 💡 Why Two Folders?

**Local Dev (CascadeProjects):**
- Your workspace
- Test changes safely
- Doesn't affect production
- Can be messy/experimental

**Production Repo (GitHub/success007):**
- Clean, production-ready
- Tracked by git
- Deploys to .com
- Should be organized

**Workflow:**
1. Edit in Local Dev
2. Test at localhost:8080
3. Sync to Production Repo
4. Push to deploy

---

## 📊 Current Status

From the audit:
- **Local Dev**: 10GB (includes node_modules, review-repo, etc.)
- **Production Repo**: 697MB (cleaner)
- **Git tracking**: 888 files
- **Modified files**: 59 ready to commit

---

## 🚀 Next Steps

1. **Review the audit:**
   ```bash
   cat audit-report.txt
   ```

2. **Find dead files:**
   ```bash
   ./find-dead-files.sh
   ```

3. **Clean up** (delete files you don't need)

4. **Sync and deploy:**
   ```bash
   ./sync-selective.sh
   git add .
   git commit -m "Cleanup: Removed dead files"
   git push
   ```
