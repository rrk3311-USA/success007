/**
 * Success Chemistry - Google Analytics 4 & Enhanced Conversions Tracking
 * This script handles all tracking events across the site
 */

// Initialize Google Analytics 4
function initializeGA4(measurementId) {
    if (!measurementId || measurementId === 'G-XXXXXXXXXX') {
        console.warn('Google Analytics not configured. Please add your Measurement ID to config.js');
        return;
    }

    // Load gtag.js
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag;
    
    gtag('js', new Date());
    gtag('config', measurementId, {
        'send_page_view': true,
        'allow_enhanced_conversions': true
    });

    console.log('✅ Google Analytics 4 initialized:', measurementId);
}

// Track page views
function trackPageView(pagePath, pageTitle) {
    if (typeof gtag === 'function') {
        gtag('event', 'page_view', {
            page_path: pagePath || window.location.pathname,
            page_title: pageTitle || document.title
        });
    }
}

// Track product views
function trackProductView(product) {
    if (typeof gtag === 'function') {
        gtag('event', 'view_item', {
            currency: 'USD',
            value: parseFloat(product.price) || 0,
            items: [{
                item_id: product.sku,
                item_name: product.name,
                price: parseFloat(product.price) || 0,
                quantity: 1
            }]
        });
        console.log('📊 Tracked product view:', product.name);
    }
}

// Track add to cart
function trackAddToCart(product, quantity = 1) {
    if (typeof gtag === 'function') {
        const price = parseFloat(product.price) || 0;
        gtag('event', 'add_to_cart', {
            currency: 'USD',
            value: price * quantity,
            items: [{
                item_id: product.sku,
                item_name: product.name,
                price: price,
                quantity: quantity
            }]
        });
        console.log('🛒 Tracked add to cart:', product.name);
    }
}

// Track begin checkout
function trackBeginCheckout(cartItems, totalValue) {
    if (typeof gtag === 'function') {
        const items = cartItems.map(item => ({
            item_id: item.sku,
            item_name: item.name,
            price: parseFloat(item.price) || 0,
            quantity: parseInt(item.quantity) || 1
        }));

        gtag('event', 'begin_checkout', {
            currency: 'USD',
            value: totalValue,
            items: items
        });
        console.log('💳 Tracked begin checkout:', totalValue);
    }
}

// Track purchase with Enhanced Conversions
function trackPurchase(orderData, customerData = {}) {
    if (typeof gtag === 'function') {
        const items = orderData.items.map(item => ({
            item_id: item.sku,
            item_name: item.name,
            price: parseFloat(item.price) || 0,
            quantity: parseInt(item.quantity) || 1
        }));

        // Standard purchase event
        gtag('event', 'purchase', {
            transaction_id: orderData.orderNumber,
            value: orderData.total,
            currency: 'USD',
            tax: orderData.tax || 0,
            shipping: orderData.shipping || 0,
            items: items
        });

        // Enhanced Conversions - send hashed user data
        if (customerData.email) {
            gtag('set', 'user_data', {
                email: customerData.email,
                phone_number: customerData.phone || undefined,
                address: {
                    first_name: customerData.firstName || undefined,
                    last_name: customerData.lastName || undefined,
                    street: customerData.address || undefined,
                    city: customerData.city || undefined,
                    region: customerData.state || undefined,
                    postal_code: customerData.zip || undefined,
                    country: customerData.country || undefined
                }
            });
        }

        console.log('✅ Tracked purchase with Enhanced Conversions:', orderData.orderNumber);
    }
}

// Track Google Ads conversion
function trackGoogleAdsConversion(conversionId, conversionLabel, value, transactionId) {
    if (typeof gtag === 'function' && conversionId && conversionLabel) {
        gtag('event', 'conversion', {
            'send_to': `${conversionId}/${conversionLabel}`,
            'value': value,
            'currency': 'USD',
            'transaction_id': transactionId
        });
        console.log('📈 Tracked Google Ads conversion');
    }
}

// Track custom events
function trackCustomEvent(eventName, eventParams = {}) {
    if (typeof gtag === 'function') {
        gtag('event', eventName, eventParams);
        console.log('📊 Tracked custom event:', eventName);
    }
}

// Track subscription signup
function trackSubscription(planName, value) {
    if (typeof gtag === 'function') {
        gtag('event', 'subscribe', {
            plan_name: planName,
            value: value,
            currency: 'USD'
        });
        console.log('🌈 Tracked subscription:', planName);
    }
}

// Track coupon usage
function trackCouponUsage(couponCode, discount) {
    if (typeof gtag === 'function') {
        gtag('event', 'coupon_used', {
            coupon_code: couponCode,
            discount_amount: discount,
            currency: 'USD'
        });
        console.log('🎫 Tracked coupon usage:', couponCode);
    }
}

// Initialize tracking on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check if config is available
    if (typeof CONFIG !== 'undefined' && CONFIG.GOOGLE_ANALYTICS.ENABLED) {
        initializeGA4(CONFIG.GOOGLE_ANALYTICS.MEASUREMENT_ID);
    }
});

// Export functions for use in other scripts
window.SuccessChemistryTracking = {
    initializeGA4,
    trackPageView,
    trackProductView,
    trackAddToCart,
    trackBeginCheckout,
    trackPurchase,
    trackGoogleAdsConversion,
    trackCustomEvent,
    trackSubscription,
    trackCouponUsage
};
