# WooCommerce My Account Feature Setup

## Overview
The My Account feature allows customers to view their orders, update their profile, and manage their account using WooCommerce API endpoints.

## Features
- ✅ View order history from WooCommerce
- ✅ Update customer profile (name, email, phone, address)
- ✅ View account overview with stats
- ✅ Loyalty points integration
- ✅ Responsive design

## WooCommerce API Endpoints Used

### Customer Endpoints
- `GET /wp-json/wc/v3/customers?email={email}` - Get customer by email
- `GET /wp-json/wc/v3/customers/{id}` - Get customer by ID
- `PUT /wp-json/wc/v3/customers/{id}` - Update customer

### Order Endpoints
- `GET /wp-json/wc/v3/orders?customer={customerId}` - Get customer orders
- `GET /wp-json/wc/v3/orders/{id}` - Get single order

## Setup Instructions

### 1. Get WooCommerce API Credentials

1. Log into your WordPress admin: `https://blueviolet-snake-802946.hostingersite.com/wp-admin`
2. Go to **WooCommerce → Settings → Advanced → REST API**
3. Click **Add Key**
4. Set:
   - **Description**: "Success Chemistry Customer Account"
   - **User**: Select an admin user
   - **Permissions**: **Read/Write** (needed to update customer data)
5. Click **Generate API Key**
6. Copy the **Consumer Key** and **Consumer Secret**

### 2. Configure API Credentials

**Option A: Admin Dashboard (Recommended)**
1. Go to `/admin` page
2. Navigate to WooCommerce Settings
3. Enter Consumer Key and Consumer Secret
4. Save (credentials stored in localStorage)

**Option B: Direct Configuration**
Edit `/deploy-site/public/woocommerce-account.js`:
```javascript
const WOOCOMMERCE_CONFIG = {
    url: 'https://blueviolet-snake-802946.hostingersite.com',
    consumerKey: 'ck_your_key_here',
    consumerSecret: 'cs_your_secret_here',
    apiEndpoint: '/wp-json/wc/v3'
};
```

### 3. How It Works

1. **Customer Identification**: 
   - System tries to get customer email from:
     - `localStorage.getItem('successChemistrySettings').email`
     - Recent orders in localStorage
   - If email found, fetches customer from WooCommerce

2. **Loading Account Data**:
   - Calls `GET /wp-json/wc/v3/customers?email={email}`
   - If customer exists, loads their orders
   - Displays customer info and order history

3. **Updating Profile**:
   - Customer edits their information
   - Calls `PUT /wp-json/wc/v3/customers/{id}` to update WooCommerce
   - Updates local cache

## Usage

### For Customers
1. Visit `/my-account-dashboard.html`
2. System automatically loads account if email is found
3. View orders, update profile, check loyalty points

### For Developers

```javascript
// Load customer account
const accountData = await window.WooCommerceAccount.loadCustomerAccount('customer@email.com');

// Get customer by email
const customer = await window.WooCommerceAccount.getCustomerByEmail('customer@email.com');

// Get customer orders
const orders = await window.WooCommerceAccount.getCustomerOrders(customerId);

// Update customer
const updated = await window.WooCommerceAccount.updateCustomer(customerId, {
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
    billing: {
        phone: '555-1234',
        address_1: '123 Main St',
        city: 'City',
        state: 'State',
        postcode: '12345',
        country: 'US'
    }
});
```

## Security Notes

⚠️ **Important**: The WooCommerce API credentials have **Read/Write** access. 

**Best Practices**:
1. Store credentials securely (not in public code)
2. Use environment variables in production
3. Consider creating a read-only API key for customer-facing features
4. Implement proper authentication/authorization

## Troubleshooting

### "WooCommerce API credentials not found"
- Make sure credentials are set in admin dashboard or config file
- Check browser console for errors

### "Customer not found"
- Customer must exist in WooCommerce
- Email must match exactly
- Customer must have at least one order (or be manually created)

### CORS Errors
- WooCommerce REST API should allow CORS from your domain
- Check WooCommerce → Settings → Advanced → REST API
- May need to add CORS headers on server

## Files

- `/deploy-site/public/woocommerce-account.js` - WooCommerce API integration
- `/deploy-site/my-account-dashboard.html` - Customer account dashboard
- `/deploy-site/woocommerce-order-integration.js` - Order creation integration

## Next Steps

- [ ] Add customer authentication/login
- [ ] Add password reset functionality
- [ ] Add order tracking integration
- [ ] Add subscription management
- [ ] Add download links for digital products
