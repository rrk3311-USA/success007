# eBay API Integration Setup

## Configuration

The eBay API token has been saved in `deploy-site/config.js`:

```javascript
EBAY_API: {
    ACCESS_TOKEN: 'v^1.1#i^1#r^1#p^3#f^0#I^3#t^Ul4xMF83OjUwMTgyNjk2ODkzQUFDQ0E2M0FBODVDOTA0NjEyOTgwXzJfMSNFXjI2MA==',
    EXPIRES: 'Sun, 18 Jul 2027 00:21:56 GMT',
    BASE_URL: 'https://api.ebay.com',
    SANDBOX_BASE_URL: 'https://api.sandbox.ebay.com',
    USE_SANDBOX: false,
    ENABLED: true
}
```

## API Information

- **Production Base URL**: `https://api.ebay.com`
- **Sandbox Base URL**: `https://api.sandbox.ebay.com`
- **Documentation**: https://developer.ebay.com/api-docs
- **Inventory API**: https://developer.ebay.com/api-docs/sell/inventory/overview.html

## Authentication

eBay uses **OAuth 2.0 Bearer Token** authentication:

```
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json
```

## Test Script

Run the test script to list Women's Balance product:

```bash
node test-ebau-api.js https://api.ebay.com
```

## Current Status

The test script is connecting to eBay API but receiving **403 Forbidden** errors, indicating:

1. **Token may need different scopes** - Ensure token has:
   - `https://api.ebay.com/oauth/api_scope/sell.inventory`
   - `https://api.ebay.com/oauth/api_scope/commerce.catalog`

2. **Token format** - The provided token format (`v^1.1#i^1#r^1#...`) may need special handling or decoding

3. **Production access** - Verify production access is enabled in eBay Developer Portal

## Next Steps

1. Verify the token is a valid OAuth 2.0 User Access Token (not App ID)
2. Check token scopes in eBay Developer Portal
3. Ensure production access is enabled
4. Try generating a new User Token with required scopes

## API Endpoints Tested

The script tests these eBay API endpoints:

1. `GET /sell/inventory/v1/inventory_item` - List all inventory items
2. `GET /sell/inventory/v1/inventory_item?sku=52274-401` - Get specific SKU
3. `GET /sell/inventory/v1/offer` - List all offers/listings
4. `GET /commerce/catalog/v1/product_summary/search` - Search catalog
5. `GET /buy/browse/v1/item_summary/search` - Browse API search
