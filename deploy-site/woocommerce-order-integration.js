/**
 * WooCommerce Order Integration
 * Creates orders in WooCommerce when PayPal payment is completed
 * 
 * Usage:
 * 1. Get WooCommerce API credentials from WordPress admin
 * 2. Update WOOCOMMERCE_CONFIG below with your credentials
 * 3. Call createWooCommerceOrder() after PayPal payment
 */

// WooCommerce API Configuration
const WOOCOMMERCE_CONFIG = {
    url: 'https://blueviolet-snake-802946.hostingersite.com',
    consumerKey: 'ck_2a7dcf6903f5d22ed4228abd6da424746d5f80b6', // Your Consumer Key (ck_xxxxxxxxxx)
    consumerSecret: 'cs_448d2cd75368443afcd926cb249bd78e81a80db1', // Your Consumer Secret (cs_xxxxxxxxxx)
    apiEndpoint: '/wp-json/wc/v3'
};

// Initialize WooCommerce credentials
function initWooCommerce(consumerKey, consumerSecret) {
    WOOCOMMERCE_CONFIG.consumerKey = consumerKey;
    WOOCOMMERCE_CONFIG.consumerSecret = consumerSecret;
}

/**
 * Create order in WooCommerce
 * @param {Object} orderData - Order data from PayPal
 * @returns {Promise<Object>} Created WooCommerce order
 */
async function createWooCommerceOrder(orderData) {
    console.log('📦 Creating order in WooCommerce...');
    
    if (!WOOCOMMERCE_CONFIG.consumerKey || !WOOCOMMERCE_CONFIG.consumerSecret) {
        console.error('❌ WooCommerce API credentials not set!');
        console.log('💡 Call initWooCommerce(consumerKey, consumerSecret) first');
        throw new Error('WooCommerce API credentials not configured');
    }

    try {
        // Format order data for WooCommerce API
        const wooOrder = formatOrderForWooCommerce(orderData);
        
        // Create order via WooCommerce REST API
        const response = await fetch(
            `${WOOCOMMERCE_CONFIG.url}${WOOCOMMERCE_CONFIG.apiEndpoint}/orders`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${btoa(`${WOOCOMMERCE_CONFIG.consumerKey}:${WOOCOMMERCE_CONFIG.consumerSecret}`)}`
                },
                body: JSON.stringify(wooOrder)
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`WooCommerce API Error ${response.status}: ${errorText}`);
        }

        const createdOrder = await response.json();
        console.log('✅ Order created in WooCommerce!', createdOrder);
        return createdOrder;
        
    } catch (error) {
        console.error('❌ Failed to create WooCommerce order:', error);
        throw error;
    }
}

/**
 * Format PayPal order data for WooCommerce API
 * @param {Object} paypalOrder - PayPal order data
 * @returns {Object} WooCommerce order format
 */
function formatOrderForWooCommerce(paypalOrder) {
    const purchaseUnit = paypalOrder.purchase_units[0];
    const payer = paypalOrder.payer;
    const shipping = purchaseUnit.shipping;
    
    // Format line items
    const lineItems = purchaseUnit.items.map(item => ({
        product_id: getProductIdBySKU(item.sku), // You'll need to map SKUs to WooCommerce product IDs
        quantity: parseInt(item.quantity),
        // If you have product_id mapping, use it. Otherwise, WooCommerce will try to match by SKU
    }));

    // If no product_id mapping, use SKU-based line items
    const lineItemsWithSKU = purchaseUnit.items.map(item => ({
        sku: item.sku,
        quantity: parseInt(item.quantity),
        price: parseFloat(item.unit_amount.value)
    }));

    // Format shipping address
    const shippingAddress = {
        first_name: shipping?.name?.full_name?.split(' ')[0] || payer.name.given_name || '',
        last_name: shipping?.name?.full_name?.split(' ').slice(1).join(' ') || payer.name.surname || '',
        company: '',
        address_1: shipping?.address?.address_line_1 || '',
        address_2: shipping?.address?.address_line_2 || '',
        city: shipping?.address?.admin_area_2 || '',
        state: shipping?.address?.admin_area_1 || '',
        postcode: shipping?.address?.postal_code || '',
        country: shipping?.address?.country_code || 'US',
        email: payer.email_address,
        phone: ''
    };

    // Format billing address (same as shipping for now)
    const billingAddress = { ...shippingAddress };

    // Calculate totals
    const subtotal = parseFloat(purchaseUnit.amount.breakdown.item_total.value);
    const shippingCost = parseFloat(purchaseUnit.amount.breakdown.shipping?.value || 0);
    const tax = parseFloat(purchaseUnit.amount.breakdown.tax_total?.value || 0);
    const total = parseFloat(purchaseUnit.amount.value);

    // Create WooCommerce order object
    const wooOrder = {
        payment_method: 'paypal',
        payment_method_title: 'PayPal',
        set_paid: true, // Mark as paid since PayPal payment is complete
        billing: billingAddress,
        shipping: shippingAddress,
        line_items: lineItemsWithSKU, // Use SKU-based items
        shipping_lines: shippingCost > 0 ? [{
            method_id: 'flat_rate',
            method_title: 'Shipping',
            total: shippingCost.toFixed(2)
        }] : [],
        meta_data: [
            {
                key: '_paypal_order_id',
                value: paypalOrder.id
            },
            {
                key: '_paypal_transaction_id',
                value: paypalOrder.purchase_units[0].payments?.captures?.[0]?.id || paypalOrder.id
            }
        ],
        customer_note: `PayPal Order ID: ${paypalOrder.id}`,
        status: 'processing' // or 'completed' if you want
    };

    return wooOrder;
}

/**
 * Get WooCommerce product ID by SKU
 * You'll need to maintain a mapping or fetch from WooCommerce API
 * @param {string} sku - Product SKU
 * @returns {number|null} Product ID or null
 */
function getProductIdBySKU(sku) {
    // TODO: Implement SKU to product_id mapping
    // Option 1: Maintain a local mapping object
    // Option 2: Fetch from WooCommerce API when needed
    // Option 3: Use WooCommerce's SKU matching (if supported)
    return null; // WooCommerce will try to match by SKU if product_id is not provided
}

/**
 * Sync order to WooCommerce after PayPal payment
 * Call this from your PayPal onApprove handler
 * @param {Object} paypalOrder - PayPal order data from onApprove
 */
async function syncOrderToWooCommerce(paypalOrder) {
    try {
        console.log('🔄 Syncing order to WooCommerce...');
        const wooOrder = await createWooCommerceOrder(paypalOrder);
        console.log('✅ Order synced to WooCommerce!', wooOrder);
        return wooOrder;
    } catch (error) {
        console.error('❌ Failed to sync order to WooCommerce:', error);
        // Don't throw - order is still valid, just not synced to WooCommerce
        return null;
    }
}

// Export for use in other files
if (typeof window !== 'undefined') {
    window.WooCommerceOrder = {
        init: initWooCommerce,
        createOrder: createWooCommerceOrder,
        syncOrder: syncOrderToWooCommerce,
        formatOrder: formatOrderForWooCommerce
    };
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initWooCommerce,
        createWooCommerceOrder,
        syncOrderToWooCommerce,
        formatOrderForWooCommerce
    };
}
