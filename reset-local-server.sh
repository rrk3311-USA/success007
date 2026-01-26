#!/bin/bash
echo "🔄 RESETTING LOCAL SERVER..."
echo ""

# Kill all node processes
echo "1. Killing old servers..."
killall node 2>/dev/null
sleep 2

# Start server from workspace
echo "2. Starting server from workspace..."
cd /Users/r-kammer/Documents/GitHub/success007
if [ ! -f "local-server.js" ]; then
    echo "   ❌ ERROR: local-server.js not found!"
    echo "   Make sure you're in the correct directory"
    exit 1
fi
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
