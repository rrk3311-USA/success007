/**
 * WooCommerce Coupon Creation API
 * Creates a 15% off coupon in WooCommerce with 7 months expiry
 */

const WOOCOMMERCE_CONFIG = {
    url: 'https://blueviolet-snake-802946.hostingersite.com',
    consumerKey: 'ck_2a7dcf6903f5d22ed4228abd6da424746d5f80b6',
    consumerSecret: 'cs_448d2cd75368443afcd926cb249bd78e81a80db1',
    apiEndpoint: '/wp-json/wc/v3'
};

/**
 * Generate a unique coupon code
 */
function generateCouponCode() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `THANKYOU15-${timestamp}-${random}`;
}

/**
 * Create coupon in WooCommerce
 */
async function createWooCommerceCoupon() {
    const couponCode = generateCouponCode();
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 7); // 7 months from now
    
    const couponData = {
        code: couponCode,
        discount_type: 'percent',
        amount: '15',
        individual_use: false,
        exclude_sale_items: false,
        minimum_amount: '0.00',
        maximum_amount: '',
        email_restrictions: [],
        usage_limit: 1,
        usage_limit_per_user: 1,
        limit_usage_to_x_items: null,
        free_shipping: false,
        product_ids: [],
        exclude_product_ids: [],
        product_categories: [],
        exclude_product_categories: [],
        exclude_sale_items: false,
        minimum_amount: '',
        maximum_amount: '',
        expiry_date: expiryDate.toISOString().split('T')[0], // YYYY-MM-DD format
        description: 'Thank you coupon - 15% off your next purchase'
    };

    try {
        const response = await fetch(
            `${WOOCOMMERCE_CONFIG.url}${WOOCOMMERCE_CONFIG.apiEndpoint}/coupons`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${btoa(`${WOOCOMMERCE_CONFIG.consumerKey}:${WOOCOMMERCE_CONFIG.consumerSecret}`)}`
                },
                body: JSON.stringify(couponData)
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`WooCommerce API Error ${response.status}: ${errorText}`);
        }

        const createdCoupon = await response.json();
        return {
            success: true,
            code: createdCoupon.code,
            discount: '15%',
            expiryDate: expiryDate.toISOString().split('T')[0],
            expiryDateFormatted: expiryDate.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            })
        };
    } catch (error) {
        console.error('Failed to create WooCommerce coupon:', error);
        throw error;
    }
}

// Export for use in server-side or client-side
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { createWooCommerceCoupon, generateCouponCode };
}

// For browser use
if (typeof window !== 'undefined') {
    window.createWooCommerceCoupon = createWooCommerceCoupon;
    window.generateCouponCode = generateCouponCode;
}
