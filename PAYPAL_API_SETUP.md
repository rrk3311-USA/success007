# PayPal API Integration Guide

## How to Provide PayPal API Credentials

### Option 1: Add to .env File (Recommended)
Add these lines to your `.env` file:

```env
# PayPal API Credentials
PAYPAL_MODE=sandbox
PAYPAL_CLIENT_ID=your_client_id_here
PAYPAL_CLIENT_SECRET=your_client_secret_here
```

For production:
```env
PAYPAL_MODE=live
PAYPAL_CLIENT_ID=your_live_client_id
PAYPAL_CLIENT_SECRET=your_live_client_secret
```

### Option 2: Get Your PayPal API Credentials

1. **Go to PayPal Developer Portal:**
   - Visit: https://developer.paypal.com/dashboard/
   - Log in with your PayPal account

2. **Create an App:**
   - Click "My Apps & Credentials"
   - Click "Create App"
   - Choose "Merchant" as the app type
   - Give it a name (e.g., "Success Chemistry Store")

3. **Get Your Credentials:**
   - **Sandbox (Testing):**
     - Client ID: Found under "Sandbox" tab
     - Secret: Click "Show" to reveal
   
   - **Live (Production):**
     - Client ID: Found under "Live" tab
     - Secret: Click "Show" to reveal

4. **Copy to .env file** as shown above

### What We'll Build With PayPal API:

1. **Payment Processing:**
   - Accept payments on your public shop page
   - Process orders securely
   - Handle refunds

2. **Order Tracking:**
   - Sync PayPal transactions to dashboard
   - Track payment status
   - Generate invoices

3. **Subscription Management:**
   - Set up recurring payments
   - Manage subscription billing
   - Handle cancellations

### Security Best Practices:

✅ **DO:**
- Keep credentials in `.env` file (already in `.gitignore`)
- Use sandbox mode for testing
- Never commit `.env` to git
- Rotate credentials periodically

❌ **DON'T:**
- Share credentials in chat/email
- Hardcode credentials in code
- Use live credentials for testing
- Commit `.env` to version control

### Next Steps After Adding Credentials:

1. I'll create PayPal integration endpoints in `server/index.js`
2. Add payment buttons to public shop page
3. Implement order creation and tracking
4. Set up webhook handlers for payment notifications

**Ready to add your PayPal credentials?** Just update the `.env` file and let me know!
