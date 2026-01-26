/**
 * List eBay Draft Listings
 * 
 * Lists unpublished/draft listings
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
 * List all offers (including drafts/unpublished)
 */
async function listOffers(statusFilter = null) {
    const token = await getAccessToken();
    if (!token) return null;
    
    let url = `${BASE_URL}/sell/inventory/v1/offer?limit=50`;
    if (statusFilter) {
        url += `&status=${statusFilter}`;
    }
    
    try {
        const response = await fetch(url, {
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

async function main() {
    console.log('='.repeat(60));
    console.log('eBay Draft Listings');
    console.log('='.repeat(60));
    console.log('');
    
    // List unpublished/draft offers
    console.log('📋 Checking for UNPUBLISHED offers (drafts)...');
    console.log('');
    
    const drafts = await listOffers('UNPUBLISHED');
    
    if (drafts && drafts.offers && drafts.offers.length > 0) {
        console.log(`✅ Found ${drafts.offers.length} draft listing(s):`);
        console.log('');
        
        drafts.offers.forEach((offer, idx) => {
            console.log(`${idx + 1}. Offer ID: ${offer.offerId}`);
            console.log(`   SKU: ${offer.sku || 'N/A'}`);
            console.log(`   Status: ${offer.status}`);
            console.log(`   Price: $${offer.pricingSummary?.price?.value || 'N/A'}`);
            if (offer.listingDescription) {
                const title = offer.listingDescription.substring(0, 60) + '...';
                console.log(`   Title: ${title}`);
            }
            console.log('');
        });
        
        console.log('💡 To view in eBay Seller Hub:');
        console.log('   1. Go to: https://www.ebay.com/sh/landing');
        console.log('   2. Click "Selling" → "Drafts"');
        console.log('   3. Or go directly to: https://www.ebay.com/sh/listings/drafts');
        console.log('');
    } else {
        console.log('⚠️  No UNPUBLISHED offers found');
        console.log('');
        
        // List all offers to see what we have
        console.log('📋 Checking all offers...');
        const allOffers = await listOffers();
        
        if (allOffers && allOffers.offers && allOffers.offers.length > 0) {
            console.log(`Found ${allOffers.offers.length} total offer(s):`);
            console.log('');
            
            allOffers.offers.forEach((offer, idx) => {
                console.log(`${idx + 1}. Offer ID: ${offer.offerId}`);
                console.log(`   SKU: ${offer.sku || 'N/A'}`);
                console.log(`   Status: ${offer.status || 'N/A'}`);
                console.log(`   Price: $${offer.pricingSummary?.price?.value || 'N/A'}`);
                if (offer.listingId) {
                    console.log(`   Listing ID: ${offer.listingId}`);
                    console.log(`   View: https://www.ebay.com/itm/${offer.listingId}`);
                }
                console.log('');
            });
        } else {
            console.log('No offers found');
        }
    }
    
    console.log('='.repeat(60));
    console.log('💡 Where to find drafts in eBay:');
    console.log('='.repeat(60));
    console.log('1. eBay Seller Hub: https://www.ebay.com/sh/landing');
    console.log('2. Go to: Selling → Drafts');
    console.log('3. Direct link: https://www.ebay.com/sh/listings/drafts');
    console.log('');
    console.log('Or check "Active Listings" if it was auto-published:');
    console.log('https://www.ebay.com/sh/listings/active');
    console.log('');
}

main().catch(error => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
});
