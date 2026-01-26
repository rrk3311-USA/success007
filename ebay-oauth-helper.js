/**
 * eBay OAuth 2.0 Helper Script
 * 
 * This script helps you complete the OAuth 2.0 flow to get an access token.
 * 
 * Usage:
 *   1. node ebay-oauth-helper.js generate-url
 *      - Generates the authorization URL you need to visit
 * 
 *   2. node ebay-oauth-helper.js exchange-code <authorization_code>
 *      - Exchanges the authorization code for an access token
 */

import { readFileSync } from 'fs';
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
    console.error('   Error details:', err);
    process.exit(1);
}

const EBAY_CONFIG = CONFIG.EBAY_API;

// Hardcoded scopes - only inventory scope
const scopes = [
  "https://api.ebay.com/oauth/api_scope/sell.inventory"
];

/**
 * Generate OAuth authorization URL
 */
function generateAuthUrl() {
    const {
        CLIENT_ID,
        REDIRECT_URI,
        RU_NAME
    } = EBAY_CONFIG;

    if (!CLIENT_ID || CLIENT_ID.includes('...')) {
        console.error('❌ Please set your full CLIENT_ID in config.js');
        console.log('   Get it from: https://developer.ebay.com/my/keys');
        return null;
    }

    const scopeString = scopes.join(' ');
    // eBay uses RuName as redirect_uri (no separate ruName parameter needed)
    const authUrl = `${EBAY_CONFIG.AUTH_URL}?` +
        `client_id=${CLIENT_ID}&` +
        `response_type=code&` +
        `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
        `scope=${encodeURIComponent(scopeString)}`;

    return authUrl;
}

/**
 * Exchange authorization code for access token
 */
async function exchangeCodeForToken(authorizationCode) {
    const {
        CLIENT_ID,
        CLIENT_SECRET,
        TOKEN_URL,
        REDIRECT_URI
    } = EBAY_CONFIG;

    if (!CLIENT_ID || CLIENT_ID.includes('...')) {
        console.error('❌ Please set your full CLIENT_ID in config.js');
        return null;
    }

    if (!CLIENT_SECRET) {
        console.error('❌ Please set your CLIENT_SECRET in config.js');
        console.log('   Get it from: https://developer.ebay.com/my/keys');
        return null;
    }

    console.log('🔄 Exchanging authorization code for access token...');
    console.log(`   Token URL: ${TOKEN_URL}`);
    console.log('');

    try {
        // Create Basic Auth header
        const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

        const response = await fetch(TOKEN_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${credentials}`
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code: authorizationCode,
                redirect_uri: REDIRECT_URI
            })
        });

        const responseText = await response.text();
        let responseData;

        try {
            responseData = JSON.parse(responseText);
        } catch {
            console.error('❌ Invalid JSON response:', responseText);
            return null;
        }

        if (!response.ok) {
            console.error(`❌ Error (${response.status}):`, responseData);
            return null;
        }

        console.log('✅ Successfully obtained access token!');
        console.log('');
        console.log('Token Details:');
        console.log(`   Access Token: ${responseData.access_token.substring(0, 50)}...`);
        console.log(`   Token Type: ${responseData.token_type}`);
        console.log(`   Expires In: ${responseData.expires_in} seconds`);
        if (responseData.refresh_token) {
            console.log(`   Refresh Token: ${responseData.refresh_token.substring(0, 50)}...`);
        }
        console.log('');

        // Update config
        console.log('💡 To save this token, update deploy-site/config.js:');
        console.log('');
        console.log(`   ACCESS_TOKEN: '${responseData.access_token}',`);
        if (responseData.refresh_token) {
            console.log(`   REFRESH_TOKEN: '${responseData.refresh_token}',`);
        }
        const expiresDate = new Date(Date.now() + responseData.expires_in * 1000);
        console.log(`   EXPIRES: '${expiresDate.toUTCString()}',`);
        console.log('');

        return responseData;
    } catch (error) {
        console.error('❌ Error exchanging code:', error.message);
        return null;
    }
}

/**
 * Refresh access token using refresh token
 */
async function refreshAccessToken() {
    const {
        CLIENT_ID,
        CLIENT_SECRET,
        TOKEN_URL,
        REFRESH_TOKEN
    } = EBAY_CONFIG;

    if (!REFRESH_TOKEN) {
        console.error('❌ No REFRESH_TOKEN found in config.js');
        return null;
    }

    console.log('🔄 Refreshing access token...');

    try {
        const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

        const response = await fetch(TOKEN_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${credentials}`
            },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: REFRESH_TOKEN,
                scope: EBAY_CONFIG.SCOPES.join(' ')
            })
        });

        const responseData = await response.json();

        if (!response.ok) {
            console.error(`❌ Error (${response.status}):`, responseData);
            return null;
        }

        console.log('✅ Successfully refreshed access token!');
        console.log(`   New Access Token: ${responseData.access_token.substring(0, 50)}...`);
        
        return responseData;
    } catch (error) {
        console.error('❌ Error refreshing token:', error.message);
        return null;
    }
}

// Main
const command = process.argv[2];

if (command === 'generate-url') {
    console.log('='.repeat(60));
    console.log('eBay OAuth 2.0 - Generate Authorization URL');
    console.log('='.repeat(60));
    console.log('');

    const authUrl = generateAuthUrl();
    if (authUrl) {
        console.log('📋 Step 1: Visit this URL to authorize:');
        console.log('');
        console.log(authUrl);
        console.log('');
        console.log('📋 Step 2: After authorization, eBay will redirect you to:');
        console.log(`   Your configured redirect URL with ?code=AUTHORIZATION_CODE`);
        console.log(`   (RuName: ${EBAY_CONFIG.RU_NAME})`);
        console.log('');
        console.log('📋 Step 3: Copy the authorization code from the URL');
        console.log('📋 Step 4: Run: node ebay-oauth-helper.js exchange-code <code>');
    }
} else if (command === 'exchange-code') {
    const code = process.argv[3];
    if (!code) {
        console.error('❌ Please provide the authorization code');
        console.log('   Usage: node ebay-oauth-helper.js exchange-code <code>');
        process.exit(1);
    }

    console.log('='.repeat(60));
    console.log('eBay OAuth 2.0 - Exchange Code for Token');
    console.log('='.repeat(60));
    console.log('');

    await exchangeCodeForToken(code);
} else if (command === 'refresh') {
    console.log('='.repeat(60));
    console.log('eBay OAuth 2.0 - Refresh Access Token');
    console.log('='.repeat(60));
    console.log('');

    await refreshAccessToken();
} else {
    console.log('eBay OAuth 2.0 Helper');
    console.log('');
    console.log('Usage:');
    console.log('  node ebay-oauth-helper.js generate-url');
    console.log('    - Generate the authorization URL');
    console.log('');
    console.log('  node ebay-oauth-helper.js exchange-code <authorization_code>');
    console.log('    - Exchange authorization code for access token');
    console.log('');
    console.log('  node ebay-oauth-helper.js refresh');
    console.log('    - Refresh access token using refresh token');
    console.log('');
}
