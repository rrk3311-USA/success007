/**
 * Create Amazon Listing via SP-API
 * 
 * Creates a product listing on Amazon using the Selling Partner API.
 * 
 * Usage:
 *   node create-amazon-listing.js <SKU>
 * 
 * Example:
 *   node create-amazon-listing.js 10777-810
 * 
 * Prerequisites:
 *   1. Complete Amazon SP-API setup (see AMAZON_SP_API_SETUP.md)
 *   2. Have all credentials in .env file
 *   3. Seller account must be approved for Listings API
 */

import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import crypto from 'crypto';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Amazon SP-API Credentials
const LWA_CLIENT_ID = process.env.AMAZON_LWA_CLIENT_ID;
const LWA_CLIENT_SECRET = process.env.AMAZON_LWA_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.AMAZON_REFRESH_TOKEN;
const IAM_USER_ARN = process.env.AMAZON_IAM_USER_ARN;
const MARKETPLACE_ID = process.env.AMAZON_MARKETPLACE_ID || 'ATVPDKIKX0DER'; // US
const SELLER_ID = process.env.AMAZON_SELLER_ID;
const REGION = process.env.AMAZON_REGION || 'us-east-1';

// API Endpoints
const SP_API_BASE = {
    'us-east-1': 'https://sellingpartnerapi-na.amazon.com',
    'eu-west-1': 'https://sellingpartnerapi-eu.amazon.com',
    'us-west-2': 'https://sellingpartnerapi-fe.amazon.com'
}[REGION] || 'https://sellingpartnerapi-na.amazon.com';

const LWA_ENDPOINT = 'https://api.amazon.com/auth/o2/token';

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
 * Get access token using refresh token
 */
async function getAccessToken() {
    try {
        const response = await fetch(LWA_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: REFRESH_TOKEN,
                client_id: LWA_CLIENT_ID,
                client_secret: LWA_CLIENT_SECRET
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(`Failed to get access token: ${JSON.stringify(data)}`);
        }

        return data.access_token;
    } catch (error) {
        console.error('❌ Error getting access token:', error.message);
        throw error;
    }
}

/**
 * Create AWS signature for SP-API request
 */
function createSignature(method, uri, queryString, payload, accessToken) {
    const algorithm = 'AWS4-HMAC-SHA256';
    const service = 'execute-api';
    const host = new URL(SP_API_BASE).hostname;
    const region = REGION;
    const timestamp = new Date().toISOString().replace(/[:\-]|\.\d{3}/g, '');
    const date = timestamp.substr(0, 8);
    
    // Create canonical request
    const canonicalUri = uri;
    const canonicalQueryString = queryString || '';
    const canonicalHeaders = [
        `host:${host}`,
        `x-amz-access-token:${accessToken}`,
        `x-amz-date:${timestamp}`
    ].join('\n') + '\n';
    
    const signedHeaders = 'host;x-amz-access-token;x-amz-date';
    const payloadHash = crypto.createHash('sha256').update(payload || '').digest('hex');
    
    const canonicalRequest = [
        method,
        canonicalUri,
        canonicalQueryString,
        canonicalHeaders,
        signedHeaders,
        payloadHash
    ].join('\n');
    
    // Create string to sign
    const credentialScope = `${date}/${region}/${service}/aws4_request`;
    const stringToSign = [
        algorithm,
        timestamp,
        credentialScope,
        crypto.createHash('sha256').update(canonicalRequest).digest('hex')
    ].join('\n');
    
    // Calculate signature (simplified - in production, use AWS SDK)
    // Note: This is a simplified version. For production, use AWS SDK v3
    console.warn('⚠️  Using simplified signature. For production, use AWS SDK v3');
    
    return {
        authorization: `${algorithm} Credential=${IAM_USER_ARN}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=...`,
        'x-amz-date': timestamp,
        'x-amz-access-token': accessToken
    };
}

/**
 * Create product listing
 */
async function createListing(product, accessToken) {
    console.log(`📦 Creating listing for: ${product.name}\n`);
    
    // Prepare listing data
    const listingData = {
        marketplaceId: MARKETPLACE_ID,
        sku: product.sku,
        productType: 'HEALTH_PERSONAL_CARE', // Adjust based on product
        requirements: 'LISTING',
        attributes: {
            item_name: [{
                value: product.name,
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
                value: product.description || product.name,
                marketplace_id: MARKETPLACE_ID
            }],
            bullet_point: product.bullets?.slice(0, 5).map(bullet => ({
                value: bullet,
                marketplace_id: MARKETPLACE_ID
            })) || [],
            main_product_image: [{
                value: product.images?.[0]?.startsWith('http') 
                    ? product.images[0] 
                    : `https://successchemistry.com${product.images?.[0] || ''}`,
                marketplace_id: MARKETPLACE_ID
            }],
            other_product_image: product.images?.slice(1, 8).map(img => ({
                value: img.startsWith('http') ? img : `https://successchemistry.com${img}`,
                marketplace_id: MARKETPLACE_ID
            })) || []
        }
    };

    // Add GTIN/UPC if available
    if (product.gtin || product.upc) {
        listingData.attributes.external_product_id = [{
            value: product.gtin || product.upc,
            type: 'UPC',
            marketplace_id: MARKETPLACE_ID
        }];
    }

    try {
        // Note: This is a simplified example
        // In production, you should use the official AWS SDK for JavaScript v3
        // or a library like 'amazon-sp-api' npm package
        
        console.log('⚠️  This is a template - you need to use AWS SDK v3 or amazon-sp-api package');
        console.log('📦 Recommended: npm install amazon-sp-api');
        console.log('');
        console.log('Listing data prepared:');
        console.log(JSON.stringify(listingData, null, 2));
        
        // For actual implementation, use:
        // const { SellingPartnerApiClient } = require('amazon-sp-api');
        // const client = new SellingPartnerApiClient({...});
        // await client.callAPI('POST', '/listings/2021-08-01/items', {...});
        
        return { success: true, message: 'Template ready - implement with AWS SDK' };
    } catch (error) {
        console.error('❌ Error creating listing:', error.message);
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
        console.error('Usage: node create-amazon-listing.js <SKU>');
        console.error('Example: node create-amazon-listing.js 10777-810');
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
        // Get access token
        console.log('🔐 Getting access token...');
        const accessToken = await getAccessToken();
        console.log('✅ Access token obtained\n');

        // Create listing
        const result = await createListing(product, accessToken);
        
        if (result.success) {
            console.log('✅ Listing creation process initiated!');
            console.log('');
            console.log('📝 Next steps:');
            console.log('   1. Install amazon-sp-api: npm install amazon-sp-api');
            console.log('   2. Update this script to use the library');
            console.log('   3. Check listing status in Seller Central');
        } else {
            console.error('❌ Failed to create listing:', result.error);
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

main().catch(error => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
});
