/**
 * Get OAuth Token with ZiaAgents Scope
 * 
 * This script helps you get a new OAuth token with the ZiaAgents.agents.TRIGGER scope
 * 
 * Usage: node get-zia-token.js
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
const ZOHO_REDIRECT_URI = process.env.ZOHO_REDIRECT_URI || 'http://localhost:8080/zoho/callback';

const ZOHO_AUTH_URL = 'https://accounts.zoho.com/oauth/v2/auth';
const ZOHO_TOKEN_URL = 'https://accounts.zoho.com/oauth/v2/token';

// Required scopes including ZiaAgents
const SCOPES = [
    'ZohoCRM.modules.ALL',
    'ZohoCRM.settings.ALL',
    'ZohoCRM.users.READ',
    'ZiaAgents.agents.TRIGGER'  // Required for ZiaAgents API
].join(',');

if (!ZOHO_CLIENT_ID || !ZOHO_CLIENT_SECRET) {
    console.error('❌ ZOHO_CLIENT_ID and ZOHO_CLIENT_SECRET must be set in .env file');
    process.exit(1);
}

function generateAuthUrl() {
    const state = Math.random().toString(36).substring(7);
    const params = new URLSearchParams({
        client_id: ZOHO_CLIENT_ID,
        scope: SCOPES,
        response_type: 'code',
        access_type: 'offline',
        redirect_uri: ZOHO_REDIRECT_URI,
        state: state
    });

    const authUrl = `${ZOHO_AUTH_URL}?${params.toString()}`;
    return { authUrl, state };
}

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
        envContent = envContent.replace(
            /(ZOHO_CRM_ACCESS_TOKEN=.*)/,
            `$1\nZOHO_REFRESH_TOKEN=${refreshToken}`
        );
    }

    writeFileSync(envPath, envContent);
    console.log('✅ Updated .env file with new tokens');
}

async function main() {
    console.log('🔐 Zoho OAuth Token Generator (with ZiaAgents scope)\n');
    console.log('Client ID:', ZOHO_CLIENT_ID.substring(0, 20) + '...');
    console.log('Redirect URI:', ZOHO_REDIRECT_URI);
    console.log('Required Scopes:', SCOPES);
    console.log('');

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
        updateEnvFile(tokenData.access_token, tokenData.refresh_token || '');
        
        console.log('\n✅ Done! Your tokens have been saved to .env');
        console.log('   You can now run: node train-zoho-zia-agent.js train');
        
    } catch (error) {
        console.error('❌ Failed to get tokens:', error.message);
        process.exit(1);
    }
}

main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
