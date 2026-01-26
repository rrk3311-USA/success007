/**
 * Check eBay Listing Status
 * 
 * Checks the status of an eBay offer/listing
 * 
 * Usage:
 *   node check-ebay-listing-status.js <offer-id>
 *   Example: node check-ebay-listing-status.js 250318575012
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load config
let CONFIG;
try {
    const configPath = join(__dirname, 'deploy-site', 'config.js');
    const configModule = await import(`file://${configPath}?update=${Date.now()}`);
    CONFIG = configModule.CONFIG || configModule.default || configModule;
} catch (err) {
    console.error('❌ Could not load config.js:', err.message);
    process.exit(1);
}

const EBAY_CONFIG = CONFIG.EBAY_API;
const BASE_URL = EBAY_CONFIG.USE_SANDBOX ? EBAY_CONFIG.SANDBOX_BASE_URL : EBAY_CONFIG.BASE_URL;

async function getAccessToken() {
    return EBAY_CONFIG.ACCESS_TOKEN;
}

/**
 * Get offer status by offer ID
 */
async function getOfferStatus(offerId) {
    const token = await getAccessToken();
    if (!token) return null;
    
    console.log(`📋 Checking offer status for: ${offerId}`);
    console.log('');
    
    try {
        const response = await fetch(`${BASE_URL}/sell/inventory/v1/offer/${offerId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Content-Language': 'en-US',
                'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'
            }
        });
        
        const responseText = await response.text();
        let responseData;
        
        try {
            responseData = responseText ? JSON.parse(responseText) : {};
        } catch (e) {
            console.error('❌ Invalid JSON response:');
            console.error('   Status:', response.status, response.statusText);
            console.error('   Response:', responseText.substring(0, 500));
            return null;
        }
        
        if (!response.ok) {
            console.error(`❌ Error (${response.status}):`);
            if (responseData.errors && responseData.errors.length > 0) {
                responseData.errors.forEach(err => {
                    console.error(`   ${err.message}: ${err.longMessage}`);
                });
            } else {
                console.error('   Response:', JSON.stringify(responseData, null, 2));
            }
            return null;
        }
        
        return responseData;
    } catch (error) {
        console.error('❌ Error:', error.message);
        return null;
    }
}

/**
 * Get listing status by listing ID
 */
async function getListingStatus(listingId) {
    const token = await getAccessToken();
    if (!token) return null;
    
    console.log(`📋 Checking listing status for: ${listingId}`);
    console.log('');
    
    try {
        const response = await fetch(`${BASE_URL}/sell/inventory/v1/offer?offer_id=${listingId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Content-Language': 'en-US',
                'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'
            }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            console.error(`❌ Error (${response.status}):`, data);
            return null;
        }
        
        return data;
    } catch (error) {
        console.error('❌ Error:', error.message);
        return null;
    }
}

/**
 * List all offers
 */
async function listAllOffers() {
    const token = await getAccessToken();
    if (!token) return null;
    
    console.log('📋 Listing all offers...');
    console.log('');
    
    try {
        const response = await fetch(`${BASE_URL}/sell/inventory/v1/offer?limit=10`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Content-Language': 'en-US',
                'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'
            }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            console.error(`❌ Error (${response.status}):`, data);
            return null;
        }
        
        return data;
    } catch (error) {
        console.error('❌ Error:', error.message);
        return null;
    }
}

/**
 * Main function
 */
async function main() {
    const offerId = process.argv[2];
    
    console.log('='.repeat(60));
    console.log('eBay Listing Status Check');
    console.log('='.repeat(60));
    console.log('');
    
    if (offerId) {
        // Check specific offer
        const offer = await getOfferStatus(offerId);
        
        if (offer) {
            console.log('✅ Offer Details:');
            console.log(JSON.stringify(offer, null, 2));
            console.log('');
            
            if (offer.offerId) {
                console.log(`Offer ID: ${offer.offerId}`);
            }
            if (offer.listingId) {
                console.log(`Listing ID: ${offer.listingId}`);
                console.log(`View: https://www.ebay.com/itm/${offer.listingId}`);
            }
            if (offer.status) {
                console.log(`Status: ${offer.status}`);
            }
            if (offer.pricingSummary) {
                console.log(`Price: $${offer.pricingSummary.price?.value || 'N/A'}`);
            }
            if (offer.quantity) {
                console.log(`Quantity: ${offer.quantity}`);
            }
        }
    } else {
        // List all offers
        const offers = await listAllOffers();
        
        if (offers && offers.offers) {
            console.log(`Found ${offers.offers.length} offers:`);
            console.log('');
            
            offers.offers.forEach((offer, idx) => {
                console.log(`${idx + 1}. Offer ID: ${offer.offerId}`);
                console.log(`   SKU: ${offer.sku || 'N/A'}`);
                console.log(`   Status: ${offer.status || 'N/A'}`);
                if (offer.listingId) {
                    console.log(`   Listing ID: ${offer.listingId}`);
                    console.log(`   View: https://www.ebay.com/itm/${offer.listingId}`);
                }
                if (offer.pricingSummary) {
                    console.log(`   Price: $${offer.pricingSummary.price?.value || 'N/A'}`);
                }
                console.log('');
            });
        } else {
            console.log('No offers found or error occurred');
        }
    }
    
    console.log('='.repeat(60));
}

main().catch(error => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
});
