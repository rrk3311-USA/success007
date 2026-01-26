#!/bin/bash

# Deploy to all platforms: Vercel, Render, Hostinger, and Docker
# This script coordinates deployment across all configured platforms

set -e

echo "🚀 Deploying Success Chemistry to All Platforms"
echo "================================================"
echo ""

# Navigate to project root
cd "$(dirname "$0")"

# Step 1: Build the project
echo "📦 Step 1: Building project..."
echo ""
npm run build:all
echo "✅ Build complete"
echo ""

# Step 2: Commit and push to GitHub (triggers Vercel & Render)
echo "📤 Step 2: Pushing to GitHub (triggers Vercel & Render auto-deploy)..."
echo ""

# Check if there are changes to commit
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 Committing changes..."
    git add .
    git commit -m "Deploy: Update site with latest changes" || echo "No changes to commit"
    git push origin main
    echo "✅ Pushed to GitHub"
    echo "   → Vercel will auto-deploy"
    echo "   → Render will auto-deploy"
else
    echo "ℹ️  No changes to commit - already up to date"
fi

echo ""

# Step 3: Deploy to Hostinger (if configured)
echo "🌐 Step 3: Deploying to Hostinger..."
if [ -f .env ] && grep -q "HOSTINGER_HOST" .env; then
    if [ -f deploy-to-hostinger.sh ]; then
        ./deploy-to-hostinger.sh
        echo "✅ Hostinger deployment complete"
    else
        echo "⚠️  deploy-to-hostinger.sh not found"
    fi
else
    echo "ℹ️  Hostinger credentials not configured - skipping"
    echo "   Add HOSTINGER_* variables to .env to enable"
fi

echo ""

# Step 4: Docker deployment options
echo "🐳 Step 4: Docker Deployment Options"
echo ""
echo "To deploy with Docker, choose one:"
echo ""
echo "1. Build and run locally:"
echo "   docker-compose up -d"
echo ""
echo "2. Build Docker image:"
echo "   docker build -t success-chemistry ."
echo ""
echo "3. Push to Docker Hub (if configured):"
echo "   docker tag success-chemistry yourusername/success-chemistry:latest"
echo "   docker push yourusername/success-chemistry:latest"
echo ""
echo "4. Deploy to cloud (AWS, GCP, Azure, etc.):"
echo "   Use your cloud provider's container service"
echo ""

echo "✅ Deployment workflow complete!"
echo ""
echo "📊 Deployment Status:"
echo "   ✅ GitHub: Pushed (triggers auto-deploy)"
echo "   ✅ Vercel: Auto-deploying from GitHub"
echo "   ✅ Render: Auto-deploying from GitHub"
if [ -f .env ] && grep -q "HOSTINGER_HOST" .env; then
    echo "   ✅ Hostinger: Deployed via FTP"
else
    echo "   ⏭️  Hostinger: Skipped (not configured)"
fi
echo "   🐳 Docker: Ready (see options above)"
echo ""
