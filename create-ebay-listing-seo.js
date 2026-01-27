/**
 * Create New eBay Listing with SEO-Optimized Content
 * 
 * Creates a new listing with:
 * - SEO-optimized title
 * - Expanded SEO description (4000 chars)
 * - Price: $29.86 (40% margin)
 * 
 * Usage:
 *   node create-ebay-listing-seo.js <SKU>
 *   node create-ebay-listing-seo.js 10777-810
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
const PRICE = 29.86; // 40% margin

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
    return 'Success Chemistry Liver Cleanse Detox Support Formula - 60 Capsules';
}

/**
 * Generate SEO-optimized, well-formatted description (max 4000 chars for eBay)
 */
function generateSEODescription() {
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

/**
 * Parse weight string to number (pounds)
 */
function parseWeight(weightStr) {
    if (!weightStr) return 0.1875; // Default 3oz = 0.1875 lbs
    
    const match = weightStr.match(/(\d+\.?\d*)\s*(oz|lb|pound|pounds)/i);
    if (match) {
        const value = parseFloat(match[1]);
        const unit = match[2].toLowerCase();
        if (unit.includes('oz')) {
            return value / 16; // Convert oz to pounds
        }
        return value;
    }
    
    return 0.1875; // Default
}

/**
 * Parse dimensions string
 */
function parseDimensions(dimensionsStr) {
    if (!dimensionsStr) {
        return {
            length: 2,
            width: 2,
            height: 3.5,
            unit: 'INCH'
        };
    }
    
    const match = dimensionsStr.match(/(\d+\.?\d*)\s*(?:inches|inch|in)\s*(?:wide|w)\s*x\s*(\d+\.?\d*)\s*(?:inches|inch|in)\s*(?:tall|h)/i);
    if (match) {
        return {
            length: parseFloat(match[1]),
            width: parseFloat(match[1]),
            height: parseFloat(match[2]),
            unit: 'INCH'
        };
    }
    
    return {
        length: 2,
        width: 2,
        height: 3.5,
        unit: 'INCH'
    };
}

/**
 * Create inventory item
 */
async function createInventoryItem() {
    console.log('📦 Step 1: Creating inventory item...\n');
    
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
                'Key Ingredients': ['Milk Thistle', 'Dandelion Root', 'Artichoke Extract', 'Turmeric', 'Ginger'],
                'Target Audience': ['Adults'],
                'Health Concern': ['Liver Health', 'Detoxification', 'Digestive Support'],
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
            // Additional product details
            countryOfOrigin: 'US',
            // Include ingredients in description (already in SEO description)
            // Include formulation details (already in SEO description)
        },
        condition: 'NEW',
        conditionDescription: 'Brand new, factory sealed',
        packageWeightAndSize: {
            weight: {
                value: parseWeight(product.weight),
                unit: 'POUND'
            },
            dimensions: parseDimensions(product.dimensions)
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
            console.error(`❌ Error creating inventory item (${response.status}):`);
            if (responseData.errors && responseData.errors.length > 0) {
                responseData.errors.forEach(err => {
                    console.error(`   Error ${err.errorId}: ${err.message}`);
                    console.error(`   ${err.longMessage || ''}`);
                });
            }
            return false;
        }
        
        console.log('✅ Inventory item created successfully!');
        return true;
    } catch (error) {
        console.error('❌ Error creating inventory item:', error.message);
        return false;
    }
}

/**
 * Create offer (listing)
 */
async function createOffer() {
    console.log('📋 Step 2: Creating offer (listing)...\n');
    
    const seoDescription = generateSEODescription();
    
    const offer = {
        sku: product.sku,
        marketplaceId: 'EBAY_US',
        format: 'FIXED_PRICE',
        listingPolicies: {
            fulfillmentPolicyId: '83111818022', // Flat:USPS Priority(Free),2 business days
            paymentPolicyId: '258748124022', // eBay Payments
            returnPolicyId: '145517245022' // Returns Accepted, Buyer, 30 Days, Money back
        },
        pricingSummary: {
            price: {
                value: PRICE.toFixed(2),
                currency: 'USD'
            }
        },
        categoryId: '26395', // Try Health & Beauty > Vitamins & Supplements (alternative leaf category)
        merchantLocationKey: '29ffe3a3-8e8c-4085-a3e0-8c179586ba13',
        quantity: product.stock || 1,
        listingDescription: seoDescription,
        includeCatalogProductDetails: true,
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
        const response = await fetch(`${BASE_URL}/sell/inventory/v1/offer`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
                'Content-Type': 'application/json',
                'Content-Language': 'en-US',
                'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'
            },
            body: JSON.stringify(offer)
        });
        
        const responseText = await response.text();
        let responseData = {};
        
        try {
            responseData = JSON.parse(responseText);
        } catch {
            console.error('❌ Invalid JSON response:', responseText.substring(0, 500));
            return null;
        }
        
        if (!response.ok) {
            console.error(`❌ Error creating offer (${response.status}):`);
            console.error(JSON.stringify(responseData, null, 2));
            return null;
        }
        
        console.log('✅ Offer created successfully!');
        console.log(`   Offer ID: ${responseData.offerId}`);
        if (responseData.listingId) {
            console.log(`   Listing ID: ${responseData.listingId}`);
        }
        return responseData;
    } catch (error) {
        console.error('❌ Error creating offer:', error.message);
        return null;
    }
}

/**
 * Publish offer to make it live
 */
async function publishOffer(offerId) {
    console.log('🚀 Step 3: Publishing offer...\n');
    
    try {
        const response = await fetch(`${BASE_URL}/sell/inventory/v1/offer/${offerId}/publish`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
                'Content-Type': 'application/json',
                'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'
            }
        });
        
        const responseData = await response.json();
        
        if (!response.ok) {
            console.error(`❌ Error publishing offer (${response.status}):`);
            console.error(JSON.stringify(responseData, null, 2));
            return null;
        }
        
        console.log('✅ Offer published successfully!');
        if (responseData.listingId) {
            console.log(`   Listing ID: ${responseData.listingId}`);
            console.log(`   View listing: https://www.ebay.com/itm/${responseData.listingId}`);
        }
        return responseData;
    } catch (error) {
        console.error('❌ Error publishing offer:', error.message);
        return null;
    }
}

/**
 * Main function
 */
async function main() {
    console.log('='.repeat(70));
    console.log('eBay Listing Creator - SEO Optimized');
    console.log('='.repeat(70));
    console.log('');
    console.log(`Product: ${product.name.substring(0, 60)}...`);
    console.log(`SKU: ${product.sku}`);
    console.log(`Price: $${PRICE.toFixed(2)} (40% margin)`);
    console.log('');
    
    // Step 1: Create inventory item
    const inventoryCreated = await createInventoryItem();
    
    if (!inventoryCreated) {
        console.error('❌ Failed to create inventory item. Cannot proceed.');
        process.exit(1);
    }
    
    console.log('');
    
    // Step 2: Create offer
    const offer = await createOffer();
    
    if (!offer) {
        console.error('❌ Failed to create offer.');
        process.exit(1);
    }
    
    console.log('');
    
    // Step 3: Publish offer
    const published = await publishOffer(offer.offerId);
    
    if (!published) {
        console.log('⚠️  Offer created but not published. You can publish it manually later.');
        console.log(`   Run: node publish-ebay-offer.js ${SKU}`);
    }
    
    console.log('');
    console.log('='.repeat(70));
    console.log('✅ Listing created successfully!');
    console.log('='.repeat(70));
    console.log('');
    console.log('📊 Summary:');
    console.log(`   ✅ SEO-optimized title: ${generateSEOTitle()}`);
    console.log(`   ✅ SEO-optimized description: ${generateSEODescription().length} characters`);
    console.log(`   ✅ Price: $${PRICE.toFixed(2)}`);
    console.log(`   ✅ Expected profit margin: ~40%`);
    console.log('');
}

main().catch(error => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
});
