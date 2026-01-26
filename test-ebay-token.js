/**
 * Test eBay Access Token
 * 
 * Simple script to verify if the eBay access token is valid
 */

import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const ACCESS_TOKEN = process.env.EBAY_ACCESS_TOKEN;
const BASE_URL = 'https://api.ebay.com';

if (!ACCESS_TOKEN) {
    console.error('❌ EBAY_ACCESS_TOKEN not found in .env file');
    process.exit(1);
}

console.log('🧪 Testing eBay Access Token...\n');
console.log(`Token (first 50 chars): ${ACCESS_TOKEN.substring(0, 50)}...`);
console.log(`Token length: ${ACCESS_TOKEN.length}`);
console.log('');

// Test 1: Get user account info (simple endpoint)
async function testToken() {
    try {
        console.log('📡 Testing token with GET /sell/account/v1/privilege...\n');
        
        const response = await fetch(`${BASE_URL}/sell/account/v1/privilege`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
                'Content-Type': 'application/json',
                'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'
            }
        });

        const responseText = await response.text();
        console.log(`Status: ${response.status} ${response.statusText}`);
        console.log('');

        if (response.ok) {
            const data = JSON.parse(responseText);
            console.log('✅ Token is VALID!');
            console.log('Response:', JSON.stringify(data, null, 2));
            return true;
        } else {
            console.log('❌ Token validation failed');
            console.log('Response:', responseText.substring(0, 500));
            
            try {
                const errorData = JSON.parse(responseText);
                if (errorData.errors) {
                    errorData.errors.forEach(err => {
                        console.log(`\nError ${err.errorId}: ${err.message}`);
                        console.log(`Long message: ${err.longMessage || 'N/A'}`);
                    });
                }
            } catch (e) {
                // Not JSON
            }
            
            return false;
        }
    } catch (error) {
        console.error('❌ Error testing token:', error.message);
        return false;
    }
}

// Test 2: Try inventory endpoint
async function testInventoryEndpoint() {
    try {
        console.log('\n📡 Testing token with GET /sell/inventory/v1/inventory_item...\n');
        
        const response = await fetch(`${BASE_URL}/sell/inventory/v1/inventory_item?limit=1`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
                'Content-Type': 'application/json',
                'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'
            }
        });

        const responseText = await response.text();
        console.log(`Status: ${response.status} ${response.statusText}`);

        if (response.ok) {
            console.log('✅ Inventory API access granted!');
            const data = JSON.parse(responseText);
            console.log(`Found ${data.total || 0} inventory items`);
            return true;
        } else {
            console.log('❌ Inventory API access denied');
            console.log('Response:', responseText.substring(0, 300));
            return false;
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
        return false;
    }
}

async function main() {
    const tokenValid = await testToken();
    
    if (tokenValid) {
        await testInventoryEndpoint();
    } else {
        console.log('\n💡 Troubleshooting:');
        console.log('   1. Token might be expired - try refreshing it');
        console.log('   2. Token might be for sandbox - check if you need sandbox URL');
        console.log('   3. Token might need to be regenerated');
        console.log('   4. Check if token has required scopes');
        console.log('\n   To refresh token, you may need to:');
        console.log('   - Visit: https://developer.ebay.com/my/keys');
        console.log('   - Generate a new token');
        console.log('   - Or use: node ebay-oauth-helper.js refresh');
    }
}

main().catch(error => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
});
