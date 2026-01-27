/**
 * Update eBay Listing for Prostate Renew with SEO-Optimized Content
 * 
 * Updates existing listing with:
 * - SEO-optimized title
 * - Expanded SEO description
 * - Price: $29.86 (same as other single products)
 * 
 * Usage:
 *   node update-ebay-listing-prostate.js
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
const SKU = '14179-504';
const PRICE = 29.86; // Same as other single products

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

/**
 * Generate SEO-optimized title (80 characters max for eBay)
 */
function generateSEOTitle() {
    return 'Success Chemistry Prostate Renew - Saw Palmetto Formula - 60 Capsules';
}

/**
 * Generate SEO-optimized, well-formatted description (max 4000 chars for eBay)
 */
function generateSEODescription() {
    return `
<h2>👨 Success Chemistry Prostate Renew - Premium Prostate Health & Urinary Support</h2>

<p><strong>Support Your Prostate Health Naturally - Advanced Formula for Men's Wellness</strong></p>

<p>Success Chemistry Prostate Renew is a premium dietary supplement specifically formulated to support men's prostate health and urinary function. This advanced natural formula combines time-tested herbal ingredients including Saw Palmetto, Quercetin, and Juniper - traditional herbs that have been used for centuries to support prostate wellness and maintain healthy urinary flow. Ideal for men over 40 or anyone seeking natural prostate support, this supplement helps reduce frequent nighttime bathroom trips, supports stronger urinary flow, and promotes optimal prostate function.</p>

<h3>✨ Key Benefits & Features</h3>

<ul>
<li><strong>Supports Healthy Urinary Flow:</strong> Saw Palmetto and Uva Ursi work together to help relieve bladder pressure, promoting smoother, stronger urine flow and reducing disruptions during sleep and daily activities.</li>
<li><strong>Reduces Nighttime Bathroom Trips:</strong> Helps reduce frequent nighttime urination, allowing for better sleep and improved daily comfort and confidence.</li>
<li><strong>Prostate Health Support:</strong> Contains Saw Palmetto Extract (320mg) and Pumpkin Seed Oil, traditionally used to maintain normal prostate size and function for long-term wellness.</li>
<li><strong>Anti-Inflammatory Support:</strong> Quercetin (250mg) and Burdock Root provide powerful antioxidant support to help maintain a healthy inflammatory response and reduce prostate discomfort.</li>
<li><strong>Natural Urinary Tract Support:</strong> Juniper Berry and Uva Ursi assist with urinary health, gentle detox, and overall tract comfort.</li>
<li><strong>Comprehensive Men's Health Formula:</strong> Includes Beta-Sitosterol, Zinc, Vitamin D3, and Vitamin B6 for holistic prostate and urinary support.</li>
<li><strong>Premium Quality:</strong> Made in the USA in a GMP-certified facility with non-GMO ingredients and vegetarian capsules.</li>
</ul>

<h3>🔬 Premium Ingredient Profile</h3>

<p><strong>Saw Palmetto Extract (320mg):</strong> One of the most researched and trusted herbs for prostate health. Saw Palmetto has been traditionally used for centuries to support urinary function and prostate health. Research suggests it helps maintain healthy prostate size and supports normal urinary flow, making it essential for men's prostate wellness.</p>

<p><strong>Quercetin (250mg):</strong> A powerful flavonoid antioxidant that helps maintain a healthy inflammatory response. Quercetin supports prostate health by reducing oxidative stress and helping to calm inflammation that can contribute to prostate discomfort. It works synergistically with other ingredients for comprehensive support.</p>

<p><strong>Pumpkin Seed Oil (200mg):</strong> Rich in phytosterols and essential fatty acids, Pumpkin Seed Oil has been traditionally used to support prostate function and maintain healthy prostate size. It provides natural support for long-term prostate wellness.</p>

<p><strong>Juniper Berry Extract (150mg):</strong> Traditionally used to support urinary tract health and assist with natural detoxification. Juniper helps maintain healthy urinary function and supports the body's natural cleansing processes.</p>

<p><strong>Uva Ursi Extract (100mg):</strong> A traditional herb known for supporting urinary tract health. Uva Ursi helps maintain healthy urinary function and provides gentle support for urinary comfort.</p>

<p><strong>Burdock Root (100mg):</strong> Supports healthy inflammatory balance and provides antioxidant support. Burdock Root works with Quercetin to help maintain a healthy inflammatory response in the prostate and urinary tract.</p>

<p><strong>Beta-Sitosterol (50mg):</strong> A plant sterol that supports prostate health and helps maintain healthy urinary flow. Beta-Sitosterol is one of the most studied natural compounds for prostate support.</p>

<p><strong>Essential Nutrients:</strong> Includes Zinc (15mg) for immune support, Vitamin D3 (1000 IU) for overall health, and Vitamin B6 (10mg) for metabolic support - all essential for men's wellness.</p>

<h3>📋 Complete Supplement Facts</h3>

<p><strong>Serving Size:</strong> 2 Capsules | <strong>Servings Per Container:</strong> 30</p>

<p><strong>Key Ingredients Per Serving:</strong> Saw Palmetto Extract (320mg), Quercetin (250mg), Pumpkin Seed Oil (200mg), Juniper Berry Extract (150mg), Uva Ursi Extract (100mg), Burdock Root (100mg), Beta-Sitosterol (50mg), Zinc (15mg), Vitamin D3 (1000 IU), Vitamin B6 (10mg)</p>

<h3>💊 Suggested Use</h3>

<p>As a dietary supplement, take two (2) veggie capsules once a day after a meal with an 8oz. glass of water or as directed by your healthcare professional. Taking with food helps with absorption and ensures optimal results. For best results, maintain consistent daily use for at least 60-90 days to allow the herbs to fully support your prostate health. Most users notice improvements in urinary flow and reduced nighttime trips within 2-4 weeks of consistent use.</p>

<h3>✅ Quality Assurance</h3>

<p>✅ Made in the USA in a GMP-certified facility | ✅ Non-GMO ingredients | ✅ Vegetarian capsules (no gelatin) | ✅ Third-party tested for purity and potency | ✅ No artificial colors, flavors, or preservatives | ✅ Gluten-free and dairy-free | ✅ High-quality, natural ingredients | ✅ Free from common allergens</p>

<h3>🎯 Who Can Benefit?</h3>

<p>This formula is ideal for men looking to support their prostate health naturally, including men over 40 seeking proactive prostate support, those experiencing frequent nighttime bathroom trips, individuals looking to improve urinary flow and control, men seeking natural alternatives for prostate wellness, those wanting to reduce prostate discomfort, or anyone committed to maintaining optimal men's health as part of a healthy lifestyle. Perfect for men who want to feel more confident, active, and comfortable.</p>

<h3>📦 What's Included</h3>

<p>Each bottle contains 60 easy-to-swallow vegetarian capsules, providing a full 30-day supply when taken as directed. With consistent use, you'll have everything you need to support your journey to better prostate health, improved urinary flow, and enhanced daily comfort.</p>

<h3>🏆 Why Choose Success Chemistry Prostate Renew?</h3>

<p>Success Chemistry is committed to providing premium-quality supplements backed by traditional herbal wisdom and modern nutritional science. Our Prostate Renew formula is carefully crafted with the finest herbal extracts and nutrients to support your men's health journey. This comprehensive formula addresses multiple aspects of prostate and urinary health - from supporting healthy prostate function and urinary flow to reducing nighttime disruptions and promoting overall men's wellness.</p>

<p><strong>Thousands of men trust this prostate supplement for real results. Experience the benefits of natural prostate support with Success Chemistry Prostate Renew. Take control of your comfort and confidence today!</strong></p>

<p><em>*These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease. Consult with your healthcare provider before starting any new supplement regimen, especially if you are pregnant, nursing, taking medication, or have a medical condition.</em></p>
    `.trim().substring(0, 4000);
}

/**
 * Update inventory item with new SEO content
 */
async function updateInventoryItem() {
    console.log('📦 Step 1: Updating inventory item with SEO content...\n');
    
    const seoTitle = generateSEOTitle();
    const seoDescription = generateSEODescription();
    
    console.log(`✅ SEO Title (${seoTitle.length} chars): ${seoTitle}`);
    console.log(`✅ SEO Description: ${seoDescription.length} characters\n`);
    
    const inventoryItem = {
        sku: product.sku,
        product: {
            title: seoTitle,
            description: seoDescription,
            aspects: {
                'Brand': ['Success Chemistry'],
                'Product Type': ['Dietary Supplements'],
                'Form': ['Capsules'],
                'Size': ['60 Count'],
                'Capsule Count': ['60'],
                'Key Ingredients': ['Saw Palmetto', 'Quercetin', 'Pumpkin Seed Oil', 'Juniper', 'Uva Ursi'],
                'Target Audience': ['Men', 'Adults'],
                'Health Concern': ['Prostate Health', 'Urinary Health', 'Men\'s Health'],
                'Main Purpose': ['Prostate Support', 'Urinary Flow'],
                'Shade': ['Not Applicable'],
                'Type': ['Dietary Supplement'],
                'Country/Region of Manufacture': ['United States'],
                'Country of Origin': ['United States']
            },
            imageUrls: product.images ? product.images.map(img => {
                if (img.startsWith('http')) return img;
                return `https://successchemistry.com${img}`;
            }).slice(0, 12) : [],
            brand: 'Success Chemistry',
            mpn: product.sku,
            productIdentifiers: (product.gtin || product.upc) ? {
                upc: [product.gtin || product.upc]
            } : undefined,
            countryOfOrigin: 'US'
        },
        condition: 'NEW',
        conditionDescription: 'Brand new, factory sealed',
        packageWeightAndSize: {
            weight: {
                value: 0.1875, // 3oz = 0.1875 lbs
                unit: 'POUND'
            },
            dimensions: {
                length: 2,
                width: 2,
                height: 3.5,
                unit: 'INCH'
            }
        },
        availability: {
            shipToLocationAvailability: {
                quantity: product.stock || 1
            }
        }
    };
    
    try {
        const response = await fetch(`${BASE_URL}/sell/inventory/v1/inventory_item/${product.sku}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
                'Content-Type': 'application/json',
                'Content-Language': 'en-US',
                'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'
            },
            body: JSON.stringify(inventoryItem)
        });
        
        const responseText = await response.text();
        let responseData = {};
        
        try {
            responseData = responseText ? JSON.parse(responseText) : {};
        } catch (e) {
            console.error('❌ Invalid JSON response:', responseText.substring(0, 500));
            return false;
        }
        
        if (!response.ok) {
            console.error(`❌ Error updating inventory item (${response.status}):`);
            if (responseData.errors && responseData.errors.length > 0) {
                responseData.errors.forEach(err => {
                    console.error(`   Error ${err.errorId}: ${err.message}`);
                });
            }
            return false;
        }
        
        console.log('✅ Inventory item updated successfully!');
        return true;
    } catch (error) {
        console.error('❌ Error updating inventory item:', error.message);
        return false;
    }
}

/**
 * Update offer with new price and SEO description
 */
async function updateOffer() {
    console.log('📋 Step 2: Updating offer with new price and SEO content...\n');
    
    // First, get the current offer
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
        return false;
    }

    const offer = getData.offers[0];
    const offerId = offer.offerId;

    console.log(`✅ Found offer ID: ${offerId}`);
    console.log(`   Current price: $${offer.pricingSummary?.price?.value || 'N/A'}`);
    console.log(`   New price: $${PRICE.toFixed(2)}\n`);

    const seoDescription = generateSEODescription();
    
    console.log(`✅ SEO Description: ${seoDescription.length} characters\n`);
    
    // Update the offer with new price and SEO content
    const updatedOffer = {
        sku: product.sku,
        marketplaceId: 'EBAY_US',
        format: offer.format || 'FIXED_PRICE',
        listingPolicies: offer.listingPolicies,
        pricingSummary: {
            price: {
                value: PRICE.toFixed(2),
                currency: 'USD'
            }
        },
        categoryId: offer.categoryId || '180960',
        merchantLocationKey: offer.merchantLocationKey,
        quantity: offer.availableQuantity || product.stock || 1,
        listingDescription: seoDescription,
        includeCatalogProductDetails: true
        // Omit tax field - let eBay use existing tax configuration
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

        const responseText = await response.text();
        let responseData = {};
        
        try {
            responseData = responseText ? JSON.parse(responseText) : {};
        } catch {
            console.error('❌ Invalid JSON response:', responseText.substring(0, 500));
            return false;
        }

        if (!response.ok) {
            console.error(`❌ Error updating offer (${response.status}):`);
            console.error(JSON.stringify(responseData, null, 2));
            return false;
        }

        console.log('✅ Offer updated successfully!');
        console.log(`   New price: $${PRICE.toFixed(2)}`);
        console.log(`   Offer ID: ${responseData.offerId || offerId}`);
        if (responseData.listingId) {
            console.log(`   Listing ID: ${responseData.listingId}`);
        }
        
        return true;
    } catch (error) {
        console.error('❌ Error updating offer:', error.message);
        return false;
    }
}

/**
 * Main function
 */
async function main() {
    console.log('='.repeat(70));
    console.log('eBay Listing Update - Prostate Renew (Single)');
    console.log('='.repeat(70));
    console.log('');
    console.log(`Product: ${product.name.substring(0, 60)}...`);
    console.log(`SKU: ${product.sku}`);
    console.log(`Price: $${PRICE.toFixed(2)} (same as other single products)`);
    console.log('');
    
    // Step 1: Update inventory item
    const inventoryUpdated = await updateInventoryItem();
    
    if (!inventoryUpdated) {
        console.log('⚠️  Inventory item update had issues, but continuing with offer update...\n');
    }
    
    // Step 2: Update offer
    const offerUpdated = await updateOffer();
    
    if (!offerUpdated) {
        console.error('❌ Failed to update offer.');
        process.exit(1);
    }
    
    console.log('');
    console.log('='.repeat(70));
    console.log('✅ Listing Updated Successfully!');
    console.log('='.repeat(70));
    console.log('');
    console.log('📊 Summary:');
    console.log(`   ✅ SEO-optimized title: ${generateSEOTitle()}`);
    console.log(`   ✅ SEO-optimized description: ${generateSEODescription().length} characters`);
    console.log(`   ✅ Price: $${PRICE.toFixed(2)}`);
    console.log(`   ✅ SEO Focus: Prostate health, saw palmetto, urinary flow, nighttime trips`);
    console.log('');
    console.log('💡 Next Steps:');
    console.log('   1. Check the listing in eBay Seller Hub');
    console.log('   2. Publish if needed: node publish-ebay-offer.js ' + SKU);
    console.log('');
}

main().catch(error => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
});
