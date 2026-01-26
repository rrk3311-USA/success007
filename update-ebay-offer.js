/**
 * Update eBay Offer
 * 
 * Updates an existing offer (e.g., to fix category)
 * 
 * Usage:
 *   node update-ebay-offer.js <offer-id>
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
    CONFIG = configModule.CONFIG || configModule.default || CONFIG;
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
 * Get current offer
 */
async function getOffer(offerId) {
    const token = await getAccessToken();
    if (!token) return null;
    
    try {
        const response = await fetch(`${BASE_URL}/sell/inventory/v1/offer/${offerId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Content-Language': 'en-US',
                'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'
            }
        });
        
        const data = await response.json();
        return response.ok ? data : null;
    } catch (error) {
        console.error('Error:', error.message);
        return null;
    }
}

/**
 * Update offer
 */
async function updateOffer(offerId) {
    const token = await getAccessToken();
    if (!token) return null;
    
    // Get current offer
    const currentOffer = await getOffer(offerId);
    if (!currentOffer) {
        console.error('❌ Could not retrieve current offer');
        return null;
    }
    
    console.log('📝 Updating offer with correct category...');
    console.log(`   Current category: ${currentOffer.categoryId}`);
    console.log(`   New category: 180959 (Vitamins & Dietary Supplements)`);
    console.log('');
    
    // Update only the category field
    const updatePayload = {
        categoryId: '180959' // Vitamins & Dietary Supplements (leaf category)
    };
    
    try {
        const response = await fetch(`${BASE_URL}/sell/inventory/v1/offer/${offerId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Content-Language': 'en-US',
                'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'
            },
            body: JSON.stringify(updatePayload)
        });
        
        const responseText = await response.text();
        let responseData;
        
        try {
            responseData = responseText ? JSON.parse(responseText) : {};
        } catch (e) {
            console.error('❌ Invalid JSON response:', responseText.substring(0, 500));
            return null;
        }
        
        if (!response.ok) {
            console.error(`❌ Error (${response.status}):`);
            if (responseData.errors) {
                responseData.errors.forEach(err => {
                    console.error(`   ${err.message}: ${err.longMessage}`);
                });
            }
            return null;
        }
        
        console.log('✅ Offer updated successfully!');
        console.log(`   Category updated to: ${responseData.categoryId || '180959'}`);
        return responseData;
    } catch (error) {
        console.error('❌ Error:', error.message);
        return null;
    }
}

async function main() {
    const offerId = process.argv[2] || '250318575012';
    
    console.log('='.repeat(60));
    console.log('Update eBay Offer');
    console.log('='.repeat(60));
    console.log('');
    
    const result = await updateOffer(offerId);
    
    if (result) {
        console.log('');
        console.log('✅ Offer updated! Now try publishing:');
        console.log(`   node publish-ebay-listing.js ${offerId}`);
    }
}

main().catch(console.error);
