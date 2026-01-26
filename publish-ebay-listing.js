/**
 * Publish eBay Listing
 * 
 * Publishes an UNPUBLISHED offer to create an active eBay listing
 * 
 * Usage:
 *   node publish-ebay-listing.js <offer-id>
 *   Example: node publish-ebay-listing.js 250318575012
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
 * Publish an offer
 */
async function publishOffer(offerId) {
    const token = await getAccessToken();
    if (!token) return null;
    
    console.log(`📤 Publishing offer: ${offerId}`);
    console.log('');
    
    const url = `${BASE_URL}/sell/inventory/v1/offer/${offerId}/publish`;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
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
        
        console.log(`📊 Response Status: ${response.status} ${response.statusText}`);
        console.log('');
        
        if (!response.ok) {
            console.error('❌ Failed to publish offer:');
            if (responseData.errors && responseData.errors.length > 0) {
                responseData.errors.forEach(err => {
                    console.error(`   Error ${err.errorId}: ${err.message}`);
                    console.error(`   ${err.longMessage}`);
                    if (err.parameters && err.parameters.length > 0) {
                        console.error(`   Parameters:`, JSON.stringify(err.parameters, null, 2));
                    }
                });
            } else {
                console.error('   Response:', JSON.stringify(responseData, null, 2));
            }
            return null;
        }
        
        console.log('✅ Offer published successfully!');
        console.log('');
        console.log('Publish Response:');
        console.log(JSON.stringify(responseData, null, 2));
        console.log('');
        
        if (responseData.listingId) {
            console.log('='.repeat(60));
            console.log('🎉 Listing is now LIVE!');
            console.log('='.repeat(60));
            console.log(`Listing ID: ${responseData.listingId}`);
            console.log(`View listing: https://www.ebay.com/itm/${responseData.listingId}`);
            console.log('');
        }
        
        if (responseData.warnings && responseData.warnings.length > 0) {
            console.log('⚠️  Warnings:');
            responseData.warnings.forEach(warning => {
                console.log(`   - ${warning.message}`);
            });
            console.log('');
        }
        
        return responseData;
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
    
    if (!offerId) {
        console.log('eBay Listing Publisher');
        console.log('');
        console.log('Usage:');
        console.log('  node publish-ebay-listing.js <offer-id>');
        console.log('');
        console.log('Example:');
        console.log('  node publish-ebay-listing.js 250318575012');
        process.exit(1);
    }
    
    console.log('='.repeat(60));
    console.log('eBay Listing Publisher');
    console.log('='.repeat(60));
    console.log('');
    
    const result = await publishOffer(offerId);
    
    if (result && result.listingId) {
        console.log('✅ Success! Your listing is now live on eBay.');
    } else {
        console.log('');
        console.log('⚠️  Publishing failed. Check errors above.');
        console.log('   The offer may need additional information before it can be published.');
    }
}

main().catch(error => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
});
