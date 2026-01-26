#!/bin/bash

# Exact commands to get eBay category tree
# Replace <ACCESS_TOKEN> with your token from config.js

TOKEN=$(node -e "import('./deploy-site/config.js?t='+Date.now()).then(m=>console.log(m.CONFIG.EBAY_API.ACCESS_TOKEN))" 2>/dev/null)

echo "=" | head -c 60
echo ""
echo "Step 1: Get Default Category Tree ID"
echo "=" | head -c 60
echo ""
echo "Command:"
echo 'curl -s "https://api.ebay.com/commerce/taxonomy/v1/get_default_category_tree_id?marketplace_id=EBAY_US" \'
echo '  -H "Authorization: Bearer <ACCESS_TOKEN>"'
echo ""
echo "Response:"
curl -s "https://api.ebay.com/commerce/taxonomy/v1/get_default_category_tree_id?marketplace_id=EBAY_US" \
  -H "Authorization: Bearer ${TOKEN}" | jq '.' 2>/dev/null || curl -s "https://api.ebay.com/commerce/taxonomy/v1/get_default_category_tree_id?marketplace_id=EBAY_US" \
  -H "Authorization: Bearer ${TOKEN}"

echo ""
echo ""
echo "=" | head -c 60
echo ""
echo "Step 2: Search Categories (run after getting tree ID)"
echo "=" | head -c 60
echo ""
echo "Command (replace <TREE_ID> with result from Step 1):"
echo 'curl -s "https://api.ebay.com/commerce/taxonomy/v1/category_tree/<TREE_ID>/get_category_suggestions?q=dietary%20supplements" \'
echo '  -H "Authorization: Bearer <ACCESS_TOKEN>"'
echo ""

# Try to get tree ID and search
TREE_ID=$(curl -s "https://api.ebay.com/commerce/taxonomy/v1/get_default_category_tree_id?marketplace_id=EBAY_US" \
  -H "Authorization: Bearer ${TOKEN}" 2>/dev/null | grep -o '"categoryTreeId":"[^"]*"' | cut -d'"' -f4)

if [ -n "$TREE_ID" ] && [ "$TREE_ID" != "null" ] && [ ! -z "$TREE_ID" ]; then
    echo "Tree ID found: $TREE_ID"
    echo ""
    echo "Searching for 'dietary supplements'..."
    echo ""
    curl -s "https://api.ebay.com/commerce/taxonomy/v1/category_tree/${TREE_ID}/get_category_suggestions?q=dietary%20supplements" \
      -H "Authorization: Bearer ${TOKEN}" | jq '.categorySuggestions[0:10] | .[] | {categoryId: .category.categoryId, categoryName: .category.categoryName}' 2>/dev/null || \
    curl -s "https://api.ebay.com/commerce/taxonomy/v1/category_tree/${TREE_ID}/get_category_suggestions?q=dietary%20supplements" \
      -H "Authorization: Bearer ${TOKEN}"
else
    echo "⚠️  Could not get tree ID automatically."
    echo "   Token may need commerce.taxonomy.readonly scope"
    echo "   Run: node ebay-oauth-helper.js generate-url"
    echo "   Re-authorize with new scopes, then exchange code for new token"
fi

echo ""
