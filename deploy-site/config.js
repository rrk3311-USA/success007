/**
 * Success Chemistry Configuration
 * Toggle between sandbox and production environments
 */

const CONFIG = {
    // Set to true for testing, false for production
    SANDBOX_MODE: true, // Change to false when ready for live payments
    
    // PayPal Configuration
    PAYPAL: {
        // Get Sandbox Client ID from: https://developer.paypal.com/dashboard/applications/sandbox
        SANDBOX_CLIENT_ID: 'ATM3Eoawal0vHl1xqCcuP5TvlPBP-96AHV0xP0tiQ-KlAd_tuSLLQjKMsby8lgbgE7jN5zXPF3HjMUNk', // Replace with your Sandbox Client ID
        PRODUCTION_CLIENT_ID: 'EBAQIbUDDVgB06yvEWREs2cMox8AKElkxFJAqKF71iUj007dv0YzxlKbepduwV7xGEI5FrjK3vakzm0b'
    },
    
    // Google Analytics Configuration
    GOOGLE_ANALYTICS: {
        MEASUREMENT_ID: 'G-WNZH4JKEL5', // Success Chemistry - GA4
        ENABLED: true
    },
    
    // Google Ads Configuration (for Enhanced Conversions)
    GOOGLE_ADS: {
        CONVERSION_ID: 'AW-XXXXXXXXX', // Replace with your Google Ads Conversion ID
        CONVERSION_LABEL: 'XXXXX', // Replace with your conversion label
        ENABLED: true
    },
    
    // eBay API Configuration (OAuth 2.0)
    EBAY_API: {
        // OAuth 2.0 Credentials
        // ⚠️ SECRETS: These are loaded from environment variables in production
        // Get your credentials from: https://developer.ebay.com/my/keys
        CLIENT_ID: (typeof process !== 'undefined' && process.env?.EBAY_CLIENT_ID) || 'YOUR_EBAY_CLIENT_ID_HERE', // Production Client ID
        CLIENT_SECRET: (typeof process !== 'undefined' && process.env?.EBAY_CLIENT_SECRET) || 'YOUR_EBAY_CLIENT_SECRET_HERE', // Production Client Secret
        RU_NAME: 'Raphael_Kammer-RaphaelK-Cursor-hxncgp',
        
        // OAuth URLs
        REDIRECT_URI: 'Raphael_Kammer-RaphaelK-Cursor-hxncgp', // RuName (eBay uses RuName as redirect_uri) - or use 'http://localhost:3000/ebay/callback' for local callback server
        AUTH_URL: 'https://auth.ebay.com/oauth2/authorize',
        TOKEN_URL: 'https://api.ebay.com/identity/v1/oauth2/token',
        
        // Current Access Token (if you have one)
        ACCESS_TOKEN: 'v^1.1#i^1#r^1#f^0#p^3#I^3#t^Ul41Xzg6OTE5QTY4QTE1MTY4RjI1QzcyOEQ3QjIzRTZBMjk4MDRfMV8xI0VeMjYw',
        REFRESH_TOKEN: 'v^1.1#i^1#r^1#f^0#p^3#I^3#t^Ul41Xzg6OTE5QTY4QTE1MTY4RjI1QzcyOEQ3QjIzRTZBMjk4MDRfMV8xI0VeMjYw', // OAuth refresh token (eBay format: v^1.1#...)
        EXPIRES: 'Sun, 18 Jul 2027 00:21:56 GMT',
        
        // API Configuration
        BASE_URL: 'https://api.ebay.com', // Production API
        SANDBOX_BASE_URL: 'https://api.sandbox.ebay.com', // Sandbox for testing
        USE_SANDBOX: false, // Set to true for testing
        
        // Required Scopes (minimal - for listing products)
        SCOPES: [
            'https://api.ebay.com/oauth/api_scope/sell.inventory',
            'https://api.ebay.com/oauth/api_scope/sell.account',
            'https://api.ebay.com/oauth/api_scope/commerce.taxonomy.readonly' // For Taxonomy API to find categories
            // Optional later: 'https://api.ebay.com/oauth/api_scope/sell.fulfillment'
        ],
        
        ENABLED: true,
        // API Documentation: https://developer.ebay.com/api-docs
        // Inventory API: https://developer.ebay.com/api-docs/sell/inventory/overview.html
        // OAuth Guide: https://developer.ebay.com/api-docs/static/oauth-consent-request.html
    }
};

// Helper function to get PayPal Client ID based on mode
function getPayPalClientID() {
    return CONFIG.SANDBOX_MODE 
        ? CONFIG.PAYPAL.SANDBOX_CLIENT_ID 
        : CONFIG.PAYPAL.PRODUCTION_CLIENT_ID;
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}

// ES Module export (only if actually in module context - check at runtime)
// Note: This file is loaded as regular script, not module, so ES6 exports will fail
// If you need ES6 exports, load this file with type="module"
// For now, we only expose via window and module.exports

// Expose to window for browser scripts (always available)
if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
    window.getPayPalClientID = getPayPalClientID;
}
