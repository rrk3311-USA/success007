/**
 * Check existing eBay offers/listings
 */

import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const ACCESS_TOKEN = process.env.EBAY_ACCESS_TOKEN;
const BASE_URL = 'https://api.ebay.com';

if (!ACCESS_TOKEN) {
    console.error('❌ EBAY_ACCESS_TOKEN not found in .env');
    process.exit(1);
}

async function checkOffers() {
    try {
        console.log('📋 Checking existing eBay offers...\n');
        
        const response = await fetch(`${BASE_URL}/sell/inventory/v1/offer?limit=10`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
                'Content-Type': 'application/json',
                'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'
            }
        });

        const data = await response.json();

        if (!response.ok) {
            console.error(`❌ Error (${response.status}):`, data);
            return;
        }

        console.log(`✅ Found ${data.total || 0} offers\n`);
        
        if (data.offers && data.offers.length > 0) {
            data.offers.forEach(offer => {
                console.log(`SKU: ${offer.sku}`);
                console.log(`Offer ID: ${offer.offerId}`);
                console.log(`Listing ID: ${offer.listingId || 'Not published'}`);
                console.log(`Status: ${offer.status || 'N/A'}`);
                console.log(`Price: $${offer.pricingSummary?.price?.value || 'N/A'}`);
                console.log('---');
            });
        } else {
            console.log('No offers found.');
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

checkOffers();
