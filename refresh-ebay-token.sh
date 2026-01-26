#!/bin/bash

# Refresh eBay OAuth Token
# This script refreshes your eBay OAuth access token using a refresh token

# Load config values (you'll need to set these)
CLIENT_ID="RaphaelK-Cursor-PRD-0b440ed0b-8f8aab49"
CLIENT_SECRET=""  # Add your client secret here
REFRESH_TOKEN=""   # Add your refresh token here

# Check if values are set
if [ -z "$CLIENT_SECRET" ]; then
    echo "❌ Error: CLIENT_SECRET not set"
    echo "💡 Get it from: https://developer.ebay.com/my/keys"
    echo "   Then edit this script and add it"
    exit 1
fi

if [ -z "$REFRESH_TOKEN" ]; then
    echo "❌ Error: REFRESH_TOKEN not set"
    echo "💡 You need to complete OAuth flow first to get a refresh token"
    echo "   Run: node ebay-oauth-helper.js exchange-code <code>"
    exit 1
fi

# Create Base64 encoded credentials
CREDENTIALS=$(echo -n "${CLIENT_ID}:${CLIENT_SECRET}" | base64)

echo "🔄 Refreshing eBay OAuth token..."
echo ""

# Make the request
curl -X POST "https://api.ebay.com/identity/v1/oauth2/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -H "Authorization: Basic ${CREDENTIALS}" \
  -d "grant_type=refresh_token" \
  -d "refresh_token=${REFRESH_TOKEN}" \
  -d "scope=https://api.ebay.com/oauth/api_scope/sell.inventory https://api.ebay.com/oauth/api_scope/sell.account https://api.ebay.com/oauth/api_scope/sell.marketing https://api.ebay.com/oauth/api_scope/commerce.catalog" \
  -w "\n\nHTTP Status: %{http_code}\n"
