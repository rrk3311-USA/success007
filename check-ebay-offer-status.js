/**
 * Check status of a specific eBay offer
 */

import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const ACCESS_TOKEN = process.env.EBAY_ACCESS_TOKEN;
const BASE_URL = 'https://api.ebay.com';
const SKU = process.argv[2] || '10777-810';

if (!ACCESS_TOKEN) {
    console.error('❌ EBAY_ACCESS_TOKEN not found in .env');
    process.exit(1);
}

async function checkOfferStatus() {
    try {
        console.log(`📋 Checking offer status for SKU: ${SKU}\n`);
        
        // First, try to get the offer by SKU
        const response = await fetch(`${BASE_URL}/sell/inventory/v1/offer?sku=${SKU}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
                'Content-Type': 'application/json',
                'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'
            }
        });

        const data = await response.json();

        if (!response.ok) {
            console.error(`❌ Error (${response.status}):`, JSON.stringify(data, null, 2));
            
            // Try to get inventory item instead
            console.log('\n📦 Checking inventory item...');
            const invResponse = await fetch(`${BASE_URL}/sell/inventory/v1/inventory_item/${SKU}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${ACCESS_TOKEN}`,
                    'Content-Type': 'application/json',
                    'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'
                }
            });
            
            const invData = await invResponse.json();
            if (invResponse.ok) {
                console.log('✅ Inventory item exists:');
                console.log(JSON.stringify(invData, null, 2));
            } else {
                console.error('❌ Inventory item error:', JSON.stringify(invData, null, 2));
            }
            return;
        }

        console.log('✅ Offer found:');
        console.log(JSON.stringify(data, null, 2));
        
        if (data.offers && data.offers.length > 0) {
            const offer = data.offers[0];
            console.log(`\n📊 Offer Details:`);
            console.log(`   Offer ID: ${offer.offerId}`);
            console.log(`   SKU: ${offer.sku}`);
            console.log(`   Status: ${offer.status}`);
            console.log(`   Listing ID: ${offer.listingId || 'NOT PUBLISHED'}`);
            console.log(`   Format: ${offer.format}`);
            console.log(`   Marketplace: ${offer.marketplaceId}`);
            
            if (!offer.listingId) {
                console.log('\n⚠️  Offer exists but is NOT published to eBay yet!');
                console.log('   The offer needs to be published to appear in your eBay account.');
            } else {
                console.log(`\n✅ Listing is published! View at: https://www.ebay.com/itm/${offer.listingId}`);
            }
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

checkOfferStatus();
