/**
 * Update eBay Listing for Sclera White with SEO-Optimized Content
 * 
 * Updates existing listing with:
 * - SEO-optimized title
 * - Expanded SEO description
 * - Price: $29.86 (same as other single products)
 * 
 * Usage:
 *   node update-ebay-listing-sclera.js
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
const SKU = '10786-807';
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
    return 'Success Chemistry Sclera White - Eye Whitening Supplement - 60 Capsules';
}

/**
 * Generate SEO-optimized, well-formatted description (max 4000 chars for eBay)
 */
function generateSEODescription() {
    return `
<h2>👁️ Success Chemistry Sclera White - Premium Eye Whitening & Beauty Supplement</h2>

<p><strong>Transform Your Eyes Naturally - Achieve Brighter, Clearer, More Radiant Eyes</strong></p>

<p>Success Chemistry Sclera White is a revolutionary dietary supplement designed to enhance your natural eye beauty from within. This powerful formula combines Eyebright and Lutein - two of nature's most effective ingredients for supporting ocular health and promoting brighter, whiter-looking eyes. Unlike temporary eye drops, Sclera White works internally to nourish your eyes and address the root causes of eye dullness, yellowing, and redness.</p>

<h3>✨ Key Benefits & Features</h3>

<ul>
<li><strong>Natural Eye Whitening Support:</strong> Helps reduce the appearance of yellowing and redness in the sclera (white part of the eye) through targeted nutritional support.</li>
<li><strong>Eyebright for Eye Clarity:</strong> Traditionally used for centuries to support eye health, Eyebright helps reduce eye irritation and redness while promoting clearer vision.</li>
<li><strong>Lutein for Macular Health:</strong> This powerful carotenoid filters harmful blue light and supports macular health, helping protect your eyes from digital screen damage.</li>
<li><strong>Comprehensive Eye Nutrition:</strong> Includes Zeaxanthin, Bilberry Extract, Vitamin A, C, E, and essential B-vitamins for complete ocular support.</li>
<li><strong>Antioxidant Protection:</strong> Rich in antioxidants including Lycopene, Grape Extract, and Alpha Lipoic Acid to protect eye tissues from oxidative stress.</li>
<li><strong>Premium Quality:</strong> Made in the USA in a GMP-certified, FDA-compliant facility with non-GMO ingredients and vegetarian capsules.</li>
</ul>

<h3>🔬 Premium Ingredient Profile</h3>

<p><strong>Lutein (20mg equivalent):</strong> One of the most researched nutrients for eye health. Lutein accumulates in the macula and helps filter high-energy blue light from digital devices, reducing eye strain and supporting long-term eye health. Studies show lutein supplementation can improve visual function and protect against age-related eye concerns.</p>

<p><strong>Eyebright Extract:</strong> A traditional herb used for centuries in natural medicine to support eye health. Eyebright is known for its ability to help reduce eye redness, irritation, and inflammation, promoting clearer, brighter-looking eyes.</p>

<p><strong>Zeaxanthin:</strong> Works synergistically with Lutein to form the macular pigment, which protects the retina from blue light damage. Zeaxanthin enhances visual performance and reduces glare discomfort, especially important in our digital age.</p>

<p><strong>Bilberry Extract:</strong> Rich in anthocyanins, Bilberry supports night vision and reduces eye fatigue. It may enhance blood flow to the eyes, making them appear brighter and less strained.</p>

<p><strong>Proprietary Blend (481mg):</strong> Includes Lutein, Bilberry Extract, Alpha Lipoic Acid, Eyebright, Zeaxanthin, Quercetin, Rutin, L-Taurine, Grape Extract, and Lycopene - a comprehensive blend designed for optimal eye health and beauty.</p>

<h3>📋 Complete Supplement Facts</h3>

<p><strong>Serving Size:</strong> 2 Capsules | <strong>Servings Per Container:</strong> 30</p>

<p><strong>Key Ingredients Per Serving:</strong> Vitamin A (100 mcg RAE), Vitamin C (200mg), Vitamin E (20mg), Thiamin (8mg), Riboflavin (8mg), Niacin (40mg), Vitamin B12 (27mcg), Biotin (800mcg), Zinc (32mg), Selenium (8mcg), Copper (2mg), Proprietary Blend (481mg) containing Lutein, Bilberry Extract, Alpha Lipoic Acid, Eyebright, Zeaxanthin, Quercetin, Rutin, L-Taurine, Grape Extract, and Lycopene.</p>

<h3>💊 Suggested Use</h3>

<p>As a dietary supplement, take two (2) veggie capsules once a day after a meal with an 8oz. glass of water or as directed by your healthcare professional. For best results, maintain consistent daily use for at least 60-90 days to allow the nutrients to build up in your system and support long-term eye health and brightness.</p>

<h3>✅ Quality Assurance</h3>

<p>✅ Made in the USA in a GMP-certified, FDA-compliant facility | ✅ Non-GMO ingredients | ✅ Vegetarian capsules (no gelatin) | ✅ Third-party tested for purity and potency | ✅ No artificial colors, flavors, or preservatives | ✅ Gluten-free and dairy-free | ✅ Organically sourced extracts where possible</p>

<h3>🎯 Who Can Benefit?</h3>

<p>This formula is ideal for anyone looking to support their eye health naturally, reduce the appearance of yellowing or redness in the eyes, protect against blue light damage from screens, enhance visual clarity and brightness, support macular health, reduce eye strain and fatigue, or achieve brighter, more radiant-looking eyes. Perfect for digital device users, contact lens wearers, and anyone seeking natural eye beauty support.</p>

<h3>📦 What's Included</h3>

<p>Each bottle contains 60 easy-to-swallow vegetarian capsules, providing a full 30-day supply when taken as directed. With consistent use, you'll have everything you need to support your journey to brighter, healthier-looking eyes.</p>

<h3>🏆 Why Choose Success Chemistry Sclera White?</h3>

<p>Success Chemistry is committed to providing premium-quality supplements backed by science and manufactured to the highest standards. Our Sclera White formula is carefully crafted with the finest botanical extracts and nutrients to support your eye health and beauty journey. Unlike topical eye drops that provide only temporary relief, Sclera White works from within to nourish your eyes and address the root causes of eye dullness.</p>

<p><strong>Inspired by popular products like Lumify and Meibo, but working from within for lasting results. Order today and experience the difference premium eye health support can make in achieving brighter, more radiant eyes!</strong></p>

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
                'Key Ingredients': ['Lutein', 'Eyebright', 'Zeaxanthin', 'Bilberry Extract', 'Vitamin A'],
                'Target Audience': ['Adults'],
                'Health Concern': ['Eye Health', 'Eye Beauty', 'Vision Support'],
                'Main Purpose': ['Eye Whitening', 'Eye Health'],
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
    console.log('eBay Listing Update - Sclera White (Single)');
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
    console.log(`   ✅ SEO Focus: Eye whitening, sclera white, lutein, eyebright`);
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
