#!/bin/bash

# Cleanup script - exclude large unnecessary folders from deployment
# This creates a clean deploy-site without the bloat

SOURCE_DIR="/Users/r-kammer/CascadeProjects/Success Chemistry/deploy-site"
DEST_DIR="/Users/r-kammer/Documents/GitHub/success007/deploy-site"

echo "🧹 Cleaning Up for Deployment"
echo "=============================="
echo ""

# Folders to exclude (not needed on website)
EXCLUDE_DIRS=(
    "images/UGC & Review"
    "images/SC backgrounds"
    "images/GMP proccess images"
    "images/Great images to sort"
    "public/images/UGC & Review"
    "public/images/SC backgrounds"
    "public/images/GMP proccess images"
)

echo "📋 Excluding unnecessary folders:"
for dir in "${EXCLUDE_DIRS[@]}"; do
    echo "  ❌ $dir"
done
echo ""

# Build rsync exclude pattern
EXCLUDE_PATTERN=""
for dir in "${EXCLUDE_DIRS[@]}"; do
    EXCLUDE_PATTERN="$EXCLUDE_PATTERN --exclude='$dir'"
done

echo "🔄 Syncing files (excluding large folders)..."
echo ""

# Sync with exclusions
rsync -av --delete \
    --exclude='.git' \
    --exclude='.DS_Store' \
    --exclude='.vercel' \
    --exclude='.netlify' \
    --exclude='node_modules' \
    --exclude='images/UGC & Review' \
    --exclude='images/SC backgrounds' \
    --exclude='images/GMP proccess images' \
    --exclude='images/Great images to sort' \
    --exclude='public/images/UGC & Review' \
    --exclude='public/images/SC backgrounds' \
    --exclude='public/images/GMP proccess images' \
    --exclude='**/Screenshot*.png' \
    --exclude='**/Screen Shot*.png' \
    "$SOURCE_DIR/" "$DEST_DIR/"

echo ""
echo "✅ Cleanup complete!"
echo ""

# Show new size
new_size=$(du -sh "$DEST_DIR" 2>/dev/null | awk '{print $1}')
echo "📊 New deploy-site size: $new_size"
echo ""

# Count remaining large files
remaining_large=$(find "$DEST_DIR" -type f -size +2M 2>/dev/null | wc -l | tr -d ' ')
echo "📈 Remaining files over 2MB: $remaining_large"
echo ""

if [ "$remaining_large" -gt 0 ]; then
    echo "💡 You may want to optimize remaining large files:"
    find "$DEST_DIR" -type f -size +2M -exec ls -lh {} \; 2>/dev/null | head -10 | awk '{print "  " $5 " - " $9}'
fi

echo ""
echo "✨ Ready to deploy! Next:"
echo "   git add ."
echo "   git commit -m 'Cleanup: Removed large unnecessary folders'"
echo "   git push"
