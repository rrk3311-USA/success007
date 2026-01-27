/**
 * Create eBay Listing for BabyBean Female Fertility Support (Single)
 * 
 * Creates a listing with:
 * - SEO-optimized title
 * - Expanded SEO description
 * - Price: $29.86 (same as other single products)
 * - Uses Walmart images (update WALMART_IMAGES array below)
 * 
 * Usage:
 *   node create-ebay-listing-babybean.js
 * 
 * IMPORTANT: Update WALMART_IMAGES array below with actual Walmart image URLs
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
const SKU = '16715-401';
const PRICE = 29.86; // Same as other single products

// Walmart image URLs - can be provided via command line or update this array
// Usage: node create-ebay-listing-babybean.js "url1" "url2" "url3" ...
// Or update the array below with Walmart image URLs from the product page
const WALMART_IMAGES = process.argv.slice(2).filter(arg => arg.startsWith('http')) || [
    // Add Walmart image URLs here, or pass them as command line arguments
    // Example: 'https://i5.walmartimages.com/asr/...',
];

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
 * Get image URLs - use Walmart images if provided, otherwise fall back to local
 */
function getImageUrls() {
    if (WALMART_IMAGES.length > 0 && WALMART_IMAGES[0]) {
        console.log('📸 Using Walmart images...');
        return WALMART_IMAGES.filter(url => url && url.trim() !== '');
    }
    
    console.log('📸 Using local images (Walmart images not configured)...');
    return product.images ? product.images.map(img => {
        if (img.startsWith('http')) return img;
        return `https://successchemistry.com${img}`;
    }).slice(0, 12) : [];
}

/**
 * Generate SEO-optimized title (80 characters max for eBay)
 */
function generateSEOTitle() {
    return 'BabyBean Female Fertility Support - Natural Conception Aid - 60 Capsules';
}

/**
 * Generate SEO-optimized, well-formatted description (max 4000 chars for eBay)
 */
function generateSEODescription() {
    return `
<h2>🌸 BabyBean® Female Fertility Support Supplement - Natural Conception Aid & Reproductive Health</h2>

<p><strong>Unlock Your Fertility Potential - Natural, Non-GMO Support for Women's Reproductive Wellness</strong></p>

<p>BabyBean® Female Fertility Support Supplement is a premium dietary supplement expertly crafted to support women's reproductive health and fertility. This advanced natural formula combines traditional herbal wisdom with modern science, featuring a powerful blend of fertility-supporting ingredients including Maca Root, Ashwagandha, Dong Quai, and more. Ideal for women seeking to optimize their fertility, support hormone balance, and enhance their reproductive wellness naturally.</p>

<h3>✨ Key Benefits & Features</h3>

<ul>
<li><strong>Supports Reproductive Health:</strong> Our unique blend of natural ingredients provides essential nutrients that promote optimal reproductive health and enhance fertility potential, supporting your journey to conception.</li>
<li><strong>Promotes Hormone Balance:</strong> Ingredients like Dong Quai, Ashwagandha, and Maca Root work together to support hormonal balance, which is crucial for a healthy menstrual cycle and optimal reproductive function.</li>
<li><strong>Enhances Prenatal Wellness:</strong> BabyBean provides vital nutrients including Folic Acid (400mcg), Iron (18mg), and Vitamin D3 (800 IU) to support a healthy pregnancy right from the start, ensuring you and your baby have the best foundation.</li>
<li><strong>Comprehensive Fertility Support:</strong> Features a proprietary fertility blend with Epimedium, Tribulus, Catuaba, Ginkgo, Asian Ginseng, Damiana, and more - traditional herbs known for their fertility-boosting properties.</li>
<li><strong>Natural and Non-GMO:</strong> Made with high-quality, non-GMO ingredients. Free from artificial additives and preservatives, making it a natural choice for your fertility journey.</li>
<li><strong>Premium Quality:</strong> Made in the USA in a GMP-certified facility with vegetarian capsules and third-party tested for purity and potency.</li>
</ul>

<h3>🔬 Premium Ingredient Profile</h3>

<p><strong>Maca Root (Lepidium meyenii):</strong> Renowned for enhancing fertility and balancing hormones. Maca has been used for centuries in traditional medicine to support reproductive health and improve fertility outcomes. It helps support healthy hormone production and menstrual cycle regularity.</p>

<p><strong>Ashwagandha Extract (Withania somnifera):</strong> An adaptogenic herb that helps balance hormones, reduce stress, and promote overall reproductive health. Stress can significantly impact fertility, and Ashwagandha helps support the body's natural stress response while promoting hormonal balance.</p>

<p><strong>Dong Quai (Angelica sinensis):</strong> Often called "female ginseng," Dong Quai is a staple in traditional medicine for supporting hormonal balance and reproductive health. It helps maintain healthy menstrual cycles and supports overall reproductive function.</p>

<p><strong>Epimedium Powder:</strong> Supports healthy sexual function and reproductive health. Epimedium has been traditionally used to enhance reproductive wellness and support fertility.</p>

<p><strong>Tribulus Extract:</strong> Known for its ability to enhance fertility and support hormone balance. Tribulus helps support healthy reproductive function and may improve fertility outcomes.</p>

<p><strong>Ginkgo Biloba:</strong> Enhances blood flow and supports overall reproductive function. Improved circulation to reproductive organs is essential for optimal fertility and reproductive health.</p>

<p><strong>Asian Ginseng:</strong> Increases energy levels and supports reproductive vitality. Ginseng helps combat fatigue and supports overall wellness, which is important during the fertility journey.</p>

<p><strong>Proprietary Fertility Blend (800mg):</strong> Includes Epimedium Powder, Tribulus Extract, Catuaba Powder, Dong Quai, Ginkgo Biloba, Asian Ginseng, Damiana Powder, Ashwagandha Extract, Ginger, Maca Root, and Muira Puama - a comprehensive blend designed for optimal fertility support.</p>

<p><strong>Essential Prenatal Nutrients:</strong> Includes Folic Acid (400mcg) to support neural tube development, Iron (18mg) for healthy blood and oxygen transport, and Vitamin D3 (800 IU) for overall reproductive and bone health.</p>

<h3>📋 Complete Supplement Facts</h3>

<p><strong>Serving Size:</strong> 2 Capsules | <strong>Servings Per Container:</strong> 30</p>

<p><strong>Key Ingredients Per Serving:</strong> Proprietary Fertility Blend (800mg) containing Epimedium Powder, Tribulus Extract, Catuaba Powder, Dong Quai, Ginkgo Biloba, Asian Ginseng, Damiana Powder, Ashwagandha Extract, Ginger, Maca Root, and Muira Puama, Folic Acid (400mcg), Iron (18mg), Vitamin D3 (800 IU)</p>

<h3>💊 Suggested Use</h3>

<p>As a dietary supplement, take two (2) veggie capsules once a day after a meal with an 8oz. glass of water or as directed by your healthcare professional. Taking with food helps with absorption and ensures optimal results. For best results, incorporate BabyBean into your daily routine and maintain a healthy lifestyle. Most women begin to notice improvements in cycle regularity and overall reproductive wellness within 2-3 months of consistent use. It's recommended to continue use for at least 90 days to allow the herbs to fully support your reproductive health.</p>

<h3>✅ Quality Assurance</h3>

<p>✅ Made in the USA in a GMP-certified facility | ✅ Non-GMO ingredients | ✅ Vegetarian capsules (no gelatin) | ✅ Third-party tested for purity and potency | ✅ No artificial colors, flavors, or preservatives | ✅ Gluten-free and dairy-free | ✅ High-quality, natural ingredients | ✅ Free from common allergens</p>

<h3>🎯 Who Can Benefit?</h3>

<p>This formula is ideal for women looking to support their fertility naturally, including those trying to conceive, women seeking to optimize their reproductive health, those experiencing irregular menstrual cycles, individuals looking to support hormone balance, women preparing for pregnancy, those seeking natural alternatives for fertility support, or anyone committed to maintaining optimal reproductive wellness as part of a healthy lifestyle. Perfect for women at any stage of their fertility journey.</p>

<h3>📦 What's Included</h3>

<p>Each bottle contains 60 easy-to-swallow vegetarian capsules, providing a full 30-day supply when taken as directed. With consistent use, you'll have everything you need to support your journey to enhanced fertility, improved reproductive health, and optimal hormone balance.</p>

<h3>🏆 Why Choose BabyBean® Female Fertility Support?</h3>

<p>BabyBean® is committed to providing premium-quality supplements backed by traditional herbal wisdom and modern nutritional science. Our Female Fertility Support formula is carefully crafted with the finest herbal extracts and essential nutrients to support your fertility journey. This comprehensive formula addresses multiple aspects of reproductive health - from hormone balance and cycle regularity to prenatal wellness and overall reproductive function.</p>

<p><strong>Take control of your reproductive health with BabyBean®. Support your fertility journey naturally and unlock your potential for optimal reproductive wellness!</strong></p>

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
    console.log('📦 Step 1: Creating inventory item...\n');
    
    const seoTitle = generateSEOTitle();
    const seoDescription = generateSEODescription();
    const imageUrls = getImageUrls();
    
    console.log(`✅ SEO Title (${seoTitle.length} chars): ${seoTitle}`);
    console.log(`✅ SEO Description: ${seoDescription.length} characters`);
    console.log(`✅ Images: ${imageUrls.length} images configured\n`);
    
    const inventoryItem = {
        sku: product.sku,
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
            imageUrls: imageUrls.slice(0, 12),
            brand: 'BabyBean',
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
    console.log('eBay Listing Creator - BabyBean Female Fertility Support (Single)');
    console.log('='.repeat(70));
    console.log('');
    console.log(`Product: ${product.name.substring(0, 60)}...`);
    console.log(`SKU: ${product.sku}`);
    console.log(`Price: $${PRICE.toFixed(2)} (same as other single products)`);
    console.log(`Images: ${WALMART_IMAGES.length > 0 && WALMART_IMAGES[0] ? 'Walmart images' : 'Local images (update WALMART_IMAGES array)'}`);
    console.log('');
    
    if (WALMART_IMAGES.length === 0 || !WALMART_IMAGES[0]) {
        console.log('⚠️  WARNING: Walmart images not configured!');
        console.log('   The script will use local images. To use Walmart images:');
        console.log('   1. Go to the Walmart product page');
        console.log('   2. Right-click on product images and copy image URLs');
        console.log('   3. Update the WALMART_IMAGES array in this script');
        console.log('');
    }
    
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
    console.log(`   ✅ SEO Focus: Female fertility, conception aid, reproductive health, hormone balance`);
    console.log('');
}

main().catch(error => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
});
