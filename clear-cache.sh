#!/bin/bash

# 🧹 Cache Clearing Script for Success Chemistry Project
# Clears various types of cache that might be causing issues

echo "🧹 Clearing Cache..."
echo "===================="
echo ""

# Get the project directory
PROJECT_DIR="/Users/r-kammer/Documents/GitHub/success007"
cd "$PROJECT_DIR" || exit 1

# 1. Clear npm cache
echo "1️⃣  Clearing npm cache..."
npm cache clean --force
echo "   ✅ npm cache cleared"
echo ""

# 2. Clear Vite cache (if exists)
echo "2️⃣  Clearing Vite cache..."
if [ -d "node_modules/.vite" ]; then
    rm -rf node_modules/.vite
    echo "   ✅ Vite cache cleared"
else
    echo "   ℹ️  No Vite cache found"
fi
echo ""

# 3. Clear any .cache directories
echo "3️⃣  Clearing .cache directories..."
find . -type d -name ".cache" -not -path "*/node_modules/*" -exec rm -rf {} + 2>/dev/null
if [ $? -eq 0 ]; then
    echo "   ✅ .cache directories cleared"
else
    echo "   ℹ️  No .cache directories found"
fi
echo ""

# 4. Clear dist/build directories (if exists)
echo "4️⃣  Clearing build artifacts..."
if [ -d "dist" ]; then
    rm -rf dist
    echo "   ✅ dist/ directory cleared"
fi
if [ -d "build" ]; then
    rm -rf build
    echo "   ✅ build/ directory cleared"
fi
if [ -d ".next" ]; then
    rm -rf .next
    echo "   ✅ .next/ directory cleared"
fi
echo ""

# 5. Clear OS-specific caches
echo "5️⃣  Clearing system caches..."
# macOS specific
if [ -d "$HOME/Library/Caches" ]; then
    # Clear npm cache in user's cache directory
    rm -rf "$HOME/Library/Caches/npm" 2>/dev/null
    echo "   ✅ System npm cache cleared"
fi
echo ""

# Summary
echo "===================="
echo "✅ Cache clearing complete!"
echo ""
echo "💡 Next steps:"
echo "   - If you want to reinstall dependencies: npm install"
echo "   - If you want to rebuild: npm run build"
echo "   - Clear browser cache: Cmd+Shift+Delete (Mac) or Ctrl+Shift+Delete (Windows)"
echo ""
