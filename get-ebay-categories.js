/**
 * Get eBay Categories using Trading API
 * 
 * Gets category list to find valid leaf categories
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
} catch (err) {
    console.error('❌ Could not load config.js:', err.message);
    process.exit(1);
}

const EBAY_CONFIG = CONFIG.EBAY_API;
const BASE_URL = EBAY_CONFIG.USE_SANDBOX ? EBAY_CONFIG.SANDBOX_BASE_URL : EBAY_CONFIG.BASE_URL;

async function getAccessToken() {
    return EBAY_CONFIG.ACCESS_TOKEN;
}

/**
 * Try to get categories - may need different API
 */
async function tryGetCategories() {
    const token = await getAccessToken();
    if (!token) return null;
    
    // Try Browse API category tree
    const url = `${BASE_URL}/buy/browse/v1/category_tree/0`;
    
    try {
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'
            }
        });
        
        const data = await response.json();
        
        if (response.ok && data.categoryTreeNode) {
            return data;
        }
        
        console.log(`Status: ${response.status}`);
        if (!response.ok) {
            console.log('Response:', JSON.stringify(data, null, 2));
        }
        
        return null;
    } catch (error) {
        console.error('Error:', error.message);
        return null;
    }
}

async function main() {
    console.log('='.repeat(60));
    console.log('Get eBay Categories');
    console.log('='.repeat(60));
    console.log('');
    
    const result = await tryGetCategories();
    
    if (result) {
        console.log('✅ Category tree retrieved');
        console.log(JSON.stringify(result, null, 2));
    } else {
        console.log('❌ Could not retrieve categories via API');
        console.log('');
        console.log('💡 Manual Solution:');
        console.log('1. Go to: https://www.ebay.com/sh/listings/create');
        console.log('2. Start creating a listing');
        console.log('3. Navigate to: Health & Beauty → Vitamins & Dietary Supplements');
        console.log('4. Check browser developer tools (Network tab) for API calls');
        console.log('5. Or inspect the category dropdown to find the ID');
        console.log('');
        console.log('Alternative: Try common supplement category IDs:');
        console.log('  - 11700 (Health & Beauty - might auto-select subcategory)');
        console.log('  - Check if offer can be created without categoryId');
    }
}

main().catch(console.error);
