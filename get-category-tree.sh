#!/bin/bash

# Get eBay Category Tree using Taxonomy API
# Run these commands to get the category tree ID and find leaf categories

# Get access token from config
TOKEN=$(node -e "import('./deploy-site/config.js?t='+Date.now()).then(m=>console.log(m.CONFIG.EBAY_API.ACCESS_TOKEN))" 2>/dev/null)

if [ -z "$TOKEN" ]; then
    echo "❌ Could not get access token from config.js"
    exit 1
fi

echo "=" | head -c 60
echo ""
echo "Step 1: Get Default Category Tree ID"
echo "=" | head -c 60
echo ""
echo ""

curl -s "https://api.ebay.com/commerce/taxonomy/v1/get_default_category_tree_id?marketplace_id=EBAY_US" \
  -H "Authorization: Bearer ${TOKEN}" | jq '.' || cat

echo ""
echo ""
echo "=" | head -c 60
echo ""
echo "Step 2: Search Categories (if Step 1 worked)"
echo "=" | head -c 60
echo ""
echo ""

# If we got a tree ID, search for supplements
TREE_ID=$(curl -s "https://api.ebay.com/commerce/taxonomy/v1/get_default_category_tree_id?marketplace_id=EBAY_US" \
  -H "Authorization: Bearer ${TOKEN}" | jq -r '.categoryTreeId' 2>/dev/null)

if [ -n "$TREE_ID" ] && [ "$TREE_ID" != "null" ]; then
    echo "Tree ID: $TREE_ID"
    echo ""
    echo "Searching for 'dietary supplements'..."
    echo ""
    
    curl -s "https://api.ebay.com/commerce/taxonomy/v1/category_tree/${TREE_ID}/get_category_suggestions?q=dietary%20supplements" \
      -H "Authorization: Bearer ${TOKEN}" | jq '.categorySuggestions[0:10] | .[] | {categoryId: .category.categoryId, categoryName: .category.categoryName}' || cat
else
    echo "⚠️  Could not get tree ID. Token may need additional scopes."
    echo ""
    echo "Required scope: https://api.ebay.com/oauth/api_scope/commerce.taxonomy.readonly"
    echo "Or try: https://api.ebay.com/oauth/api_scope/commerce.catalog.readonly"
fi

echo ""
echo ""
