/**
 * Create eBay Listing for BabyBean Female Fertility Support (Single) - ALTERNATE SEO VERSION
 * 
 * Creates a listing with:
 * - ALTERNATE SEO-optimized title (different keywords)
 * - ALTERNATE SEO description (different long-tail keywords)
 * - Price: $29.86 (same as other single products)
 * - Uses WooCommerce images from product data
 * 
 * Usage:
 *   node create-ebay-listing-babybean-alt.js
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
const SKU = '16715-401-alt'; // Variant SKU for alternate listing
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

const product = PRODUCTS_DATA['16715-401']; // Base product
if (!product) {
    console.error(`❌ Base product 16715-401 not found`);
    process.exit(1);
}

/**
 * Generate ALTERNATE SEO-optimized title (80 characters max for eBay)
 * Different keywords: "women trying to conceive", "fertility vitamins"
 */
function generateSEOTitle() {
    return 'BabyBean Fertility Vitamins for Women - Natural Conception Support - 60 Caps';
}

/**
 * Generate ALTERNATE SEO-optimized description with DIFFERENT long-tail keywords
 * Targets: "fertility vitamins for women trying to conceive", "natural fertility boost", "women's reproductive wellness"
 */
function generateSEODescription() {
    return `
<h2>💕 BabyBean® Natural Fertility Vitamins for Women - Conception Support & Reproductive Wellness</h2>

<p><strong>Support Your Journey to Conception - Natural, Science-Backed Formula for Women Trying to Conceive</strong></p>

<p>BabyBean® Natural Fertility Vitamins are specifically designed for women trying to conceive and seeking natural fertility support. This comprehensive formula combines clinically-studied herbs and essential prenatal nutrients to help optimize your reproductive health, support hormone balance, and enhance your body's natural fertility potential. Whether you're just starting your fertility journey or have been trying to conceive, BabyBean provides the natural support your body needs.</p>

<h3>💎 Why Choose BabyBean for Your Fertility Journey?</h3>

<ul>
<li><strong>Designed for Women Trying to Conceive:</strong> Our formula is specifically crafted to support women at every stage of their fertility journey, from pre-conception through early pregnancy support.</li>
<li><strong>Natural Fertility Boost:</strong> Features a powerful blend of traditional fertility herbs including Maca Root, Ashwagandha, and Dong Quai - herbs that have been used for centuries to support women's reproductive health.</li>
<li><strong>Essential Prenatal Nutrients:</strong> Includes Folic Acid (400mcg), Iron (18mg), and Vitamin D3 (800 IU) - essential nutrients recommended for women trying to conceive and during early pregnancy.</li>
<li><strong>Hormone Balance Support:</strong> Helps support healthy hormone levels and menstrual cycle regularity, which are crucial for optimal fertility and conception success.</li>
<li><strong>Reproductive Wellness Formula:</strong> Comprehensive blend supports overall reproductive health, from cycle regulation to egg quality and uterine health.</li>
<li><strong>Non-GMO & Natural:</strong> Made with high-quality, non-GMO ingredients. Free from artificial additives, making it a safe choice for your fertility journey.</li>
</ul>

<h3>🌿 Natural Fertility-Boosting Ingredients</h3>

<p><strong>Maca Root (Lepidium meyenii):</strong> One of the most researched natural fertility enhancers for women. Maca helps support hormone balance, improve energy levels, and enhance reproductive function. Studies suggest Maca may help support healthy menstrual cycles and improve fertility outcomes.</p>

<p><strong>Ashwagandha Extract:</strong> An adaptogenic herb that helps reduce stress and support hormone balance. Chronic stress can negatively impact fertility, and Ashwagandha helps support your body's natural stress response while promoting reproductive wellness.</p>

<p><strong>Dong Quai (Angelica sinensis):</strong> Known as "female ginseng," Dong Quai has been used in traditional medicine for thousands of years to support women's reproductive health. It helps maintain healthy menstrual cycles and supports overall reproductive function.</p>

<p><strong>Ginkgo Biloba:</strong> Enhances blood circulation, including to reproductive organs. Improved blood flow supports healthy uterine lining and optimal reproductive function, which are essential for conception.</p>

<p><strong>Asian Ginseng:</strong> Boosts energy and supports overall vitality. Maintaining good energy levels is important during your fertility journey, and Ginseng helps combat fatigue while supporting reproductive health.</p>

<p><strong>Proprietary Fertility Blend (800mg):</strong> A comprehensive blend including Epimedium, Tribulus, Catuaba, Dong Quai, Ginkgo, Asian Ginseng, Damiana, Ashwagandha, Ginger, Maca Root, and Muira Puama. Each herb has been traditionally used to support different aspects of women's reproductive health and fertility.</p>

<p><strong>Folic Acid (400mcg):</strong> Essential for women trying to conceive. Folic Acid helps support healthy neural tube development in early pregnancy and is recommended by healthcare providers for all women of childbearing age.</p>

<p><strong>Iron (18mg):</strong> Supports healthy blood and oxygen transport throughout the body, including to reproductive organs. Adequate iron levels are important for overall health and fertility.</p>

<p><strong>Vitamin D3 (800 IU):</strong> Supports reproductive health and hormone function. Research suggests adequate Vitamin D levels may support fertility outcomes.</p>

<h3>📋 Complete Supplement Facts</h3>

<p><strong>Serving Size:</strong> 2 Capsules | <strong>Servings Per Container:</strong> 30</p>

<p><strong>Key Ingredients Per Serving:</strong> Proprietary Fertility Blend (800mg) containing Epimedium Powder, Tribulus Extract, Catuaba Powder, Dong Quai, Ginkgo Biloba, Asian Ginseng, Damiana Powder, Ashwagandha Extract, Ginger, Maca Root, and Muira Puama, Folic Acid (400mcg), Iron (18mg), Vitamin D3 (800 IU)</p>

<h3>💊 Suggested Use for Optimal Results</h3>

<p>As a dietary supplement, take two (2) veggie capsules once a day after a meal with an 8oz. glass of water or as directed by your healthcare professional. Taking with food helps with absorption and ensures optimal results. For women trying to conceive, it's recommended to start taking BabyBean at least 3 months before trying to conceive to allow the nutrients to build up in your system and support optimal reproductive health. Continue use during early pregnancy as directed by your healthcare provider.</p>

<h3>✅ Quality & Safety Assurance</h3>

<p>✅ Made in the USA in a GMP-certified facility | ✅ Non-GMO ingredients | ✅ Vegetarian capsules (no gelatin) | ✅ Third-party tested for purity and potency | ✅ No artificial colors, flavors, or preservatives | ✅ Gluten-free and dairy-free | ✅ High-quality, natural ingredients | ✅ Safe for women trying to conceive</p>

<h3>🎯 Perfect For Women Who Are:</h3>

<p>This formula is ideal for women trying to conceive naturally, those seeking to optimize their reproductive health before pregnancy, women experiencing irregular menstrual cycles, individuals looking to support hormone balance naturally, those preparing their body for conception, women seeking natural alternatives for fertility support, or anyone committed to supporting their reproductive wellness. Perfect for women at any stage of their fertility journey, from just starting to try to those who have been trying for a while.</p>

<h3>📦 What's Included</h3>

<p>Each bottle contains 60 easy-to-swallow vegetarian capsules, providing a full 30-day supply when taken as directed. With consistent use, you'll have everything you need to support your fertility journey, enhance your reproductive health, and prepare your body for conception.</p>

<h3>🏆 Why Trust BabyBean® for Your Fertility Journey?</h3>

<p>BabyBean® is dedicated to supporting women's reproductive health with premium-quality supplements backed by traditional herbal wisdom and modern nutritional science. Our Natural Fertility Vitamins formula is carefully crafted with the finest fertility-supporting herbs and essential nutrients to support your journey to conception. This comprehensive formula addresses all aspects of reproductive wellness - from hormone balance and cycle regularity to egg quality and overall reproductive health.</p>

<p><strong>Start your fertility journey with confidence. Support your reproductive health naturally with BabyBean® Natural Fertility Vitamins and give yourself the best foundation for conception success!</strong></p>

<p><em>*These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease. Consult with your healthcare provider before starting any new supplement regimen, especially if you are pregnant, nursing, trying to conceive, taking medication, or have a medical condition.</em></p>
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
    console.log('📦 Step 1: Creating inventory item with ALTERNATE SEO...\n');
    
    const seoTitle = generateSEOTitle();
    const seoDescription = generateSEODescription();
    
    // Use WooCommerce images from product data
    const imageUrls = product.images ? product.images.map(img => {
        if (img.startsWith('http')) return img;
        return `https://successchemistry.com${img}`;
    }).slice(0, 12) : [];
    
    console.log(`✅ SEO Title (${seoTitle.length} chars): ${seoTitle}`);
    console.log(`✅ SEO Description: ${seoDescription.length} characters`);
    console.log(`✅ Images: ${imageUrls.length} WooCommerce images`);
    console.log(`✅ Alternate Keywords: fertility vitamins, women trying to conceive, natural fertility boost\n`);
    
    const inventoryItem = {
        sku: SKU,
        product: {
            title: seoTitle,
            description: seoDescription,
            aspects: {
                'Brand': ['BabyBean'],
                'Product Type': ['Dietary Supplements'],
                'Form': ['Capsules'],
                'Size': ['60 Count'],
                'Capsule Count': ['60'],
                'Key Ingredients': ['Maca Root', 'Ashwagandha', 'Dong Quai', 'Folic Acid', 'Iron'],
                'Target Audience': ['Women', 'Adults'],
                'Health Concern': ['Fertility', 'Reproductive Health', 'Hormone Balance'],
                'Main Purpose': ['Fertility Support', 'Conception Aid'],
                'Shade': ['Not Applicable'],
                'Type': ['Dietary Supplement'],
                'Country/Region of Manufacture': ['United States'],
                'Country of Origin': ['United States']
            },
            imageUrls: imageUrls,
            brand: 'BabyBean',
            mpn: SKU,
            productIdentifiers: (product.gtin || product.upc) ? {
                upc: [product.gtin || product.upc]
            } : undefined,
            countryOfOrigin: 'US'
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
    console.log('📋 Step 2: Creating offer (listing) with ALTERNATE SEO...\n');
    
    const seoDescription = generateSEODescription();
    
    const offer = {
        sku: SKU,
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
    console.log('eBay Listing Creator - BabyBean (ALTERNATE SEO VERSION)');
    console.log('='.repeat(70));
    console.log('');
    console.log(`Product: BabyBean Female Fertility Support (Alternate SEO)`);
    console.log(`SKU: ${SKU} (variant for alternate listing)`);
    console.log(`Price: $${PRICE.toFixed(2)} (same as other single products)`);
    console.log(`Images: WooCommerce images from product data`);
    console.log(`SEO Strategy: Alternate keywords - fertility vitamins, women trying to conceive`);
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
    console.log('✅ Alternate Listing Created Successfully!');
    console.log('='.repeat(70));
    console.log('');
    console.log('📊 Summary:');
    console.log(`   ✅ SEO Title: ${generateSEOTitle()}`);
    console.log(`   ✅ SEO Description: ${generateSEODescription().length} characters`);
    console.log(`   ✅ Price: $${PRICE.toFixed(2)}`);
    console.log(`   ✅ Alternate Keywords: fertility vitamins, women trying to conceive, natural fertility boost`);
    console.log(`   ✅ Images: WooCommerce images from product data`);
    console.log('');
}

main().catch(error => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
});
