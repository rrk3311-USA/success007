/**
 * Recreate eBay 2-Pack Listing
 * 
 * Deletes the old 2-pack listing and creates a new one with:
 * - Updated hero image (02-hero-2pack-main.png)
 * - All required fields (UPC, country of origin, ingredients, etc.)
 * 
 * Usage:
 *   node recreate-ebay-2pack-listing.js
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
 * Delete existing offer
 */
async function deleteOffer() {
    console.log('🗑️  Step 1: Checking for existing offer...\n');
    
    try {
        // Get offer by SKU
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
            console.log('✅ No existing offer found - ready to create new one\n');
            return true;
        }

        const offer = getData.offers[0];
        const offerId = offer.offerId;
        const status = offer.status;

        console.log(`   Found offer ID: ${offerId}`);
        console.log(`   Status: ${status}\n`);

        // Delete the offer
        console.log('🗑️  Deleting existing offer...');
        const deleteResponse = await fetch(`${BASE_URL}/sell/inventory/v1/offer/${offerId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
                'Content-Type': 'application/json',
                'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'
            }
        });

        if (deleteResponse.ok) {
            console.log('✅ Offer deleted successfully!\n');
            return true;
        }

        const deleteData = await deleteResponse.json();
        console.error(`❌ Error deleting offer (${deleteResponse.status}):`);
        console.error(JSON.stringify(deleteData, null, 2));
        return false;
    } catch (error) {
        console.error('❌ Error deleting offer:', error.message);
        return false;
    }
}

/**
 * Import the create function from the 2pack script
 */
async function createNewListing() {
    console.log('📦 Step 2: Creating new 2-pack listing...\n');
    
    // Import and run the create script
    const { exec } = await import('child_process');
    const { promisify } = await import('util');
    const execPromise = promisify(exec);
    
    try {
        const { stdout, stderr } = await execPromise('node create-ebay-listing-2pack.js');
        console.log(stdout);
        if (stderr) {
            console.error(stderr);
        }
        return true;
    } catch (error) {
        console.error('❌ Error creating listing:', error.message);
        return false;
    }
}

async function main() {
    console.log('='.repeat(70));
    console.log('Recreate eBay 2-Pack Listing');
    console.log('='.repeat(70));
    console.log('');
    console.log(`Product: Liver Cleanse 2-Pack`);
    console.log(`SKU: ${SKU}`);
    console.log(`New Hero Image: 02-hero-2pack-main.png`);
    console.log('');
    
    // Step 1: Delete old listing
    const deleted = await deleteOffer();
    
    if (!deleted) {
        console.error('⚠️  Could not delete old offer, but continuing...');
    }
    
    console.log('');
    
    // Step 2: Create new listing
    console.log('💡 Now run: node create-ebay-listing-2pack.js');
    console.log('');
    console.log('This will create a new listing with:');
    console.log('   ✅ Updated hero image (02-hero-2pack-main.png)');
    console.log('   ✅ UPC/GTIN');
    console.log('   ✅ Country of Origin');
    console.log('   ✅ Capsule Count');
    console.log('   ✅ Ingredients & Formulation');
    console.log('');
}

main().catch(error => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
});
