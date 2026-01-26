/**
 * Create eBay 2-Pack Listing with New SEO Keywords
 * 
 * Creates a 2-pack listing with:
 * - 2-bottle hero image
 * - New SEO-optimized title (2-pack focused)
 * - New SEO description with different long-tail keywords
 * - Better value pricing
 * 
 * Usage:
 *   node create-ebay-listing-2pack.js
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
const SKU = '10777-810-2'; // 2-pack variant SKU
const PRICE = 55.72; // 2-pack price (slight discount from 2x $29.86 = $59.72)

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

const product = PRODUCTS_DATA['10777-810']; // Base product
if (!product) {
    console.error(`❌ Base product 10777-810 not found`);
    process.exit(1);
}

/**
 * Generate SEO-optimized title for 2-pack (80 characters max)
 */
function generateSEOTitle() {
    return 'Success Chemistry Liver Cleanse 2-Pack - Milk Thistle Detox Formula - 120 Caps';
}

/**
 * Generate NEW SEO-optimized description with different long-tail keywords
 * Targets: "milk thistle liver support", "dandelion root detox", "liver health supplements for adults"
 */
function generateSEODescription() {
    return `
<h2>🌿 Success Chemistry Liver Cleanse 2-Pack - Premium Liver Support & Detox Formula</h2>

<p><strong>Get Maximum Value with Our 2-Bottle Bundle - 60 Days of Premium Liver Support!</strong></p>

<p>This exclusive 2-pack bundle offers exceptional value for anyone serious about supporting their liver health. Success Chemistry Liver Cleanse combines the most researched botanical extracts for comprehensive liver support, natural detoxification, and optimal digestive wellness. Each bottle contains 60 vegetarian capsules, providing a full 30-day supply - this 2-pack gives you a complete 60-day liver support program.</p>

<h3>💎 Why Choose the 2-Pack Bundle?</h3>

<ul>
<li><strong>Better Value:</strong> Save money compared to buying two bottles separately</li>
<li><strong>60-Day Supply:</strong> Complete liver support program with consistent daily use</li>
<li><strong>Never Run Out:</strong> Always have your next bottle ready when you need it</li>
<li><strong>Optimal Results:</strong> Extended use allows your liver to fully benefit from the natural detoxification support</li>
</ul>

<h3>✨ Comprehensive Liver Health Benefits</h3>

<ul>
<li><strong>Milk Thistle Liver Support:</strong> Silymarin, the active compound in Milk Thistle, is extensively researched for its ability to support healthy liver function and protect liver cells from oxidative stress. This is one of the most trusted natural ingredients for liver health support.</li>
<li><strong>Dandelion Root Detox Support:</strong> Traditionally used for centuries to support the body's natural detoxification processes, dandelion root aids in healthy bile production and promotes optimal liver and kidney function.</li>
<li><strong>Artichoke Extract for Digestive Health:</strong> Supports healthy digestion and liver function while helping maintain cholesterol levels already within normal range. Works synergistically with other ingredients for comprehensive support.</li>
<li><strong>Turmeric & Ginger Antioxidant Protection:</strong> These powerful antioxidants help maintain a healthy inflammatory response in the liver and throughout the body, providing additional cellular protection.</li>
<li><strong>Complete Botanical Formula:</strong> Includes Alfalfa, Burdock Root, Celery Powder, Feverfew, Grape Seed Extract, and more for holistic liver wellness support.</li>
</ul>

<h3>🔬 Premium Ingredient Profile (Per Serving)</h3>

<p><strong>Milk Thistle Extract (300mg):</strong> The cornerstone of this formula, Silymarin is one of the most studied liver-supporting compounds. Research shows it helps protect liver cells and supports healthy liver regeneration processes.</p>

<p><strong>Dandelion Root (200mg):</strong> A traditional liver and kidney support herb that aids natural detoxification and promotes healthy bile production, essential for optimal digestive function.</p>

<p><strong>Artichoke Extract (150mg):</strong> Supports healthy digestion and liver function. Clinical studies suggest artichoke helps maintain healthy cholesterol levels already within normal range.</p>

<p><strong>Turmeric Extract (100mg):</strong> Provides powerful antioxidant support and helps maintain a healthy inflammatory response throughout the body, including liver tissues.</p>

<p><strong>Ginger Extract (50mg):</strong> Supports digestive health and works in synergy with other ingredients to promote optimal liver function and overall wellness.</p>

<h3>📋 Complete Supplement Facts</h3>

<p><strong>Serving Size:</strong> 2 Capsules | <strong>Servings Per Bottle:</strong> 30 | <strong>Total Servings (2-Pack):</strong> 60</p>

<p><strong>Key Ingredients Per Serving:</strong> Milk Thistle Extract (300mg), Dandelion Root (200mg), Artichoke Extract (150mg), Turmeric Extract (100mg), Ginger Extract (50mg), Alfalfa (50mg), Burdock Root (50mg), Vitamin C (60mg), Selenium (100mcg)</p>

<h3>💊 Suggested Use for Optimal Results</h3>

<p>As a dietary supplement, take two (2) veggie capsules once daily after a meal with an 8oz. glass of water or as directed by your healthcare professional. For best results with this 2-pack, maintain consistent daily use throughout the 60-day period to allow your liver to fully benefit from the natural detoxification support.</p>

<h3>✅ Premium Quality Assurance</h3>

<p>✅ Made in the USA in a GMP-certified facility | ✅ Non-GMO ingredients | ✅ Vegetarian capsules (no gelatin) | ✅ Third-party tested for purity and potency | ✅ No artificial colors, flavors, or preservatives | ✅ Gluten-free and dairy-free | ✅ Quality guaranteed</p>

<h3>🎯 Who Benefits Most from This 2-Pack?</h3>

<p>This comprehensive 2-pack is ideal for adults seeking extended liver support, including those who want to maintain healthy liver function, support their body's natural detoxification processes, promote digestive wellness, enhance antioxidant protection, maintain a healthy inflammatory response, or incorporate liver support into a long-term wellness routine. Perfect for anyone committed to a 60-day liver health program.</p>

<h3>📦 What's Included in This 2-Pack</h3>

<p>You'll receive two (2) full-size bottles, each containing 60 easy-to-swallow vegetarian capsules. This provides a complete 60-day supply when taken as directed - perfect for a comprehensive liver support program without the need to reorder.</p>

<h3>🏆 Why Success Chemistry Liver Cleanse?</h3>

<p>Success Chemistry is dedicated to providing premium-quality supplements backed by scientific research and manufactured to the highest industry standards. Our Liver Cleanse 2-pack formula is carefully crafted with the finest botanical extracts to support your long-term liver wellness journey. This bundle offers exceptional value for those committed to maintaining optimal liver health.</p>

<p><strong>Order your 2-pack today and experience the comprehensive benefits of extended liver support with maximum value!</strong></p>

<p><em>*These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease. Consult with your healthcare provider before starting any new supplement regimen, especially if you are pregnant, nursing, taking medication, or have a medical condition.</em></p>
    `.trim().substring(0, 4000);
}

/**
 * Parse weight for 2-pack (double the single)
 */
function parseWeight(weightStr) {
    if (!weightStr) return 0.375; // 2x 3oz = 6oz = 0.375 lbs
    
    const match = weightStr.match(/(\d+\.?\d*)\s*(oz|lb|pound|pounds)/i);
    if (match) {
        const value = parseFloat(match[1]) * 2; // Double for 2-pack
        const unit = match[2].toLowerCase();
        if (unit.includes('oz')) {
            return value / 16; // Convert oz to pounds
        }
        return value;
    }
    
    return 0.375; // Default
}

/**
 * Parse dimensions for 2-pack
 */
function parseDimensions(dimensionsStr) {
    // 2-pack will be slightly larger
    return {
        length: 4,
        width: 2,
        height: 3.5,
        unit: 'INCH'
    };
}

/**
 * Create inventory item
 */
async function createInventoryItem() {
    console.log('📦 Step 1: Creating inventory item for 2-pack...\n');
    
    const seoTitle = generateSEOTitle();
    const seoDescription = generateSEODescription();
    
    console.log(`✅ SEO Title (${seoTitle.length} chars): ${seoTitle}`);
    console.log(`✅ SEO Description: ${seoDescription.length} characters`);
    console.log(`✅ Targeting: milk thistle liver support, dandelion root detox, liver health supplements\n`);
    
    // Use image 02.png as hero (assuming it shows 2 bottles)
    // If not, we'll use 01.png but note it's a 2-pack
    const images = product.images ? product.images.map(img => {
        if (img.startsWith('http')) return img;
        return `https://successchemistry.com${img}`;
    }) : [];
    
    // Reorder images to put 02.png first (2-bottle image)
    const reorderedImages = [];
    const twoBottleImage = images.find(img => img.includes('02.png'));
    if (twoBottleImage) {
        reorderedImages.push(twoBottleImage);
        images.forEach(img => {
            if (img !== twoBottleImage) reorderedImages.push(img);
        });
    } else {
        reorderedImages.push(...images);
    }
    
    const inventoryItem = {
        sku: SKU,
        product: {
            title: seoTitle,
            description: seoDescription,
            aspects: {
                'Brand': ['Success Chemistry'],
                'Product Type': ['Dietary Supplements'],
                'Form': ['Capsules'],
                'Size': ['120 Count', '2-Pack'],
                'Key Ingredients': ['Milk Thistle', 'Dandelion Root', 'Artichoke Extract', 'Turmeric', 'Ginger'],
                'Target Audience': ['Adults'],
                'Health Concern': ['Liver Health', 'Detoxification', 'Digestive Support'],
                'Package Quantity': ['2']
            },
            imageUrls: reorderedImages.slice(0, 12),
            brand: 'Success Chemistry',
            mpn: SKU
        },
        condition: 'NEW',
        conditionDescription: 'Brand new, factory sealed - 2-pack bundle',
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
        const response = await fetch(`${BASE_URL}/sell/inventory/v1/inventory_item/${SKU}`, {
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
    console.log('📋 Step 2: Creating offer (listing) for 2-pack...\n');
    
    const seoDescription = generateSEODescription();
    
    const offer = {
        sku: SKU,
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
        categoryId: '26395', // Health & Beauty > Vitamins & Supplements
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
 * Main function
 */
async function main() {
    console.log('='.repeat(70));
    console.log('eBay 2-Pack Listing Creator - New SEO Keywords');
    console.log('='.repeat(70));
    console.log('');
    console.log(`Product: Liver Cleanse 2-Pack`);
    console.log(`SKU: ${SKU}`);
    console.log(`Price: $${PRICE.toFixed(2)} (2-pack value)`);
    console.log(`Hero Image: 2-bottle image (02.png)`);
    console.log(`SEO Focus: New long-tail keywords`);
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
    console.log('='.repeat(70));
    console.log('✅ 2-Pack Listing Created Successfully!');
    console.log('='.repeat(70));
    console.log('');
    console.log('📊 Summary:');
    console.log(`   ✅ SEO Title: ${generateSEOTitle()}`);
    console.log(`   ✅ SEO Description: ${generateSEODescription().length} characters`);
    console.log(`   ✅ Price: $${PRICE.toFixed(2)} (2-pack bundle)`);
    console.log(`   ✅ Hero Image: 2-bottle image`);
    console.log(`   ✅ New Keywords: milk thistle liver support, dandelion root detox, liver health supplements`);
    console.log('');
    console.log('💡 Next Steps:');
    console.log('   1. Check offer in eBay Seller Hub (Drafts/Unsold)');
    console.log('   2. Set correct category if needed');
    console.log('   3. Publish the listing');
    console.log('');
}

main().catch(error => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
});
