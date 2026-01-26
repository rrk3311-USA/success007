/**
 * Check Inventory Item
 * 
 * Checks the inventory item details
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

async function checkInventoryItem(sku) {
    const token = await getAccessToken();
    if (!token) return null;
    
    try {
        const response = await fetch(`${BASE_URL}/sell/inventory/v1/inventory_item/${sku}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Content-Language': 'en-US',
                'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'
            }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            console.error(`❌ Error (${response.status}):`, data);
            return null;
        }
        
        return data;
    } catch (error) {
        console.error('❌ Error:', error.message);
        return null;
    }
}

async function main() {
    const sku = process.argv[2] || '52274-401';
    
    console.log('='.repeat(60));
    console.log('Inventory Item Check');
    console.log('='.repeat(60));
    console.log(`SKU: ${sku}`);
    console.log('');
    
    const item = await checkInventoryItem(sku);
    
    if (item) {
        console.log('✅ Inventory Item Details:');
        console.log(JSON.stringify(item, null, 2));
    }
}

main().catch(console.error);
