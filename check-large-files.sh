#!/bin/bash

# Check for large files that might cause deployment issues

SOURCE_DIR="/Users/r-kammer/CascadeProjects/Success Chemistry/deploy-site"

echo "🔍 Checking for Large Files"
echo "==========================="
echo ""

# Files over 5MB (definitely too big)
echo "⚠️  FILES OVER 5MB (Too Large for Web):"
echo "----------------------------------------"
find "$SOURCE_DIR" -type f -size +5M -exec ls -lh {} \; 2>/dev/null | awk '{print "  " $5 " - " $9}'
echo ""

# Files over 2MB (should be optimized)
echo "📦 FILES OVER 2MB (Should Optimize):"
echo "------------------------------------"
find "$SOURCE_DIR" -type f -size +2M -size -5M -exec ls -lh {} \; 2>/dev/null | awk '{print "  " $5 " - " $9}' | head -20
echo ""

# Large directories
echo "📁 LARGE DIRECTORIES:"
echo "---------------------"
du -sh "$SOURCE_DIR/images"/* 2>/dev/null | sort -hr | head -10 | awk '{printf "  %-10s %s\n", $1, $2}'
echo ""

# Summary
total_size=$(du -sh "$SOURCE_DIR" 2>/dev/null | awk '{print $1}')
echo "📊 Total deploy-site size: $total_size"
echo ""

# Count files by size
over_5mb=$(find "$SOURCE_DIR" -type f -size +5M 2>/dev/null | wc -l | tr -d ' ')
over_2mb=$(find "$SOURCE_DIR" -type f -size +2M 2>/dev/null | wc -l | tr -d ' ')
over_1mb=$(find "$SOURCE_DIR" -type f -size +1M 2>/dev/null | wc -l | tr -d ' ')

echo "📈 File Count Summary:"
echo "  Files over 5MB: $over_5mb"
echo "  Files over 2MB: $over_2mb"
echo "  Files over 1MB: $over_1mb"
echo ""

# Recommendations
echo "💡 RECOMMENDATIONS:"
echo "-------------------"
echo ""
echo "1. EXCLUDE from deployment (not needed on website):"
echo "   - images/UGC & Review/ (78MB - user reviews, not needed)"
echo "   - images/SC backgrounds/ (20MB - unused backgrounds)"
echo "   - images/GMP proccess images/ (18MB - process photos)"
echo "   - images/Great images to sort/ (9MB - unsorted)"
echo ""
echo "2. OPTIMIZE (resize/compress):"
echo "   - images/home/ (31MB - home page images)"
echo "   - images/products/ (127MB - product images)"
echo ""
echo "3. Category images are fine (568K)"
echo ""
