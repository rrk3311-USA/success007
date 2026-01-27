/**
 * Create eBay Listing for Sclera White 2-Pack
 * 
 * Creates a 2-pack listing with:
 * - 2-bottle hero image
 * - SEO-optimized title (2-pack focused)
 * - SEO description with different long-tail keywords
 * - Better value pricing
 * 
 * Usage:
 *   node create-ebay-listing-sclera-2pack.js
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
const SKU = '10786-807-2'; // 2-pack variant SKU
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

const product = PRODUCTS_DATA['10786-807']; // Base product
if (!product) {
    console.error(`❌ Base product 10786-807 not found`);
    process.exit(1);
}

/**
 * Generate SEO-optimized title for 2-pack (80 characters max)
 */
function generateSEOTitle() {
    return 'Success Chemistry Sclera White 2-Pack - Eye Whitening Formula - 120 Caps';
}

/**
 * Generate SEO-optimized description with different long-tail keywords
 * Targets: "eye whitening 2 pack", "sclera white bundle", "brighter eyes value pack"
 */
function generateSEODescription() {
    return `
<h2>👁️ Success Chemistry Sclera White 2-Pack - Premium Eye Whitening & Beauty Bundle</h2>

<p><strong>Get Maximum Value with Our 2-Bottle Bundle - 60 Days of Premium Eye Brightening Support!</strong></p>

<p>This exclusive 2-pack bundle offers exceptional value for anyone serious about achieving brighter, whiter-looking eyes naturally. Success Chemistry Sclera White combines Eyebright and Lutein - two of nature's most effective ingredients for supporting ocular health and promoting brighter, clearer-looking eyes. Each bottle contains 60 vegetarian capsules, providing a full 30-day supply - this 2-pack gives you a complete 60-day eye whitening program.</p>

<h3>💎 Why Choose the 2-Pack Bundle?</h3>

<ul>
<li><strong>Better Value:</strong> Save money compared to buying two bottles separately</li>
<li><strong>60-Day Supply:</strong> Complete eye whitening program with consistent daily use</li>
<li><strong>Never Run Out:</strong> Always have your next bottle ready when you need it</li>
<li><strong>Optimal Results:</strong> Extended use allows your eyes to fully benefit from the natural brightening support</li>
</ul>

<h3>✨ Comprehensive Eye Whitening Benefits</h3>

<ul>
<li><strong>Natural Eye Whitening Support:</strong> Helps reduce the appearance of yellowing and redness in the sclera (white part of the eye) through targeted nutritional support. This 2-pack provides extended support for lasting results.</li>
<li><strong>Eyebright for Eye Clarity:</strong> Traditionally used for centuries to support eye health, Eyebright helps reduce eye irritation and redness while promoting clearer vision. Consistent use over 60 days maximizes these benefits.</li>
<li><strong>Lutein for Macular Health:</strong> This powerful carotenoid filters harmful blue light and supports macular health, helping protect your eyes from digital screen damage. Essential for anyone spending time on computers or mobile devices.</li>
<li><strong>Comprehensive Eye Nutrition:</strong> Includes Zeaxanthin, Bilberry Extract, Vitamin A, C, E, and essential B-vitamins for complete ocular support throughout your 60-day program.</li>
<li><strong>Antioxidant Protection:</strong> Rich in antioxidants including Lycopene, Grape Extract, and Alpha Lipoic Acid to protect eye tissues from oxidative stress and support long-term eye health.</li>
</ul>

<h3>🔬 Premium Ingredient Profile (Per Serving)</h3>

<p><strong>Lutein (20mg equivalent):</strong> One of the most researched nutrients for eye health. Lutein accumulates in the macula and helps filter high-energy blue light from digital devices, reducing eye strain and supporting long-term eye health. Studies show lutein supplementation can improve visual function and protect against age-related eye concerns.</p>

<p><strong>Eyebright Extract:</strong> A traditional herb used for centuries in natural medicine to support eye health. Eyebright is known for its ability to help reduce eye redness, irritation, and inflammation, promoting clearer, brighter-looking eyes. Extended use with this 2-pack enhances these benefits.</p>

<p><strong>Zeaxanthin:</strong> Works synergistically with Lutein to form the macular pigment, which protects the retina from blue light damage. Zeaxanthin enhances visual performance and reduces glare discomfort, especially important in our digital age.</p>

<p><strong>Bilberry Extract:</strong> Rich in anthocyanins, Bilberry supports night vision and reduces eye fatigue. It may enhance blood flow to the eyes, making them appear brighter and less strained.</p>

<p><strong>Proprietary Blend (481mg):</strong> Includes Lutein, Bilberry Extract, Alpha Lipoic Acid, Eyebright, Zeaxanthin, Quercetin, Rutin, L-Taurine, Grape Extract, and Lycopene - a comprehensive blend designed for optimal eye health and beauty.</p>

<h3>📋 Complete Supplement Facts</h3>

<p><strong>Serving Size:</strong> 2 Capsules | <strong>Servings Per Bottle:</strong> 30 | <strong>Total Servings (2-Pack):</strong> 60</p>

<p><strong>Key Ingredients Per Serving:</strong> Vitamin A (100 mcg RAE), Vitamin C (200mg), Vitamin E (20mg), Thiamin (8mg), Riboflavin (8mg), Niacin (40mg), Vitamin B12 (27mcg), Biotin (800mcg), Zinc (32mg), Selenium (8mcg), Copper (2mg), Proprietary Blend (481mg) containing Lutein, Bilberry Extract, Alpha Lipoic Acid, Eyebright, Zeaxanthin, Quercetin, Rutin, L-Taurine, Grape Extract, and Lycopene.</p>

<h3>💊 Suggested Use for Optimal Results</h3>

<p>As a dietary supplement, take two (2) veggie capsules once daily after a meal with an 8oz. glass of water or as directed by your healthcare professional. For best results with this 2-pack, maintain consistent daily use throughout the 60-day period to allow the nutrients to build up in your system and support long-term eye health and brightness. Most users begin noticing improvements in eye clarity and brightness within 2-4 weeks of consistent daily use.</p>

<h3>✅ Premium Quality Assurance</h3>

<p>✅ Made in the USA in a GMP-certified, FDA-compliant facility | ✅ Non-GMO ingredients | ✅ Vegetarian capsules (no gelatin) | ✅ Third-party tested for purity and potency | ✅ No artificial colors, flavors, or preservatives | ✅ Gluten-free and dairy-free | ✅ Organically sourced extracts where possible | ✅ Quality guaranteed</p>

<h3>🎯 Who Benefits Most from This 2-Pack?</h3>

<p>This comprehensive 2-pack is ideal for anyone looking to support their eye health naturally over an extended period, including those who want to reduce the appearance of yellowing or redness in the eyes, protect against blue light damage from screens, enhance visual clarity and brightness, support macular health, reduce eye strain and fatigue, or achieve brighter, more radiant-looking eyes. Perfect for digital device users, contact lens wearers, and anyone seeking natural eye beauty support with a 60-day commitment to optimal results.</p>

<h3>📦 What's Included in This 2-Pack</h3>

<p>You'll receive two (2) full-size bottles, each containing 60 easy-to-swallow vegetarian capsules. This provides a complete 60-day supply when taken as directed - perfect for a comprehensive eye whitening program without the need to reorder. Each bottle is individually sealed for freshness.</p>

<h3>🏆 Why Success Chemistry Sclera White 2-Pack?</h3>

<p>Success Chemistry is committed to providing premium-quality supplements backed by science and manufactured to the highest standards. Our Sclera White 2-pack formula is carefully crafted with the finest botanical extracts and nutrients to support your long-term eye health and beauty journey. Unlike topical eye drops that provide only temporary relief, Sclera White works from within to nourish your eyes and address the root causes of eye dullness.</p>

<p><strong>Inspired by popular products like Lumify and Meibo, but working from within for lasting results. This 2-pack bundle offers exceptional value for those committed to maintaining optimal eye health and achieving brighter, more radiant eyes!</strong></p>

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
    console.log(`✅ Targeting: eye whitening 2 pack, sclera white bundle, brighter eyes value pack\n`);
    
    // Use the new 2-pack hero image (02-hero-2pack-main.png) as the first image
    const images = product.images ? product.images.map(img => {
        if (img.startsWith('http')) return img;
        return `https://successchemistry.com${img}`;
    }) : [];
    
    // Reorder images to put the new 2-pack hero image first
    const reorderedImages = [];
    const newHeroImage = 'https://successchemistry.com/images/products/10786-807-2/02-hero-2pack-main.png';
    reorderedImages.push(newHeroImage); // New hero image first
    
    // Add other images after
    images.forEach(img => {
        if (!img.includes('02-hero-2pack-main.png')) {
            reorderedImages.push(img);
        }
    });
    
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
                'Capsule Count': ['120'],
                'Key Ingredients': ['Lutein', 'Eyebright', 'Zeaxanthin', 'Bilberry Extract', 'Vitamin A'],
                'Target Audience': ['Adults'],
                'Health Concern': ['Eye Health', 'Eye Beauty', 'Vision Support'],
                'Main Purpose': ['Eye Whitening', 'Eye Health'],
                'Package Quantity': ['2'],
                'Shade': ['Not Applicable'],
                'Type': ['Dietary Supplement'],
                'Country/Region of Manufacture': ['United States'],
                'Country of Origin': ['United States']
            },
            imageUrls: reorderedImages.slice(0, 12),
            brand: 'Success Chemistry',
            mpn: SKU,
            productIdentifiers: (product.gtin || product.upc) ? {
                upc: [product.gtin || product.upc]
            } : undefined,
            countryOfOrigin: 'US'
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
    console.log('eBay 2-Pack Listing Creator - Sclera White');
    console.log('='.repeat(70));
    console.log('');
    console.log(`Product: Sclera White 2-Pack`);
    console.log(`SKU: ${SKU}`);
    console.log(`Price: $${PRICE.toFixed(2)} (2-pack value)`);
    console.log(`Hero Image: 2-bottle image (02-hero-2pack-main.png)`);
    console.log(`SEO Focus: Eye whitening 2 pack, sclera white bundle, brighter eyes`);
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
    console.log('✅ 2-Pack Listing Created Successfully!');
    console.log('='.repeat(70));
    console.log('');
    console.log('📊 Summary:');
    console.log(`   ✅ SEO Title: ${generateSEOTitle()}`);
    console.log(`   ✅ SEO Description: ${generateSEODescription().length} characters`);
    console.log(`   ✅ Price: $${PRICE.toFixed(2)} (2-pack bundle)`);
    console.log(`   ✅ Hero Image: 2-bottle image`);
    console.log(`   ✅ Keywords: eye whitening 2 pack, sclera white bundle, brighter eyes value pack`);
    console.log('');
}

main().catch(error => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
});
