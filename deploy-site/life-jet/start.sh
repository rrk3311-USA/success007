#!/bin/bash

# LIFE JET - Start Script
echo "🚀 Starting LIFE JET..."
echo "📍 Location: $(pwd)"
echo ""

cd "$(dirname "$0")"

# Check if node_modules exists
if [ ! -d "../node_modules" ] && [ ! -d "../../node_modules" ]; then
    echo "⚠️  node_modules not found. Running from project root..."
    cd ../..
    if [ ! -d "node_modules" ]; then
        echo "❌ Error: node_modules not found. Please run 'npm install' from project root first."
        exit 1
    fi
fi

# Start Vite dev server
echo "🎯 Starting Vite dev server on port 5174..."
echo "🌐 Open http://localhost:5174 in your browser"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npx vite --host --port 5174
