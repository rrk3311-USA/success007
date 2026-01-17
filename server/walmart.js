import axios from 'axios';
import crypto from 'crypto';

const WALMART_API_BASE = 'https://marketplace.walmartapis.com/v3';

let accessToken = null;
let tokenExpiry = null;

async function getAccessToken() {
  if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
    return accessToken;
  }

  const clientId = process.env.WALMART_CLIENT_ID;
  const clientSecret = process.env.WALMART_CLIENT_SECRET;
  
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  
  try {
    const response = await axios.post(
      'https://marketplace.walmartapis.com/v3/token',
      'grant_type=client_credentials',
      {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
          'WM_SVC.NAME': 'Success Chemistry',
          'WM_QOS.CORRELATION_ID': crypto.randomUUID(),
        }
      }
    );
    
    accessToken = response.data.access_token;
    tokenExpiry = Date.now() + (response.data.expires_in * 1000) - 60000;
    
    return accessToken;
  } catch (error) {
    console.error('Walmart auth error:', error.response?.data || error.message);
    throw new Error('Failed to authenticate with Walmart API');
  }
}

async function walmartRequest(method, endpoint, data = null) {
  const token = await getAccessToken();
  
  const config = {
    method,
    url: `${WALMART_API_BASE}${endpoint}`,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'WM_SVC.NAME': 'Success Chemistry',
      'WM_QOS.CORRELATION_ID': crypto.randomUUID(),
    }
  };
  
  if (data) {
    config.data = data;
  }
  
  const response = await axios(config);
  return response.data;
}

export async function getWalmartItems(limit = 20, offset = 0) {
  return walmartRequest('GET', `/items?limit=${limit}&offset=${offset}`);
}

export async function getWalmartItem(sku) {
  return walmartRequest('GET', `/items/${encodeURIComponent(sku)}`);
}

export async function updateWalmartInventory(sku, quantity) {
  const payload = {
    sku,
    quantity: {
      unit: 'EACH',
      amount: quantity
    }
  };
  
  return walmartRequest('PUT', '/inventory', payload);
}

export async function getWalmartOrders(status = 'Created', limit = 100) {
  return walmartRequest('GET', `/orders?status=${status}&limit=${limit}`);
}

export async function getWalmartOrder(purchaseOrderId) {
  return walmartRequest('GET', `/orders/${purchaseOrderId}`);
}

export async function acknowledgeWalmartOrder(purchaseOrderId) {
  return walmartRequest('POST', `/orders/${purchaseOrderId}/acknowledge`);
}

export async function shipWalmartOrder(purchaseOrderId, shipmentData) {
  return walmartRequest('POST', `/orders/${purchaseOrderId}/shipping`, shipmentData);
}

export async function testWalmartConnection() {
  try {
    await getAccessToken();
    return { success: true, message: 'Connected to Walmart API' };
  } catch (error) {
    return { success: false, message: error.message };
  }
}
