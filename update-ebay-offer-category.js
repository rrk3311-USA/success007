/**
 * Update eBay Offer Category
 * 
 * Usage:
 *   node update-ebay-offer-category.js <SKU> <categoryId>
 */

import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const ACCESS_TOKEN = process.env.EBAY_ACCESS_TOKEN;
const BASE_URL = 'https://api.ebay.com';
const SKU = process.argv[2];
const CATEGORY_ID = process.argv[3] || '180959';

if (!ACCESS_TOKEN) {
    console.error('❌ EBAY_ACCESS_TOKEN not found in .env');
    process.exit(1);
}

if (!SKU) {
    console.error('❌ Please provide SKU');
    console.log('Usage: node update-ebay-offer-category.js <SKU> [categoryId]');
    process.exit(1);
}

async function updateCategory() {
    // Get current offer
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
    console.log(`   Current category: ${offer.categoryId}`);
    console.log(`   New category: ${CATEGORY_ID}`);
    console.log('');

    // Update offer with new category
    const updatedOffer = {
        sku: offer.sku,
        marketplaceId: offer.marketplaceId,
        format: offer.format,
        listingPolicies: offer.listingPolicies,
        pricingSummary: offer.pricingSummary,
        categoryId: CATEGORY_ID,
        merchantLocationKey: offer.merchantLocationKey,
        quantity: offer.availableQuantity || offer.quantity || 1,
        listingDescription: offer.listingDescription,
        includeCatalogProductDetails: offer.includeCatalogProductDetails !== false,
        tax: offer.tax
    };

    try {
        const response = await fetch(`${BASE_URL}/sell/inventory/v1/offer/${offerId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
                'Content-Type': 'application/json',
                'Content-Language': 'en-US',
                'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'
            },
            body: JSON.stringify(updatedOffer)
        });

        const responseData = await response.json();

        if (!response.ok) {
            console.error(`❌ Error updating offer (${response.status}):`);
            console.error(JSON.stringify(responseData, null, 2));
            process.exit(1);
        }

        console.log('✅ Offer updated successfully!');
        console.log(`   New category: ${CATEGORY_ID}`);
        console.log(`   Offer ID: ${responseData.offerId || offerId}`);
    } catch (error) {
        console.error('❌ Error updating offer:', error.message);
        process.exit(1);
    }
}

updateCategory().catch(error => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
});
