// Update all products missing UPC codes
import fetch from 'node-fetch';
import fs from 'fs';

const WOOCOMMERCE_CONFIG = {
    url: 'https://blueviolet-snake-802946.hostingersite.com',
    consumerKey: 'ck_2a7dcf6903f5d22ed4228abd6da424746d5f80b6',
    consumerSecret: 'cs_448d2cd75368443afcd926cb249bd78e81a80db1',
    apiEndpoint: '/wp-json/wc/v3'
};

function getAuthHeader() {
    return `Basic ${Buffer.from(`${WOOCOMMERCE_CONFIG.consumerKey}:${WOOCOMMERCE_CONFIG.consumerSecret}`).toString('base64')}`;
}

function loadLocalProducts() {
    try {
        const filePath = './deploy-site/products-data.js';
        const content = fs.readFileSync(filePath, 'utf8');
        const match = content.match(/const PRODUCTS_DATA\s*=\s*({[\s\S]*?});/);
        if (match) {
            return new Function('return ' + match[1])();
        }
    } catch (e) {}
    return {};
}

async function fetchAllProducts() {
    const response = await fetch(
        `${WOOCOMMERCE_CONFIG.url}${WOOCOMMERCE_CONFIG.apiEndpoint}/products?per_page=100`,
        { headers: { 'Authorization': getAuthHeader() } }
    );
    if (!response.ok) throw new Error(`API Error ${response.status}`);
    return await response.json();
}

async function updateProduct(productId, updateData) {
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
        const error = await response.text();
        throw new Error(`Update failed: ${error}`);
    }
    return await response.json();
}

async function main() {
    console.log('🔍 Finding Products Missing UPC\n');
    console.log('='.repeat(60));
    
    const localProducts = loadLocalProducts();
    const products = await fetchAllProducts();
    
    // Find products missing UPC
    const missingUPC = products.filter(p => {
        const upc = p.meta_data?.find(m => m.key === 'upc')?.value || '';
        return !upc;
    });
    
    console.log(`Found ${missingUPC.length} products missing UPC\n`);
    
    let updated = 0;
    for (const product of missingUPC) {
        const baseSKU = product.sku?.split('-')[0] + '-' + product.sku?.split('-')[1];
        const localData = localProducts[baseSKU] || localProducts[product.sku];
        
        if (localData?.upc) {
            console.log(`📦 ${product.name.substring(0, 60)}...`);
            console.log(`   SKU: ${product.sku}`);
            
            const updateData = {
                meta_data: [...(product.meta_data || [])]
            };
            
            const existing = updateData.meta_data.find(m => m.key === 'upc');
            if (existing) {
                existing.value = localData.upc;
            } else {
                updateData.meta_data.push({ key: 'upc', value: localData.upc });
            }
            
            try {
                await updateProduct(product.id, updateData);
                console.log(`   ✅ Added UPC: ${localData.upc}\n`);
                updated++;
            } catch (error) {
                console.log(`   ❌ Failed: ${error.message}\n`);
            }
        }
    }
    
    console.log(`\n✨ Complete! Updated ${updated} products with UPC codes.`);
}

main().catch(console.error);
