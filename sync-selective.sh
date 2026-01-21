#!/bin/bash

# Selective sync script - sync files à la carte from local dev to production
# This lets you pick and choose what to sync

SOURCE_DIR="/Users/r-kammer/CascadeProjects/Success Chemistry/deploy-site"
DEST_DIR="/Users/r-kammer/Documents/GitHub/success007/deploy-site"

echo "🔄 Selective Sync Tool"
echo "===================="
echo ""
echo "📂 Source: $SOURCE_DIR"
echo "📂 Destination: $DEST_DIR"
echo ""

# Check if directories exist
if [ ! -d "$SOURCE_DIR" ]; then
    echo "❌ Error: Source directory not found: $SOURCE_DIR"
    exit 1
fi

if [ ! -d "$DEST_DIR" ]; then
    echo "❌ Error: Destination directory not found: $DEST_DIR"
    exit 1
fi

# Function to show differences
show_diff() {
    echo "📊 Files that differ between local and production:"
    echo ""
    cd "$SOURCE_DIR"
    find . -type f ! -path '*/\.*' ! -name '.DS_Store' | while read file; do
        if [ -f "$DEST_DIR/$file" ]; then
            if ! cmp -s "$SOURCE_DIR/$file" "$DEST_DIR/$file" 2>/dev/null; then
                echo "  ✏️  $file"
            fi
        else
            echo "  ➕ $file (new file)"
        fi
    done
    echo ""
}

# Function to sync a single file
sync_file() {
    local file="$1"
    local source_file="$SOURCE_DIR/$file"
    local dest_file="$DEST_DIR/$file"
    
    if [ ! -f "$source_file" ]; then
        echo "❌ File not found: $source_file"
        return 1
    fi
    
    # Create destination directory if needed
    mkdir -p "$(dirname "$dest_file")"
    
    # Copy file
    cp "$source_file" "$dest_file"
    echo "✅ Synced: $file"
}

# Function to sync a directory
sync_dir() {
    local dir="$1"
    local source_dir="$SOURCE_DIR/$dir"
    local dest_dir="$DEST_DIR/$dir"
    
    if [ ! -d "$source_dir" ]; then
        echo "❌ Directory not found: $source_dir"
        return 1
    fi
    
    # Create destination directory
    mkdir -p "$dest_dir"
    
    # Copy directory contents
    rsync -av --exclude='.DS_Store' "$source_dir/" "$dest_dir/"
    echo "✅ Synced directory: $dir"
}

# Main menu
while true; do
    echo "What would you like to do?"
    echo ""
    echo "1) 📊 Show differences (what's changed)"
    echo "2) 📄 Sync a specific file"
    echo "3) 📁 Sync a specific directory"
    echo "4) 🛍️  Sync shop page (common)"
    echo "5) 🏠 Sync index/home page (common)"
    echo "6) 🛒 Sync cart (common)"
    echo "7) 📦 Sync product pages (common)"
    echo "8) 🎨 Sync images folder"
    echo "9) 📝 Sync all HTML files"
    echo "10) 🔄 Sync everything (full sync)"
    echo "11) ❌ Exit"
    echo ""
    read -p "Choose an option (1-11): " choice
    
    case $choice in
        1)
            show_diff
            ;;
        2)
            echo ""
            read -p "Enter file path (e.g., shop/index.html): " filepath
            sync_file "$filepath"
            ;;
        3)
            echo ""
            read -p "Enter directory path (e.g., shop or images): " dirpath
            sync_dir "$dirpath"
            ;;
        4)
            echo ""
            echo "🛍️  Syncing shop page..."
            sync_file "shop/index.html"
            ;;
        5)
            echo ""
            echo "🏠 Syncing home page..."
            sync_file "index.html"
            ;;
        6)
            echo ""
            echo "🛒 Syncing cart..."
            sync_dir "cart"
            ;;
        7)
            echo ""
            echo "📦 Syncing product pages..."
            sync_dir "product"
            ;;
        8)
            echo ""
            echo "🎨 Syncing images..."
            sync_dir "images"
            sync_dir "public/images"
            ;;
        9)
            echo ""
            echo "📝 Syncing all HTML files..."
            find "$SOURCE_DIR" -name "*.html" -type f | while read file; do
                rel_path="${file#$SOURCE_DIR/}"
                sync_file "$rel_path"
            done
            ;;
        10)
            echo ""
            echo "🔄 Full sync - copying everything..."
            read -p "Are you sure? This will overwrite all files in production. (y/N): " confirm
            if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
                rsync -av --delete \
                    --exclude='.git' \
                    --exclude='.DS_Store' \
                    --exclude='.vercel' \
                    --exclude='.netlify' \
                    --exclude='node_modules' \
                    "$SOURCE_DIR/" "$DEST_DIR/"
                echo "✅ Full sync complete!"
            else
                echo "❌ Sync cancelled"
            fi
            ;;
        11)
            echo "👋 Goodbye!"
            exit 0
            ;;
        *)
            echo "❌ Invalid option. Please choose 1-11."
            ;;
    esac
    echo ""
    echo "---"
    echo ""
done
