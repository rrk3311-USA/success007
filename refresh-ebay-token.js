/**
 * Refresh eBay OAuth Token
 * 
 * This script refreshes your eBay OAuth access token using a refresh token.
 * 
 * Usage:
 *   node refresh-ebay-token.js [refresh_token]
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
        console.error('Debug: configModule keys:', Object.keys(configModule));
        console.error('Debug: CONFIG type:', typeof CONFIG);
        throw new Error('EBAY_API configuration not found');
    }
} catch (err) {
    console.error('❌ Could not load config.js:', err.message);
    console.error('   Error details:', err.stack);
    process.exit(1);
}

const EBAY_CONFIG = CONFIG.EBAY_API;
const TOKEN_URL = EBAY_CONFIG.TOKEN_URL || 'https://api.ebay.com/identity/v1/oauth2/token';

/**
 * Refresh access token
 */
async function refreshToken(refreshToken = null) {
    const clientId = EBAY_CONFIG.CLIENT_ID;
    const clientSecret = EBAY_CONFIG.CLIENT_SECRET;
    const refreshTokenToUse = refreshToken || EBAY_CONFIG.REFRESH_TOKEN;
    
    if (!clientId) {
        console.error('❌ CLIENT_ID not found in config.js');
        return null;
    }
    
    if (!clientSecret) {
        console.error('❌ CLIENT_SECRET not found in config.js');
        console.log('💡 Get it from: https://developer.ebay.com/my/keys');
        console.log('   Then add it to deploy-site/config.js');
        return null;
    }
    
    if (!refreshTokenToUse) {
        console.error('❌ REFRESH_TOKEN not found');
        console.log('💡 Options:');
        console.log('   1. Pass refresh token as argument: node refresh-ebay-token.js <token>');
        console.log('   2. Add REFRESH_TOKEN to config.js');
        console.log('   3. Complete OAuth flow first: node ebay-oauth-helper.js exchange-code <code>');
        return null;
    }
    
    console.log('='.repeat(60));
    console.log('eBay OAuth Token Refresh');
    console.log('='.repeat(60));
    console.log('');
    console.log('Request Details:');
    console.log(`   URL: ${TOKEN_URL}`);
    console.log(`   Method: POST`);
    console.log(`   Grant Type: refresh_token`);
    console.log(`   Client ID: ${clientId}`);
    console.log(`   Refresh Token: ${refreshTokenToUse.substring(0, 30)}...`);
    console.log('');
    
    // Create Basic Auth header
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    
    // Build request body
    const scopes = EBAY_CONFIG.SCOPES || [
        'https://api.ebay.com/oauth/api_scope/sell.inventory',
        'https://api.ebay.com/oauth/api_scope/sell.account',
        'https://api.ebay.com/oauth/api_scope/sell.marketing',
        'https://api.ebay.com/oauth/api_scope/commerce.catalog'
    ];
    
    const params = new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshTokenToUse,
        scope: scopes.join(' ')
    });
    
    try {
        console.log('📡 Sending refresh token request...');
        
        const response = await fetch(TOKEN_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${credentials}`
            },
            body: params.toString()
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
            console.error('❌ Token refresh failed!');
            console.log('');
            console.log('Error Details:');
            console.log(JSON.stringify(responseData, null, 2));
            console.log('');
            
            if (response.status === 400) {
                console.log('💡 Common issues:');
                console.log('   - Refresh token is expired or invalid');
                console.log('   - Client secret is incorrect');
                console.log('   - Need to complete OAuth flow again');
            } else if (response.status === 401) {
                console.log('💡 Authentication failed:');
                console.log('   - Check CLIENT_ID and CLIENT_SECRET');
                console.log('   - Verify credentials are correct');
            }
            
            return null;
        }
        
        console.log('✅ Token refreshed successfully!');
        console.log('');
        console.log('New Token Details:');
        console.log(`   Access Token: ${responseData.access_token.substring(0, 50)}...`);
        console.log(`   Token Type: ${responseData.token_type}`);
        console.log(`   Expires In: ${responseData.expires_in} seconds`);
        
        if (responseData.refresh_token) {
            console.log(`   Refresh Token: ${responseData.refresh_token.substring(0, 50)}...`);
        }
        
        if (responseData.token_type === 'Bearer') {
            console.log(`   ✅ Valid Bearer token format!`);
        }
        
        console.log('');
        console.log('='.repeat(60));
        console.log('💡 Update config.js with these values:');
        console.log('='.repeat(60));
        console.log('');
        console.log(`ACCESS_TOKEN: '${responseData.access_token}',`);
        if (responseData.refresh_token) {
            console.log(`REFRESH_TOKEN: '${responseData.refresh_token}',`);
        }
        const expiresDate = new Date(Date.now() + responseData.expires_in * 1000);
        console.log(`EXPIRES: '${expiresDate.toUTCString()}',`);
        console.log('');
        
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
    const refreshTokenArg = process.argv[2];
    
    const result = await refreshToken(refreshTokenArg);
    
    if (result) {
        console.log('🎉 Token refresh successful!');
        console.log('   Update your config.js with the new token values above.');
    } else {
        console.log('');
        console.log('⚠️  Token refresh failed. Please check:');
        console.log('   1. CLIENT_SECRET is set in config.js');
        console.log('   2. REFRESH_TOKEN is valid');
        console.log('   3. Credentials are correct');
        process.exit(1);
    }
}

main().catch(error => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
});
