#!/bin/bash

# Full project audit - understand your entire setup
# This will show you everything: folders, files, URLs, git status, etc.

WORKSPACE="/Users/r-kammer/Documents/GitHub/success007"

echo "🔍 FULL PROJECT AUDIT"
echo "===================="
echo ""

# ============================================
# 1. PROJECT STRUCTURE
# ============================================
echo "📁 PROJECT STRUCTURE"
echo "================================"
echo ""
echo "📍 YOUR WORKSPACE (Single Source of Truth):"
echo "   $WORKSPACE"
if [ -d "$WORKSPACE" ]; then
    echo "   ✅ EXISTS"
    workspace_size=$(du -sh "$WORKSPACE" 2>/dev/null | awk '{print $1}')
    echo "   📊 Size: $workspace_size"
else
    echo "   ❌ NOT FOUND - This is a problem!"
fi
echo ""

echo "📍 DEPLOYMENT:"
echo "   Auto-deploys to successchemistry.com on git push"
echo ""

# ============================================
# 2. GIT STATUS
# ============================================
echo "🔀 GIT STATUS"
echo "============"
echo ""

if [ -d "$WORKSPACE/.git" ]; then
    cd "$WORKSPACE" || exit
    echo "📦 Repository: $(git remote get-url origin 2>/dev/null || echo 'No remote')"
    echo "🌿 Current branch: $(git branch --show-current 2>/dev/null || echo 'unknown')"
    echo ""
    
    echo "📝 Files tracked by git:"
    git ls-files 2>/dev/null | wc -l | awk '{print "   " $1 " files"}'
    echo ""
    
    echo "📋 Modified/New files (not committed):"
    git status --short 2>/dev/null | head -20
    if [ $(git status --short 2>/dev/null | wc -l) -gt 20 ]; then
        echo "   ... and $(($(git status --short 2>/dev/null | wc -l) - 20)) more"
    fi
    echo ""
    
    echo "🗑️  Files git is ignoring (.gitignore):"
    git status --ignored --short 2>/dev/null | grep '^!!' | head -10
    echo ""
else
    echo "❌ Not a git repository"
fi
echo ""

# ============================================
# 3. FOLDER STRUCTURE
# ============================================
echo "📂 LOCAL DEV FOLDER STRUCTURE"
echo "=============================="
echo ""

if [ -d "$WORKSPACE" ]; then
    echo "Top-level folders in local dev:"
    ls -1d "$WORKSPACE"/*/ 2>/dev/null | while read dir; do
        dirname=$(basename "$dir")
        size=$(du -sh "$dir" 2>/dev/null | awk '{print $1}')
        echo "   📁 $dirname ($size)"
    done
    echo ""
    
    if [ -d "$WORKSPACE/deploy-site" ]; then
        echo "deploy-site/ subfolders:"
        ls -1d "$WORKSPACE/deploy-site"/*/ 2>/dev/null | head -20 | while read dir; do
            dirname=$(basename "$dir")
            size=$(du -sh "$dir" 2>/dev/null | awk '{print $1}')
            echo "   📁 $dirname ($size)"
        done
        if [ $(ls -1d "$WORKSPACE/deploy-site"/*/ 2>/dev/null | wc -l) -gt 20 ]; then
            echo "   ... and more"
        fi
    fi
fi
echo ""

# ============================================
# 4. PRODUCTION REPO STRUCTURE
# ============================================
echo "📂 PRODUCTION REPO STRUCTURE"
echo "============================"
echo ""

if [ -d "$WORKSPACE" ]; then
    echo "Top-level items:"
    ls -1 "$WORKSPACE" 2>/dev/null | head -30 | while read item; do
        if [ -d "$WORKSPACE/$item" ]; then
            size=$(du -sh "$WORKSPACE/$item" 2>/dev/null | awk '{print $1}')
            echo "   📁 $item/ ($size)"
        else
            echo "   📄 $item"
        fi
    done
    echo ""
    
    if [ -d "$WORKSPACE/deploy-site" ]; then
        echo "deploy-site/ subfolders:"
        ls -1d "$WORKSPACE/deploy-site"/*/ 2>/dev/null | head -20 | while read dir; do
            dirname=$(basename "$dir")
            size=$(du -sh "$dir" 2>/dev/null | awk '{print $1}')
            echo "   📁 $dirname ($size)"
        done
    fi
fi
echo ""

# ============================================
# 5. FIND DEAD/BROKEN FILES
# ============================================
echo "🔍 CHECKING FOR DEAD/BROKEN FILES"
echo "=================================="
echo ""

if [ -d "$WORKSPACE/deploy-site" ]; then
    echo "Looking for common dead file patterns..."
    echo ""
    
    # Empty files
    empty_count=$(find "$WORKSPACE/deploy-site" -type f -empty 2>/dev/null | wc -l | tr -d ' ')
    if [ "$empty_count" -gt 0 ]; then
        echo "⚠️  Empty files ($empty_count found):"
        find "$WORKSPACE/deploy-site" -type f -empty 2>/dev/null | head -10 | sed 's|.*/|   |'
        echo ""
    fi
    
    # Orphaned files (no extension, suspicious)
    echo "🔎 Suspicious files (might be dead):"
    find "$WORKSPACE/deploy-site" -type f ! -name ".*" ! -name "*.html" ! -name "*.js" ! -name "*.css" ! -name "*.json" ! -name "*.xml" ! -name "*.txt" ! -name "*.md" ! -name "*.png" ! -name "*.jpg" ! -name "*.jpeg" ! -name "*.gif" ! -name "*.webp" ! -name "*.svg" ! -name "*.ico" 2>/dev/null | head -10 | sed 's|.*/|   |'
    echo ""
    
    # Duplicate files
    echo "📋 Potential duplicate files:"
    find "$WORKSPACE/deploy-site" -type f -name "*.png" -o -name "*.jpg" 2>/dev/null | xargs -I {} basename {} | sort | uniq -d | head -10 | while read dup; do
        echo "   🔄 $dup"
        find "$WORKSPACE/deploy-site" -name "$dup" 2>/dev/null | sed 's|.*/|      |'
    done
    echo ""
fi

# ============================================
# 6. URLS IN CODE
# ============================================
echo "🌐 URLs FOUND IN CODE"
echo "===================="
echo ""

if [ -d "$WORKSPACE/deploy-site" ]; then
    echo "External URLs (http/https):"
    grep -r -h -o -E 'https?://[^"'\''\s<>]+' "$WORKSPACE/deploy-site" --include="*.html" --include="*.js" 2>/dev/null | sort -u | head -20 | sed 's/^/   /'
    echo ""
    
    echo "Local paths (/shop, /product, etc.):"
    grep -r -h -o -E '["'\'']/[^"'\''\s<>]+' "$WORKSPACE/deploy-site" --include="*.html" --include="*.js" 2>/dev/null | grep -E '^["'\'']/(shop|product|cart|admin|blog|contact|faq|privacy|terms|payment|shipping)' | sort -u | head -20 | sed 's/^/   /'
    echo ""
fi

# ============================================
# 7. LARGE FILES SUMMARY
# ============================================
echo "📊 LARGE FILES SUMMARY"
echo "======================"
echo ""

if [ -d "$WORKSPACE/deploy-site" ]; then
    echo "Files over 5MB:"
    find "$WORKSPACE/deploy-site" -type f -size +5M -exec ls -lh {} \; 2>/dev/null | awk '{print "   " $5 " - " $9}' | sed "s|$WORKSPACE/deploy-site/||"
    echo ""
    
    echo "Files over 2MB:"
    count=$(find "$WORKSPACE/deploy-site" -type f -size +2M 2>/dev/null | wc -l | tr -d ' ')
    echo "   Total: $count files"
    echo ""
fi

# ============================================
# 8. SUMMARY & RECOMMENDATIONS
# ============================================
echo "💡 SUMMARY & UNDERSTANDING"
echo "=========================="
echo ""
echo "📍 YOUR WORKSPACE:"
echo ""
echo "   Location: $WORKSPACE"
echo "   - Edit files here"
echo "   - Run: node local-server.js"
echo "   - View at: http://localhost:8080"
echo "   - Managed by git"
echo "   - GitHub Desktop watches this folder"
echo "   - Auto-deploys to successchemistry.com on git push"
echo ""
echo "🔄 WORKFLOW:"
echo "   1. Edit files in deploy-site/"
echo "   2. Test: node local-server.js → http://localhost:8080"
echo "   3. Commit: git add . && git commit -m 'message'"
echo "   4. Deploy: git push (auto-deploys)"
echo ""
echo "📋 NEXT STEPS:"
echo "   1. Review the files above"
echo "   2. Clean up any dead files you see"
echo "   3. Test changes locally"
echo "   4. Deploy: git add . && git commit && git push"
echo ""
