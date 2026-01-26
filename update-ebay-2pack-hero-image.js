/**
 * Update eBay 2-Pack Listing Hero Image
 * 
 * Updates the inventory item to use the new 2-bottle hero image
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
const SKU = '10777-810-2';

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

const baseProduct = PRODUCTS_DATA['10777-810'];

/**
 * Parse weight for 2-pack
 */
function parseWeight(weightStr) {
    if (!weightStr) return 0.375; // 2x 3oz = 6oz = 0.375 lbs
    const match = weightStr.match(/(\d+\.?\d*)\s*(oz|lb|pound|pounds)/i);
    if (match) {
        const value = parseFloat(match[1]) * 2;
        const unit = match[2].toLowerCase();
        if (unit.includes('oz')) {
            return value / 16;
        }
        return value;
    }
    return 0.375;
}

/**
 * Parse dimensions for 2-pack
 */
function parseDimensions() {
    return {
        length: 4,
        width: 2,
        height: 3.5,
        unit: 'INCH'
    };
}

async function updateInventoryItem() {
    console.log('🖼️  Updating eBay 2-pack inventory item with new hero image...\n');
    
    // Get current inventory item
    const getResponse = await fetch(`${BASE_URL}/sell/inventory/v1/inventory_item/${SKU}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
            'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'
        }
    });
    
    let currentItem = {};
    if (getResponse.ok) {
        currentItem = await getResponse.json();
        console.log('✅ Found existing inventory item');
    } else {
        console.log('⚠️  Inventory item not found, will create new one');
    }
    
    // Prepare images - use 02.png as hero (shows 2 bottles) since new image isn't deployed yet
    // Once the new image is deployed, we can update to use 02-hero-2pack-main.png
    const allImages = baseProduct.images || [];
    
    // Reorder: 02.png first (2-bottle image), then other images
    const heroImage = '/images/products/10777-810/02.png'; // Use existing 02.png which shows 2 bottles
    const otherImages = allImages.filter(img => !img.includes('02.png'));
    
    const imageUrls = [
        `https://successchemistry.com${heroImage}`, // 2-bottle hero image first
        ...otherImages.map(img => img.startsWith('http') ? img : `https://successchemistry.com${img}`)
    ].slice(0, 12); // eBay allows up to 12 images
    
    console.log(`📸 Image URLs (${imageUrls.length} total):`);
    imageUrls.forEach((url, idx) => {
        console.log(`   ${idx + 1}. ${url}`);
    });
    console.log('');
    
    const inventoryItem = {
        sku: SKU,
        product: {
            title: currentItem.product?.title || 'Success Chemistry Liver Cleanse 2-Pack - Milk Thistle Detox Formula - 120 Caps',
            description: currentItem.product?.description || '',
            aspects: currentItem.product?.aspects || {
                'Brand': ['Success Chemistry'],
                'Product Type': ['Dietary Supplements'],
                'Form': ['Capsules'],
                'Size': ['120 Count', '2-Pack'],
                'Key Ingredients': ['Milk Thistle', 'Dandelion Root', 'Artichoke Extract', 'Turmeric', 'Ginger'],
                'Target Audience': ['Adults'],
                'Health Concern': ['Liver Health', 'Detoxification', 'Digestive Support'],
                'Package Quantity': ['2']
            },
            imageUrls: imageUrls,
            brand: 'Success Chemistry',
            mpn: SKU
        },
        condition: 'NEW',
        packageWeightAndSize: {
            weight: {
                value: parseWeight(baseProduct.weight),
                unit: 'POUND'
            },
            dimensions: parseDimensions()
        },
        availability: {
            shipToLocationAvailability: {
                quantity: baseProduct.stock || 1
            }
        }
    };
    
    try {
        console.log('🚀 Updating inventory item...');
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
            console.error(`❌ Error updating inventory item (${response.status}):`);
            if (responseData.errors && responseData.errors.length > 0) {
                responseData.errors.forEach(err => {
                    console.error(`   Error ${err.errorId}: ${err.message}`);
                });
            }
            return false;
        }
        
        console.log('✅ Inventory item updated successfully!');
        console.log(`   Hero image: ${imageUrls[0]}`);
        console.log(`   Total images: ${imageUrls.length}`);
        return true;
    } catch (error) {
        console.error('❌ Error updating inventory item:', error.message);
        return false;
    }
}

async function main() {
    console.log('='.repeat(70));
    console.log('eBay 2-Pack Hero Image Update');
    console.log('='.repeat(70));
    console.log('');
    
    const updated = await updateInventoryItem();
    
    if (!updated) {
        console.error('❌ Failed to update inventory item.');
        process.exit(1);
    }
    
    console.log('');
    console.log('='.repeat(70));
    console.log('✅ Hero Image Updated!');
    console.log('='.repeat(70));
    console.log('');
    console.log('💡 Note: The listing may take a few minutes to reflect the changes.');
    console.log('   Check your eBay listing to see the updated hero image.');
    console.log('');
}

main().catch(error => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
});
