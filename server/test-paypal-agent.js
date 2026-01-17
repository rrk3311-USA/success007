import { initializePayPalAgent, getPayPalToolkit } from './paypal-agent.js';

console.log('Testing PayPal Agent Toolkit initialization...\n');

const toolkit = initializePayPalAgent();

if (toolkit) {
  console.log('✅ PayPal Agent Toolkit initialized successfully!');
  console.log('Mode:', process.env.PAYPAL_MODE);
  console.log('Client ID:', process.env.PAYPAL_CLIENT_ID?.substring(0, 20) + '...');
  console.log('\nAvailable tools ready to use:');
  console.log('  - Invoice Management (create, list, send, etc.)');
  console.log('  - Payment Processing (orders, refunds)');
  console.log('  - Dispute Management');
  console.log('  - Product Catalog');
  console.log('  - Subscription Management');
  console.log('  - Transaction Reporting');
  console.log('  - Merchant Insights');
} else {
  console.log('❌ Failed to initialize PayPal Agent Toolkit');
  console.log('Please check your credentials in .env file');
}
