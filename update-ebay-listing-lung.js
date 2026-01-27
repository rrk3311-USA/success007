/**
 * Update eBay Listing for Lung Detox Premium Cleanse with SEO-Optimized Content
 * 
 * Updates existing listing with:
 * - SEO-optimized title
 * - Expanded SEO description
 * - Price: $29.86 (same as other single products)
 * 
 * Usage:
 *   node update-ebay-listing-lung.js
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
const SKU = '20647-507';
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
    return 'New Lung Detox Premium Cleanse - Respiratory Support Formula - 60 Capsules';
}

/**
 * Generate SEO-optimized, well-formatted description (max 4000 chars for eBay)
 */
function generateSEODescription() {
    return `
<h2>🫁 New Lung® Lung Detox Premium Cleanse - Premium Respiratory Health & Detox Support</h2>

<p><strong>Breathe Easier, Support Your Lungs Naturally - Advanced Herbal Formula for Respiratory Wellness</strong></p>

<p>New Lung® Lung Detox Premium Cleanse is a revolutionary dietary supplement designed to support your respiratory health from within. This powerful formula combines time-tested herbal ingredients known for their lung-cleansing properties, including Mullein, Marshmallow Root, and Ginger. Ideal for those exposed to pollutants, smokers, ex-smokers, or anyone seeking enhanced lung health, this supplement helps remove toxins, reduce inflammation, and improve overall respiratory function.</p>

<h3>✨ Key Benefits & Features</h3>

<ul>
<li><strong>Natural Lung Detoxification:</strong> Helps remove toxins and pollutants that accumulate in the lungs, supporting your body's natural cleansing processes for healthier respiratory function.</li>
<li><strong>Mullein for Respiratory Support:</strong> Traditionally used for centuries to reduce respiratory inflammation and promote easier breathing. Mullein helps soothe airways and support lung health.</li>
<li><strong>Marshmallow Root for Airway Comfort:</strong> Soothes mucous membranes and supports lung health by coating and protecting respiratory tissues, helping to expel toxins naturally.</li>
<li><strong>Ginger Anti-Inflammatory Support:</strong> Provides natural anti-inflammatory benefits that aid lung function and support overall respiratory wellness.</li>
<li><strong>Comprehensive Antioxidant Protection:</strong> Includes Lutein, Lycopene, Green Tea Extract, Hawthorn, and Grape Seed Extract to protect lung tissue from oxidative stress.</li>
<li><strong>Immune System Support:</strong> Enhanced with Echinacea, Beta Glucan, Spirulina, and Garlic to boost immune function and support overall respiratory defense.</li>
<li><strong>Premium Quality:</strong> Made in the USA in a GMP-certified, FDA-compliant facility with non-GMO ingredients and vegetarian capsules.</li>
</ul>

<h3>🔬 Premium Ingredient Profile</h3>

<p><strong>Mullein Extract (200mg):</strong> One of the most trusted herbs for respiratory health. Mullein has been used for centuries to reduce inflammation in the airways, soothe irritation, and promote easier breathing. It helps support the body's natural ability to clear mucus and toxins from the lungs.</p>

<p><strong>Marshmallow Root (200mg):</strong> A traditional herb known for its soothing properties. Marshmallow Root coats and protects mucous membranes in the respiratory tract, helping to reduce irritation and support the natural expulsion of toxins. It works synergistically with Mullein for comprehensive lung support.</p>

<p><strong>Ginger Extract (100mg):</strong> Provides powerful anti-inflammatory support that aids lung function. Ginger helps reduce respiratory inflammation and supports overall respiratory wellness, making breathing more comfortable.</p>

<p><strong>Stinging Nettle Extract (100mg):</strong> Reduces respiratory irritation and has natural antihistamine properties. Stinging Nettle helps support the body's response to environmental allergens and pollutants.</p>

<p><strong>Antioxidant Blend (200mg):</strong> Includes Green Tea Extract, Hawthorn Powder, and Grape Seed Extract. These powerful antioxidants protect lung tissue from oxidative stress caused by environmental toxins, pollutants, and free radicals.</p>

<p><strong>Immune Support Blend (200mg):</strong> Features Echinacea Extract, Beta Glucan, Spirulina, and Garlic. This comprehensive blend enhances immune function and supports the body's natural defense mechanisms, essential for maintaining healthy respiratory function.</p>

<p><strong>Molybdenum (100mcg):</strong> An essential trace mineral that plays a crucial role in detoxification processes, helping the body eliminate toxins more effectively.</p>

<p><strong>Lutein & Lycopene (10mg each):</strong> Powerful carotenoid antioxidants that protect lung tissue from oxidative damage and support overall respiratory health.</p>

<h3>📋 Complete Supplement Facts</h3>

<p><strong>Serving Size:</strong> 2 Capsules | <strong>Servings Per Container:</strong> 30</p>

<p><strong>Key Ingredients Per Serving:</strong> Mullein Extract (200mg), Marshmallow Root (200mg), Ginger Extract (100mg), Stinging Nettle Extract (100mg), Saw Palmetto (100mg), Molybdenum (100mcg), Lutein (10mg), Lycopene (10mg), Antioxidant Blend (200mg) containing Green Tea Extract, Hawthorn Powder, and Grape Seed Extract, Immune Support Blend (200mg) containing Echinacea Extract, Beta Glucan, Spirulina, and Garlic.</p>

<h3>💊 Suggested Use</h3>

<p>As a dietary supplement, take two (2) veggie capsules once a day after a meal with an 8oz. glass of water or as directed by your healthcare professional. Taking with food helps with absorption and reduces any potential stomach sensitivity. For best results, maintain consistent daily use for at least 60-90 days to allow the herbs to fully support your body's natural lung cleansing processes. Most users notice improvements in breathing and respiratory comfort within 2-4 weeks of consistent use.</p>

<h3>✅ Quality Assurance</h3>

<p>✅ Made in the USA in a GMP-certified, FDA-compliant facility | ✅ Non-GMO ingredients | ✅ Vegetarian capsules (no gelatin) | ✅ Third-party tested for purity and potency | ✅ No artificial colors, flavors, or preservatives | ✅ Gluten-free and dairy-free | ✅ High-quality, natural ingredients</p>

<h3>🎯 Who Can Benefit?</h3>

<p>This formula is ideal for anyone looking to support their respiratory health naturally, including those exposed to environmental pollutants, smokers and former smokers seeking lung detoxification, individuals with seasonal respiratory discomfort, people looking to improve breathing capacity during exercise, those seeking natural immune support for respiratory health, or anyone wanting to maintain optimal lung function as part of a healthy lifestyle. Perfect for city dwellers, athletes, and anyone committed to respiratory wellness.</p>

<h3>📦 What's Included</h3>

<p>Each bottle contains 60 easy-to-swallow vegetarian capsules, providing a full 30-day supply when taken as directed. With consistent use, you'll have everything you need to support your journey to healthier, clearer breathing and optimal respiratory function.</p>

<h3>🏆 Why Choose New Lung® Lung Detox Premium Cleanse?</h3>

<p>New Lung® is committed to providing premium-quality supplements backed by traditional herbal wisdom and modern nutritional science. Our Lung Detox Premium Cleanse formula is carefully crafted with the finest herbal extracts and nutrients to support your respiratory health journey. This comprehensive formula addresses multiple aspects of lung health - from detoxification and inflammation reduction to immune support and antioxidant protection.</p>

<p><strong>Experience the benefits of natural lung support with New Lung® Lung Detox Premium Cleanse. Breathe easier, support your respiratory health, and invest in your overall well-being!</strong></p>

<p><em>*These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease. Consult with your healthcare provider before starting any new supplement regimen, especially if you are pregnant, nursing, taking medication, have asthma, COPD, or other respiratory conditions, or have a medical condition.</em></p>
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
                'Brand': ['New Lung'],
                'Product Type': ['Dietary Supplements'],
                'Form': ['Capsules'],
                'Size': ['60 Count'],
                'Capsule Count': ['60'],
                'Key Ingredients': ['Mullein', 'Marshmallow Root', 'Ginger', 'Echinacea', 'Beta Glucan'],
                'Target Audience': ['Adults'],
                'Health Concern': ['Respiratory Health', 'Lung Health', 'Immune Support'],
                'Main Purpose': ['Lung Detox', 'Respiratory Support'],
                'Shade': ['Not Applicable'],
                'Type': ['Dietary Supplement'],
                'Country/Region of Manufacture': ['United States'],
                'Country of Origin': ['United States']
            },
            imageUrls: product.images ? product.images.map(img => {
                if (img.startsWith('http')) return img;
                return `https://successchemistry.com${img}`;
            }).slice(0, 12) : [],
            brand: 'New Lung',
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
    console.log('eBay Listing Update - Lung Detox Premium Cleanse (Single)');
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
    console.log(`   ✅ SEO Focus: Lung detox, respiratory health, mullein, marshmallow root`);
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
