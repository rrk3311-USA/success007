#!/bin/bash

# Sync script to copy files from local development to production deploy folder
# This syncs your work from CascadeProjects to the GitHub repo

SOURCE_DIR="/Users/r-kammer/CascadeProjects/Success Chemistry/deploy-site"
DEST_DIR="/Users/r-kammer/Documents/GitHub/success007/deploy-site"

echo "🔄 Syncing files from local development to production..."
echo "📂 Source: $SOURCE_DIR"
echo "📂 Destination: $DEST_DIR"
echo ""

# Check if source exists
if [ ! -d "$SOURCE_DIR" ]; then
    echo "❌ Error: Source directory not found: $SOURCE_DIR"
    exit 1
fi

# Check if destination exists
if [ ! -d "$DEST_DIR" ]; then
    echo "❌ Error: Destination directory not found: $DEST_DIR"
    exit 1
fi

# Sync files (using rsync for efficiency)
rsync -av --delete \
    --exclude='.git' \
    --exclude='.DS_Store' \
    --exclude='.vercel' \
    --exclude='.netlify' \
    --exclude='node_modules' \
    "$SOURCE_DIR/" "$DEST_DIR/"

echo ""
echo "✅ Sync complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Review changes: cd $DEST_DIR && git status"
echo "   2. Commit changes: git add . && git commit -m 'Sync latest changes from local dev'"
echo "   3. Push to deploy: git push"
echo ""
echo "🌐 Your changes will be live on successchemistry.com after deployment"
