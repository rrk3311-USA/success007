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
