/**
 * Order Confirmation Email Sender
 * 
 * This script demonstrates how to send order confirmation emails
 * using Nodemailer (popular Node.js email library)
 * 
 * SETUP INSTRUCTIONS:
 * 1. Install dependencies: npm install nodemailer
 * 2. Set up email service credentials (Gmail, SendGrid, etc.)
 * 3. Replace placeholder values with actual order data
 */

const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Email configuration
const EMAIL_CONFIG = {
    // Option 1: Gmail (requires app password)
    gmail: {
        service: 'gmail',
        auth: {
            user: 'your-email@gmail.com',
            pass: 'your-app-password' // Generate at https://myaccount.google.com/apppasswords
        }
    },
    
    // Option 2: SendGrid (recommended for production)
    sendgrid: {
        host: 'smtp.sendgrid.net',
        port: 587,
        auth: {
            user: 'apikey',
            pass: 'YOUR_SENDGRID_API_KEY'
        }
    },
    
    // Option 3: Custom SMTP
    custom: {
        host: 'smtp.yourprovider.com',
        port: 587,
        secure: false,
        auth: {
            user: 'your-smtp-username',
            pass: 'your-smtp-password'
        }
    }
};

/**
 * Send order confirmation email
 */
async function sendOrderConfirmation(orderData) {
    try {
        // Create transporter (choose one from EMAIL_CONFIG above)
        const transporter = nodemailer.createTransport(EMAIL_CONFIG.gmail);
        
        // Load email template
        const templatePath = path.join(__dirname, 'order-confirmation.html');
        let emailHTML = fs.readFileSync(templatePath, 'utf8');
        
        // Replace placeholders with actual data
        emailHTML = emailHTML
            .replace(/\[Customer Name\]/g, orderData.customerName)
            .replace(/\[ORDER_NUMBER\]/g, orderData.orderNumber)
            .replace(/\[ORDER_DATE\]/g, orderData.orderDate)
            .replace(/\[PRODUCT_IMAGE_URL\]/g, orderData.items[0].imageUrl)
            .replace(/\[Product Name\]/g, orderData.items[0].name)
            .replace(/\[QTY\]/g, orderData.items[0].quantity)
            .replace(/\[PRICE\]/g, orderData.items[0].price.toFixed(2))
            .replace(/\[SUBTOTAL\]/g, orderData.subtotal.toFixed(2))
            .replace(/\[SHIPPING\]/g, orderData.shipping.toFixed(2))
            .replace(/\[TAX\]/g, orderData.tax.toFixed(2))
            .replace(/\[TOTAL\]/g, orderData.total.toFixed(2))
            .replace(/\[Address Line 1\]/g, orderData.shippingAddress.line1)
            .replace(/\[Address Line 2\]/g, orderData.shippingAddress.line2 || '')
            .replace(/\[City, State ZIP\]/g, `${orderData.shippingAddress.city}, ${orderData.shippingAddress.state} ${orderData.shippingAddress.zip}`)
            .replace(/\[Country\]/g, orderData.shippingAddress.country)
            .replace(/\[TRACKING_URL\]/g, orderData.trackingUrl || '#')
            .replace(/\[UNSUBSCRIBE_URL\]/g, orderData.unsubscribeUrl || '#');
        
        // Email options
        const mailOptions = {
            from: '"Success Chemistry" <orders@successchemistry.com>',
            to: orderData.customerEmail,
            subject: `Order Confirmation #${orderData.orderNumber} - Success Chemistry`,
            html: emailHTML,
            // Optional: Add plain text version
            text: `Thank you for your order #${orderData.orderNumber}! Your order total is $${orderData.total.toFixed(2)}.`
        };
        
        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Order confirmation email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
        
    } catch (error) {
        console.error('❌ Error sending email:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Example: Send test email
 */
async function sendTestEmail() {
    const testOrderData = {
        customerName: 'John Doe',
        customerEmail: 'rrk3311@gmail.com', // Your test email
        orderNumber: 'SC-' + Date.now(),
        orderDate: new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        }),
        items: [
            {
                name: "Women's Balance - Hormone Support",
                imageUrl: 'https://successchemistry.com/public/images/products/52274-401/01.png',
                quantity: 2,
                price: 29.99
            }
        ],
        subtotal: 59.98,
        shipping: 0.00,
        tax: 4.80,
        total: 64.78,
        shippingAddress: {
            line1: '123 Wellness Street',
            line2: 'Apt 4B',
            city: 'Los Angeles',
            state: 'CA',
            zip: '90001',
            country: 'United States'
        },
        trackingUrl: 'https://successchemistry.com/track-order',
        unsubscribeUrl: 'https://successchemistry.com/unsubscribe'
    };
    
    await sendOrderConfirmation(testOrderData);
}

/**
 * Integration with PayPal webhook
 * Call this function when PayPal payment is completed
 */
function handlePayPalWebhook(paypalOrderData) {
    const orderData = {
        customerName: paypalOrderData.payer.name.given_name + ' ' + paypalOrderData.payer.name.surname,
        customerEmail: paypalOrderData.payer.email_address,
        orderNumber: 'SC-' + paypalOrderData.id,
        orderDate: new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        }),
        items: paypalOrderData.purchase_units[0].items.map(item => ({
            name: item.name,
            imageUrl: `https://successchemistry.com/public/images/products/${item.sku}/01.png`,
            quantity: item.quantity,
            price: parseFloat(item.unit_amount.value)
        })),
        subtotal: parseFloat(paypalOrderData.purchase_units[0].amount.breakdown.item_total.value),
        shipping: parseFloat(paypalOrderData.purchase_units[0].amount.breakdown.shipping?.value || 0),
        tax: parseFloat(paypalOrderData.purchase_units[0].amount.breakdown.tax_total?.value || 0),
        total: parseFloat(paypalOrderData.purchase_units[0].amount.value),
        shippingAddress: {
            line1: paypalOrderData.purchase_units[0].shipping.address.address_line_1,
            line2: paypalOrderData.purchase_units[0].shipping.address.address_line_2 || '',
            city: paypalOrderData.purchase_units[0].shipping.address.admin_area_2,
            state: paypalOrderData.purchase_units[0].shipping.address.admin_area_1,
            zip: paypalOrderData.purchase_units[0].shipping.address.postal_code,
            country: paypalOrderData.purchase_units[0].shipping.address.country_code
        },
        trackingUrl: `https://successchemistry.com/track-order?id=${paypalOrderData.id}`,
        unsubscribeUrl: 'https://successchemistry.com/unsubscribe'
    };
    
    return sendOrderConfirmation(orderData);
}

// Export functions
module.exports = {
    sendOrderConfirmation,
    sendTestEmail,
    handlePayPalWebhook
};

// Run test if executed directly
if (require.main === module) {
    console.log('🧪 Sending test order confirmation email...');
    sendTestEmail()
        .then(() => console.log('✅ Test complete!'))
        .catch(err => console.error('❌ Test failed:', err));
}
