# PayPal Smart Payment Buttons Guide

## Overview

Your Success Chemistry store now has **dynamic PayPal Smart Payment Buttons** that automatically integrate with your PayPal Agent Toolkit backend. These buttons support both one-time purchases and subscriptions, and they dynamically adapt based on cart contents.

## What's Been Implemented

### Dynamic Button Module
**File**: `public/paypal-buttons.js`

This module provides:
- ✅ **Automatic PayPal SDK loading**
- ✅ **One-time purchase buttons** - For regular orders
- ✅ **Subscription buttons** - For Subscribe & Save
- ✅ **Backend integration** - Uses PayPal Agent Toolkit APIs
- ✅ **Smart detection** - Automatically chooses button type
- ✅ **Error handling** - Graceful fallbacks
- ✅ **Success callbacks** - Custom completion handlers

### Integration Points

**1. Checkout Page** (`checkout.html`)
- Displays order summary with subscription savings
- Shows appropriate PayPal button (order or subscription)
- Handles payment completion and redirects
- Clears cart after successful payment

**2. Cart Page** (`cart.html`)
- Subscribe & Save toggle (single items only)
- Dynamic pricing based on selection
- Checkout button triggers subscription setup
- Passes subscription info to checkout

## How It Works

### For Regular Orders

```javascript
// Automatically renders on checkout page
window.PayPalButtons.renderCart();
```

**Flow:**
1. Customer clicks PayPal button
2. System calls `/api/paypal/orders` to create order
3. PayPal SDK opens payment window
4. Customer completes payment
5. System calls `/api/paypal/orders/:id/pay` to capture
6. Redirects to order confirmation
7. Cart is cleared

### For Subscriptions

```javascript
// When Subscribe & Save is selected in cart
window.PayPalButtons.renderCart();
```

**Flow:**
1. Customer selects "Subscribe & Save" in cart
2. Clicks "🔄 Subscribe Now" button
3. System calls `/api/subscription/setup` to create plan
4. Subscription info saved to localStorage
5. Redirects to checkout
6. PayPal subscription button renders
7. Customer approves subscription
8. Redirects to subscription success page

## Using PayPal Buttons

### Method 1: Auto-Render Cart Buttons

```javascript
// Automatically detects cart contents and subscription status
window.PayPalButtons.renderCart();
```

This is used on the checkout page and handles everything automatically.

### Method 2: Custom Button Configuration

```javascript
window.PayPalButtons.render('paypal-button-container', {
    amount: 29.99,
    currency: 'USD',
    description: 'Premium Supplement',
    items: [{
        name: 'Turmeric Curcumin',
        description: 'Premium supplement',
        price: 29.99,
        quantity: 1
    }],
    onSuccess: (payment) => {
        console.log('Payment successful:', payment);
        window.location.href = '/thank-you';
    },
    onError: (error) => {
        console.error('Payment failed:', error);
        alert('Payment failed. Please try again.');
    },
    onCancel: (data) => {
        console.log('Payment cancelled');
    }
});
```

### Method 3: Product Page Button

```javascript
// Quick setup for product pages
window.PayPalButtons.renderProduct(
    'product-sku-123',
    'Turmeric Curcumin',
    29.99
);
```

### Method 4: Subscription Button

```javascript
window.PayPalButtons.render('paypal-button-container', {
    isSubscription: true,
    planId: 'P-XXXXXXXXXXXX',
    onSuccess: (data) => {
        console.log('Subscription created:', data.subscriptionID);
        window.location.href = '/subscription-success';
    }
});
```

## Button Customization

### Style Options

The buttons automatically use optimal styling:

**Regular Order Buttons:**
- Color: Gold (PayPal brand color)
- Shape: Rectangular
- Label: "PayPal"
- Height: 45px

**Subscription Buttons:**
- Color: Blue
- Shape: Rectangular
- Label: "Subscribe"
- Height: 45px

### Custom Styling

To customize, edit `public/paypal-buttons.js`:

```javascript
// Line 50-56 for order buttons
style: {
    layout: 'vertical',
    color: 'gold',      // Options: gold, blue, silver, white, black
    shape: 'rect',      // Options: rect, pill
    label: 'paypal',    // Options: paypal, checkout, buynow, pay
    height: 45          // Range: 25-55
}

// Line 157-163 for subscription buttons
style: {
    layout: 'vertical',
    color: 'blue',
    shape: 'rect',
    label: 'subscribe',
    height: 45
}
```

## Adding Buttons to New Pages

### Example: Product Detail Page

```html
<!DOCTYPE html>
<html>
<head>
    <title>Product - Success Chemistry</title>
</head>
<body>
    <h1>Turmeric Curcumin</h1>
    <p>Price: $29.99</p>
    
    <!-- PayPal Button Container -->
    <div id="paypal-button-container"></div>
    
    <!-- Load PayPal Buttons Module -->
    <script src="/public/paypal-buttons.js"></script>
    
    <script>
        // Render button when page loads
        document.addEventListener('DOMContentLoaded', () => {
            window.PayPalButtons.renderProduct(
                '10775-506',
                'Turmeric Curcumin',
                29.99
            );
        });
    </script>
</body>
</html>
```

### Example: Custom Checkout Flow

```html
<div id="custom-paypal-button"></div>

<script src="/public/paypal-buttons.js"></script>
<script>
    const cartTotal = 99.99;
    const cartItems = [
        { name: 'Product 1', price: 49.99, quantity: 1 },
        { name: 'Product 2', price: 50.00, quantity: 1 }
    ];
    
    window.PayPalButtons.render('custom-paypal-button', {
        amount: cartTotal,
        description: 'Success Chemistry Order',
        items: cartItems,
        onSuccess: (payment) => {
            // Custom success handling
            console.log('Payment ID:', payment.id);
            
            // Save order to database
            fetch('/api/orders/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    paymentId: payment.id,
                    items: cartItems,
                    total: cartTotal
                })
            }).then(() => {
                window.location.href = '/thank-you';
            });
        },
        onError: (error) => {
            // Custom error handling
            console.error('Payment error:', error);
            document.getElementById('error-message').textContent = 
                'Payment failed. Please try again or contact support.';
        }
    });
</script>
```

## Backend Integration

The buttons automatically integrate with your PayPal Agent Toolkit backend:

### API Endpoints Used

**Create Order:**
```
POST http://localhost:3001/api/paypal/orders
```

**Capture Payment:**
```
POST http://localhost:3001/api/paypal/orders/:orderId/pay
```

**Create Subscription:**
```
POST http://localhost:3001/api/paypal/subscriptions
```

**Setup Subscription Plan:**
```
POST http://localhost:3001/api/subscription/setup
```

## Features

### 1. Automatic Order Creation
- Creates PayPal order via backend API
- Includes all cart items and pricing
- Handles item breakdown for receipts

### 2. Payment Capture
- Automatically captures payment after approval
- Verifies payment status
- Handles errors gracefully

### 3. Subscription Support
- Creates subscription plans automatically
- Links to PayPal subscription checkout
- Handles recurring billing setup

### 4. Cart Management
- Clears cart after successful payment
- Preserves cart on cancellation
- Saves subscription info for checkout

### 5. Error Handling
- Network error fallbacks
- PayPal API error messages
- User-friendly error alerts

## Testing

### Test with PayPal Sandbox

1. **Start your server:**
   ```bash
   node server/index.js
   ```

2. **Add item to cart:**
   - Go to shop page
   - Add product to cart

3. **Test Regular Purchase:**
   - Go to cart
   - Select "One-Time Purchase"
   - Click "Proceed to Checkout"
   - Click PayPal button
   - Use sandbox test account to complete payment

4. **Test Subscription:**
   - Add single item to cart
   - Select "Subscribe & Save"
   - Click "🔄 Subscribe Now"
   - Complete subscription in PayPal sandbox

### PayPal Sandbox Test Accounts

Create test accounts at: https://developer.paypal.com/dashboard/accounts

You'll need:
- **Personal Account** - For customer testing
- **Business Account** - Already configured (your credentials)

## Configuration

### PayPal Client ID

Currently set in `public/paypal-buttons.js`:
```javascript
const PAYPAL_CLIENT_ID = 'EBAQIbUDDVgB06yvEWREs2cMox8AKElkxFJAqKF71iUj007dv0YzxlKbepduwV7xGEI5FrjK3vakzm0b';
```

### Switching to Production

1. Update Client ID in `public/paypal-buttons.js`:
   ```javascript
   const PAYPAL_CLIENT_ID = 'YOUR_LIVE_CLIENT_ID';
   const PAYPAL_MODE = 'live';
   ```

2. Update backend `.env`:
   ```env
   PAYPAL_MODE=live
   PAYPAL_CLIENT_ID=your_live_client_id
   PAYPAL_CLIENT_SECRET=your_live_client_secret
   ```

## Troubleshooting

### Button Not Rendering

**Check:**
- PayPal SDK loaded: Open browser console, type `window.paypal`
- Container exists: `document.getElementById('paypal-button-container')`
- No JavaScript errors in console
- Server running on port 3001

### Order Creation Fails

**Check:**
- Server is running
- Backend API accessible at `http://localhost:3001`
- PayPal credentials valid in `.env`
- Network tab shows API call succeeding

### Payment Not Capturing

**Check:**
- Order ID returned from creation
- Payment API endpoint responding
- PayPal account has permissions
- Sandbox vs Live mode matches

### Subscription Not Working

**Check:**
- Subscription plan created successfully
- Plan ID passed to button
- Subscription API enabled in PayPal app settings
- Customer has valid payment method

## Advanced Usage

### Custom Success Page

Create `order-confirmation.html`:
```html
<!DOCTYPE html>
<html>
<head>
    <title>Order Confirmed - Success Chemistry</title>
</head>
<body>
    <h1>✅ Order Confirmed!</h1>
    <p>Thank you for your purchase.</p>
    <div id="order-details"></div>
    
    <script>
        const urlParams = new URLSearchParams(window.location.search);
        const orderId = urlParams.get('orderId');
        
        document.getElementById('order-details').innerHTML = `
            <p>Order ID: ${orderId}</p>
            <p>You will receive a confirmation email shortly.</p>
        `;
    </script>
</body>
</html>
```

### Webhook Integration

For production, set up PayPal webhooks to handle:
- Payment completed
- Subscription activated
- Subscription cancelled
- Refund processed

Configure at: https://developer.paypal.com/dashboard/webhooks

## Summary

✅ **Dynamic PayPal Smart Payment Buttons** - Fully integrated  
✅ **Backend API Integration** - Uses PayPal Agent Toolkit  
✅ **Subscription Support** - Subscribe & Save ready  
✅ **Error Handling** - Graceful fallbacks  
✅ **Cart Integration** - Automatic detection  
✅ **Customizable** - Easy to modify and extend  

Your PayPal buttons are production-ready and will automatically handle both regular purchases and subscriptions!

---

**Status**: ✅ Fully Operational  
**Last Updated**: January 2026  
**Version**: 1.0
