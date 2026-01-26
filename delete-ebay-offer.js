/**
 * Delete eBay Offer
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

async function deleteOffer(offerId) {
    const token = await getAccessToken();
    if (!token) return null;
    
    try {
        const response = await fetch(`${BASE_URL}/sell/inventory/v1/offer/${offerId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'
            }
        });
        
        if (response.status === 204) {
            console.log('✅ Offer deleted successfully');
            return true;
        }
        
        const data = await response.json();
        console.error(`❌ Error (${response.status}):`, data);
        return false;
    } catch (error) {
        console.error('❌ Error:', error.message);
        return false;
    }
}

async function main() {
    const offerId = process.argv[2] || '250318575012';
    
    console.log(`🗑️  Deleting offer: ${offerId}`);
    console.log('');
    
    await deleteOffer(offerId);
}

main().catch(console.error);
