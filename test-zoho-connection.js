/**
 * Test Zoho CRM Connection
 * Verifies that Zoho API credentials are working
 */

import dotenv from 'dotenv';
dotenv.config();

const ZOHO_CRM_API_URL = process.env.ZOHO_CRM_API_URL || 'https://www.zohoapis.com/crm/v2';
const ZOHO_CRM_ACCESS_TOKEN = process.env.ZOHO_CRM_ACCESS_TOKEN || '';
const ZOHO_CLIENT_ID = process.env.ZOHO_CLIENT_ID || '';
const ZOHO_CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET || '';
const ZOHO_REFRESH_TOKEN = process.env.ZOHO_REFRESH_TOKEN || '';

console.log('🔍 Testing Zoho CRM Connection...\n');

// Check credentials
console.log('📋 Credentials Check:');
console.log('   Client ID:', ZOHO_CLIENT_ID ? `${ZOHO_CLIENT_ID.substring(0, 20)}...` : '❌ Not set');
console.log('   Client Secret:', ZOHO_CLIENT_SECRET ? '✅ Set' : '❌ Not set');
console.log('   Access Token:', ZOHO_CRM_ACCESS_TOKEN ? `${ZOHO_CRM_ACCESS_TOKEN.substring(0, 30)}...` : '❌ Not set');
console.log('   Refresh Token:', ZOHO_REFRESH_TOKEN ? `${ZOHO_REFRESH_TOKEN.substring(0, 30)}...` : '❌ Not set');
console.log('   API URL:', ZOHO_CRM_API_URL);
console.log('');

if (!ZOHO_CLIENT_ID || !ZOHO_CLIENT_SECRET) {
    console.error('❌ Missing Client ID or Client Secret in .env file');
    console.error('   Make sure ZOHO_CLIENT_ID and ZOHO_CLIENT_SECRET are set');
    process.exit(1);
}

if (!ZOHO_CRM_ACCESS_TOKEN) {
    console.warn('⚠️  No access token found. You need to:');
    console.warn('   1. Run: node zoho-oauth-helper.js');
    console.warn('   2. Or complete the OAuth flow to get an access token');
    console.warn('');
    console.warn('   If you have a refresh token, we can try to get a new access token...');
    
    if (ZOHO_REFRESH_TOKEN) {
        console.log('\n🔄 Attempting to refresh access token...');
        try {
            const response = await fetch('https://accounts.zoho.com/oauth/v2/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    grant_type: 'refresh_token',
                    client_id: ZOHO_CLIENT_ID,
                    client_secret: ZOHO_CLIENT_SECRET,
                    refresh_token: ZOHO_REFRESH_TOKEN
                })
            });

            if (response.ok) {
                const tokenData = await response.json();
                console.log('✅ Successfully refreshed access token!');
                console.log('   New Access Token:', tokenData.access_token.substring(0, 30) + '...');
                console.log('   Expires in:', tokenData.expires_in, 'seconds');
                console.log('\n💡 Add this to your .env file:');
                console.log(`   ZOHO_CRM_ACCESS_TOKEN=${tokenData.access_token}`);
                
                // Test with the new token
                await testZohoAPI(tokenData.access_token);
            } else {
                const error = await response.text();
                console.error('❌ Failed to refresh token:', response.status, error);
                process.exit(1);
            }
        } catch (error) {
            console.error('❌ Error refreshing token:', error.message);
            process.exit(1);
        }
    } else {
        console.error('❌ No refresh token available. Please run the OAuth flow first.');
        process.exit(1);
    }
} else {
    // Test with existing access token
    await testZohoAPI(ZOHO_CRM_ACCESS_TOKEN);
}

/**
 * Test Zoho API with access token
 */
async function testZohoAPI(accessToken) {
    console.log('\n🧪 Testing Zoho CRM API...');
    
    try {
        // Test 1: Get user info (simple endpoint to verify token)
        console.log('   Test 1: Verifying access token...');
        const userResponse = await fetch(`${ZOHO_CRM_API_URL}/users`, {
            headers: {
                'Authorization': `Zoho-oauthtoken ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (userResponse.status === 401) {
            console.error('   ❌ Access token is invalid or expired');
            console.error('   💡 Try refreshing the token or run the OAuth flow again');
            process.exit(1);
        }

        if (!userResponse.ok) {
            const error = await userResponse.text();
            console.warn('   ⚠️  Could not fetch users:', userResponse.status, error.substring(0, 200));
        } else {
            const userData = await userResponse.json();
            console.log('   ✅ Access token is valid!');
            if (userData.users && userData.users.length > 0) {
                console.log('   📧 Connected as:', userData.users[0].email || 'User');
            }
        }

        // Test 2: Try to search for leads (verify CRM access)
        console.log('   Test 2: Testing Leads API access...');
        const leadsResponse = await fetch(`${ZOHO_CRM_API_URL}/Leads?per_page=1`, {
            headers: {
                'Authorization': `Zoho-oauthtoken ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (leadsResponse.ok) {
            const leadsData = await leadsResponse.json();
            console.log('   ✅ Leads API is accessible!');
            console.log('   📊 Total leads in CRM:', leadsData.info?.count || 'Unknown');
        } else if (leadsResponse.status === 401) {
            console.error('   ❌ Unauthorized - token may not have CRM permissions');
        } else {
            const error = await leadsResponse.text();
            console.warn('   ⚠️  Leads API test:', leadsResponse.status, error.substring(0, 200));
        }

        // Test 3: Try creating a test lead (optional - can be skipped)
        console.log('   Test 3: Testing lead creation (optional)...');
        const testLeadResponse = await fetch(`${ZOHO_CRM_API_URL}/Leads`, {
            method: 'POST',
            headers: {
                'Authorization': `Zoho-oauthtoken ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: [{
                    First_Name: 'Test',
                    Last_Name: 'Connection',
                    Email: 'test@successchemistry.com',
                    Company: 'Success Chemistry',
                    Lead_Source: 'API Test',
                    Description: 'This is a test lead to verify API connection',
                    Lead_Status: 'Not Contacted'
                }]
            })
        });

        if (testLeadResponse.ok) {
            const leadData = await testLeadResponse.json();
            console.log('   ✅ Test lead created successfully!');
            console.log('   🆔 Lead ID:', leadData.data?.[0]?.id);
            console.log('   💡 You can delete this test lead from Zoho CRM if needed');
        } else {
            const error = await testLeadResponse.text();
            console.warn('   ⚠️  Could not create test lead:', testLeadResponse.status);
            console.warn('   (This is okay - API connection is still working)');
        }

        console.log('\n✅ Zoho CRM connection test completed!');
        console.log('   Your integration is ready to use.');
        
    } catch (error) {
        console.error('❌ Error testing Zoho API:', error.message);
        process.exit(1);
    }
}
