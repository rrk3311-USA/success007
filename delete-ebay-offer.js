/**
 * Delete eBay Offer
 * 
 * Usage:
 *   node delete-ebay-offer.js <SKU>
 */

import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const ACCESS_TOKEN = process.env.EBAY_ACCESS_TOKEN;
const BASE_URL = 'https://api.ebay.com';
const SKU = process.argv[2];

if (!ACCESS_TOKEN) {
    console.error('❌ EBAY_ACCESS_TOKEN not found in .env');
    process.exit(1);
}

if (!SKU) {
    console.error('❌ Please provide SKU');
    console.log('Usage: node delete-ebay-offer.js <SKU>');
    process.exit(1);
}

async function deleteOffer() {
    // First, get the offer ID
    const getResponse = await fetch(`${BASE_URL}/sell/inventory/v1/offer?sku=${SKU}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
            'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'
        }
    });

    const getData = await getResponse.json();

    if (!getResponse.ok || !getData.offers || getData.offers.length === 0) {
        console.error(`❌ Offer not found for SKU: ${SKU}`);
        process.exit(1);
    }

    const offer = getData.offers[0];
    const offerId = offer.offerId;

    console.log(`✅ Found offer ID: ${offerId}`);
    console.log(`   Status: ${offer.status}`);
    console.log(`   Listing ID: ${offer.listingId || 'Not published'}`);
    console.log('');
    console.log('🗑️  Deleting offer...');

    // Delete the offer
    const deleteResponse = await fetch(`${BASE_URL}/sell/inventory/v1/offer/${offerId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
            'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'
        }
    });

    if (deleteResponse.ok || deleteResponse.status === 204) {
        console.log('✅ Offer deleted successfully!');
        console.log(`   You can now create a new listing for SKU: ${SKU}`);
    } else {
        const errorData = await deleteResponse.json();
        console.error(`❌ Error deleting offer (${deleteResponse.status}):`);
        console.error(JSON.stringify(errorData, null, 2));
        process.exit(1);
    }
}

deleteOffer().catch(error => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
});
