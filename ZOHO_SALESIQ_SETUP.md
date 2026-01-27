# Zoho SalesIQ & Zia Skills Integration

## ✅ Setup Complete!

Your Success Chemistry site is now integrated with Zoho SalesIQ and Zia Skills.

## 📋 What's Been Added

### 1. **API Endpoints** (`local-server.js`)
- `/api/zia/products/search?q=QUERY&field=ingredients` - Search products
- `/api/zia/products/:sku` - Get product by SKU
- `/api/zia/products` - Get all products summary

### 2. **SalesIQ Widget** 
- Added to `index.html` (appears on all pages)
- Widget code in `/deploy-site/includes/salesiq-widget.html`

### 3. **Test Script**
- `test-zia-api.js` - Test all API endpoints
- Run with: `npm run test:zia`

## 🚀 Usage

### Testing the API

1. **Start your server:**
   ```bash
   npm run start
   ```

2. **Run the test script:**
   ```bash
   npm run test:zia
   ```

3. **Test endpoints manually:**
   - Search: `http://localhost:8080/api/zia/products/search?q=L-Arginine`
   - Get product: `http://localhost:8080/api/zia/products/52274-401`
   - All products: `http://localhost:8080/api/zia/products`

### Using in Zia Skills

In Zoho SalesIQ → Zia Skills, use the `invokeUrl` function:

```javascript
// Search products by ingredient
response = invokeUrl [
    url: "https://successchemistry.com/api/zia/products/search?q=L-Arginine&field=ingredients"
    type: GET
    connection: "ide"
];

// Get product details
response = invokeUrl [
    url: "https://successchemistry.com/api/zia/products/52274-401"
    type: GET
    connection: "ide"
];

// Search by name
response = invokeUrl [
    url: "https://successchemistry.com/api/zia/products/search?q=Women&field=name"
    type: GET
    connection: "ide"
];
```

### API Response Format

**Search Response:**
```json
{
  "success": true,
  "query": "L-Arginine",
  "count": 3,
  "products": [
    {
      "sku": "52274-401",
      "name": "Women's Balance...",
      "price": 28,
      "category": "Women's Health",
      "short_description": "...",
      "ingredients": "...",
      "key_features": "...",
      "url": "https://successchemistry.com/product?sku=52274-401"
    }
  ]
}
```

**Product by SKU Response:**
```json
{
  "success": true,
  "product": {
    "sku": "52274-401",
    "name": "...",
    "price": 28,
    "category": "Women's Health",
    "description": "...",
    "ingredients": "...",
    "supplement_facts": "...",
    "suggested_use": "...",
    "images": [...],
    "url": "..."
  }
}
```

## 🔍 Search Fields

The `field` parameter supports:
- `ingredients` - Search in product ingredients
- `name` - Search in product names
- `description` - Search in descriptions
- `category` - Search in categories
- `goals` - Search in key search terms and SEO targets
- `all` - Search all fields (default)

## 📝 Next Steps

1. **Train Zia Skills:**
   - Go to Zoho SalesIQ → Zia Skills
   - Create a new skill
   - Use `invokeUrl` to call your API endpoints
   - Train it to answer questions about products, ingredients, and goals

2. **Configure Lead Capture:**
   - Set up lead capture forms in SalesIQ
   - Configure webhooks to sync leads to Capsule CRM and Zoho CRM
   - Webhook URL: `https://successchemistry.com/api/webhooks/salesiq/lead`

3. **Test the Widget:**
   - Visit your site
   - The SalesIQ chat widget should appear
   - Test conversations with Zia Skills

## 🐛 Troubleshooting

**API not working?**
- Check server is running: `npm run start`
- Verify products data loaded: Check server console for "✅ Loaded X products"
- Test endpoints: `npm run test:zia`

**Widget not appearing?**
- Check browser console for errors
- Verify widget code is in HTML before `</body>`
- Check SalesIQ dashboard for widget status

**Zia Skills not responding?**
- Verify API URL is correct (use production URL: `https://successchemistry.com`)
- Check connection name matches ("ide")
- Test API endpoint directly in browser

## 🔗 Lead Capture Webhook

### Webhook Endpoint
**URL:** `https://successchemistry.com/api/webhooks/salesiq/lead`  
**Method:** `POST`  
**Content-Type:** `application/json`

### Request Format
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "message": "Interested in prostate health supplements",
  "company": "Optional Company Name"
}
```

### Response Format
```json
{
  "success": true,
  "message": "Lead captured and synced",
  "results": {
    "capsule": {
      "success": true,
      "contactId": "12345"
    },
    "zoho": {
      "success": true,
      "lead": { "id": "67890" }
    }
  }
}
```

### Setting Up in SalesIQ

1. **Go to SalesIQ Dashboard** → Settings → Integrations → Webhooks
2. **Add Webhook:**
   - URL: `https://successchemistry.com/api/webhooks/salesiq/lead`
   - Method: `POST`
   - Trigger: On lead capture / form submission
3. **Map Fields:**
   - `firstName` → First Name
   - `lastName` → Last Name
   - `email` → Email
   - `phone` → Phone
   - `message` → Message/Description

### CRM Sync

The webhook automatically syncs leads to:
- ✅ **Capsule CRM** - Creates contact (or updates if exists)
- ✅ **Zoho CRM** - Creates lead (or updates if exists)

**Note:** Zoho CRM requires `ZOHO_CRM_ACCESS_TOKEN` in `.env` file. If not configured, only Capsule CRM will sync.

## 📚 Resources

- [Zoho SalesIQ Documentation](https://www.zoho.com/salesiq/help/)
- [Zia Skills Guide](https://www.zoho.com/salesiq/help/developer-section/bot-zia-integration-2.0.html)
- [Capsule CRM API](https://developer.capsulecrm.com/)
- [Zoho CRM API](https://www.zoho.com/crm/developer/docs/api/v2/)
- [API Endpoints Documentation](./deploy-site/llms.txt)
