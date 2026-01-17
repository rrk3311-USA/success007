# 📧 Order Confirmation Email Setup Guide

## Overview
This guide explains how to set up automated order confirmation emails for Success Chemistry.

---

## 🎨 Email Template
**Location:** `email-templates/order-confirmation.html`

**Features:**
- Navy and gold color scheme matching your site
- Responsive design for mobile devices
- Order details with product images
- Shipping information
- Exclusive 25% off coupon for next order
- Social media links
- Professional footer

---

## 🔧 Setup Options

### Option 1: Gmail (Easiest for Testing)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password:**
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Name it "Success Chemistry Orders"
   - Copy the 16-character password

3. **Update Configuration:**
   ```javascript
   const transporter = nodemailer.createTransport({
       service: 'gmail',
       auth: {
           user: 'your-email@gmail.com',
           pass: 'your-16-char-app-password'
       }
   });
   ```

4. **Limitations:**
   - 500 emails per day limit
   - Not recommended for production
   - Good for testing only

---

### Option 2: SendGrid (Recommended for Production)

1. **Sign up for SendGrid:**
   - Go to https://sendgrid.com
   - Free tier: 100 emails/day
   - Paid plans available for higher volume

2. **Get API Key:**
   - Dashboard → Settings → API Keys
   - Create API Key with "Mail Send" permissions
   - Copy the API key

3. **Update Configuration:**
   ```javascript
   const transporter = nodemailer.createTransport({
       host: 'smtp.sendgrid.net',
       port: 587,
       auth: {
           user: 'apikey',
           pass: 'YOUR_SENDGRID_API_KEY'
       }
   });
   ```

4. **Benefits:**
   - Reliable delivery
   - Email analytics
   - Bounce handling
   - Professional reputation

---

### Option 3: Netlify Functions (Serverless)

Since you're using Netlify, you can create a serverless function:

1. **Create Function:**
   ```javascript
   // netlify/functions/send-order-email.js
   const nodemailer = require('nodemailer');
   
   exports.handler = async (event) => {
       const orderData = JSON.parse(event.body);
       
       // Send email using your chosen service
       // ... email sending code ...
       
       return {
           statusCode: 200,
           body: JSON.stringify({ success: true })
       };
   };
   ```

2. **Call from Frontend:**
   ```javascript
   // After PayPal payment success
   fetch('/.netlify/functions/send-order-email', {
       method: 'POST',
       body: JSON.stringify(orderData)
   });
   ```

---

## 🔗 PayPal Integration

### Step 1: Set Up PayPal Webhook

1. **Go to PayPal Developer Dashboard:**
   - https://developer.paypal.com/dashboard/

2. **Create Webhook:**
   - Apps & Credentials → Your App → Webhooks
   - Add Webhook URL: `https://your-site.netlify.app/.netlify/functions/paypal-webhook`
   - Select events: `PAYMENT.CAPTURE.COMPLETED`

3. **Verify Webhook:**
   - PayPal will send test events
   - Verify signature for security

### Step 2: Handle PayPal Webhook

```javascript
// netlify/functions/paypal-webhook.js
exports.handler = async (event) => {
    const paypalEvent = JSON.parse(event.body);
    
    if (paypalEvent.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
        const orderData = extractOrderData(paypalEvent);
        await sendOrderConfirmation(orderData);
    }
    
    return { statusCode: 200 };
};
```

---

## 🧪 Testing

### Send Test Email

1. **Install Dependencies:**
   ```bash
   npm install nodemailer
   ```

2. **Run Test Script:**
   ```bash
   node email-templates/send-order-email.js
   ```

3. **Check Email:**
   - Look in inbox: rrk3311@gmail.com
   - Check spam folder if not received
   - Verify all placeholders are replaced

---

## 📝 Email Template Customization

### Update Logo:
Replace in `order-confirmation.html`:
```html
<img src="YOUR_LOGO_URL" alt="Success Chemistry" class="logo">
```

### Update Colors:
- Navy: `#0a234e`
- Gold: `#d4af37`
- Light Gold: `#f4d03f`

### Add More Products:
Duplicate the `.order-item` div for each product in the order.

---

## 🔐 Security Best Practices

1. **Never commit credentials to Git:**
   ```bash
   # Add to .gitignore
   .env
   email-config.json
   ```

2. **Use Environment Variables:**
   ```javascript
   const transporter = nodemailer.createTransport({
       service: 'gmail',
       auth: {
           user: process.env.EMAIL_USER,
           pass: process.env.EMAIL_PASSWORD
       }
   });
   ```

3. **Validate PayPal Webhooks:**
   - Verify webhook signature
   - Check event authenticity
   - Prevent duplicate processing

---

## 📊 Monitoring

### Track Email Delivery:

1. **SendGrid Dashboard:**
   - View delivery rates
   - Monitor bounces
   - Track opens/clicks

2. **Log Events:**
   ```javascript
   console.log('Email sent:', {
       orderId: orderData.orderNumber,
       recipient: orderData.customerEmail,
       timestamp: new Date()
   });
   ```

3. **Error Handling:**
   ```javascript
   try {
       await sendEmail(orderData);
   } catch (error) {
       // Log error
       // Retry logic
       // Alert admin
   }
   ```

---

## 🚀 Production Checklist

- [ ] Email service configured (SendGrid recommended)
- [ ] PayPal webhook set up and verified
- [ ] Test emails sent successfully
- [ ] Logo and branding updated
- [ ] Environment variables secured
- [ ] Error handling implemented
- [ ] Monitoring/logging in place
- [ ] Spam testing completed
- [ ] Mobile rendering verified
- [ ] Unsubscribe link functional

---

## 💡 Quick Start for Testing

**Fastest way to test:**

1. Use Gmail with app password
2. Update `send-order-email.js` with your credentials
3. Run: `node email-templates/send-order-email.js`
4. Check rrk3311@gmail.com for test email

**For production:**
- Switch to SendGrid or similar service
- Set up Netlify Functions
- Configure PayPal webhooks
- Test thoroughly before going live

---

## 📞 Support

Need help? Email: support@successchemistry.com

**Common Issues:**
- **Email not received:** Check spam folder, verify credentials
- **Template not rendering:** Ensure all placeholders are replaced
- **PayPal webhook not firing:** Verify webhook URL and events selected
