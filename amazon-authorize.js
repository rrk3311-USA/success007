/**
 * Amazon SP-API Authorization Helper
 * 
 * This script helps you:
 * 1. Generate authorization URL
 * 2. Exchange authorization code for refresh token
 * 
 * Usage:
 *   node amazon-authorize.js                    # Generate auth URL
 *   node amazon-authorize.js --code CODE        # Exchange code for token
 */

import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const LWA_CLIENT_ID = process.env.AMAZON_LWA_CLIENT_ID;
const LWA_CLIENT_SECRET = process.env.AMAZON_LWA_CLIENT_SECRET;
const REDIRECT_URI = process.env.AMAZON_REDIRECT_URI || 'https://successchemistry.com/amazon-oauth';
const MARKETPLACE_ID = process.env.AMAZON_MARKETPLACE_ID || 'ATVPDKIKX0DER'; // US

if (!LWA_CLIENT_ID || !LWA_CLIENT_SECRET) {
    console.error('❌ AMAZON_LWA_CLIENT_ID and AMAZON_LWA_CLIENT_SECRET required in .env');
    console.error('');
    console.error('📝 Get these from: https://developer.amazon.com/selling-partner-api/console');
    console.error('   1. Register your application');
    console.error('   2. Copy LWA Client ID and Secret');
    console.error('   3. Add to .env file');
    process.exit(1);
}

/**
 * Generate authorization URL
 */
function generateAuthUrl() {
    const scope = 'sellingpartnerapi::migration';
    const responseType = 'code';
    const state = 'amazon-auth-' + Date.now();
    
    const params = new URLSearchParams({
        client_id: LWA_CLIENT_ID,
        scope: scope,
        response_type: responseType,
        redirect_uri: REDIRECT_URI,
        state: state
    });
    
    const authUrl = `https://sellercentral.amazon.com/apps/authorize/consent?${params.toString()}`;
    
    console.log('='.repeat(70));
    console.log('Amazon SP-API Authorization');
    console.log('='.repeat(70));
    console.log('');
    console.log('📋 Step 1: Open this URL in your browser:');
    console.log('');
    console.log(authUrl);
    console.log('');
    console.log('📋 Step 2: After authorizing, you\'ll be redirected to:');
    console.log(`   ${REDIRECT_URI}?code=AUTHORIZATION_CODE&state=${state}`);
    console.log('');
    console.log('📋 Step 3: Copy the "code" parameter and run:');
    console.log(`   node amazon-authorize.js --code YOUR_AUTHORIZATION_CODE`);
    console.log('');
}

/**
 * Exchange authorization code for refresh token
 */
async function exchangeCodeForToken(authCode) {
    console.log('🔄 Exchanging authorization code for refresh token...\n');
    
    try {
        const response = await fetch('https://api.amazon.com/auth/o2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code: authCode,
                redirect_uri: REDIRECT_URI,
                client_id: LWA_CLIENT_ID,
                client_secret: LWA_CLIENT_SECRET
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error(`❌ Error (${response.status}):`);
            console.error(JSON.stringify(data, null, 2));
            return null;
        }

        console.log('✅ Successfully obtained refresh token!');
        console.log('');
        console.log('📝 Add this to your .env file:');
        console.log(`AMAZON_REFRESH_TOKEN=${data.refresh_token}`);
        console.log('');
        console.log('⚠️  Save this refresh token securely - you\'ll need it for all API calls!');
        console.log('');
        
        // Try to update .env file automatically
        try {
            const envPath = `${__dirname}/.env`;
            let envContent = readFileSync(envPath, 'utf8');
            
            if (envContent.includes('AMAZON_REFRESH_TOKEN=')) {
                envContent = envContent.replace(
                    /AMAZON_REFRESH_TOKEN=.*/,
                    `AMAZON_REFRESH_TOKEN=${data.refresh_token}`
                );
            } else {
                envContent += `\nAMAZON_REFRESH_TOKEN=${data.refresh_token}\n`;
            }
            
            writeFileSync(envPath, envContent);
            console.log('✅ Automatically updated .env file!');
        } catch (err) {
            console.log('⚠️  Could not auto-update .env - please add manually');
        }

        return data.refresh_token;
    } catch (error) {
        console.error('❌ Error exchanging code:', error.message);
        return null;
    }
}

/**
 * Main function
 */
async function main() {
    const args = process.argv.slice(2);
    const codeIndex = args.indexOf('--code');
    
    if (codeIndex !== -1 && args[codeIndex + 1]) {
        const authCode = args[codeIndex + 1];
        await exchangeCodeForToken(authCode);
    } else {
        generateAuthUrl();
    }
}

main().catch(error => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
});
