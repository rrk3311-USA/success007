/**
 * Update eBay Listing Description Only (SEO-optimized)
 * Then update price separately if needed
 */

import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ACCESS_TOKEN = process.env.EBAY_ACCESS_TOKEN;
const BASE_URL = 'https://api.ebay.com';
const SKU = process.argv[2] || '10777-810';

if (!ACCESS_TOKEN) {
    console.error('❌ EBAY_ACCESS_TOKEN not found in .env');
    process.exit(1);
}

// Load products data
let PRODUCTS_DATA;
try {
    const productsPath = join(__dirname, 'deploy-site', 'products-data.js');
    const productsContent = readFileSync(productsPath, 'utf8');
    const modifiedContent = productsContent.replace(/^const PRODUCTS_DATA/, 'var PRODUCTS_DATA') + '\nPRODUCTS_DATA;';
    const func = new Function(modifiedContent + '\nreturn PRODUCTS_DATA;');
    PRODUCTS_DATA = func();
} catch (err) {
    console.error('❌ Could not load products-data.js:', err.message);
    process.exit(1);
}

const product = PRODUCTS_DATA[SKU];
if (!product) {
    console.error(`❌ Product with SKU "${SKU}" not found`);
    process.exit(1);
}

function generateSEODescription() {
    // Optimized description under 4000 characters
    return `
<h2>🌿 Success Chemistry Liver Cleanse - Premium Detox Support Formula</h2>

<p><strong>Transform Your Liver Health with Nature's Most Powerful Detox Ingredients</strong></p>

<p>Success Chemistry Liver Cleanse is a premium dietary supplement specifically formulated to support your liver's natural detoxification processes. This advanced formula combines time-tested botanical extracts with modern nutritional science to help maintain optimal liver function and promote overall wellness.</p>

<h3>✨ Key Benefits & Features</h3>

<ul>
<li><strong>Supports Liver Health:</strong> Milk Thistle (Silymarin) has been traditionally used for centuries to support healthy liver function and protect liver cells from oxidative stress.</li>
<li><strong>Natural Detoxification:</strong> Dandelion Root and Artichoke Extract work synergistically to support the body's natural detox processes and aid in healthy digestion.</li>
<li><strong>Antioxidant Protection:</strong> Turmeric and Ginger provide powerful antioxidant support to help maintain a healthy inflammatory response in the liver.</li>
<li><strong>Comprehensive Formula:</strong> Includes Alfalfa, Burdock Root, Celery Powder, Feverfew, Grape Seed Extract, and more for holistic liver support.</li>
<li><strong>Premium Quality:</strong> Made in the USA in a GMP-certified facility with non-GMO ingredients and vegetarian capsules.</li>
</ul>

<h3>🔬 Premium Ingredient Profile</h3>

<p><strong>Milk Thistle Extract (300mg):</strong> The star ingredient, Silymarin, is one of the most researched liver-supporting compounds. It helps protect liver cells and supports healthy liver regeneration.</p>

<p><strong>Dandelion Root (200mg):</strong> Traditionally used to support liver and kidney function, dandelion root aids in natural detoxification and promotes healthy bile production.</p>

<p><strong>Artichoke Extract (150mg):</strong> Supports healthy digestion and liver function. Artichoke helps maintain healthy cholesterol levels already within normal range.</p>

<p><strong>Turmeric Extract (100mg):</strong> Provides powerful antioxidant support and helps maintain a healthy inflammatory response throughout the body, including the liver.</p>

<p><strong>Ginger Extract (50mg):</strong> Supports digestive health and works synergistically with other ingredients to promote optimal liver function.</p>

<h3>📋 Supplement Facts</h3>

<p><strong>Serving Size:</strong> 2 Capsules | <strong>Servings Per Container:</strong> 30</p>

<p><strong>Key Ingredients Per Serving:</strong> Milk Thistle Extract (300mg), Dandelion Root (200mg), Artichoke Extract (150mg), Turmeric Extract (100mg), Ginger Extract (50mg), Alfalfa (50mg), Burdock Root (50mg), Vitamin C (60mg), Selenium (100mcg)</p>

<h3>💊 Suggested Use</h3>

<p>As a dietary supplement, take two (2) veggie capsules once a day after a meal with an 8oz. glass of water or as directed by your healthcare professional.</p>

<h3>✅ Quality Assurance</h3>

<p>✅ Made in the USA in a GMP-certified facility | ✅ Non-GMO ingredients | ✅ Vegetarian capsules (no gelatin) | ✅ Third-party tested for purity and potency | ✅ No artificial colors, flavors, or preservatives | ✅ Gluten-free and dairy-free</p>

<h3>🎯 Who Can Benefit?</h3>

<p>This formula is ideal for anyone looking to support their liver's natural detoxification processes, maintain healthy liver function, support overall digestive health, promote antioxidant protection, support a healthy inflammatory response, and maintain optimal wellness as part of a healthy lifestyle.</p>

<h3>📦 What's Included</h3>

<p>Each bottle contains 60 easy-to-swallow vegetarian capsules, providing a full 30-day supply when taken as directed.</p>

<h3>🏆 Why Choose Success Chemistry?</h3>

<p>Success Chemistry is committed to providing premium-quality supplements backed by science and manufactured to the highest standards. Our Liver Cleanse formula is carefully crafted with the finest ingredients to support your wellness journey. Order today and experience the difference premium liver support can make in your overall health and wellness!</p>

<p><em>*These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease. Consult with your healthcare provider before starting any new supplement regimen, especially if you are pregnant, nursing, taking medication, or have a medical condition.</em></p>
    `.trim().substring(0, 4000);
}

async function main() {
    console.log('='.repeat(70));
    console.log('eBay Listing - Update Description & Price');
    console.log('='.repeat(70));
    console.log('');
    
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
    const currentPrice = parseFloat(offer.pricingSummary?.price?.value || 0);
    const newPrice = 29.86;

    console.log(`✅ Found offer ID: ${offerId}`);
    console.log(`   Current price: $${currentPrice.toFixed(2)}`);
    console.log(`   New price: $${newPrice.toFixed(2)}`);
    console.log('');
    
    const seoDescription = generateSEODescription();
    console.log(`✅ SEO Description: ${seoDescription.length} characters\n`);

    // Shorten description if needed
    let finalDescription = seoDescription;
    if (finalDescription.length > 4000) {
        finalDescription = finalDescription.substring(0, 3997) + '...';
        console.log(`⚠️  Description truncated to 4000 characters`);
    }
    
    // Build update - preserve existing tax structure exactly
    const updatedOffer = {
        sku: offer.sku,
        marketplaceId: offer.marketplaceId,
        format: offer.format,
        listingPolicies: offer.listingPolicies,
        pricingSummary: {
            price: {
                value: newPrice.toFixed(2),
                currency: 'USD'
            }
        },
        categoryId: offer.categoryId,
        merchantLocationKey: offer.merchantLocationKey,
        quantity: offer.availableQuantity || 1,
        listingDescription: finalDescription,
        includeCatalogProductDetails: offer.includeCatalogProductDetails !== false,
        listingDuration: offer.listingDuration || 'GTC',
        hideBuyerDetails: offer.hideBuyerDetails || false,
        tax: {
            applyTax: true,
            vatPercentage: 0,
            thirdPartyTaxCategory: 'HEALTH_BEAUTY',
            salesTax: {
                salesTaxState: 'US',
                salesTaxPercent: 0.0,
                shippingAndHandlingTaxed: false
            }
        }
    };
    
    try {
        console.log('🔄 Updating offer...');
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
        console.log(`   New price: $${newPrice.toFixed(2)}`);
        console.log(`   SEO description updated (${seoDescription.length} chars)`);
        console.log(`   Offer ID: ${responseData.offerId || offerId}`);
        console.log('');
        console.log('💡 The listing will be updated. If it was already published, changes may take a few minutes to appear.');
        console.log('');
    } catch (error) {
        console.error('❌ Error updating offer:', error.message);
        process.exit(1);
    }
}

main().catch(error => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
});
