#!/bin/bash

# Build and Deploy Script for Success Chemistry
# Builds LIFE JET React app and prepares for deployment

echo "🚀 Building project for deployment..."
echo ""

# Navigate to project root
cd "$(dirname "$0")"

# Build LIFE JET React app
echo "📦 Building LIFE JET React app..."
cd deploy-site/life-jet

# Build the React app
if npx vite build 2>&1; then
    echo "✅ LIFE JET build complete"
    
    # Copy built files to replace source files for deployment
    if [ -d "dist" ]; then
        echo "📁 Preparing built files..."
        # The dist folder contains the built app
        # Vercel/Render will serve from deploy-site/life-jet/
        echo "✅ Build output ready in dist/"
    fi
else
    echo "❌ Build failed!"
    exit 1
fi

cd ../..

echo ""
echo "✅ Build complete! Ready for deployment."
echo ""
echo "📋 Next steps:"
echo "   1. git add ."
echo "   2. git commit -m 'Build: Updated project with LIFE JET'"
echo "   3. git push"
echo ""
echo "🌐 Vercel and Render will automatically deploy!"
