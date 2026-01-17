# Subscribe & Save Feature Guide

## Overview

The Subscribe & Save feature has been successfully integrated into your Success Chemistry e-commerce site using the PayPal Agent Toolkit. This feature offers customers a 15% discount on monthly auto-deliveries and only appears when there's a **single item** in the cart.

## How It Works

### Customer Experience

1. **Cart Detection**: When a customer has exactly 1 item in their cart, they see the Subscribe & Save option
2. **Choice Toggle**: Customers can choose between:
   - **One-Time Purchase** - Regular price
   - **Subscribe & Save** - 15% off with monthly delivery
3. **Visual Benefits**: Clear display of:
   - Monthly savings ($X.XX per delivery)
   - Annual savings ($X.XX per year)
   - Free shipping on subscriptions
   - Cancel anytime flexibility
4. **Checkout Flow**: When subscribing, the system:
   - Creates a PayPal product (if needed)
   - Creates a subscription plan with 15% discount
   - Redirects to PayPal subscription checkout

### Technical Implementation

## Files Modified/Created

### Backend Files

**`server/paypal-agent.js`** - PayPal Agent Toolkit wrapper
- Initializes PayPal toolkit with all tools enabled
- Provides helper functions for all PayPal operations
- Configured for sandbox mode by default

**`server/paypal-routes.js`** - PayPal API endpoints
- `/api/paypal/orders` - Order management
- `/api/paypal/invoices` - Invoice operations
- `/api/paypal/products` - Product catalog
- `/api/paypal/subscription-plans` - Plan management
- `/api/paypal/subscriptions` - Subscription operations
- `/api/paypal/transactions` - Transaction reporting
- `/api/paypal/disputes` - Dispute management

**`server/subscription-manager.js`** - Subscription business logic
- `ensureProductInPayPal()` - Syncs products to PayPal catalog
- `createSubscriptionPlanForProduct()` - Creates monthly plans with 15% discount
- `setupSubscriptionForCartItem()` - Full subscription setup
- `calculateSubscriptionSavings()` - Calculates savings display

**`server/index.js`** - Updated with new routes
- Added PayPal routes at `/api/paypal/*`
- Added subscription endpoints:
  - `POST /api/subscription/setup` - Setup subscription for cart item
  - `POST /api/subscription/calculate-savings` - Calculate savings

### Frontend Files

**`cart.html`** - Enhanced cart page
- New Subscribe & Save section (only shows for single items)
- Toggle between one-time and subscription purchase
- Real-time savings calculation
- Updated checkout button with subscription flow
- Integration with backend subscription API

## Key Features

### 1. Automatic Product Sync
When a customer chooses to subscribe, the system:
- Checks if product exists in PayPal catalog
- Creates product if needed
- Links to existing product if already created

### 2. Subscription Plan Creation
- Creates monthly subscription plan automatically
- Sets 15% discount (configurable)
- Includes product details and images
- Enables auto-billing

### 3. Savings Display
- **Per Delivery**: Shows $X.XX saved per month
- **Annual**: Shows total yearly savings (monthly savings × 12)
- **Percentage**: Clearly displays 15% discount badge

### 4. Customer Benefits Highlighted
- ✅ Save 15% on every delivery
- ✅ Free shipping on subscriptions
- ✅ Never run out - automatic delivery
- ✅ Cancel or skip anytime
- ✅ Modify delivery schedule

## Configuration

### Discount Percentage
To change the subscription discount, update in `server/subscription-manager.js`:

```javascript
// Line 37 - Change 0.85 to adjust discount
const discountedPrice = (productData.price * 0.85).toFixed(2); // 15% off

// Line 109 - Update savings calculation
const subscriptionPrice = price * 0.85; // 15% off
```

### Subscription Frequency
To change delivery frequency, update in `server/subscription-manager.js`:

```javascript
// Line 42-45
frequency: {
  interval_unit: 'MONTH', // Change to 'WEEK', 'DAY', 'YEAR'
  interval_count: 1       // Change to 2 for bi-monthly, etc.
}
```

### Display Conditions
Currently shows only for single items. To change, update in `cart.html`:

```javascript
// Line 377 - Change condition
${cart.length === 1 ? `...` : ''}
```

## API Endpoints

### Setup Subscription
```javascript
POST http://localhost:3001/api/subscription/setup
Content-Type: application/json

{
  "cartItem": {
    "sku": "10775-506",
    "name": "Turmeric Curcumin",
    "price": 29.00,
    "quantity": 1,
    "image": "/images/products/10775-506/01.png"
  }
}

Response:
{
  "success": true,
  "subscription": {
    "productId": "PROD-XXX",
    "planId": "P-XXX",
    "savings": "4.35",
    "subscriptionPrice": "24.65"
  }
}
```

### Calculate Savings
```javascript
POST http://localhost:3001/api/subscription/calculate-savings
Content-Type: application/json

{
  "price": 29.00,
  "quantity": 1
}

Response:
{
  "success": true,
  "savings": {
    "regularPrice": "29.00",
    "regularTotal": "29.00",
    "subscriptionPrice": "24.65",
    "subscriptionTotal": "24.65",
    "savings": "4.35",
    "savingsPercent": 15
  }
}
```

## PayPal Configuration

### Environment Variables
Already configured in `.env`:
```env
PAYPAL_MODE=sandbox
PAYPAL_CLIENT_ID=EBAQIbUDDVgB06yvEWRE...
PAYPAL_CLIENT_SECRET=ATlL0F2rcNpoQK97h7if...
```

### Switching to Production
Update `.env`:
```env
PAYPAL_MODE=live
PAYPAL_CLIENT_ID=your_live_client_id
PAYPAL_CLIENT_SECRET=your_live_client_secret
```

## Testing

### Start the Server
```bash
cd /Users/r-kammer/CascadeProjects/Success\ Chemistry
node server/index.js
```

Expected output:
```
Server running on http://localhost:3001
🤖 Fleet Manager AI System: ONLINE
📊 Analytics Dashboard: READY
🎯 Tracking & Lead Magnets: ACTIVE
📦 Inventory: All products set to 100,000 units
💳 PayPal Agent Toolkit: READY
🔄 Subscribe & Save: ACTIVE
```

### Test Subscription Flow

1. **Add Single Item to Cart**
   - Go to shop page
   - Add one product to cart
   - Navigate to cart

2. **Verify Subscribe & Save Appears**
   - Should see purple gradient section
   - Two options: One-Time vs Subscribe & Save
   - Subscribe & Save should be pre-selected

3. **Toggle Options**
   - Click "One-Time Purchase" - benefits hide, price changes
   - Click "Subscribe & Save" - benefits show, discounted price

4. **Check Savings Display**
   - Monthly savings should show
   - Annual savings should calculate correctly
   - Total should reflect 15% discount

5. **Proceed to Checkout**
   - Click "🔄 Subscribe Now" button
   - System calls `/api/subscription/setup`
   - Creates PayPal product and plan
   - Redirects to checkout with subscription info

### Test with PayPal Sandbox

1. Use PayPal sandbox test accounts
2. Complete subscription checkout
3. Verify subscription created in PayPal dashboard
4. Test subscription management (cancel, modify)

## Troubleshooting

### Subscription Not Showing
- Check cart has exactly 1 item
- Verify JavaScript loaded correctly
- Check browser console for errors

### API Errors
- Ensure server is running on port 3001
- Verify PayPal credentials in `.env`
- Check server logs for error details
- Confirm PayPal Agent Toolkit initialized

### PayPal Product Creation Fails
- Verify PayPal credentials are valid
- Check sandbox vs live mode settings
- Ensure product data is complete
- Review PayPal API error messages

## Future Enhancements

### Potential Additions
1. **Multi-item subscriptions** - Allow subscribing to bundles
2. **Frequency options** - Let customers choose delivery schedule
3. **Subscription management page** - Customer portal for managing subscriptions
4. **Discount tiers** - Higher discounts for longer commitments
5. **First-order discount** - Extra savings on first subscription order
6. **Subscription analytics** - Track subscription metrics in dashboard

### Integration Points
- Link to existing customer dashboard
- Add subscription status to order history
- Email notifications for upcoming deliveries
- SMS reminders for subscription renewals

## Support

For PayPal Agent Toolkit documentation:
- [PayPal Agent Toolkit GitHub](https://github.com/paypal/paypal-agent-toolkit)
- [PayPal Subscriptions API](https://developer.paypal.com/docs/subscriptions/)
- [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/)

---

**Status**: ✅ Fully Operational
**Last Updated**: January 2026
**Version**: 1.0
