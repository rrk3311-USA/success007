#!/bin/bash

# eBay OAuth Token Refresh - Ready to Run
# Replace CLIENT_SECRET and REFRESH_TOKEN below, then run this script

CLIENT_ID="RaphaelK-Cursor-PRD-0b440ed0b-8f8aab49"
CLIENT_SECRET=""  # ⚠️ ADD YOUR CLIENT SECRET HERE
REFRESH_TOKEN=""  # ⚠️ ADD YOUR REFRESH TOKEN HERE

# Check if values are set
if [ -z "$CLIENT_SECRET" ]; then
    echo "❌ Error: CLIENT_SECRET not set"
    echo ""
    echo "💡 Get your Client Secret from:"
    echo "   https://developer.ebay.com/my/keys"
    echo "   Click 'Show' next to your Production Client Secret"
    echo ""
    echo "Then edit this file and add it to CLIENT_SECRET=\"\""
    exit 1
fi

if [ -z "$REFRESH_TOKEN" ]; then
    echo "❌ Error: REFRESH_TOKEN not set"
    echo ""
    echo "💡 You need to complete OAuth flow first:"
    echo "   1. Run: node ebay-oauth-helper.js generate-url"
    echo "   2. Visit the URL and authorize"
    echo "   3. Copy the authorization code"
    echo "   4. Run: node ebay-oauth-helper.js exchange-code <code>"
    echo "   5. Copy the refresh_token from the output"
    echo ""
    echo "Then edit this file and add it to REFRESH_TOKEN=\"\""
    exit 1
fi

# Create Base64 encoded credentials
CREDENTIALS=$(echo -n "${CLIENT_ID}:${CLIENT_SECRET}" | base64)

echo "🔄 Refreshing eBay OAuth token..."
echo ""
echo "Request Details:"
echo "   URL: https://api.ebay.com/identity/v1/oauth2/token"
echo "   Method: POST"
echo "   Grant Type: refresh_token"
echo "   Client ID: ${CLIENT_ID}"
echo "   Refresh Token: ${REFRESH_TOKEN:0:30}..."
echo ""

# Make the request
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST "https://api.ebay.com/identity/v1/oauth2/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -H "Authorization: Basic ${CREDENTIALS}" \
  -d "grant_type=refresh_token" \
  -d "refresh_token=${REFRESH_TOKEN}" \
  -d "scope=https://api.ebay.com/oauth/api_scope/sell.inventory https://api.ebay.com/oauth/api_scope/sell.account https://api.ebay.com/oauth/api_scope/sell.marketing https://api.ebay.com/oauth/api_scope/commerce.catalog")

# Split response and status
HTTP_BODY=$(echo "$RESPONSE" | sed '$d')
HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)

echo "📊 Response Status: ${HTTP_STATUS}"
echo ""
echo "Response Body:"
echo "$HTTP_BODY" | jq '.' 2>/dev/null || echo "$HTTP_BODY"
echo ""

if [ "$HTTP_STATUS" = "200" ]; then
    echo "✅ Token refreshed successfully!"
    echo ""
    echo "💡 Update deploy-site/config.js with:"
    echo ""
    ACCESS_TOKEN=$(echo "$HTTP_BODY" | jq -r '.access_token' 2>/dev/null)
    NEW_REFRESH_TOKEN=$(echo "$HTTP_BODY" | jq -r '.refresh_token' 2>/dev/null)
    EXPIRES_IN=$(echo "$HTTP_BODY" | jq -r '.expires_in' 2>/dev/null)
    
    if [ -n "$ACCESS_TOKEN" ]; then
        echo "ACCESS_TOKEN: '${ACCESS_TOKEN}',"
    fi
    if [ -n "$NEW_REFRESH_TOKEN" ]; then
        echo "REFRESH_TOKEN: '${NEW_REFRESH_TOKEN}',"
    fi
    if [ -n "$EXPIRES_IN" ]; then
        EXPIRES_DATE=$(date -u -v+${EXPIRES_IN}S +"%a, %d %b %Y %H:%M:%S GMT" 2>/dev/null || date -u -d "+${EXPIRES_IN} seconds" +"%a, %d %b %Y %H:%M:%S GMT" 2>/dev/null || echo "Calculate manually")
        echo "EXPIRES: '${EXPIRES_DATE}',"
    fi
else
    echo "❌ Token refresh failed!"
    echo ""
    echo "Check the error message above for details."
fi
