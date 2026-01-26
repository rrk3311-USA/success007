# 📋 Quick Reference - Your Project

## 🎯 Single Source of Truth

### **YOUR WORKSPACE** (Edit Here!)
```
📍 /Users/r-kammer/Documents/GitHub/success007/
   Size: ~700MB  
   GitHub Desktop: ✅ Watches this
   Deploys: ✅ Yes (to successchemistry.com)
   Purpose: Edit, test, and deploy from here
```

**This is your single source of truth - no syncing needed!**

---

## 🔍 Audit Commands

### See Everything:
```bash
./full-audit.sh
```
Shows: folders, sizes, git status, URLs, large files

### Find Dead Files:
```bash
./find-dead-files.sh
```
Shows: empty files, duplicates, broken links, old files

### Check Large Files:
```bash
./check-large-files.sh
```
Shows: files over 1MB, 2MB, 5MB

---

## 🔄 Development Workflow

**No syncing needed!** Edit directly in the repo:

```bash
# 1. Edit files in deploy-site/
# 2. Test with local server
node local-server.js

# 3. Commit changes
git add .
git commit -m "Description of changes"

# 4. Deploy
git push
```

---

## 🚀 Deploy Commands

```bash
cd /Users/r-kammer/Documents/GitHub/success007

# See what changed
git status

# Add changes
git add .

# Commit
git commit -m "Your message here"

# Push (deploys to .com)
git push
```

---

## 📊 Current Status

- **Git tracking**: 888 files
- **Modified files**: 59 ready to commit
- **Large folders removed**: 125MB saved
- **Deploy-site size**: 335MB (down from 460MB)

---

## 🗂️ Important Folders

### In Local Dev:
- `deploy-site/shop/` - Shop page
- `deploy-site/product/` - Product pages
- `deploy-site/images/` - All images
- `deploy-site/config.js` - Settings

### In Production Repo:
- Same structure, but cleaner
- No large unnecessary folders
- Ready to deploy

---

## ❓ Common Questions

**Q: Where should I edit files?**
A: Directly in `/Users/r-kammer/Documents/GitHub/success007/deploy-site/`

**Q: How do I test changes?**
A: Run `node local-server.js` and visit `http://localhost:8080`

**Q: How do I deploy?**
A: Just `git push` - auto-deploys to successchemistry.com

**Q: How do I get changes online?**
A: Edit → Sync → Commit → Push

**Q: What's the difference?**
A: Local Dev = your workspace. Production Repo = what goes live.

---

## 📝 Files Created for You

- `full-audit.sh` - Complete project audit
- `find-dead-files.sh` - Find files to delete
- `check-large-files.sh` - Find large files
- `sync-selective.sh` - Interactive sync
- `quick-sync.sh` - Quick sync shortcuts
- `cleanup-for-deploy.sh` - Clean before deploy

---

## 🎯 Next Steps

1. **Review audit**: `./full-audit.sh > audit.txt && cat audit.txt`
2. **Find dead files**: `./find-dead-files.sh`
3. **Clean up** (delete what you don't need)
4. **Sync**: `./sync-selective.sh`
5. **Deploy**: `git add . && git commit -m "Cleanup" && git push`
