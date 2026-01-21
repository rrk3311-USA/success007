#!/bin/bash

# Image optimization script - resize category images and large files
# This will create optimized thumbnails for category images

SOURCE_DIR="/Users/r-kammer/CascadeProjects/Success Chemistry/deploy-site"
IMAGES_DIR="$SOURCE_DIR/images"

echo "🖼️  Image Optimization Script"
echo "=============================="
echo ""

# Check if ImageMagick or sips is available
if command -v convert &> /dev/null; then
    TOOL="imagemagick"
    echo "✅ Using ImageMagick"
elif command -v sips &> /dev/null; then
    TOOL="sips"
    echo "✅ Using sips (macOS built-in)"
else
    echo "❌ Error: Need ImageMagick or sips to resize images"
    echo "   Install ImageMagick: brew install imagemagick"
    exit 1
fi

# Function to resize image
resize_image() {
    local file="$1"
    local max_width="$2"
    local max_height="$3"
    local quality="$4"
    
    if [ "$TOOL" = "imagemagick" ]; then
        convert "$file" -resize "${max_width}x${max_height}>" -quality "$quality" -strip "$file"
    elif [ "$TOOL" = "sips" ]; then
        # sips doesn't support quality for PNG, but we can resize
        sips -Z "$max_width" "$file" > /dev/null 2>&1
        # For JPEG, we can set quality
        if [[ "$file" == *.jpg ]] || [[ "$file" == *.jpeg ]]; then
            sips -s format jpeg -s formatOptions "$quality" "$file" --out "$file" > /dev/null 2>&1
        fi
    fi
}

# Category images should be small thumbnails (300x300 max)
echo "📐 Optimizing category images..."
echo ""

# Find and optimize large images in images folder
find "$IMAGES_DIR" -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" \) -size +500k | while read file; do
    size=$(ls -lh "$file" | awk '{print $5}')
    echo "  🔧 Optimizing: $(basename "$file") ($size)"
    
    # Get file size in bytes
    file_size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
    
    # Resize based on file size
    if [ "$file_size" -gt 5000000 ]; then
        # Very large files (>5MB) - resize to 800px max
        resize_image "$file" 800 800 85
    elif [ "$file_size" -gt 2000000 ]; then
        # Large files (>2MB) - resize to 1200px max
        resize_image "$file" 1200 1200 85
    elif [ "$file_size" -gt 500000 ]; then
        # Medium files (>500KB) - resize to 1500px max
        resize_image "$file" 1500 1500 85
    fi
    
    new_size=$(ls -lh "$file" | awk '{print $5}')
    echo "     ✅ Reduced to: $new_size"
done

echo ""
echo "📦 Creating optimized category thumbnails..."
echo ""

# Create category thumbnails directory if it doesn't exist
CATEGORY_DIR="$IMAGES_DIR/categories"
mkdir -p "$CATEGORY_DIR"

# If there are category images, optimize them to 300x300
if [ -d "$CATEGORY_DIR" ]; then
    find "$CATEGORY_DIR" -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" \) | while read file; do
        echo "  🖼️  Creating thumbnail: $(basename "$file")"
        resize_image "$file" 300 300 90
    done
fi

echo ""
echo "✅ Image optimization complete!"
echo ""
echo "📊 Summary:"
du -sh "$IMAGES_DIR" 2>/dev/null | awk '{print "   Total images folder size: " $1}'
