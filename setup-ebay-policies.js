/**
 * Setup eBay Policies (Required before creating listings)
 * 
 * eBay requires these policies before you can create listings:
 *   1. Fulfillment Policy (shipping)
 *   2. Payment Policy
 *   3. Return Policy
 *   4. Merchant Location
 * 
 * Usage:
 *   node setup-ebay-policies.js
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
    
    if (!CONFIG || !CONFIG.EBAY_API) {
        throw new Error('EBAY_API configuration not found');
    }
} catch (err) {
    console.error('❌ Could not load config.js:', err.message);
    process.exit(1);
}

const EBAY_CONFIG = CONFIG.EBAY_API;
const BASE_URL = EBAY_CONFIG.USE_SANDBOX ? EBAY_CONFIG.SANDBOX_BASE_URL : EBAY_CONFIG.BASE_URL;

/**
 * Get access token
 */
async function getAccessToken() {
    const token = EBAY_CONFIG.ACCESS_TOKEN;
    
    if (!token) {
        console.error('❌ No ACCESS_TOKEN found in config.js');
        return null;
    }
    
    return token;
}

/**
 * Create Fulfillment Policy
 */
async function createFulfillmentPolicy() {
    const token = await getAccessToken();
    if (!token) return null;
    
    console.log('📦 Creating Fulfillment Policy...');
    
    const policy = {
        name: 'Standard Shipping Policy',
        marketplaceId: 'EBAY_US',
        categoryTypes: [
            {
                name: 'MOTORS_VEHICLES',
                default: true
            }
        ],
        handlingTime: {
            value: 1,
            unit: 'DAY'
        },
        shippingOptions: [
            {
                costType: 'FLAT_RATE',
                shippingServices: [
                    {
                        shippingServiceCode: 'USPSPriority',
                        shippingCost: {
                            value: '5.99',
                            currency: 'USD'
                        },
                        shippingServiceAdditionalCost: {
                            value: '0.00',
                            currency: 'USD'
                        },
                        freeShipping: false,
                        buyerResponsibleForShipping: false
                    }
                ]
            }
        ],
        shipToLocations: {
            regionIncluded: ['WORLDWIDE']
        }
    };
    
    try {
        const response = await fetch(`${BASE_URL}/sell/account/v1/fulfillment_policy`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'
            },
            body: JSON.stringify(policy)
        });
        
        const responseData = await response.json();
        
        if (!response.ok) {
            console.error(`❌ Error (${response.status}):`, responseData);
            return null;
        }
        
        console.log('✅ Fulfillment Policy created!');
        console.log(`   Policy ID: ${responseData.fulfillmentPolicyId}`);
        console.log(`   Name: ${responseData.name}`);
        console.log('');
        console.log('💡 Add this to config.js:');
        console.log(`   FULFILLMENT_POLICY_ID: '${responseData.fulfillmentPolicyId}'`);
        console.log('');
        
        return responseData;
    } catch (error) {
        console.error('❌ Error:', error.message);
        return null;
    }
}

/**
 * Create Payment Policy
 */
async function createPaymentPolicy() {
    const token = await getAccessToken();
    if (!token) return null;
    
    console.log('💳 Creating Payment Policy...');
    
    const policy = {
        name: 'Standard Payment Policy',
        marketplaceId: 'EBAY_US',
        categoryTypes: [
            {
                name: 'MOTORS_VEHICLES',
                default: true
            }
        ],
        paymentMethods: [
            {
                paymentMethodType: 'CREDIT_CARD',
                brands: ['VISA', 'MASTERCARD', 'AMEX', 'DISCOVER']
            },
            {
                paymentMethodType: 'PAYPAL'
            }
        ],
        paymentTerms: {
            paymentMethods: ['CREDIT_CARD', 'PAYPAL']
        }
    };
    
    try {
        const response = await fetch(`${BASE_URL}/sell/account/v1/payment_policy`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'
            },
            body: JSON.stringify(policy)
        });
        
        const responseData = await response.json();
        
        if (!response.ok) {
            console.error(`❌ Error (${response.status}):`, responseData);
            return null;
        }
        
        console.log('✅ Payment Policy created!');
        console.log(`   Policy ID: ${responseData.paymentPolicyId}`);
        console.log(`   Name: ${responseData.name}`);
        console.log('');
        console.log('💡 Add this to config.js:');
        console.log(`   PAYMENT_POLICY_ID: '${responseData.paymentPolicyId}'`);
        console.log('');
        
        return responseData;
    } catch (error) {
        console.error('❌ Error:', error.message);
        return null;
    }
}

/**
 * Create Return Policy
 */
async function createReturnPolicy() {
    const token = await getAccessToken();
    if (!token) return null;
    
    console.log('↩️  Creating Return Policy...');
    
    const policy = {
        name: '30 Day Return Policy',
        marketplaceId: 'EBAY_US',
        categoryTypes: [
            {
                name: 'MOTORS_VEHICLES',
                default: true
            }
        ],
        returnsAcceptedOption: 'RETURNS_ACCEPTED',
        refundMethod: 'MERCHANDISE_CREDIT',
        returnPeriod: {
            value: 30,
            unit: 'DAY'
        },
        returnShippingCostPayer: 'BUYER'
    };
    
    try {
        const response = await fetch(`${BASE_URL}/sell/account/v1/return_policy`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'
            },
            body: JSON.stringify(policy)
        });
        
        const responseData = await response.json();
        
        if (!response.ok) {
            console.error(`❌ Error (${response.status}):`, responseData);
            return null;
        }
        
        console.log('✅ Return Policy created!');
        console.log(`   Policy ID: ${responseData.returnPolicyId}`);
        console.log(`   Name: ${responseData.name}`);
        console.log('');
        console.log('💡 Add this to config.js:');
        console.log(`   RETURN_POLICY_ID: '${responseData.returnPolicyId}'`);
        console.log('');
        
        return responseData;
    } catch (error) {
        console.error('❌ Error:', error.message);
        return null;
    }
}

/**
 * Get Merchant Locations
 */
async function getMerchantLocations() {
    const token = await getAccessToken();
    if (!token) return null;
    
    console.log('📍 Fetching Merchant Locations...');
    
    try {
        const response = await fetch(`${BASE_URL}/sell/inventory/v1/location`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'
            }
        });
        
        const responseData = await response.json();
        
        if (!response.ok) {
            console.error(`❌ Error (${response.status}):`, responseData);
            return null;
        }
        
        console.log('✅ Merchant Locations:');
        if (responseData.locations && responseData.locations.length > 0) {
            responseData.locations.forEach(location => {
                console.log(`   Location Key: ${location.merchantLocationKey}`);
                console.log(`   Name: ${location.name || 'N/A'}`);
                console.log('');
            });
            console.log('💡 Use the first location key in your listings');
        } else {
            console.log('   No locations found. You may need to create one in eBay Seller Hub.');
        }
        
        return responseData;
    } catch (error) {
        console.error('❌ Error:', error.message);
        return null;
    }
}

/**
 * Main function
 */
async function main() {
    console.log('='.repeat(60));
    console.log('eBay Policy Setup');
    console.log('='.repeat(60));
    console.log('');
    console.log('This script will create the required policies for eBay listings.');
    console.log('');
    
    const token = await getAccessToken();
    if (!token) {
        console.log('💡 Please set up your access token first:');
        console.log('   node ebay-oauth-helper.js exchange-code <code>');
        process.exit(1);
    }
    
    console.log('Creating policies...');
    console.log('');
    
    // Create policies
    const fulfillmentPolicy = await createFulfillmentPolicy();
    const paymentPolicy = await createPaymentPolicy();
    const returnPolicy = await createReturnPolicy();
    
    // Get locations
    await getMerchantLocations();
    
    console.log('='.repeat(60));
    if (fulfillmentPolicy && paymentPolicy && returnPolicy) {
        console.log('✅ All policies created successfully!');
        console.log('');
        console.log('Next steps:');
        console.log('1. Update config.js with the policy IDs shown above');
        console.log('2. Set MERCHANT_LOCATION_KEY in config.js');
        console.log('3. Run: node create-ebay-listing.js <SKU>');
    } else {
        console.log('⚠️  Some policies failed to create. Check errors above.');
    }
    console.log('='.repeat(60));
}

main().catch(error => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
});
