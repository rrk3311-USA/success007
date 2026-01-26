/**
 * Fix eBay Listing - Update category and add required item specifics
 */

import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const ACCESS_TOKEN = process.env.EBAY_ACCESS_TOKEN;
const BASE_URL = 'https://api.ebay.com';
const SKU = '10777-810';

if (!ACCESS_TOKEN) {
    console.error('❌ EBAY_ACCESS_TOKEN not found in .env');
    process.exit(1);
}

async function fixListing() {
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
    const offer = getData.offers[0];
    const offerId = offer.offerId;

    console.log(`✅ Found offer ID: ${offerId}`);
    console.log(`   Current category: ${offer.categoryId}`);
    console.log('');

    // Try category 26395 (Health & Beauty > Vitamins & Supplements)
    // Or we need to update the inventory item with proper aspects
    console.log('📝 Updating inventory item with proper aspects...');
    
    // First, update inventory item to add proper aspects
    const inventoryUpdate = {
        sku: SKU,
        product: {
            title: offer.listingDescription ? 'Success Chemistry Liver Cleanse Detox Support Formula - 60 Capsules' : undefined,
            aspects: {
                'Brand': ['Success Chemistry'],
                'Product Type': ['Dietary Supplements'],
                'Form': ['Capsules'],
                'Size': ['60 Count'],
                'Key Ingredients': ['Milk Thistle', 'Dandelion Root', 'Artichoke Extract'],
                'Target Audience': ['Adults'],
                'Health Concern': ['Liver Health', 'Detoxification']
            }
        }
    };

    const invResponse = await fetch(`${BASE_URL}/sell/inventory/v1/inventory_item/${SKU}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
            'Content-Language': 'en-US',
            'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'
        },
        body: JSON.stringify(inventoryUpdate)
    });

    if (!invResponse.ok) {
        const invError = await invResponse.json();
        console.error('❌ Error updating inventory:', JSON.stringify(invError, null, 2));
    } else {
        console.log('✅ Inventory item updated');
    }

    // Update offer with category 26395
    console.log('\n📝 Updating offer category to 26395...');
    
    const updatedOffer = {
        sku: offer.sku,
        marketplaceId: offer.marketplaceId,
        format: offer.format,
        listingPolicies: offer.listingPolicies,
        pricingSummary: offer.pricingSummary,
        categoryId: '26395', // Health & Beauty > Vitamins & Supplements
        merchantLocationKey: offer.merchantLocationKey,
        quantity: offer.availableQuantity || 1,
        listingDescription: offer.listingDescription,
        includeCatalogProductDetails: offer.includeCatalogProductDetails,
        tax: offer.tax
    };

    const updateResponse = await fetch(`${BASE_URL}/sell/inventory/v1/offer/${offerId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
            'Content-Language': 'en-US',
            'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'
        },
        body: JSON.stringify(updatedOffer)
    });

    const updateData = await updateResponse.json();

    if (!updateResponse.ok) {
        console.error(`❌ Error updating offer (${updateResponse.status}):`);
        console.error(JSON.stringify(updateData, null, 2));
        return;
    }

    console.log('✅ Offer updated!');
    console.log('   New category: 26395');
    console.log('\n🚀 Attempting to publish...');

    // Try to publish
    const publishResponse = await fetch(`${BASE_URL}/sell/inventory/v1/offer/${offerId}/publish`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
            'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'
        }
    });

    const publishData = await publishResponse.json();

    if (!publishResponse.ok) {
        console.error(`❌ Error publishing (${publishResponse.status}):`);
        console.error(JSON.stringify(publishData, null, 2));
        console.log('\n💡 The listing needs to be published manually in eBay Seller Hub.');
        console.log('   Go to: https://www.ebay.com/sh/landing');
        console.log('   Find offer ID: ' + offerId);
        console.log('   Set the correct category and publish');
    } else {
        console.log('✅ Published successfully!');
        if (publishData.listingId) {
            console.log(`   Listing ID: ${publishData.listingId}`);
            console.log(`   View: https://www.ebay.com/itm/${publishData.listingId}`);
        }
    }
}

fixListing().catch(error => {
    console.error('❌ Error:', error.message);
    process.exit(1);
});
