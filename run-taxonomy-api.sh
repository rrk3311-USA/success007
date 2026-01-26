#!/bin/bash

# Run eBay Taxonomy API to find leaf category
# Replace <ACCESS_TOKEN> with your token that has commerce.taxonomy.readonly scope

TOKEN="${1:-$(node -e "import('./deploy-site/config.js?t='+Date.now()).then(m=>console.log(m.CONFIG.EBAY_API.ACCESS_TOKEN))" 2>/dev/null)}"

if [ -z "$TOKEN" ] || [ "$TOKEN" = "undefined" ]; then
    echo "❌ No access token provided"
    echo ""
    echo "Usage: $0 <ACCESS_TOKEN>"
    echo "   OR: Set ACCESS_TOKEN in config.js and run without arguments"
    echo ""
    echo "To get a token with taxonomy scope:"
    echo "  1. node ebay-oauth-helper.js generate-url"
    echo "  2. Visit the URL and authorize"
    echo "  3. node ebay-oauth-helper.js exchange-code <code>"
    exit 1
fi

echo "=" | head -c 60
echo ""
echo "Step 1: Get Default Category Tree ID"
echo "=" | head -c 60
echo ""
echo ""

RESPONSE=$(curl -s "https://api.ebay.com/commerce/taxonomy/v1/get_default_category_tree_id?marketplace_id=EBAY_US" \
  -H "Authorization: Bearer ${TOKEN}")

echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"

TREE_ID=$(echo "$RESPONSE" | jq -r '.categoryTreeId' 2>/dev/null)

echo ""
echo ""

if [ -n "$TREE_ID" ] && [ "$TREE_ID" != "null" ] && [ ! -z "$TREE_ID" ]; then
    echo "=" | head -c 60
    echo ""
    echo "Step 2: Search Categories for 'dietary supplements'"
    echo "=" | head -c 60
    echo ""
    echo "Tree ID: $TREE_ID"
    echo ""
    
    curl -s "https://api.ebay.com/commerce/taxonomy/v1/category_tree/${TREE_ID}/get_category_suggestions?q=dietary%20supplements" \
      -H "Authorization: Bearer ${TOKEN}" | jq '.categorySuggestions[0:10] | .[] | {categoryId: .category.categoryId, categoryName: .category.categoryName, path: .category.categoryNamePath}' 2>/dev/null || \
    curl -s "https://api.ebay.com/commerce/taxonomy/v1/category_tree/${TREE_ID}/get_category_suggestions?q=dietary%20supplements" \
      -H "Authorization: Bearer ${TOKEN}"
    
    echo ""
    echo ""
    echo "=" | head -c 60
    echo ""
    echo "Step 3: Verify Leaf Category (run manually with category ID)"
    echo "=" | head -c 60
    echo ""
    echo "Command:"
    echo "curl -s \"https://api.ebay.com/commerce/taxonomy/v1/category_tree/${TREE_ID}/get_category_subtree?category_id=<CATEGORY_ID>\" \\"
    echo "  -H \"Authorization: Bearer ${TOKEN}\" | jq '.'"
else
    echo "⚠️  Could not get tree ID. Token may be invalid or missing taxonomy scope."
    echo ""
    echo "Error details:"
    echo "$RESPONSE" | jq '.errors' 2>/dev/null || echo "$RESPONSE"
fi

echo ""
