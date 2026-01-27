/**
 * Create Amazon Listing via SP-API (Using amazon-sp-api package)
 * 
 * Creates a product listing on Amazon using the Selling Partner API.
 * 
 * Prerequisites:
 *   1. npm install amazon-sp-api
 *   2. Complete Amazon SP-API setup (see AMAZON_SP_API_SETUP.md)
 *   3. Have all credentials in .env file
 * 
 * Usage:
 *   node create-amazon-listing-v2.js <SKU>
 * 
 * Example:
 *   node create-amazon-listing-v2.js 10777-810
 */

import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Check if amazon-sp-api is installed
let SellingPartnerApi;
try {
    SellingPartnerApi = (await import('amazon-sp-api')).default;
} catch (error) {
    console.error('❌ amazon-sp-api package not installed');
    console.error('');
    console.error('📦 Install it with:');
    console.error('   npm install amazon-sp-api');
    console.error('');
    console.error('Then run this script again.');
    process.exit(1);
}

// Amazon SP-API Credentials
const LWA_CLIENT_ID = process.env.AMAZON_LWA_CLIENT_ID;
const LWA_CLIENT_SECRET = process.env.AMAZON_LWA_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.AMAZON_REFRESH_TOKEN;
const IAM_USER_ARN = process.env.AMAZON_IAM_USER_ARN;
const MARKETPLACE_ID = process.env.AMAZON_MARKETPLACE_ID || 'ATVPDKIKX0DER'; // US
const SELLER_ID = process.env.AMAZON_SELLER_ID;
const REGION = process.env.AMAZON_REGION || 'us-east-1';

// Validate credentials
if (!LWA_CLIENT_ID || !LWA_CLIENT_SECRET || !REFRESH_TOKEN || !IAM_USER_ARN) {
    console.error('❌ Missing Amazon SP-API credentials in .env');
    console.error('');
    console.error('Required:');
    console.error('  - AMAZON_LWA_CLIENT_ID');
    console.error('  - AMAZON_LWA_CLIENT_SECRET');
    console.error('  - AMAZON_REFRESH_TOKEN');
    console.error('  - AMAZON_IAM_USER_ARN');
    console.error('');
    console.error('See AMAZON_SP_API_SETUP.md for setup instructions');
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

/**
 * Initialize SP-API client
 */
function createSPApiClient() {
    return new SellingPartnerApi({
        region: REGION,
        credentials: {
            SELLING_PARTNER_APP_CLIENT_ID: LWA_CLIENT_ID,
            SELLING_PARTNER_APP_CLIENT_SECRET: LWA_CLIENT_SECRET,
            AWS_ACCESS_KEY_ID: '', // Not needed for LWA
            AWS_SECRET_ACCESS_KEY: '', // Not needed for LWA
            AWS_SESSION_TOKEN: '', // Not needed for LWA
            refresh_token: REFRESH_TOKEN,
            access_token: '', // Will be auto-generated
            role_arn: process.env.AMAZON_IAM_ROLE_ARN || IAM_USER_ARN
        },
        endpoints: {
            default: {
                region: REGION,
                sandbox: false
            }
        },
        options: {
            auto_request_tokens: true,
            version: 'v1'
        }
    });
}

/**
 * Create product listing
 */
async function createListing(client, product) {
    console.log(`📦 Creating listing for: ${product.name}\n`);
    
    // Prepare listing data according to Amazon's Listings API schema
    const listingData = {
        marketplaceId: MARKETPLACE_ID,
        sku: product.sku,
        productType: 'HEALTH_PERSONAL_CARE', // Adjust based on your product category
        requirements: 'LISTING',
        attributes: {
            item_name: [{
                value: product.name.substring(0, 200), // Max 200 chars
                marketplace_id: MARKETPLACE_ID
            }],
            brand: [{
                value: 'Success Chemistry',
                marketplace_id: MARKETPLACE_ID
            }],
            manufacturer: [{
                value: 'Success Chemistry',
                marketplace_id: MARKETPLACE_ID
            }],
            list_price: [{
                value: product.price.toString(),
                currency: 'USD',
                marketplace_id: MARKETPLACE_ID
            }],
            product_description: [{
                value: (product.description || product.name).substring(0, 2000), // Max 2000 chars
                marketplace_id: MARKETPLACE_ID
            }],
            bullet_point: (product.bullets || []).slice(0, 5).map(bullet => ({
                value: bullet.substring(0, 500), // Max 500 chars per bullet
                marketplace_id: MARKETPLACE_ID
            })),
            main_product_image: [{
                value: product.images?.[0]?.startsWith('http') 
                    ? product.images[0] 
                    : `https://successchemistry.com${product.images?.[0] || ''}`,
                marketplace_id: MARKETPLACE_ID
            }]
        }
    };

    // Add additional images
    if (product.images && product.images.length > 1) {
        listingData.attributes.other_product_image = product.images.slice(1, 8).map(img => ({
            value: img.startsWith('http') ? img : `https://successchemistry.com${img}`,
            marketplace_id: MARKETPLACE_ID
        }));
    }

    // Add GTIN/UPC if available
    if (product.gtin || product.upc) {
        listingData.attributes.external_product_id = [{
            value: product.gtin || product.upc,
            type: 'UPC',
            marketplace_id: MARKETPLACE_ID
        }];
    }

    // Add quantity/fulfillment
    listingData.attributes.fulfillment_availability = [{
        value: 'DEFAULT', // or 'AMAZON' for FBA
        marketplace_id: MARKETPLACE_ID
    }];

    try {
        console.log('📤 Sending listing to Amazon...\n');
        
        const response = await client.callAPI({
            operation: 'putListingsItem',
            endpoint: 'listings',
            path: {
                sellerId: SELLER_ID,
                sku: product.sku
            },
            body: listingData,
            options: {
                version: '2021-08-01'
            }
        });

        console.log('✅ Listing created successfully!');
        console.log('');
        console.log('📊 Response:');
        console.log(JSON.stringify(response, null, 2));
        
        return { success: true, response };
    } catch (error) {
        console.error('❌ Error creating listing:', error.message);
        if (error.response) {
            console.error('Response:', JSON.stringify(error.response, null, 2));
        }
        return { success: false, error: error.message };
    }
}

/**
 * Main function
 */
async function main() {
    const sku = process.argv[2];
    
    if (!sku) {
        console.error('❌ SKU required');
        console.error('');
        console.error('Usage: node create-amazon-listing-v2.js <SKU>');
        console.error('Example: node create-amazon-listing-v2.js 10777-810');
        process.exit(1);
    }

    const product = PRODUCTS_DATA[sku];
    if (!product) {
        console.error(`❌ Product with SKU ${sku} not found`);
        process.exit(1);
    }

    console.log('='.repeat(70));
    console.log('Amazon SP-API Listing Creator');
    console.log('='.repeat(70));
    console.log('');
    console.log(`Product: ${product.name}`);
    console.log(`SKU: ${product.sku}`);
    console.log(`Price: $${product.price}`);
    console.log(`Marketplace: ${MARKETPLACE_ID} (US)`);
    console.log('');

    try {
        // Initialize SP-API client
        console.log('🔐 Initializing SP-API client...');
        const client = createSPApiClient();
        console.log('✅ Client initialized\n');

        // Create listing
        const result = await createListing(client, product);
        
        if (result.success) {
            console.log('');
            console.log('✅ Listing creation complete!');
            console.log('');
            console.log('📝 Next steps:');
            console.log('   1. Check listing status in Seller Central');
            console.log('   2. Verify product details');
            console.log('   3. Set inventory quantity');
            console.log('   4. Monitor for any errors or warnings');
        } else {
            console.error('');
            console.error('❌ Failed to create listing');
            process.exit(1);
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.stack) {
            console.error(error.stack);
        }
        process.exit(1);
    }
}

main().catch(error => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
});
