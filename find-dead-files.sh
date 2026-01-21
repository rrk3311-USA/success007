#!/bin/bash

# Find dead/broken files - empty, orphaned, duplicates, etc.

LOCAL_DEV="/Users/r-kammer/CascadeProjects/Success Chemistry/deploy-site"

echo "🔍 Finding Dead & Broken Files"
echo "==============================="
echo ""

if [ ! -d "$LOCAL_DEV" ]; then
    echo "❌ Local dev folder not found: $LOCAL_DEV"
    exit 1
fi

# Empty files
echo "1️⃣  EMPTY FILES (0 bytes - probably dead):"
echo "----------------------------------------"
empty_files=$(find "$LOCAL_DEV" -type f -empty 2>/dev/null)
if [ -z "$empty_files" ]; then
    echo "   ✅ None found"
else
    echo "$empty_files" | while read file; do
        rel_path="${file#$LOCAL_DEV/}"
        echo "   ❌ $rel_path"
    done
fi
echo ""

# Files with no extension (suspicious)
echo "2️⃣  FILES WITH NO EXTENSION (might be dead):"
echo "-------------------------------------------"
find "$LOCAL_DEV" -type f ! -name ".*" ! -name "*.*" 2>/dev/null | while read file; do
    rel_path="${file#$LOCAL_DEV/}"
    size=$(ls -lh "$file" 2>/dev/null | awk '{print $5}')
    echo "   ⚠️  $rel_path ($size)"
done | head -20
if [ $(find "$LOCAL_DEV" -type f ! -name ".*" ! -name "*.*" 2>/dev/null | wc -l) -gt 20 ]; then
    echo "   ... and more"
fi
echo ""

# Duplicate filenames
echo "3️⃣  DUPLICATE FILENAMES (same name in different folders):"
echo "----------------------------------------------------------"
find "$LOCAL_DEV" -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.html" \) 2>/dev/null | \
    xargs -I {} basename {} | sort | uniq -d | head -20 | while read dup; do
    echo "   🔄 $dup"
    find "$LOCAL_DEV" -name "$dup" 2>/dev/null | while read file; do
        rel_path="${file#$LOCAL_DEV/}"
        size=$(ls -lh "$file" 2>/dev/null | awk '{print $5}')
        echo "      📍 $rel_path ($size)"
    done
    echo ""
done
echo ""

# Broken image references
echo "4️⃣  CHECKING FOR BROKEN IMAGE REFERENCES:"
echo "-----------------------------------------"
echo "   (This checks if HTML files reference images that don't exist)"
echo ""
# This would need more complex parsing, but we can list all image references
grep -r -h -o -E 'src=["'\''][^"'\'']+\.(png|jpg|jpeg|gif|webp)' "$LOCAL_DEV" --include="*.html" 2>/dev/null | \
    sed "s/.*src=['\"]//" | sed "s/['\"].*//" | sort -u | head -30 | while read img; do
    # Check if file exists
    if [[ "$img" == /* ]]; then
        # Absolute path from root
        check_path="$LOCAL_DEV$img"
    else
        # Relative path
        check_path="$LOCAL_DEV/$img"
    fi
    if [ ! -f "$check_path" ]; then
        echo "   ❌ Broken: $img (referenced but file missing)"
    fi
done
echo ""

# Old/unused files
echo "5️⃣  VERY OLD FILES (might be unused):"
echo "------------------------------------"
find "$LOCAL_DEV" -type f -mtime +365 -exec ls -lh {} \; 2>/dev/null | \
    awk '{print $9, $6, $7, $8}' | head -20 | while read file date time size; do
    rel_path="${file#$LOCAL_DEV/}"
    echo "   📅 $rel_path (last modified: $date $time)"
done
echo ""

# Summary
echo "📊 SUMMARY"
echo "---------"
total_files=$(find "$LOCAL_DEV" -type f 2>/dev/null | wc -l | tr -d ' ')
empty_count=$(find "$LOCAL_DEV" -type f -empty 2>/dev/null | wc -l | tr -d ' ')
no_ext_count=$(find "$LOCAL_DEV" -type f ! -name ".*" ! -name "*.*" 2>/dev/null | wc -l | tr -d ' ')

echo "   Total files: $total_files"
echo "   Empty files: $empty_count"
echo "   Files with no extension: $no_ext_count"
echo ""
echo "💡 TIP: Review the files above and delete any you don't need"
echo ""
