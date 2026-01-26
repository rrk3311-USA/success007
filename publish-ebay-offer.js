/**
 * Publish an eBay offer to make it active
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

async function publishOffer() {
    try {
        console.log(`📋 Publishing offer for SKU: ${SKU}\n`);
        
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
            console.error(JSON.stringify(getData, null, 2));
            return;
        }

        const offer = getData.offers[0];
        const offerId = offer.offerId;

        console.log(`✅ Found offer ID: ${offerId}`);
        console.log(`   Current status: ${offer.status}`);
        console.log(`   Listing ID: ${offer.listing?.listingId || 'None'}\n`);

        // Publish the offer
        console.log('🚀 Publishing offer...');
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
            console.error(`❌ Error publishing offer (${publishResponse.status}):`);
            console.error(JSON.stringify(publishData, null, 2));
            return;
        }

        console.log('✅ Offer published successfully!');
        console.log('\n📊 Publishing Result:');
        console.log(JSON.stringify(publishData, null, 2));

        if (publishData.listingId) {
            console.log(`\n🎉 Listing is now LIVE!`);
            console.log(`   Listing ID: ${publishData.listingId}`);
            console.log(`   View at: https://www.ebay.com/itm/${publishData.listingId}`);
            console.log(`\n✅ Check your eBay Seller Hub - it should appear in Active Listings!`);
        } else if (publishData.warnings) {
            console.log('\n⚠️  Published with warnings:');
            publishData.warnings.forEach(warning => {
                console.log(`   - ${warning.message}`);
            });
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

publishOffer();
