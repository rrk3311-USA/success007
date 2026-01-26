# eBay Product Listing Guide

## Overview

This guide explains how to list your Success Chemistry products on eBay using the eBay Inventory API.

## Prerequisites

1. ✅ **eBay Developer Account** - Already set up
2. ✅ **OAuth Access Token** - Need to complete OAuth flow
3. ⚠️ **Policies** - Need to create (fulfillment, payment, return)
4. ⚠️ **Merchant Location** - Need to set up

## Step-by-Step Process

### Step 1: Get OAuth Access Token

If you haven't already, complete the OAuth flow:

```bash
# Generate authorization URL
node ebay-oauth-helper.js generate-url

# Visit the URL and authorize
# Copy the authorization code from the redirect URL

# Exchange code for token
node ebay-oauth-helper.js exchange-code <authorization_code>
```

**Important:** You'll need your **Client Secret** from https://developer.ebay.com/my/keys

### Step 2: Set Up Policies

eBay requires these policies before creating listings:

```bash
node setup-ebay-policies.js
```

This will create:
- ✅ Fulfillment Policy (shipping)
- ✅ Payment Policy
- ✅ Return Policy
- ✅ Get Merchant Location Key

**After running**, update `deploy-site/config.js` with the policy IDs:

```javascript
EBAY_API: {
    // ... existing config ...
    FULFILLMENT_POLICY_ID: 'your-fulfillment-policy-id',
    PAYMENT_POLICY_ID: 'your-payment-policy-id',
    RETURN_POLICY_ID: 'your-return-policy-id',
    MERCHANT_LOCATION_KEY: 'your-location-key'
}
```

### Step 3: Create Product Listing

List a product on eBay:

```bash
# List Women's Balance product
node create-ebay-listing.js 52274-401

# List any other product
node create-ebay-listing.js <SKU>
```

The script will:
1. ✅ Create inventory item (product details)
2. ✅ Create offer (listing) for that inventory item

## Available Scripts

### `ebay-oauth-helper.js`
- `generate-url` - Generate OAuth authorization URL
- `exchange-code <code>` - Exchange authorization code for access token
- `refresh` - Refresh expired access token

### `setup-ebay-policies.js`
- Creates all required policies for listings
- Gets merchant location information

### `create-ebay-listing.js <SKU>`
- Creates inventory item
- Creates listing (offer) for the product

## Product Data

Products are loaded from `deploy-site/products-data.js`. Currently **56 products** available.

To see available products:
```bash
node create-ebay-listing.js
```

## Listing Process Details

### 1. Inventory Item Creation
- Product details (title, description, images)
- SKU mapping
- Product aspects (attributes)
- Weight and dimensions
- UPC/GTIN codes

### 2. Offer Creation
- Links to inventory item
- Pricing
- Category mapping
- Policy references
- Quantity/stock

## Common Issues

### "Policy IDs not found"
- Run `setup-ebay-policies.js` first
- Update config.js with policy IDs

### "Access token expired"
- Run `node ebay-oauth-helper.js refresh`
- Or get a new token via OAuth flow

### "Merchant location not found"
- Set up warehouse location in eBay Seller Hub
- Or use the location key from `setup-ebay-policies.js`

### "Category ID invalid"
- Update `mapCategoryToEbayCategory()` function
- Use eBay category finder: https://pages.ebay.com/sellerinformation/sellingresources/categorylisting.html

## eBay Category Mapping

Currently mapped to:
- **Health & Beauty > Vitamins & Dietary Supplements** (Category ID: 26395)

To change categories, edit the `mapCategoryToEbayCategory()` function in `create-ebay-listing.js`.

## Next Steps

1. ✅ Complete OAuth flow (get access token)
2. ✅ Set up policies (`setup-ebay-policies.js`)
3. ✅ Update config.js with policy IDs
4. ✅ Create your first listing (`create-ebay-listing.js <SKU>`)
5. ✅ Verify listing on eBay
6. ✅ Create listings for all products (batch process)

## Batch Listing

To list multiple products, create a simple script:

```javascript
const products = ['52274-401', '14179-504-2', '10786-807-2'];
for (const sku of products) {
    // Run create-ebay-listing.js for each SKU
}
```

## Resources

- **eBay Developer Portal**: https://developer.ebay.com/my/keys
- **Inventory API Docs**: https://developer.ebay.com/api-docs/sell/inventory/overview.html
- **Account API Docs**: https://developer.ebay.com/api-docs/sell/account/overview.html
- **Category Finder**: https://pages.ebay.com/sellerinformation/sellingresources/categorylisting.html

## Support

If you encounter issues:
1. Check access token is valid
2. Verify policies are created
3. Check API error messages
4. Review eBay API documentation
