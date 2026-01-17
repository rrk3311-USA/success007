# PayPal Agent Toolkit Integration Guide

## Overview

The PayPal Agent Toolkit has been installed and configured for Success Chemistry. This toolkit enables AI agent frameworks to integrate with PayPal APIs through function calling, providing comprehensive payment, invoicing, subscription, and dispute management capabilities.

## Installation Status

✅ **Package Installed**: `@paypal/agent-toolkit` (v1.x)  
✅ **Configuration File**: `server/paypal-agent.js`  
✅ **Environment Variables**: Added to `.env.example`

## Setup Instructions

### 1. Configure Environment Variables

Add your PayPal API credentials to your `.env` file:

```env
# PayPal API Credentials (for PayPal Agent Toolkit)
PAYPAL_MODE=sandbox              # Use 'sandbox' for testing, 'live' for production
PAYPAL_CLIENT_ID=your_client_id_here
PAYPAL_CLIENT_SECRET=your_client_secret_here
```

**Get Your Credentials:**
1. Visit [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/)
2. Create an app under "My Apps & Credentials"
3. Copy your Client ID and Secret from the Sandbox or Live tab

### 2. Initialize the Toolkit

The toolkit is automatically initialized when you import the module:

```javascript
import { initializePayPalAgent, getPayPalToolkit } from './server/paypal-agent.js';

// Initialize on server startup
initializePayPalAgent();
```

## Available Tools & Functions

### 📄 Invoice Management

```javascript
import { createInvoice, listInvoices, getInvoice, sendInvoice } from './server/paypal-agent.js';

// Create a new invoice
const invoice = await createInvoice({
  detail: {
    invoice_number: "INV-001",
    currency_code: "USD"
  },
  invoicer: {
    name: { given_name: "Success", surname: "Chemistry" }
  },
  primary_recipients: [{
    billing_info: { email_address: "customer@example.com" }
  }],
  items: [{
    name: "Product Name",
    quantity: "1",
    unit_amount: { currency_code: "USD", value: "100.00" }
  }]
});

// List all invoices
const invoices = await listInvoices({ page: 1, page_size: 10 });

// Get specific invoice
const invoiceDetails = await getInvoice('INVOICE-123');

// Send invoice to customer
await sendInvoice('INVOICE-123');
```

### 💳 Payment & Order Management

```javascript
import { createOrder, getOrder, payOrder, createRefund } from './server/paypal-agent.js';

// Create an order
const order = await createOrder({
  intent: "CAPTURE",
  purchase_units: [{
    amount: {
      currency_code: "USD",
      value: "100.00"
    }
  }]
});

// Get order details
const orderDetails = await getOrder('ORDER-123');

// Process payment
const payment = await payOrder('ORDER-123');

// Create a refund
const refund = await createRefund('CAPTURE-123', {
  amount: {
    currency_code: "USD",
    value: "50.00"
  }
});
```

### 🛡️ Dispute Management

```javascript
import { listDisputes, getDispute } from './server/paypal-agent.js';

// List all disputes
const disputes = await listDisputes({ dispute_state: 'OPEN' });

// Get dispute details
const dispute = await getDispute('DISPUTE-123');
```

### 📦 Product Catalog

```javascript
import { createProduct, listProducts } from './server/paypal-agent.js';

// Create a product
const product = await createProduct({
  name: "Premium Supplement",
  type: "PHYSICAL",
  category: "HEALTH_AND_BEAUTY"
});

// List products
const products = await listProducts({ page: 1, page_size: 20 });
```

### 🔄 Subscription Management

```javascript
import { 
  createSubscriptionPlan, 
  listSubscriptionPlans, 
  createSubscription 
} from './server/paypal-agent.js';

// Create subscription plan
const plan = await createSubscriptionPlan({
  product_id: "PROD-123",
  name: "Monthly Subscription",
  billing_cycles: [{
    frequency: {
      interval_unit: "MONTH",
      interval_count: 1
    },
    tenure_type: "REGULAR",
    sequence: 1,
    total_cycles: 0,
    pricing_scheme: {
      fixed_price: {
        currency_code: "USD",
        value: "29.99"
      }
    }
  }]
});

// List subscription plans
const plans = await listSubscriptionPlans();

// Create subscription for customer
const subscription = await createSubscription({
  plan_id: "PLAN-123"
});
```

### 📊 Reporting & Analytics

```javascript
import { listTransactions, getMerchantInsights } from './server/paypal-agent.js';

// List transactions
const transactions = await listTransactions({
  start_date: "2024-01-01T00:00:00Z",
  end_date: "2024-12-31T23:59:59Z"
});

// Get merchant insights
const insights = await getMerchantInsights({
  start_date: "2024-01-01",
  end_date: "2024-12-31"
});
```

## Integration with Express Server

Add PayPal routes to your Express server:

```javascript
import express from 'express';
import { 
  initializePayPalAgent, 
  createOrder, 
  getOrder,
  listTransactions 
} from './paypal-agent.js';

const app = express();

// Initialize PayPal on startup
initializePayPalAgent();

// Create order endpoint
app.post('/api/paypal/orders', async (req, res) => {
  try {
    const order = await createOrder(req.body);
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get order endpoint
app.get('/api/paypal/orders/:orderId', async (req, res) => {
  try {
    const order = await getOrder(req.params.orderId);
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// List transactions endpoint
app.get('/api/paypal/transactions', async (req, res) => {
  try {
    const transactions = await listTransactions(req.query);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## Complete Tool List

The PayPal Agent Toolkit provides these functions:

**Invoices:**
- `create_invoice` - Create a new invoice
- `list_invoices` - List invoices with pagination
- `get_invoice` - Get invoice details
- `send_invoice` - Send invoice to recipients
- `send_invoice_reminder` - Send reminder
- `cancel_sent_invoice` - Cancel sent invoice
- `generate_invoice_qr_code` - Generate QR code

**Payments:**
- `create_order` - Create an order
- `get_order` - Get order details
- `pay_order` - Process payment
- `create_refund` - Process refund
- `get_refund` - Get refund details

**Disputes:**
- `list_disputes` - List all disputes
- `get_dispute` - Get dispute details
- `accept_dispute_claim` - Accept a claim

**Shipment Tracking:**
- `create_shipment_tracking` - Create tracking record
- `get_shipment_tracking` - Get tracking info
- `update_shipment_tracking` - Update tracking

**Catalog:**
- `create_product` - Create product
- `list_products` - List products
- `show_product_details` - Get product details

**Subscriptions:**
- `create_subscription_plan` - Create plan
- `list_subscription_plans` - List plans
- `show_subscription_plan_details` - Get plan details
- `create_subscription` - Create subscription
- `show_subscription_details` - Get subscription details
- `update_subscription` - Update subscription
- `cancel_subscription` - Cancel subscription

**Reporting:**
- `list_transactions` - List transactions
- `get_merchant_insights` - Get analytics

## Error Handling

All functions include error handling:

```javascript
try {
  const order = await createOrder(orderData);
  console.log('Order created:', order.id);
} catch (error) {
  if (error.message.includes('not initialized')) {
    console.error('PayPal credentials not configured');
  } else {
    console.error('PayPal API error:', error);
  }
}
```

## Testing

Use sandbox mode for testing:

```env
PAYPAL_MODE=sandbox
```

PayPal provides test accounts in the Developer Dashboard for simulating transactions.

## Production Deployment

Before going live:

1. Switch to live credentials:
   ```env
   PAYPAL_MODE=live
   PAYPAL_CLIENT_ID=your_live_client_id
   PAYPAL_CLIENT_SECRET=your_live_client_secret
   ```

2. Test all payment flows thoroughly
3. Set up webhook handlers for payment notifications
4. Implement proper error logging and monitoring

## Security Best Practices

- ✅ Keep credentials in `.env` (never commit to git)
- ✅ Use sandbox mode for development
- ✅ Validate all input data before sending to PayPal
- ✅ Implement rate limiting on API endpoints
- ✅ Log all transactions for audit trail
- ✅ Use HTTPS in production

## Next Steps

1. **Add your PayPal credentials** to `.env` file
2. **Initialize the agent** in your server startup code
3. **Create API endpoints** for your specific use cases
4. **Test with sandbox** before going live
5. **Implement webhooks** for real-time payment notifications

## Support & Documentation

- [PayPal Agent Toolkit GitHub](https://github.com/paypal/paypal-agent-toolkit)
- [PayPal Developer Documentation](https://developer.paypal.com/docs/)
- [PayPal API Reference](https://developer.paypal.com/api/rest/)

---

**Status**: ✅ Ready to use - Add credentials and start integrating!
