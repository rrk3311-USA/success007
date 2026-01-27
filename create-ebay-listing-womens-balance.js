/**
 * Create eBay Listing for Women's Balance
 * 
 * Creates a listing with:
 * - SEO-optimized title
 * - Expanded SEO description
 * - Price: $29.86 (same as Liver Cleanse)
 * 
 * Usage:
 *   node create-ebay-listing-womens-balance.js
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
const SKU = '52274-401';
const PRICE = 29.86; // Same as Liver Cleanse

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
    return 'Success Chemistry Women\'s Balance - Female Libido Support - 60 Capsules';
}

/**
 * Generate SEO-optimized, well-formatted description (max 4000 chars for eBay)
 */
function generateSEODescription() {
    return `
<h2>💜 Success Chemistry Women's Balance - Premium Female Libido & Arousal Support</h2>

<p><strong>Rediscover Your Confidence, Energy & Intimate Wellness</strong></p>

<p>Success Chemistry Women's Balance is thoughtfully crafted to support feminine wellness from the inside out. Modern life, stress, and hormonal changes can affect energy, mood, and responsiveness. This advanced formula combines time-honored botanicals with modern nutritional science to help support your body's natural balance so you can feel more in tune with yourself.</p>

<h3>✨ Key Benefits & Features</h3>

<ul>
<li><strong>Supports Female Arousal & Intimate Wellness:</strong> This unique blend is designed to help support natural arousal, response, and intimate wellness through carefully selected botanical extracts and nutrients.</li>
<li><strong>L-Arginine for Healthy Circulation:</strong> Formulated with 500mg of L-Arginine per serving to support healthy blood flow, which is essential for overall wellness and vitality.</li>
<li><strong>Premium Botanical Blend:</strong> Includes Maca root, Ashwagandha, Ginseng, and Damiana - traditional herbs that have been used for centuries to support vitality and female wellness.</li>
<li><strong>Energy & Vitality Support:</strong> Enriched with essential B-vitamins, Vitamin A, and Zinc to help support energy metabolism and overall health.</li>
<li><strong>Enhanced Absorption:</strong> Features BioPerine® black pepper extract to enhance nutrient absorption and maximize the benefits of all ingredients.</li>
<li><strong>Premium Quality:</strong> Made in the USA in a GMP-compliant facility with non-GMO ingredients and vegetarian capsules.</li>
</ul>

<h3>🔬 Premium Ingredient Profile</h3>

<p><strong>L-Arginine (500mg):</strong> An amino acid that supports healthy blood flow and circulation, which is essential for overall wellness and vitality.</p>

<p><strong>Proprietary Botanical Blend (600mg):</strong> A comprehensive blend including Epimedium, Tribulus, Catuaba, Dong Quai, Ginkgo, Asian Ginseng, Damiana, Turmeric, Ashwagandha, Ginger, Maca, Muira Puama, L-Phenylalanine, Asparagus Extract, and Chinese Smilax. These traditional herbs have been used for centuries to support vitality and female wellness.</p>

<p><strong>Maca Root:</strong> Traditionally used to support energy, mood, and hormonal balance. Maca is one of the most researched botanicals for female wellness support.</p>

<p><strong>Ashwagandha:</strong> An adaptogenic herb that helps support the body's response to stress and promotes overall balance and wellness.</p>

<p><strong>Ginseng:</strong> Known for supporting energy, vitality, and overall wellness. Asian Ginseng has been used in traditional wellness practices for centuries.</p>

<p><strong>Damiana:</strong> A traditional herb that has been used to support female wellness, mood, and overall vitality.</p>

<h3>📋 Complete Supplement Facts</h3>

<p><strong>Serving Size:</strong> 2 Capsules | <strong>Servings Per Container:</strong> 30</p>

<p><strong>Key Ingredients Per Serving:</strong> Vitamin A (2500 IU), Thiamin (2mg), Niacin (20mg), Vitamin B6 (5mg), Vitamin B12 (25mcg), Pantothenic Acid (10mg), Zinc (15mg), L-Arginine (500mg), BioPerine® Black Pepper Extract (5mg), Proprietary Botanical Blend (600mg)</p>

<h3>💊 Suggested Use</h3>

<p>As a dietary supplement, take two (2) veggie capsules once a day after a meal with an 8oz. glass of water or as directed by your healthcare professional. For best results, maintain consistent daily use as part of a healthy lifestyle.</p>

<h3>✅ Quality Assurance</h3>

<p>✅ Made in the USA in a GMP-compliant facility | ✅ Non-GMO ingredients | ✅ Vegetarian capsules (no gelatin) | ✅ Quality tested for purity and potency | ✅ No artificial colors, flavors, or preservatives | ✅ Clean, thoughtful formulation</p>

<h3>🎯 Who Can Benefit?</h3>

<p>This formula is ideal for women looking to support their natural balance, enhance energy and vitality, support intimate wellness, maintain hormonal balance, improve mood and responsiveness, or incorporate natural wellness support into their daily routine. Perfect for women of all ages seeking to feel more confident, balanced, and in tune with themselves.</p>

<h3>📦 What's Included</h3>

<p>Each bottle contains 60 easy-to-swallow vegetarian capsules, providing a full 30-day supply when taken as directed. With 30 servings per bottle, it fits seamlessly into your routine to support long-term wellness goals.</p>

<h3>🏆 Why Choose Success Chemistry Women's Balance?</h3>

<p>Success Chemistry is committed to providing premium-quality supplements backed by science and manufactured to the highest standards. Our Women's Balance formula is thoughtfully crafted with the finest botanical extracts and nutrients to support your feminine wellness journey. This clean, natural formula is designed to help you rediscover balance, confidence, and connection.</p>

<p><strong>Order today and experience the difference premium female wellness support can make in your life!</strong></p>

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
                'Key Ingredients': ['L-Arginine', 'Maca', 'Ashwagandha', 'Ginseng', 'Damiana'],
                'Target Audience': ['Women', 'Adults'],
                'Health Concern': ['Women\'s Health', 'Hormonal Balance', 'Energy Support'],
                'Main Purpose': ['Sexual Health'],
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
            fulfillmentPolicyId: '83111818022',
            paymentPolicyId: '258748124022',
            returnPolicyId: '145517245022'
        },
        pricingSummary: {
            price: {
                value: PRICE.toFixed(2),
                currency: 'USD'
            }
        },
        categoryId: '180960', // Health & Beauty > Vitamins & Dietary Supplements
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
    console.log('eBay Listing Creator - Women\'s Balance');
    console.log('='.repeat(70));
    console.log('');
    console.log(`Product: ${product.name.substring(0, 60)}...`);
    console.log(`SKU: ${product.sku}`);
    console.log(`Price: $${PRICE.toFixed(2)} (same as Liver Cleanse)`);
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
    console.log('✅ Listing Created Successfully!');
    console.log('='.repeat(70));
    console.log('');
    console.log('📊 Summary:');
    console.log(`   ✅ SEO-optimized title: ${generateSEOTitle()}`);
    console.log(`   ✅ SEO-optimized description: ${generateSEODescription().length} characters`);
    console.log(`   ✅ Price: $${PRICE.toFixed(2)}`);
    console.log('');
}

main().catch(error => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
});
