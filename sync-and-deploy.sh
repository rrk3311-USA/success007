#!/bin/bash

# Complete sync and deploy workflow
# 1. Optimize images
# 2. Sync files
# 3. Show git status
# 4. Optionally commit and push

SOURCE_DIR="/Users/r-kammer/CascadeProjects/Success Chemistry/deploy-site"
DEST_DIR="/Users/r-kammer/Documents/GitHub/success007/deploy-site"

echo "🚀 Complete Sync & Deploy Workflow"
echo "===================================="
echo ""

# Step 1: Optimize images
echo "Step 1: Optimizing images..."
if [ -f "./optimize-images.sh" ]; then
    ./optimize-images.sh
else
    echo "⚠️  optimize-images.sh not found, skipping..."
fi

echo ""
echo "Step 2: Syncing files..."
echo ""

# Quick sync of common files
if [ -f "./quick-sync.sh" ]; then
    echo "📄 Syncing HTML files..."
    ./quick-sync.sh shop
    ./quick-sync.sh home
    ./quick-sync.sh cart
    ./quick-sync.sh product
    
    echo ""
    echo "🎨 Syncing images (optimized)..."
    ./quick-sync.sh images
    
    echo ""
    echo "⚙️  Syncing config..."
    ./quick-sync.sh config
else
    echo "⚠️  quick-sync.sh not found, using rsync..."
    rsync -av --exclude='.git' --exclude='.DS_Store' --exclude='.vercel' --exclude='.netlify' \
        "$SOURCE_DIR/" "$DEST_DIR/"
fi

echo ""
echo "Step 3: Checking git status..."
echo ""

cd "$DEST_DIR/.." || exit 1

git status --short

echo ""
echo "📝 Next steps:"
echo ""
echo "1. Review changes above"
echo "2. Commit: git add . && git commit -m 'Update: Optimized images and synced latest changes'"
echo "3. Push: git push"
echo ""
echo "🌐 After pushing, your hosting will automatically deploy to successchemistry.com"
echo ""
