#!/bin/bash

# Workspace Verification Script
# Ensures you're working in the correct directory

CORRECT_WORKSPACE="/Users/r-kammer/Documents/GitHub/success007"
CURRENT_DIR=$(pwd)

echo "🔍 VERIFYING WORKSPACE"
echo "====================="
echo ""

# Check if we're in the correct directory
if [ "$CURRENT_DIR" != "$CORRECT_WORKSPACE" ]; then
    echo "❌ WARNING: You're in the wrong directory!"
    echo ""
    echo "   Current:  $CURRENT_DIR"
    echo "   Expected: $CORRECT_WORKSPACE"
    echo ""
    echo "   Run: cd $CORRECT_WORKSPACE"
    exit 1
fi

echo "✅ Correct workspace: $CORRECT_WORKSPACE"
echo ""

# Check for required files
echo "📋 Checking required files..."
REQUIRED_FILES=("deploy-site" ".git" "local-server.js" "package.json")
ALL_GOOD=true

for file in "${REQUIRED_FILES[@]}"; do
    if [ -e "$file" ]; then
        echo "   ✅ $file"
    else
        echo "   ❌ $file - MISSING!"
        ALL_GOOD=false
    fi
done

echo ""

# Check for old directories that might cause confusion
echo "🔍 Checking for old/duplicate directories..."
OLD_DIRS=(
    "$HOME/success007"
    "$HOME/CascadeProjects/Success Chemistry"
)

FOUND_OLD=false
for dir in "${OLD_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        echo "   ⚠️  Found old directory: $dir"
        echo "      Consider archiving this to avoid confusion"
        FOUND_OLD=true
    fi
done

if [ "$FOUND_OLD" = false ]; then
    echo "   ✅ No old directories found"
fi

echo ""

# Check git status
if [ -d ".git" ]; then
    echo "📦 Git Status:"
    git remote -v | head -1 | sed 's/^/   /'
    echo ""
    BRANCH=$(git branch --show-current)
    echo "   Current branch: $BRANCH"
    echo ""
    
    # Check for uncommitted changes
    if [ -n "$(git status --porcelain)" ]; then
        echo "   ⚠️  You have uncommitted changes"
        echo "      Run: git status"
    else
        echo "   ✅ Working directory clean"
    fi
fi

echo ""
echo "✅ Workspace verification complete!"
echo ""
echo "💡 Quick commands:"
echo "   • Start server: node local-server.js"
echo "   • View site: http://localhost:8080"
echo "   • Commit: git add . && git commit -m 'message'"
echo "   • Deploy: git push"
