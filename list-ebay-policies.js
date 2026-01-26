/**
 * List eBay Policies
 * 
 * Lists existing fulfillment, payment, and return policies
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

async function listPolicies(type) {
    const token = await getAccessToken();
    if (!token) return null;
    
    const endpoint = `${BASE_URL}/sell/account/v1/${type}_policy?marketplace_id=EBAY_US`;
    
    try {
        const response = await fetch(endpoint, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'
            }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            console.error(`❌ Error listing ${type} policies:`, data);
            return null;
        }
        
        return data;
    } catch (error) {
        console.error(`❌ Error:`, error.message);
        return null;
    }
}

async function main() {
    console.log('='.repeat(60));
    console.log('eBay Policies List');
    console.log('='.repeat(60));
    console.log('');
    
    console.log('📦 Fulfillment Policies:');
    const fulfillment = await listPolicies('fulfillment');
    if (fulfillment && fulfillment.fulfillmentPolicies) {
        fulfillment.fulfillmentPolicies.forEach(p => {
            console.log(`   ID: ${p.fulfillmentPolicyId}`);
            console.log(`   Name: ${p.name}`);
            console.log('');
        });
    } else {
        console.log('   No policies found');
        console.log('');
    }
    
    console.log('💳 Payment Policies:');
    const payment = await listPolicies('payment');
    if (payment && payment.paymentPolicies) {
        payment.paymentPolicies.forEach(p => {
            console.log(`   ID: ${p.paymentPolicyId}`);
            console.log(`   Name: ${p.name}`);
            console.log('');
        });
    } else {
        console.log('   No policies found');
        console.log('');
    }
    
    console.log('↩️  Return Policies:');
    const returnPolicies = await listPolicies('return');
    if (returnPolicies && returnPolicies.returnPolicies) {
        returnPolicies.returnPolicies.forEach(p => {
            console.log(`   ID: ${p.returnPolicyId}`);
            console.log(`   Name: ${p.name}`);
            console.log('');
        });
    } else {
        console.log('   No policies found');
        console.log('');
    }
}

main().catch(console.error);
