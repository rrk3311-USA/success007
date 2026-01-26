#!/bin/bash

# Test eBay Access Token
# Usage: ./test-access-token.sh <ACCESS_TOKEN>

ACCESS_TOKEN="$1"

if [ -z "$ACCESS_TOKEN" ]; then
    echo "❌ Error: ACCESS_TOKEN required"
    echo ""
    echo "Usage: ./test-access-token.sh <ACCESS_TOKEN>"
    echo ""
    echo "Or get token from config.js and run:"
    echo "  node -e \"const c=require('./deploy-site/config.js'); console.log(c.EBAY_API.ACCESS_TOKEN)\" | xargs ./test-access-token.sh"
    exit 1
fi

echo "🧪 Testing eBay Access Token..."
echo ""
echo "Request: GET https://api.ebay.com/sell/account/v1/privilege"
echo "Authorization: Bearer <ACCESS_TOKEN>"
echo ""

curl -i "https://api.ebay.com/sell/account/v1/privilege" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -H "X-EBAY-C-MARKETPLACE-ID: EBAY_US"

echo ""
echo ""
echo "📊 Status Code Meanings:"
echo "   200 → ✅ Token works! Proceed to policies + listings"
echo "   401 → ❌ Token invalid/expired - refresh needed"
echo "   403 → ⚠️  Scopes/seller setup issue"
