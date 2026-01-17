import dotenv from 'dotenv';
import { PayPalAgentToolkit } from '@paypal/agent-toolkit/openai';

dotenv.config();

const paypalConfig = {
  clientId: process.env.PAYPAL_CLIENT_ID,
  clientSecret: process.env.PAYPAL_CLIENT_SECRET,
  mode: process.env.PAYPAL_MODE || 'sandbox',
  configuration: {
    actions: {
      invoices: {
        create: true,
        list: true,
        get: true,
        send: true,
        sendReminder: true,
        cancel: true,
        generateQRC: true
      },
      products: {
        create: true,
        list: true,
        show: true
      },
      subscriptionPlans: {
        create: true,
        list: true,
        show: true,
        update: true
      },
      subscriptions: {
        create: true,
        show: true,
        update: true,
        cancel: true
      },
      shipment: {
        create: true,
        show: true,
        update: true
      },
      orders: {
        create: true,
        get: true,
        pay: true
      },
      refunds: {
        create: true,
        get: true
      },
      disputes: {
        list: true,
        get: true,
        accept: true
      },
      transactions: {
        list: true
      },
      insights: {
        get: true
      }
    }
  }
};

let paypalToolkit = null;

export function initializePayPalAgent() {
  if (!paypalConfig.clientId || !paypalConfig.clientSecret) {
    console.warn('PayPal credentials not configured. PayPal Agent Toolkit will not be available.');
    return null;
  }

  try {
    paypalToolkit = new PayPalAgentToolkit(paypalConfig);
    console.log(`PayPal Agent Toolkit initialized in ${paypalConfig.mode} mode`);
    return paypalToolkit;
  } catch (error) {
    console.error('Failed to initialize PayPal Agent Toolkit:', error);
    return null;
  }
}

export function getPayPalToolkit() {
  if (!paypalToolkit) {
    paypalToolkit = initializePayPalAgent();
  }
  return paypalToolkit;
}

export async function createInvoice(invoiceData) {
  const toolkit = getPayPalToolkit();
  if (!toolkit) throw new Error('PayPal Agent Toolkit not initialized');
  return await toolkit.create_invoice(invoiceData);
}

export async function listInvoices(options = {}) {
  const toolkit = getPayPalToolkit();
  if (!toolkit) throw new Error('PayPal Agent Toolkit not initialized');
  return await toolkit.list_invoices(options);
}

export async function getInvoice(invoiceId) {
  const toolkit = getPayPalToolkit();
  if (!toolkit) throw new Error('PayPal Agent Toolkit not initialized');
  return await toolkit.get_invoice({ invoice_id: invoiceId });
}

export async function sendInvoice(invoiceId) {
  const toolkit = getPayPalToolkit();
  if (!toolkit) throw new Error('PayPal Agent Toolkit not initialized');
  return await toolkit.send_invoice({ invoice_id: invoiceId });
}

export async function createOrder(orderData) {
  const toolkit = getPayPalToolkit();
  if (!toolkit) throw new Error('PayPal Agent Toolkit not initialized');
  return await toolkit.create_order(orderData);
}

export async function getOrder(orderId) {
  const toolkit = getPayPalToolkit();
  if (!toolkit) throw new Error('PayPal Agent Toolkit not initialized');
  return await toolkit.get_order({ order_id: orderId });
}

export async function payOrder(orderId) {
  const toolkit = getPayPalToolkit();
  if (!toolkit) throw new Error('PayPal Agent Toolkit not initialized');
  return await toolkit.pay_order({ order_id: orderId });
}

export async function createRefund(captureId, refundData) {
  const toolkit = getPayPalToolkit();
  if (!toolkit) throw new Error('PayPal Agent Toolkit not initialized');
  return await toolkit.create_refund({ capture_id: captureId, ...refundData });
}

export async function listDisputes(options = {}) {
  const toolkit = getPayPalToolkit();
  if (!toolkit) throw new Error('PayPal Agent Toolkit not initialized');
  return await toolkit.list_disputes(options);
}

export async function getDispute(disputeId) {
  const toolkit = getPayPalToolkit();
  if (!toolkit) throw new Error('PayPal Agent Toolkit not initialized');
  return await toolkit.get_dispute({ dispute_id: disputeId });
}

export async function createProduct(productData) {
  const toolkit = getPayPalToolkit();
  if (!toolkit) throw new Error('PayPal Agent Toolkit not initialized');
  return await toolkit.create_product(productData);
}

export async function listProducts(options = {}) {
  const toolkit = getPayPalToolkit();
  if (!toolkit) throw new Error('PayPal Agent Toolkit not initialized');
  return await toolkit.list_products(options);
}

export async function createSubscriptionPlan(planData) {
  const toolkit = getPayPalToolkit();
  if (!toolkit) throw new Error('PayPal Agent Toolkit not initialized');
  return await toolkit.create_subscription_plan(planData);
}

export async function listSubscriptionPlans(options = {}) {
  const toolkit = getPayPalToolkit();
  if (!toolkit) throw new Error('PayPal Agent Toolkit not initialized');
  return await toolkit.list_subscription_plans(options);
}

export async function createSubscription(subscriptionData) {
  const toolkit = getPayPalToolkit();
  if (!toolkit) throw new Error('PayPal Agent Toolkit not initialized');
  return await toolkit.create_subscription(subscriptionData);
}

export async function listTransactions(options = {}) {
  const toolkit = getPayPalToolkit();
  if (!toolkit) throw new Error('PayPal Agent Toolkit not initialized');
  return await toolkit.list_transactions(options);
}

export async function getMerchantInsights(options = {}) {
  const toolkit = getPayPalToolkit();
  if (!toolkit) throw new Error('PayPal Agent Toolkit not initialized');
  return await toolkit.get_merchant_insights(options);
}

export default {
  initializePayPalAgent,
  getPayPalToolkit,
  createInvoice,
  listInvoices,
  getInvoice,
  sendInvoice,
  createOrder,
  getOrder,
  payOrder,
  createRefund,
  listDisputes,
  getDispute,
  createProduct,
  listProducts,
  createSubscriptionPlan,
  listSubscriptionPlans,
  createSubscription,
  listTransactions,
  getMerchantInsights
};
