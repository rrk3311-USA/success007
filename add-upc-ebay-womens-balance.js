/**
 * Add UPC/GTIN to Women's Balance eBay Listing
 * 
 * Updates the inventory item with the product identifier (UPC)
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
const UPC = '783325397399'; // From products-data.js

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

async function addUPC() {
    console.log('📋 Adding UPC to Women\'s Balance inventory item...\n');
    console.log(`   SKU: ${SKU}`);
    console.log(`   UPC: ${UPC}\n`);
    
    // First, get the current inventory item
    console.log('📥 Fetching current inventory item...');
    const getResponse = await fetch(`${BASE_URL}/sell/inventory/v1/inventory_item/${SKU}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
            'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'
        }
    });

    if (!getResponse.ok) {
        const errorData = await getResponse.json();
        console.error(`❌ Error fetching inventory item (${getResponse.status}):`);
        console.error(JSON.stringify(errorData, null, 2));
        return false;
    }

    const currentItem = await getResponse.json();
    console.log('✅ Current inventory item retrieved\n');

    // Update with UPC
    const updatedItem = {
        ...currentItem,
        product: {
            ...currentItem.product,
            productIdentifiers: {
                upc: [UPC]
            }
        }
    };

    console.log('🔄 Updating inventory item with UPC...');
    const putResponse = await fetch(`${BASE_URL}/sell/inventory/v1/inventory_item/${SKU}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
            'Content-Language': 'en-US',
            'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'
        },
        body: JSON.stringify(updatedItem)
    });

    const responseText = await putResponse.text();
    let responseData = {};
    
    try {
        responseData = responseText ? JSON.parse(responseText) : {};
    } catch (e) {
        // Empty response is OK for PUT requests
        if (putResponse.ok) {
            console.log('✅ Inventory item updated successfully!');
            console.log(`   UPC: ${UPC} added`);
            return true;
        }
        console.error('❌ Invalid JSON response:', responseText.substring(0, 500));
        return false;
    }

    if (!putResponse.ok) {
        console.error(`❌ Error updating inventory item (${putResponse.status}):`);
        if (responseData.errors && responseData.errors.length > 0) {
            responseData.errors.forEach(err => {
                console.error(`   Error ${err.errorId}: ${err.message}`);
            });
        } else {
            console.error(JSON.stringify(responseData, null, 2));
        }
        return false;
    }

    console.log('✅ Inventory item updated successfully!');
    console.log(`   UPC: ${UPC} added`);
    return true;
}

async function main() {
    console.log('='.repeat(70));
    console.log('Add UPC to Women\'s Balance eBay Listing');
    console.log('='.repeat(70));
    console.log('');
    
    const success = await addUPC();
    
    if (!success) {
        console.error('❌ Failed to add UPC.');
        process.exit(1);
    }
    
    console.log('');
    console.log('='.repeat(70));
    console.log('✅ UPC Added Successfully!');
    console.log('='.repeat(70));
    console.log('');
    console.log('📊 Summary:');
    console.log(`   ✅ SKU: ${SKU}`);
    console.log(`   ✅ UPC: ${UPC}`);
    console.log('');
    console.log('💡 The UPC should now appear in your eBay listing!');
    console.log('');
}

main().catch(error => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
});
