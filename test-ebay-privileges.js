/**
 * Test eBay Account Privileges API
 * 
 * Tests: GET https://api.ebay.com/sell/account/v1/privilege
 * 
 * This endpoint returns the seller's account privileges and can verify
 * that your access token is working correctly.
 * 
 * Usage:
 *   node test-ebay-privileges.js
 */

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

const EBAY_CONFIG = CONFIG.EBAY_API;
const BASE_URL = EBAY_CONFIG.USE_SANDBOX ? EBAY_CONFIG.SANDBOX_BASE_URL : EBAY_CONFIG.BASE_URL;

/**
 * Test Account Privileges endpoint
 */
async function testAccountPrivileges() {
    const token = EBAY_CONFIG.ACCESS_TOKEN;
    
    if (!token) {
        console.error('❌ No ACCESS_TOKEN found in config.js');
        console.log('💡 Run: node ebay-oauth-helper.js exchange-code <code>');
        return null;
    }
    
    console.log('='.repeat(60));
    console.log('eBay Account Privileges Test');
    console.log('='.repeat(60));
    console.log('');
    console.log('Testing endpoint: GET /sell/account/v1/privilege');
    console.log(`Base URL: ${BASE_URL}`);
    console.log(`Token: ${token.substring(0, 30)}...`);
    console.log('');
    
    const url = `${BASE_URL}/sell/account/v1/privilege`;
    
    try {
        console.log('📡 Sending request...');
        console.log(`   URL: ${url}`);
        console.log(`   Method: GET`);
        console.log(`   Headers: Authorization: Bearer <ACCESS_TOKEN>`);
        console.log('');
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'
            }
        });
        
        const responseText = await response.text();
        let responseData;
        
        try {
            responseData = JSON.parse(responseText);
        } catch {
            console.error('❌ Invalid JSON response:');
            console.log(responseText);
            return null;
        }
        
        console.log(`📊 Response Status: ${response.status} ${response.statusText}`);
        console.log('');
        
        if (!response.ok) {
            console.error('❌ Request failed!');
            console.log('');
            console.log('Error Details:');
            console.log(JSON.stringify(responseData, null, 2));
            console.log('');
            
            if (response.status === 401) {
                console.log('💡 This usually means:');
                console.log('   - Access token is expired');
                console.log('   - Access token is invalid');
                console.log('   - Token format is incorrect');
                console.log('');
                console.log('Try: node ebay-oauth-helper.js refresh');
            } else if (response.status === 403) {
                console.log('💡 This usually means:');
                console.log('   - Token lacks required scopes');
                console.log('   - Account doesn\'t have required privileges');
                console.log('   - Production access not enabled');
            }
            
            return null;
        }
        
        console.log('✅ Success! Account privileges retrieved.');
        console.log('');
        console.log('Account Privileges:');
        console.log(JSON.stringify(responseData, null, 2));
        console.log('');
        
        // Parse and display privileges in a readable format
        if (responseData.sellerRegistrationCompleted !== undefined) {
            console.log('📋 Privilege Details:');
            console.log(`   Seller Registration Completed: ${responseData.sellerRegistrationCompleted}`);
            
            if (responseData.sellingLimits) {
                console.log(`   Selling Limits:`);
                if (responseData.sellingLimits.amount) {
                    console.log(`     Amount: ${responseData.sellingLimits.amount.value} ${responseData.sellingLimits.amount.currency}`);
                }
                if (responseData.sellingLimits.quantity) {
                    console.log(`     Quantity: ${responseData.sellingLimits.quantity}`);
                }
            }
            
            if (responseData.privileges) {
                console.log(`   Privileges:`);
                responseData.privileges.forEach(priv => {
                    console.log(`     - ${priv.privilege}: ${priv.status || 'N/A'}`);
                });
            }
        }
        
        console.log('');
        console.log('='.repeat(60));
        console.log('✅ Token is valid and working!');
        console.log('='.repeat(60));
        
        return responseData;
        
    } catch (error) {
        console.error('❌ Request failed:', error.message);
        console.error('   Stack:', error.stack);
        return null;
    }
}

/**
 * Main function
 */
async function main() {
    const result = await testAccountPrivileges();
    
    if (result) {
        console.log('');
        console.log('🎉 Your eBay API access token is working correctly!');
        console.log('   You can now proceed with creating listings.');
    } else {
        console.log('');
        console.log('⚠️  Token test failed. Please check:');
        console.log('   1. Access token is valid');
        console.log('   2. Token has required scopes');
        console.log('   3. Account has seller privileges');
        process.exit(1);
    }
}

main().catch(error => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
});
