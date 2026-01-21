#!/bin/bash

# Quick sync shortcuts - common files you sync often

SOURCE_DIR="/Users/r-kammer/CascadeProjects/Success Chemistry/deploy-site"
DEST_DIR="/Users/r-kammer/Documents/GitHub/success007/deploy-site"

# Function to sync a file
sync_file() {
    local file="$1"
    local source_file="$SOURCE_DIR/$file"
    local dest_file="$DEST_DIR/$file"
    
    if [ ! -f "$source_file" ]; then
        echo "❌ File not found: $source_file"
        return 1
    fi
    
    mkdir -p "$(dirname "$dest_file")"
    cp "$source_file" "$dest_file"
    echo "✅ $file"
}

# Check which file to sync
case "$1" in
    shop)
        echo "🛍️  Syncing shop page..."
        sync_file "shop/index.html"
        ;;
    home|index)
        echo "🏠 Syncing home page..."
        sync_file "index.html"
        ;;
    cart)
        echo "🛒 Syncing cart..."
        mkdir -p "$DEST_DIR/cart"
        rsync -av --exclude='.DS_Store' "$SOURCE_DIR/cart/" "$DEST_DIR/cart/"
        echo "✅ cart/"
        ;;
    product|products)
        echo "📦 Syncing product pages..."
        mkdir -p "$DEST_DIR/product"
        rsync -av --exclude='.DS_Store' "$SOURCE_DIR/product/" "$DEST_DIR/product/"
        echo "✅ product/"
        ;;
    images|img)
        echo "🎨 Syncing images..."
        mkdir -p "$DEST_DIR/images"
        mkdir -p "$DEST_DIR/public/images"
        rsync -av --exclude='.DS_Store' "$SOURCE_DIR/images/" "$DEST_DIR/images/"
        rsync -av --exclude='.DS_Store' "$SOURCE_DIR/public/images/" "$DEST_DIR/public/images/"
        echo "✅ images/"
        ;;
    config)
        echo "⚙️  Syncing config..."
        sync_file "config.js"
        sync_file "public/paypal-buttons.js"
        ;;
    *)
        echo "📋 Quick Sync - Usage:"
        echo ""
        echo "  ./quick-sync.sh shop      - Sync shop page"
        echo "  ./quick-sync.sh home      - Sync home/index page"
        echo "  ./quick-sync.sh cart      - Sync cart folder"
        echo "  ./quick-sync.sh product   - Sync product pages"
        echo "  ./quick-sync.sh images    - Sync images"
        echo "  ./quick-sync.sh config    - Sync config files"
        echo ""
        echo "Or use ./sync-selective.sh for interactive menu"
        exit 1
        ;;
esac

echo ""
echo "✨ Done! Don't forget to:"
echo "   git add ."
echo "   git commit -m 'Update: $1'"
echo "   git push"
