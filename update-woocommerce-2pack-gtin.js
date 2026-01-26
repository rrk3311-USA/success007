/**
 * Update WooCommerce 2-Pack Product GTIN
 * Sets the same GTIN as the single pack product
 */

import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const WOOCOMMERCE_CONFIG = {
    url: process.env.WOOCOMMERCE_URL || 'https://blueviolet-snake-802946.hostingersite.com',
    consumerKey: process.env.WOOCOMMERCE_CONSUMER_KEY || 'ck_2a7dcf6903f5d22ed4228abd6da424746d5f80b6',
    consumerSecret: process.env.WOOCOMMERCE_CONSUMER_SECRET || 'cs_448d2cd75368443afcd926cb249bd78e81a80db1',
    apiEndpoint: '/wp-json/wc/v3'
};

function getAuthHeader() {
    return `Basic ${Buffer.from(`${WOOCOMMERCE_CONFIG.consumerKey}:${WOOCOMMERCE_CONFIG.consumerSecret}`).toString('base64')}`;
}

async function getProduct(sku) {
    try {
        const response = await fetch(
            `${WOOCOMMERCE_CONFIG.url}${WOOCOMMERCE_CONFIG.apiEndpoint}/products?sku=${sku}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': getAuthHeader()
                }
            }
        );
        
        if (!response.ok) {
            throw new Error(`Failed to fetch product: ${response.status}`);
        }
        
        const products = await response.json();
        return products.length > 0 ? products[0] : null;
    } catch (error) {
        console.error('❌ Error fetching product:', error.message);
        return null;
    }
}

async function updateProduct(productId, updateData) {
    try {
        const response = await fetch(
            `${WOOCOMMERCE_CONFIG.url}${WOOCOMMERCE_CONFIG.apiEndpoint}/products/${productId}`,
            {
                method: 'PUT',
                headers: {
                    'Authorization': getAuthHeader(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateData)
            }
        );
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Update failed: ${errorText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error(`❌ Error updating product:`, error.message);
        throw error;
    }
}

async function main() {
    console.log('🏷️  Updating 2-Pack Product GTIN\n');
    console.log('='.repeat(70));
    
    const singlePackSKU = '10777-810';
    const twoPackSKU = '10777-810-2';
    const gtin = '783325395272'; // From products-data.js
    
    // Get single pack to verify GTIN
    console.log(`📋 Checking single pack product (${singlePackSKU})...`);
    const singlePack = await getProduct(singlePackSKU);
    
    if (singlePack) {
        const existingGtin = singlePack.meta_data?.find(m => m.key === 'gtin')?.value || 
                            singlePack.gtin || '';
        console.log(`   Current GTIN: ${existingGtin || 'Not set'}`);
    }
    
    // Get 2-pack product
    console.log(`\n📋 Fetching 2-pack product (${twoPackSKU})...`);
    const twoPack = await getProduct(twoPackSKU);
    
    if (!twoPack) {
        console.error(`❌ Product with SKU "${twoPackSKU}" not found!`);
        process.exit(1);
    }
    
    console.log(`✅ Found product: ${twoPack.name}`);
    console.log(`   Product ID: ${twoPack.id}`);
    
    // Check current GTIN
    const currentGtin = twoPack.meta_data?.find(m => m.key === 'gtin')?.value || 
                       twoPack.gtin || '';
    
    if (currentGtin === gtin) {
        console.log(`\n✅ GTIN already set correctly: ${gtin}`);
        return;
    }
    
    console.log(`   Current GTIN: ${currentGtin || 'Not set'}`);
    console.log(`   New GTIN: ${gtin}`);
    
    // Update meta_data
    const existingMeta = twoPack.meta_data || [];
    const gtinMetaIndex = existingMeta.findIndex(m => m.key === 'gtin');
    
    if (gtinMetaIndex >= 0) {
        existingMeta[gtinMetaIndex].value = gtin;
    } else {
        existingMeta.push({ key: 'gtin', value: gtin });
    }
    
    const updateData = {
        meta_data: existingMeta,
        gtin: gtin // Also set direct property if supported
    };
    
    try {
        console.log(`\n🚀 Updating product...`);
        const updated = await updateProduct(twoPack.id, updateData);
        
        // Verify update
        const updatedGtin = updated.meta_data?.find(m => m.key === 'gtin')?.value || 
                           updated.gtin || '';
        
        console.log(`✅ Product updated successfully!`);
        console.log(`   GTIN: ${updatedGtin}`);
        console.log(`\n🌐 View: ${WOOCOMMERCE_CONFIG.url}/product/${updated.slug}/`);
        
    } catch (error) {
        console.error(`\n❌ Failed to update product:`, error.message);
        process.exit(1);
    }
}

main().catch(error => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
});
