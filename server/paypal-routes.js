import express from 'express';
import {
  initializePayPalAgent,
  createOrder,
  getOrder,
  payOrder,
  createRefund,
  createInvoice,
  listInvoices,
  getInvoice,
  sendInvoice,
  listProducts,
  createProduct,
  listSubscriptionPlans,
  createSubscriptionPlan,
  createSubscription,
  listTransactions,
  getMerchantInsights,
  listDisputes,
  getDispute
} from './paypal-agent.js';

const router = express.Router();

initializePayPalAgent();

router.post('/orders', async (req, res) => {
  try {
    const order = await createOrder(req.body);
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/orders/:orderId', async (req, res) => {
  try {
    const order = await getOrder(req.params.orderId);
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/orders/:orderId/pay', async (req, res) => {
  try {
    const payment = await payOrder(req.params.orderId);
    res.json({ success: true, payment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/refunds', async (req, res) => {
  try {
    const { captureId, amount } = req.body;
    const refund = await createRefund(captureId, { amount });
    res.json({ success: true, refund });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/invoices', async (req, res) => {
  try {
    const invoice = await createInvoice(req.body);
    res.json({ success: true, invoice });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/invoices', async (req, res) => {
  try {
    const { page = 1, page_size = 10 } = req.query;
    const invoices = await listInvoices({ page: parseInt(page), page_size: parseInt(page_size) });
    res.json({ success: true, invoices });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/invoices/:invoiceId', async (req, res) => {
  try {
    const invoice = await getInvoice(req.params.invoiceId);
    res.json({ success: true, invoice });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/invoices/:invoiceId/send', async (req, res) => {
  try {
    const result = await sendInvoice(req.params.invoiceId);
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/products', async (req, res) => {
  try {
    const { page = 1, page_size = 20 } = req.query;
    const products = await listProducts({ page: parseInt(page), page_size: parseInt(page_size) });
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/products', async (req, res) => {
  try {
    const product = await createProduct(req.body);
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/subscription-plans', async (req, res) => {
  try {
    const plans = await listSubscriptionPlans(req.query);
    res.json({ success: true, plans });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/subscription-plans', async (req, res) => {
  try {
    const plan = await createSubscriptionPlan(req.body);
    res.json({ success: true, plan });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/subscriptions', async (req, res) => {
  try {
    const subscription = await createSubscription(req.body);
    res.json({ success: true, subscription });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/transactions', async (req, res) => {
  try {
    const transactions = await listTransactions(req.query);
    res.json({ success: true, transactions });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/insights', async (req, res) => {
  try {
    const insights = await getMerchantInsights(req.query);
    res.json({ success: true, insights });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/disputes', async (req, res) => {
  try {
    const disputes = await listDisputes(req.query);
    res.json({ success: true, disputes });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/disputes/:disputeId', async (req, res) => {
  try {
    const dispute = await getDispute(req.params.disputeId);
    res.json({ success: true, dispute });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
