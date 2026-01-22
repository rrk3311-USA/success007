#!/bin/bash
echo "🔄 RESETTING LOCAL SERVER..."
echo ""

# Kill all node processes
echo "1. Killing old servers..."
killall node 2>/dev/null
sleep 2

# Sync all files
echo "2. Syncing all files from GitHub repo..."
cd /Users/r-kammer/Documents/GitHub/success007
rsync -av --delete deploy-site/ "/Users/r-kammer/CascadeProjects/Success Chemistry/deploy-site/" > /dev/null 2>&1
echo "   ✅ Files synced"

# Start server
echo "3. Starting server..."
cd '/Users/r-kammer/CascadeProjects/Success Chemistry'
node local-server.js &
sleep 2

echo ""
echo "✅ SERVER RESET COMPLETE!"
echo ""
echo "📍 Access your site:"
echo "   • Home: http://localhost:8080/"
echo "   • Shop: http://localhost:8080/shop"
echo "   • Admin: http://localhost:8080/admin (NOT /adim)"
echo ""
echo "⚠️  If you see 'Cannot GET', check the URL spelling!"
