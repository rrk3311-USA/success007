/**
 * Get New eBay Access Token
 * 
 * Uses refresh token from .env to get a new access token
 * 
 * Usage:
 *   node get-new-ebay-token.js
 */

import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const CLIENT_ID = process.env.EBAY_CLIENT_ID;
const CLIENT_SECRET = process.env.EBAY_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.EBAY_REFRESH_TOKEN;

if (!CLIENT_ID) {
    console.error('❌ EBAY_CLIENT_ID not found in .env');
    process.exit(1);
}

if (!CLIENT_SECRET) {
    console.error('❌ EBAY_CLIENT_SECRET not found in .env');
    process.exit(1);
}

if (!REFRESH_TOKEN) {
    console.error('❌ EBAY_REFRESH_TOKEN not found in .env');
    console.log('💡 You may need to complete the OAuth flow again');
    process.exit(1);
}

async function getNewToken() {
    console.log('='.repeat(70));
    console.log('Getting New eBay Access Token');
    console.log('='.repeat(70));
    console.log('');
    console.log('📡 Requesting new token...\n');
    
    // Create Basic Auth header
    const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
    
    // Build request body - use only the scope that was originally granted
    const scopes = [
        'https://api.ebay.com/oauth/api_scope/sell.inventory'
    ];
    
    const params = new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: REFRESH_TOKEN,
        scope: scopes.join(' ')
    });
    
    try {
        const response = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
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
        
        if (!response.ok) {
            console.error(`❌ Token refresh failed (${response.status}):`);
            console.log(JSON.stringify(responseData, null, 2));
            console.log('');
            
            if (response.status === 400) {
                console.log('💡 The refresh token may be expired.');
                console.log('   You may need to complete the OAuth flow again:');
                console.log('   node ebay-oauth-helper.js generate-url');
            }
            
            return null;
        }
        
        console.log('✅ New token received!\n');
        console.log('📋 Token Details:');
        console.log(`   Access Token: ${responseData.access_token.substring(0, 50)}...`);
        console.log(`   Token Type: ${responseData.token_type}`);
        console.log(`   Expires In: ${responseData.expires_in} seconds (${Math.round(responseData.expires_in / 60)} minutes)`);
        
        if (responseData.refresh_token) {
            console.log(`   New Refresh Token: ${responseData.refresh_token.substring(0, 50)}...`);
        }
        
        const expiresDate = new Date(Date.now() + responseData.expires_in * 1000);
        
        console.log('');
        console.log('='.repeat(70));
        console.log('💡 Add this to your .env file:');
        console.log('='.repeat(70));
        console.log('');
        console.log(`EBAY_ACCESS_TOKEN="${responseData.access_token}"`);
        if (responseData.refresh_token) {
            console.log(`EBAY_REFRESH_TOKEN="${responseData.refresh_token}"`);
        }
        console.log(`EBAY_TOKEN_EXPIRES=${expiresDate.toUTCString()}`);
        console.log('');
        console.log('✅ Copy the values above and update your .env file!');
        console.log('');
        
        return responseData;
        
    } catch (error) {
        console.error('❌ Request failed:', error.message);
        return null;
    }
}

async function main() {
    const result = await getNewToken();
    
    if (result) {
        console.log('🎉 Token refresh successful!');
        console.log('   Update your .env file with the new token values above.');
    } else {
        console.log('');
        console.log('⚠️  Token refresh failed.');
        process.exit(1);
    }
}

main().catch(error => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
});
