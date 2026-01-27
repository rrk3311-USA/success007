/**
 * Test Amazon SP-API Connection
 * 
 * Tests your Amazon SP-API setup and credentials.
 * 
 * Usage:
 *   node test-amazon-api.js
 */

import dotenv from 'dotenv';

dotenv.config();

// Check if amazon-sp-api is installed
let SellingPartnerApi;
try {
    SellingPartnerApi = (await import('amazon-sp-api')).default;
} catch (error) {
    console.error('❌ amazon-sp-api package not installed');
    console.error('');
    console.error('📦 Install it with:');
    console.error('   npm install amazon-sp-api');
    process.exit(1);
}

const LWA_CLIENT_ID = process.env.AMAZON_LWA_CLIENT_ID;
const LWA_CLIENT_SECRET = process.env.AMAZON_LWA_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.AMAZON_REFRESH_TOKEN;
const IAM_USER_ARN = process.env.AMAZON_IAM_USER_ARN;
const MARKETPLACE_ID = process.env.AMAZON_MARKETPLACE_ID || 'ATVPDKIKX0DER';
const REGION = process.env.AMAZON_REGION || 'us-east-1';

console.log('='.repeat(70));
console.log('Amazon SP-API Connection Test');
console.log('='.repeat(70));
console.log('');

// Check credentials
console.log('📋 Checking credentials...\n');

const missing = [];
if (!LWA_CLIENT_ID) missing.push('AMAZON_LWA_CLIENT_ID');
if (!LWA_CLIENT_SECRET) missing.push('AMAZON_LWA_CLIENT_SECRET');
if (!REFRESH_TOKEN) missing.push('AMAZON_REFRESH_TOKEN');
if (!IAM_USER_ARN) missing.push('AMAZON_IAM_USER_ARN');

if (missing.length > 0) {
    console.error('❌ Missing credentials:');
    missing.forEach(key => console.error(`   - ${key}`));
    console.error('');
    console.error('See AMAZON_SP_API_SETUP.md for setup instructions');
    process.exit(1);
}

console.log('✅ All credentials found');
console.log(`   Client ID: ${LWA_CLIENT_ID.substring(0, 10)}...`);
console.log(`   Refresh Token: ${REFRESH_TOKEN.substring(0, 10)}...`);
console.log(`   IAM User ARN: ${IAM_USER_ARN}`);
console.log(`   Marketplace: ${MARKETPLACE_ID}`);
console.log(`   Region: ${REGION}`);
console.log('');

// Test API connection
console.log('🔐 Testing API connection...\n');

try {
    const client = new SellingPartnerApi({
        region: REGION,
        credentials: {
            SELLING_PARTNER_APP_CLIENT_ID: LWA_CLIENT_ID,
            SELLING_PARTNER_APP_CLIENT_SECRET: LWA_CLIENT_SECRET,
            refresh_token: REFRESH_TOKEN,
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

    // Test with a simple API call (get marketplace participations)
    console.log('📡 Calling API: getMarketplaceParticipations...');
    
    const response = await client.callAPI({
        operation: 'getMarketplaceParticipations',
        endpoint: 'sellers'
    });

    console.log('✅ API connection successful!');
    console.log('');
    console.log('📊 Response:');
    console.log(JSON.stringify(response, null, 2));
    console.log('');
    console.log('✅ Your Amazon SP-API setup is working correctly!');
    console.log('');
    console.log('🚀 Next steps:');
    console.log('   1. Create a listing: node create-amazon-listing-v2.js <SKU>');
    console.log('   2. Check Seller Central for your listings');
    
} catch (error) {
    console.error('❌ API connection failed!');
    console.error('');
    console.error('Error:', error.message);
    
    if (error.response) {
        console.error('');
        console.error('Response:', JSON.stringify(error.response, null, 2));
    }
    
    console.error('');
    console.error('🔍 Troubleshooting:');
    console.error('   1. Verify all credentials in .env are correct');
    console.error('   2. Check that refresh token is valid (run amazon-authorize.js)');
    console.error('   3. Verify IAM User ARN is correct');
    console.error('   4. Check that your seller account has API access');
    console.error('   5. See AMAZON_SP_API_SETUP.md for detailed setup');
    
    process.exit(1);
}
