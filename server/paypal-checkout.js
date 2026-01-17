import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_API_BASE = process.env.PAYPAL_MODE === 'live' 
  ? 'https://api-m.paypal.com' 
  : 'https://api-m.sandbox.paypal.com';

async function getPayPalAccessToken() {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
  
  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });
  
  const data = await response.json();
  return data.access_token;
}

// Create PayPal Order
router.post('/create-order', async (req, res) => {
  try {
    const { cart } = req.body;
    
    if (!cart || cart.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }
    
    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal >= 50 ? 0 : 5.99;
    const total = subtotal + shipping;
    
    const accessToken = await getPayPalAccessToken();
    
    // Create order payload
    const orderPayload = {
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: total.toFixed(2),
          breakdown: {
            item_total: {
              currency_code: 'USD',
              value: subtotal.toFixed(2)
            },
            shipping: {
              currency_code: 'USD',
              value: shipping.toFixed(2)
            }
          }
        },
        items: cart.map(item => ({
          name: item.name.substring(0, 127),
          description: item.description ? item.description.substring(0, 127) : '',
          sku: item.sku || '',
          unit_amount: {
            currency_code: 'USD',
            value: item.price.toFixed(2)
          },
          quantity: item.quantity.toString()
        }))
      }],
      application_context: {
        brand_name: 'Success Chemistry',
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW',
        return_url: `${process.env.SITE_URL || 'https://success-chemistry-shop.netlify.app'}/order-success.html`,
        cancel_url: `${process.env.SITE_URL || 'https://success-chemistry-shop.netlify.app'}/cart.html`
      }
    };
    
    const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderPayload)
    });
    
    const order = await response.json();
    
    if (!response.ok) {
      console.error('PayPal order creation error:', order);
      return res.status(response.status).json({ error: order.message || 'Failed to create order' });
    }
    
    res.json({ id: order.id });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Capture PayPal Order
router.post('/capture-order', async (req, res) => {
  try {
    const { orderID } = req.body;
    
    if (!orderID) {
      return res.status(400).json({ error: 'Order ID is required' });
    }
    
    const accessToken = await getPayPalAccessToken();
    
    const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderID}/capture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    const orderData = await response.json();
    
    if (!response.ok) {
      console.error('PayPal capture error:', orderData);
      return res.status(response.status).json({ error: orderData.message || 'Failed to capture order' });
    }
    
    res.json(orderData);
  } catch (error) {
    console.error('Capture order error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get Order Details
router.get('/order/:orderID', async (req, res) => {
  try {
    const { orderID } = req.params;
    
    const accessToken = await getPayPalAccessToken();
    
    const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderID}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    const order = await response.json();
    
    if (!response.ok) {
      return res.status(response.status).json({ error: order.message || 'Failed to get order' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
