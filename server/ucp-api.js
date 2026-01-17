import express from 'express';
import crypto from 'crypto';

const router = express.Router();

const PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----
MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQg9T3plx3CtvxCp9QZ
Fe/eVL92lGOZYUoKeVzXdW0cYtihRANCAAQVxwgtYsCF4tQlm+x3QSKeq22BzA0R
gFXIFUjsp9wY4O/boA8fx7xD0jCwSrCmpi4r/KritGFV4k7XC4QlFfff
-----END PRIVATE KEY-----`;

function signPayload(payload) {
    const sign = crypto.createSign('SHA256');
    sign.update(JSON.stringify(payload));
    sign.end();
    return sign.sign(PRIVATE_KEY, 'base64');
}

router.post('/v1/checkout/create', async (req, res) => {
    try {
        const { items, customer, shipping_address } = req.body;
        
        const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * 0.0825;
        const shipping = subtotal >= 50 ? 0 : 5.99;
        const total = subtotal + tax + shipping;
        
        const checkout = {
            checkout_id: `CHK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            status: 'pending',
            items: items.map(item => ({
                product_id: item.sku,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                subtotal: item.price * item.quantity
            })),
            customer: {
                email: customer.email,
                name: customer.name,
                phone: customer.phone
            },
            shipping_address: shipping_address,
            pricing: {
                subtotal: subtotal.toFixed(2),
                tax: tax.toFixed(2),
                shipping: shipping.toFixed(2),
                total: total.toFixed(2),
                currency: 'USD'
            },
            created_at: new Date().toISOString(),
            expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString()
        };
        
        const signature = signPayload(checkout);
        
        res.json({
            success: true,
            checkout,
            signature
        });
    } catch (error) {
        console.error('Checkout creation error:', error);
        res.status(500).json({ error: 'Failed to create checkout' });
    }
});

router.post('/v1/checkout/confirm', async (req, res) => {
    try {
        const { checkout_id, payment_method } = req.body;
        
        const order = {
            order_id: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            checkout_id,
            status: 'confirmed',
            payment_status: 'paid',
            payment_method,
            confirmed_at: new Date().toISOString(),
            tracking_number: null,
            estimated_delivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
        };
        
        const signature = signPayload(order);
        
        res.json({
            success: true,
            order,
            signature
        });
    } catch (error) {
        console.error('Checkout confirmation error:', error);
        res.status(500).json({ error: 'Failed to confirm checkout' });
    }
});

router.post('/v1/fulfillment/status', async (req, res) => {
    try {
        const { order_id } = req.body;
        
        const fulfillment = {
            order_id,
            status: 'processing',
            tracking_number: `1Z999AA10123456784`,
            carrier: 'USPS',
            estimated_delivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            shipment_date: new Date().toISOString(),
            tracking_url: `https://tools.usps.com/go/TrackConfirmAction?tLabels=1Z999AA10123456784`
        };
        
        res.json({
            success: true,
            fulfillment
        });
    } catch (error) {
        console.error('Fulfillment status error:', error);
        res.status(500).json({ error: 'Failed to get fulfillment status' });
    }
});

router.post('/v1/discount/validate', async (req, res) => {
    try {
        const { code, items } = req.body;
        
        const discountCodes = {
            'WELCOME10': { type: 'percentage', value: 10, min_purchase: 0 },
            'SAVE15': { type: 'percentage', value: 15, min_purchase: 50 },
            'SAVE20': { type: 'percentage', value: 20, min_purchase: 100 },
            'FREESHIP': { type: 'free_shipping', value: 0, min_purchase: 0 }
        };
        
        const discount = discountCodes[code.toUpperCase()];
        
        if (!discount) {
            return res.json({
                success: false,
                error: 'Invalid discount code'
            });
        }
        
        const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        if (subtotal < discount.min_purchase) {
            return res.json({
                success: false,
                error: `Minimum purchase of $${discount.min_purchase} required`
            });
        }
        
        let discount_amount = 0;
        if (discount.type === 'percentage') {
            discount_amount = subtotal * (discount.value / 100);
        } else if (discount.type === 'free_shipping') {
            discount_amount = subtotal >= 50 ? 0 : 5.99;
        }
        
        res.json({
            success: true,
            discount: {
                code: code.toUpperCase(),
                type: discount.type,
                value: discount.value,
                amount: discount_amount.toFixed(2),
                description: discount.type === 'percentage' 
                    ? `${discount.value}% off your order`
                    : 'Free shipping'
            }
        });
    } catch (error) {
        console.error('Discount validation error:', error);
        res.status(500).json({ error: 'Failed to validate discount' });
    }
});

router.get('/v1/products/:sku', async (req, res) => {
    try {
        const { sku } = req.params;
        
        res.json({
            success: true,
            product: {
                sku,
                available: true,
                stock: 100,
                price: 28.00,
                shipping_eligible: true
            }
        });
    } catch (error) {
        console.error('Product lookup error:', error);
        res.status(500).json({ error: 'Failed to lookup product' });
    }
});

export default router;
