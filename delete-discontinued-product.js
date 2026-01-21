// Delete discontinued product 20644-825 from WooCommerce
import fetch from 'node-fetch';

const WOOCOMMERCE_CONFIG = {
    url: 'https://blueviolet-snake-802946.hostingersite.com',
    consumerKey: 'ck_2a7dcf6903f5d22ed4228abd6da424746d5f80b6',
    consumerSecret: 'cs_448d2cd75368443afcd926cb249bd78e81a80db1',
    apiEndpoint: '/wp-json/wc/v3'
};

function getAuthHeader() {
    return `Basic ${Buffer.from(`${WOOCOMMERCE_CONFIG.consumerKey}:${WOOCOMMERCE_CONFIG.consumerSecret}`).toString('base64')}`;
}

async function findProductBySKU(sku) {
    const response = await fetch(
        `${WOOCOMMERCE_CONFIG.url}${WOOCOMMERCE_CONFIG.apiEndpoint}/products?sku=${sku}`,
        { headers: { 'Authorization': getAuthHeader() } }
    );
    if (!response.ok) throw new Error(`API Error ${response.status}`);
    const products = await response.json();
    return products[0] || null;
}

async function deleteProduct(productId) {
    const response = await fetch(
        `${WOOCOMMERCE_CONFIG.url}${WOOCOMMERCE_CONFIG.apiEndpoint}/products/${productId}?force=true`,
        {
            method: 'DELETE',
            headers: { 'Authorization': getAuthHeader() }
        }
    );
    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Delete failed: ${error}`);
    }
    return await response.json();
}

async function main() {
    console.log('🗑️  Deleting Discontinued Product: 20644-825\n');
    console.log('='.repeat(60));
    
    const product = await findProductBySKU('20644-825');
    
    if (!product) {
        console.log('❌ Product not found in WooCommerce');
        console.log('   It may have already been deleted.');
        return;
    }
    
    console.log(`✅ Found product:`);
    console.log(`   ID: ${product.id}`);
    console.log(`   Name: ${product.name}`);
    console.log(`   SKU: ${product.sku}`);
    console.log(`   Status: ${product.status}`);
    console.log(`\n🗑️  Deleting product...\n`);
    
    try {
        const result = await deleteProduct(product.id);
        console.log(`✅ Successfully deleted product from WooCommerce!`);
        console.log(`   Product ID ${product.id} has been permanently removed.`);
    } catch (error) {
        console.log(`❌ Failed to delete: ${error.message}`);
    }
}

main().catch(console.error);
