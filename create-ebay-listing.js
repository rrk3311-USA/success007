/**
 * Create eBay Product Listing
 * 
 * This script creates a product listing on eBay using the Inventory API.
 * Process:
 *   1. Create inventory item (product details)
 *   2. Create offer (listing) for that inventory item
 * 
 * Usage:
 *   node create-ebay-listing.js <SKU>
 *   Example: node create-ebay-listing.js 52274-401
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load config
let CONFIG;
try {
    const configPath = join(__dirname, 'deploy-site', 'config.js');
    const configModule = await import(`file://${configPath}?update=${Date.now()}`);
    CONFIG = configModule.CONFIG || configModule.default || configModule;
    
    if (!CONFIG || !CONFIG.EBAY_API) {
        throw new Error('EBAY_API configuration not found');
    }
} catch (err) {
    console.error('❌ Could not load config.js:', err.message);
    process.exit(1);
}

// Load products data
let PRODUCTS_DATA;
try {
    const productsPath = join(__dirname, 'deploy-site', 'products-data.js');
    const productsContent = readFileSync(productsPath, 'utf8');
    // Replace const with var and add return statement
    const modifiedContent = productsContent.replace(/^const PRODUCTS_DATA/, 'var PRODUCTS_DATA') + '\nPRODUCTS_DATA;';
    // Use Function constructor to evaluate in isolated scope
    const func = new Function(modifiedContent + '\nreturn PRODUCTS_DATA;');
    PRODUCTS_DATA = func();
    
    if (!PRODUCTS_DATA || typeof PRODUCTS_DATA !== 'object') {
        throw new Error('PRODUCTS_DATA not found or invalid');
    }
    
    console.log(`✅ Loaded ${Object.keys(PRODUCTS_DATA).length} products`);
} catch (err) {
    console.error('❌ Could not load products-data.js:', err.message);
    console.error('   Error details:', err.stack);
    process.exit(1);
}

const EBAY_CONFIG = CONFIG.EBAY_API;
const BASE_URL = EBAY_CONFIG.USE_SANDBOX ? EBAY_CONFIG.SANDBOX_BASE_URL : EBAY_CONFIG.BASE_URL;

/**
 * Get access token (refresh if needed)
 */
async function getAccessToken() {
    const token = EBAY_CONFIG.ACCESS_TOKEN;
    
    if (!token) {
        console.error('❌ No ACCESS_TOKEN found in config.js');
        console.log('💡 Run: node ebay-oauth-helper.js exchange-code <code>');
        return null;
    }
    
    // Check if token is expired (basic check)
    const expires = EBAY_CONFIG.EXPIRES;
    if (expires) {
        const expiresDate = new Date(expires);
        if (expiresDate < new Date()) {
            console.log('⚠️  Token appears expired. Attempting refresh...');
            // Try to refresh if refresh token available
            if (EBAY_CONFIG.REFRESH_TOKEN) {
                // Refresh logic would go here
                console.log('💡 Please refresh your token using: node ebay-oauth-helper.js refresh');
            }
        }
    }
    
    return token;
}

/**
 * Create inventory item on eBay
 */
async function createInventoryItem(product) {
    const token = await getAccessToken();
    if (!token) return null;
    
    console.log(`📦 Creating inventory item for SKU: ${product.sku}`);
    
    // Build inventory item payload
    const inventoryItem = {
        sku: product.sku,
        product: {
            title: product.name.substring(0, 80), // eBay title limit
            description: product.description || product.short_description || '',
            aspects: buildProductAspects(product),
            imageUrls: product.images ? product.images.map(img => {
                // Convert relative paths to absolute URLs
                if (img.startsWith('http')) return img;
                return `https://successchemistry.com${img}`;
            }).slice(0, 12) : [], // eBay allows up to 12 images
            brand: 'Success Chemistry',
            mpn: product.sku
            // Note: EAN/UPC omitted - eBay requires specific formats (EAN-13 or UPC-A)
            // If needed, validate format before including
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
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Content-Language': 'en-US',
                'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'
            },
            body: JSON.stringify(inventoryItem)
        });
        
        const responseText = await response.text();
        let responseData;
        
        try {
            responseData = responseText ? JSON.parse(responseText) : {};
        } catch (e) {
            console.error('❌ Invalid JSON response:');
            console.error('   Status:', response.status, response.statusText);
            console.error('   Response text:', responseText.substring(0, 500));
            console.error('   Parse error:', e.message);
            return null;
        }
        
        if (!response.ok) {
            console.error(`❌ Error creating inventory item (${response.status}):`);
            if (responseData.errors && responseData.errors.length > 0) {
                responseData.errors.forEach(err => {
                    console.error(`   Error ${err.errorId}: ${err.message}`);
                    console.error(`   ${err.longMessage}`);
                    if (err.parameters && err.parameters.length > 0) {
                        console.error(`   Parameters:`, JSON.stringify(err.parameters, null, 2));
                    }
                });
            } else {
                console.error('   Response:', JSON.stringify(responseData, null, 2));
            }
            return null;
        }
        
        console.log('✅ Inventory item created successfully!');
        console.log(`   SKU: ${product.sku}`);
        return inventoryItem;
        
    } catch (error) {
        console.error('❌ Error creating inventory item:', error.message);
        return null;
    }
}

/**
 * Create offer (listing) for inventory item
 */
async function createOffer(product, listingFormat = 'FIXED_PRICE') {
    const token = await getAccessToken();
    if (!token) return null;
    
    console.log(`📋 Creating offer for SKU: ${product.sku}`);
    
    // Build offer payload
    const offer = {
        sku: product.sku,
        marketplaceId: 'EBAY_US',
        format: listingFormat, // FIXED_PRICE or AUCTION
        listingPolicies: {
            fulfillmentPolicyId: '83111818022', // Flat:USPS Priority(Free),2 business days
            paymentPolicyId: '258748124022', // eBay Payments
            returnPolicyId: '145517245022' // Returns Accepted, Buyer, 30 Days, Money back
        },
        pricingSummary: {
            price: {
                value: product.price.toString(),
                currency: 'USD'
            }
        },
        categoryId: mapCategoryToEbayCategory(product.category),
        merchantLocationKey: '29ffe3a3-8e8c-4085-a3e0-8c179586ba13', // First merchant location from setup
        quantity: product.stock || 1,
        listingDescription: product.description || product.short_description || '',
        includeCatalogProductDetails: true
    };
    
    try {
        const response = await fetch(`${BASE_URL}/sell/inventory/v1/offer`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Content-Language': 'en-US',
                'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'
            },
            body: JSON.stringify(offer)
        });
        
        const responseText = await response.text();
        let responseData;
        
        try {
            responseData = JSON.parse(responseText);
        } catch {
            console.error('❌ Invalid JSON response:', responseText);
            return null;
        }
        
        if (!response.ok) {
            console.error(`❌ Error creating offer (${response.status}):`, responseData);
            
            // Provide helpful error messages
            if (response.status === 400) {
                console.log('\n💡 Common issues:');
                console.log('   - Policy IDs need to be created first (fulfillment, payment, return)');
                console.log('   - Merchant location key needs to be set up');
                console.log('   - Category ID might be invalid');
            }
            
            return null;
        }
        
        console.log('✅ Offer created successfully!');
        console.log(`   Offer ID: ${responseData.offerId}`);
        console.log(`   Listing ID: ${responseData.listingId || 'Pending'}`);
        return responseData;
        
    } catch (error) {
        console.error('❌ Error creating offer:', error.message);
        return null;
    }
}

/**
 * Build product aspects (attributes) for eBay
 */
function buildProductAspects(product) {
    const aspects = {};
    
    // Brand
    aspects['Brand'] = ['Success Chemistry'];
    
    // Category-specific aspects
    if (product.category) {
        if (product.category.includes('Women')) {
            aspects['Product Type'] = ['Supplements'];
            aspects['Target Audience'] = ['Women'];
        } else if (product.category.includes('Men')) {
            aspects['Product Type'] = ['Supplements'];
            aspects['Target Audience'] = ['Men'];
        } else {
            aspects['Product Type'] = ['Supplements'];
        }
    }
    
    // Add ingredients if available
    if (product.ingredients) {
        const mainIngredients = product.ingredients.split(',').slice(0, 3).map(i => i.trim());
        if (mainIngredients.length > 0) {
            aspects['Key Ingredients'] = mainIngredients;
        }
    }
    
    return aspects;
}

/**
 * Parse weight string to number
 */
function parseWeight(weightStr) {
    if (!weightStr) return 0.1; // Default
    
    const match = weightStr.match(/(\d+\.?\d*)\s*(oz|lb|pound|pounds)/i);
    if (match) {
        const value = parseFloat(match[1]);
        const unit = match[2].toLowerCase();
        if (unit.includes('oz')) {
            return value / 16; // Convert oz to pounds
        }
        return value;
    }
    
    return 0.1; // Default
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
    
    const match = dimensionsStr.match(/(\d+\.?\d*)\s*x\s*(\d+\.?\d*)\s*x\s*(\d+\.?\d*)/i);
    if (match) {
        return {
            length: parseFloat(match[1]),
            width: parseFloat(match[2]),
            height: parseFloat(match[3]),
            unit: 'INCH'
        };
    }
    
    // Try 2D format
    const match2D = dimensionsStr.match(/(\d+\.?\d*)\s*(?:inches|inch|in)\s*(?:wide|w)\s*x\s*(\d+\.?\d*)\s*(?:inches|inch|in)\s*(?:tall|h)/i);
    if (match2D) {
        return {
            length: parseFloat(match2D[1]),
            width: parseFloat(match2D[1]),
            height: parseFloat(match2D[2]),
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
 * Map product category to eBay category ID
 */
function mapCategoryToEbayCategory(category) {
    // Try different category IDs - eBay category structure may have changed
    // Common Health & Beauty leaf categories to try:
    
    // Option 1: Health & Beauty > Vitamins & Dietary Supplements (if 180959 doesn't work)
    // Option 2: Try parent category and let eBay suggest (not recommended)
    // Option 3: Use a more specific subcategory
    
    // For now, try 11700 (Health & Beauty parent) - eBay might auto-select correct subcategory
    // Or try to find the actual leaf category through Seller Hub
    
    // NOTE: Category must be a LEAF category (no subcategories)
    // You may need to find the correct ID through eBay Seller Hub's category picker
    
    return "11700"; // Health & Beauty - try this, or find correct leaf category manually
}

/**
 * Main function
 */
async function main() {
    const sku = process.argv[2];
    
    if (!sku) {
        console.log('eBay Product Listing Creator');
        console.log('');
        console.log('Usage:');
        console.log('  node create-ebay-listing.js <SKU>');
        console.log('');
        console.log('Example:');
        console.log('  node create-ebay-listing.js 52274-401');
        console.log('');
        console.log('Available products:');
        const productSkus = Object.keys(PRODUCTS_DATA).slice(0, 10);
        productSkus.forEach(sku => {
            const product = PRODUCTS_DATA[sku];
            console.log(`  - ${sku}: ${product.name.substring(0, 60)}...`);
        });
        if (Object.keys(PRODUCTS_DATA).length > 10) {
            console.log(`  ... and ${Object.keys(PRODUCTS_DATA).length - 10} more`);
        }
        process.exit(1);
    }
    
    const product = PRODUCTS_DATA[sku];
    
    if (!product) {
        console.error(`❌ Product with SKU "${sku}" not found`);
        console.log(`Available SKUs: ${Object.keys(PRODUCTS_DATA).join(', ')}`);
        process.exit(1);
    }
    
    console.log('='.repeat(60));
    console.log('eBay Product Listing Creator');
    console.log('='.repeat(60));
    console.log('');
    console.log(`Product: ${product.name}`);
    console.log(`SKU: ${product.sku}`);
    console.log(`Price: $${product.price}`);
    console.log(`Category: ${product.category}`);
    console.log('');
    
    // Step 1: Create inventory item
    console.log('Step 1: Creating inventory item...');
    const inventoryItem = await createInventoryItem(product);
    
    if (!inventoryItem) {
        console.error('❌ Failed to create inventory item. Cannot proceed.');
        process.exit(1);
    }
    
    console.log('');
    
    // Step 2: Create offer
    console.log('Step 2: Creating offer (listing)...');
    const offer = await createOffer(product);
    
    if (!offer) {
        console.error('❌ Failed to create offer.');
        console.log('💡 Note: You may need to set up policies first:');
        console.log('   - Fulfillment Policy');
        console.log('   - Payment Policy');
        console.log('   - Return Policy');
        console.log('   - Merchant Location');
        process.exit(1);
    }
    
    console.log('');
    console.log('='.repeat(60));
    console.log('✅ Listing created successfully!');
    console.log('='.repeat(60));
    console.log(`Offer ID: ${offer.offerId}`);
    if (offer.listingId) {
        console.log(`Listing ID: ${offer.listingId}`);
        console.log(`View listing: https://www.ebay.com/itm/${offer.listingId}`);
    }
}

main().catch(error => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
});
