/**
 * Zoho OAuth Helper
 * Generates access tokens for Zoho CRM API
 * 
 * Usage:
 * 1. Make sure ZOHO_CLIENT_ID and ZOHO_CLIENT_SECRET are in .env
 * 2. Run: node zoho-oauth-helper.js
 * 3. Follow the instructions to authorize and get tokens
 */

import dotenv from 'dotenv';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import readline from 'readline';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ZOHO_CLIENT_ID = process.env.ZOHO_CLIENT_ID;
const ZOHO_CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET;
const ZOHO_REDIRECT_URI = process.env.ZOHO_REDIRECT_URI || 'https://successchemistry.com/zoho/callback';

// Zoho OAuth URLs (based on your data center)
// Common data centers: accounts.zoho.com, accounts.zoho.eu, accounts.zoho.in, accounts.zoho.com.au
const ZOHO_AUTH_URL = 'https://accounts.zoho.com/oauth/v2/auth';
const ZOHO_TOKEN_URL = 'https://accounts.zoho.com/oauth/v2/token';

// Required scopes for Zoho CRM and ZiaAgents
const SCOPES = [
    'ZohoCRM.modules.ALL',
    'ZohoCRM.settings.ALL',
    'ZohoCRM.users.READ',
    'ZiaAgents.agents.TRIGGER'  // For ZiaAgents API access
].join(',');

if (!ZOHO_CLIENT_ID || !ZOHO_CLIENT_SECRET) {
    console.error('❌ ZOHO_CLIENT_ID and ZOHO_CLIENT_SECRET must be set in .env file');
    console.error('   Get them from: https://api-console.zoho.com/');
    process.exit(1);
}

/**
 * Step 1: Generate authorization URL
 */
function generateAuthUrl() {
    const state = Math.random().toString(36).substring(7);
    const params = new URLSearchParams({
        client_id: ZOHO_CLIENT_ID,
        scope: SCOPES,
        response_type: 'code',
        access_type: 'offline', // This ensures we get a refresh token
        redirect_uri: ZOHO_REDIRECT_URI,
        state: state
    });

    const authUrl = `${ZOHO_AUTH_URL}?${params.toString()}`;
    return { authUrl, state };
}

/**
 * Step 2: Exchange authorization code for tokens
 */
async function getTokensFromCode(authCode) {
    try {
        const response = await fetch(ZOHO_TOKEN_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                client_id: ZOHO_CLIENT_ID,
                client_secret: ZOHO_CLIENT_SECRET,
                redirect_uri: ZOHO_REDIRECT_URI,
                code: authCode
            })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Token exchange failed: ${response.status} ${error}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error exchanging code for tokens:', error);
        throw error;
    }
}

/**
 * Step 3: Refresh access token using refresh token
 */
async function refreshAccessToken(refreshToken) {
    try {
        const response = await fetch(ZOHO_TOKEN_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                client_id: ZOHO_CLIENT_ID,
                client_secret: ZOHO_CLIENT_SECRET,
                refresh_token: refreshToken
            })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Token refresh failed: ${response.status} ${error}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error refreshing token:', error);
        throw error;
    }
}

/**
 * Update .env file with tokens
 */
function updateEnvFile(accessToken, refreshToken) {
    const envPath = join(__dirname, '.env');
    let envContent = readFileSync(envPath, 'utf8');

    // Update or add access token
    if (envContent.includes('ZOHO_CRM_ACCESS_TOKEN=')) {
        envContent = envContent.replace(
            /ZOHO_CRM_ACCESS_TOKEN=.*/,
            `ZOHO_CRM_ACCESS_TOKEN=${accessToken}`
        );
    } else {
        // Add after ZOHO_CRM_API_URL
        envContent = envContent.replace(
            /(ZOHO_CRM_API_URL=.*)/,
            `$1\nZOHO_CRM_ACCESS_TOKEN=${accessToken}`
        );
    }

    // Update or add refresh token
    if (envContent.includes('ZOHO_REFRESH_TOKEN=')) {
        envContent = envContent.replace(
            /ZOHO_REFRESH_TOKEN=.*/,
            `ZOHO_REFRESH_TOKEN=${refreshToken}`
        );
    } else {
        // Add after access token
        envContent = envContent.replace(
            /(ZOHO_CRM_ACCESS_TOKEN=.*)/,
            `$1\nZOHO_REFRESH_TOKEN=${refreshToken}`
        );
    }

    writeFileSync(envPath, envContent);
    console.log('✅ Updated .env file with tokens');
}

/**
 * Main OAuth flow
 */
async function main() {
    console.log('🔐 Zoho OAuth Token Generator\n');
    console.log('Client ID:', ZOHO_CLIENT_ID.substring(0, 20) + '...');
    console.log('Redirect URI:', ZOHO_REDIRECT_URI);
    console.log('');

    // Check if we have a refresh token
    const existingRefreshToken = process.env.ZOHO_REFRESH_TOKEN;
    
    if (existingRefreshToken) {
        console.log('📋 Found existing refresh token. Options:');
        console.log('   1. Use refresh token to get new access token');
        console.log('   2. Start new OAuth flow (get new tokens)');
        console.log('');

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        const answer = await new Promise(resolve => {
            rl.question('Choose option (1 or 2): ', resolve);
        });
        rl.close();

        if (answer === '1') {
            console.log('\n🔄 Refreshing access token...');
            try {
                const tokenData = await refreshAccessToken(existingRefreshToken);
                console.log('✅ New access token obtained!');
                console.log('   Access Token:', tokenData.access_token.substring(0, 30) + '...');
                console.log('   Expires in:', tokenData.expires_in, 'seconds');
                
                // Update .env with new access token
                updateEnvFile(tokenData.access_token, existingRefreshToken);
                console.log('\n✅ Done! Your access token has been updated in .env');
                return;
            } catch (error) {
                console.error('❌ Failed to refresh token:', error.message);
                console.log('   Starting new OAuth flow...\n');
            }
        }
    }

    // Generate authorization URL
    const { authUrl, state } = generateAuthUrl();
    
    console.log('📋 Step 1: Authorize the application');
    console.log('   Visit this URL in your browser:');
    console.log(`   ${authUrl}\n`);
    console.log('   After authorizing, you will be redirected to:');
    console.log(`   ${ZOHO_REDIRECT_URI}?code=AUTHORIZATION_CODE&state=${state}\n`);

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const authCode = await new Promise(resolve => {
        rl.question('📝 Paste the authorization code from the redirect URL: ', resolve);
    });
    rl.close();

    if (!authCode) {
        console.error('❌ No authorization code provided');
        process.exit(1);
    }

    console.log('\n🔄 Exchanging authorization code for tokens...');
    try {
        const tokenData = await getTokensFromCode(authCode.trim());
        
        console.log('✅ Tokens obtained successfully!');
        console.log('   Access Token:', tokenData.access_token.substring(0, 30) + '...');
        console.log('   Refresh Token:', tokenData.refresh_token ? tokenData.refresh_token.substring(0, 30) + '...' : 'Not provided');
        console.log('   Expires in:', tokenData.expires_in, 'seconds');
        console.log('   Token Type:', tokenData.token_type);

        if (!tokenData.refresh_token) {
            console.warn('⚠️  No refresh token received. Make sure access_type=offline is set.');
        }

        // Update .env file
        updateEnvFile(tokenData.access_token, tokenData.refresh_token || existingRefreshToken || '');
        
        console.log('\n✅ Done! Your tokens have been saved to .env');
        console.log('   You can now use Zoho CRM API integration.');
        
    } catch (error) {
        console.error('❌ Failed to get tokens:', error.message);
        process.exit(1);
    }
}

// Run the OAuth flow
main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
