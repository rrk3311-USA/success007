/**
 * Test eBay API - List Women's Balance Product
 * Tests the eBay API integration by fetching Women's Balance product (SKU: 52274-401)
 * Uses OAuth 2.0 Bearer Token authentication
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load config - handle both CommonJS and ES module formats
let CONFIG;
try {
    const configPath = './deploy-site/config.js';
    const configContent = readFileSync(configPath, 'utf8');
    // Extract CONFIG object from the file
    const configMatch = configContent.match(/const CONFIG = ({[\s\S]*?});/);
    if (configMatch) {
        // Safely evaluate the CONFIG object
        CONFIG = eval('(' + configMatch[1] + ')');
    } else {
        throw new Error('Could not parse CONFIG');
    }
} catch (e) {
    console.warn('Could not load config.js, using defaults');
    CONFIG = {
        EBAY_API: {
            ACCESS_TOKEN: 'v^1.1#i^1#r^1#p^3#f^0#I^3#t^Ul4xMF83OjUwMTgyNjk2ODkzQUFDQ0E2M0FBODVDOTA0NjEyOTgwXzJfMSNFXjI2MA==',
            BASE_URL: 'https://api.ebay.com',
            USE_SANDBOX: false
        }
    };
}

const EBAY_CONFIG = CONFIG.EBAY_API || CONFIG.EBAU_API; // Support both names

/**
 * Fetch product from eBay API by SKU
 * Uses OAuth 2.0 Bearer Token authentication
 */
async function fetchProductBySKU(sku, customBaseUrl = null) {
    const token = EBAY_CONFIG.ACCESS_TOKEN || EBAY_CONFIG.TOKEN;
    const useSandbox = EBAY_CONFIG.USE_SANDBOX || false;
    const baseUrl = customBaseUrl || (useSandbox ? EBAY_CONFIG.SANDBOX_BASE_URL : EBAY_CONFIG.BASE_URL) || 'https://api.ebay.com';
    
    console.log('🔍 Testing eBay API...');
    console.log('Token:', token.substring(0, 30) + '...');
    console.log('Base URL:', baseUrl);
    console.log('Environment:', useSandbox ? 'SANDBOX' : 'PRODUCTION');
    console.log('SKU:', sku);
    console.log('');
    
    // eBay API endpoints for inventory/products
    const ebayEndpoints = [
        // List all inventory items
        {
            url: `${baseUrl}/sell/inventory/v1/inventory_item`,
            description: 'List all inventory items'
        },
        // Search for specific SKU in inventory
        {
            url: `${baseUrl}/sell/inventory/v1/inventory_item?sku=${sku}`,
            description: `Get inventory item by SKU: ${sku}`
        },
        // Get offers (listings)
        {
            url: `${baseUrl}/sell/inventory/v1/offer`,
            description: 'List all offers/listings'
        },
        // Catalog API - search products
        {
            url: `${baseUrl}/commerce/catalog/v1/product_summary/search?q=women+balance`,
            description: 'Search catalog for Women\'s Balance'
        },
        // Browse API - search items
        {
            url: `${baseUrl}/buy/browse/v1/item_summary/search?q=52274-401`,
            description: 'Search browse API for SKU'
        }
    ];
    
    try {
        console.log('Trying eBay API endpoints with OAuth Bearer token...\n');
        
        for (const endpoint of ebayEndpoints) {
            console.log(`📡 ${endpoint.description}`);
            console.log(`   URL: ${endpoint.url}`);
            
            try {
                // Try different authentication header formats
                const authHeaders = [
                    { name: 'Bearer Token', header: { 'Authorization': `Bearer ${token}` } },
                    { name: 'Token', header: { 'Authorization': `Token ${token}` } },
                    { name: 'X-EBAY-API-TOKEN', header: { 'X-EBAY-API-TOKEN': token } },
                    { name: 'X-EBAY-SOA-SECURITY-TOKEN', header: { 'X-EBAY-SOA-SECURITY-TOKEN': token } },
                    { name: 'X-EBAY-API-IAF-TOKEN', header: { 'X-EBAY-API-IAF-TOKEN': token } }
                ];
                
                let bestResponse = null;
                let bestError = null;
                
                for (const authMethod of authHeaders) {
                    const headers = {
                        ...authMethod.header,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US' // Required for some endpoints
                    };
                    
                    try {
                        const response = await fetch(endpoint.url, {
                            method: 'GET',
                            headers: headers
                        });
                        
                        const status = response.status;
                        console.log(`   Auth: ${authMethod.name} - Status: ${status}`);
                        
                        // Read response body once
                        const responseText = await response.text();
                        let responseData = null;
                        
                        try {
                            responseData = JSON.parse(responseText);
                        } catch {
                            // Not JSON, keep as text
                        }
                        
                        if (response.ok) {
                            console.log('   ✅ Success!');
                            console.log('');
                            
                            if (responseData) {
                                console.log('Response:', JSON.stringify(responseData, null, 2));
                                
                                // Try to find Women's Balance in the response
                                if (responseData.inventoryItems || responseData.offers || Array.isArray(responseData)) {
                                    const items = responseData.inventoryItems || responseData.offers || responseData;
                                    const womensBalance = items.find(item => 
                                        (item.sku && item.sku.includes('52274-401')) ||
                                        (item.product && item.product.title && item.product.title.toLowerCase().includes('women') && item.product.title.toLowerCase().includes('balance')) ||
                                        (item.title && item.title.toLowerCase().includes('women') && item.title.toLowerCase().includes('balance'))
                                    );
                                    
                                    if (womensBalance) {
                                        console.log('\n✅ Found Women\'s Balance product:');
                                        console.log(JSON.stringify(womensBalance, null, 2));
                                        return womensBalance;
                                    } else {
                                        console.log(`\n📋 Found ${items.length} items. Searching for Women's Balance...`);
                                        console.log('Sample items:');
                                        items.slice(0, 3).forEach((item, idx) => {
                                            const title = item.product?.title || item.title || item.sku || 'Unknown';
                                            console.log(`   ${idx + 1}. ${title} (SKU: ${item.sku || 'N/A'})`);
                                        });
                                    }
                                }
                            } else {
                                console.log('Response:', responseText.substring(0, 500));
                            }
                            
                            return responseData || responseText;
                        } else {
                            // Store error details
                            if (!bestResponse || (status < bestResponse.status && status >= 400)) {
                                bestResponse = { status, text: responseText, data: responseData };
                            }
                            
                            if (responseData) {
                                const errorMsg = responseData.errors?.[0]?.message || 
                                               responseData.error?.message || 
                                               responseData.message || 
                                               responseText.substring(0, 200);
                                bestError = errorMsg;
                            } else {
                                bestError = responseText.substring(0, 200);
                            }
                        }
                    } catch (err) {
                        console.log(`   ❌ Request failed: ${err.message}`);
                    }
                }
                
                // Show best error if all methods failed
                if (bestResponse && bestResponse.status >= 400) {
                    if (bestResponse.data) {
                        const errorMsg = bestResponse.data.errors?.[0]?.message || 
                                       bestResponse.data.error?.message || 
                                       bestResponse.data.message || 
                                       bestResponse.text.substring(0, 200);
                        console.log(`   ❌ Error (${bestResponse.status}): ${errorMsg}`);
                    } else {
                        console.log(`   ❌ Error (${bestResponse.status}): ${bestResponse.text.substring(0, 200)}`);
                    }
                }
            } catch (err) {
                console.log(`   ❌ Request failed: ${err.message}`);
            }
            console.log('');
        }
        
        throw new Error('All eBay API endpoint attempts failed. Please verify:\n' +
            '1. The access token is valid and not expired\n' +
            '2. The token has the required scopes (sell.inventory, commerce.catalog, etc.)\n' +
            '3. Your eBay developer account has production access enabled\n' +
            '4. Check API documentation: https://developer.ebay.com/api-docs');
        
    } catch (error) {
        console.error('❌ Error fetching product:', error.message);
        throw error;
    }
}

/**
 * Main test function
 */
async function main() {
    console.log('='.repeat(60));
    console.log('eBay API Test - Women\'s Balance Product');
    console.log('='.repeat(60));
    console.log('');
    
    // Check for custom base URL as command line argument
    const customBaseUrl = process.argv[2] || null;
    if (customBaseUrl) {
        console.log(`Using custom base URL: ${customBaseUrl}`);
        console.log('');
    }
    
    // Token format analysis
    const token = EBAY_CONFIG.ACCESS_TOKEN || EBAY_CONFIG.TOKEN;
    console.log('📋 Token Analysis:');
    console.log(`   Format: ${token.substring(0, 20)}...`);
    console.log(`   Length: ${token.length} characters`);
    if (token.includes('#')) {
        const parts = token.split('#');
        console.log(`   Parts: ${parts.length} segments`);
        parts.forEach((part, idx) => {
            if (part.length < 50) {
                console.log(`     ${idx + 1}. ${part}`);
            }
        });
    }
    console.log('');
    
    try {
        const product = await fetchProductBySKU('52274-401', customBaseUrl);
        
        if (product) {
            console.log('');
            console.log('='.repeat(60));
            console.log('✅ Test completed successfully!');
            console.log('='.repeat(60));
        } else {
            console.log('');
            console.log('⚠️  Product not found, but API connection successful');
            console.log('   Try checking your inventory items or offers');
        }
    } catch (error) {
        console.log('');
        console.log('='.repeat(60));
        console.log('❌ Test failed');
        console.log('='.repeat(60));
        console.error('Error:', error.message);
        console.log('');
        console.log('💡 Troubleshooting Tips:');
        console.log('  1. The token format suggests it might be an eBay User Token');
        console.log('  2. 401 Unauthorized means the token format is correct but may be:');
        console.log('     - Expired (check expiration date)');
        console.log('     - Missing required scopes');
        console.log('     - Not a valid OAuth User Token');
        console.log('  3. Generate a new User Access Token from:');
        console.log('     https://developer.ebay.com/my/keys');
        console.log('  4. Ensure token has required scopes:');
        console.log('     - https://api.ebay.com/oauth/api_scope/sell.inventory');
        console.log('     - https://api.ebay.com/oauth/api_scope/commerce.catalog');
        console.log('  5. Verify production access is enabled in eBay Developer Portal');
        console.log('  6. API Documentation: https://developer.ebay.com/api-docs');
        console.log('  7. Inventory API: https://developer.ebay.com/api-docs/sell/inventory/overview.html');
    }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch(console.error);
}

export { fetchProductBySKU };
