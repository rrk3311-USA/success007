// Update WooCommerce products with missing information
// Fixed version that properly loads product data
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

// Load product data - read the file and extract the object
function loadLocalProducts() {
    try {
        const filePath = './deploy-site/products-data.js';
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Extract the PRODUCTS_DATA object using regex
        const match = content.match(/const PRODUCTS_DATA\s*=\s*({[\s\S]*?});/);
        if (match) {
            // Use Function constructor to safely evaluate
            const productsData = new Function('return ' + match[1])();
            return productsData;
        }
    } catch (e) {
        console.log('⚠️  Could not load products-data.js:', e.message);
    }
    return {};
}

async function fetchAllProducts() {
    const response = await fetch(
        `${WOOCOMMERCE_CONFIG.url}${WOOCOMMERCE_CONFIG.apiEndpoint}/products?per_page=100`,
        {
            method: 'GET',
            headers: { 'Authorization': getAuthHeader() }
        }
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
    console.log('🚀 Updating WooCommerce Products\n');
    console.log('='.repeat(60));
    
    const localProducts = loadLocalProducts();
    console.log(`📦 Loaded ${Object.keys(localProducts).length} products from local data\n`);
    
    const products = await fetchAllProducts();
    console.log(`✅ Found ${products.length} products in WooCommerce\n`);
    
    // Focus on women's multivitamin (1989-403) and bundles
    const targetProducts = products.filter(p => 
        p.sku === '1989-403' || 
        (p.sku && p.sku.includes('1989-403')) ||
        (p.name.toLowerCase().includes('goddess') && p.name.toLowerCase().includes('multi'))
    );
    
    console.log(`🎯 Found ${targetProducts.length} women's multivitamin product(s):\n`);
    
    for (const product of targetProducts) {
        console.log(`\n📦 Product: ${product.name}`);
        console.log(`   SKU: ${product.sku}`);
        console.log(`   ID: ${product.id}`);
        
        const localData = localProducts['1989-403']; // Base product data
        const updateData = {};
        let hasUpdates = false;
        
        // Check UPC
        const currentUPC = product.meta_data?.find(m => m.key === 'upc')?.value || '';
        if (!currentUPC && localData?.upc) {
            updateData.meta_data = [...(product.meta_data || [])];
            const existing = updateData.meta_data.find(m => m.key === 'upc');
            if (existing) {
                existing.value = localData.upc;
            } else {
                updateData.meta_data.push({ key: 'upc', value: localData.upc });
            }
            hasUpdates = true;
            console.log(`   ✅ Adding UPC: ${localData.upc}`);
        }
        
        // Check GTIN
        const currentGTIN = product.meta_data?.find(m => m.key === 'gtin')?.value || product.gtin || '';
        if (!currentGTIN && localData?.gtin) {
            if (!updateData.meta_data) {
                updateData.meta_data = [...(product.meta_data || [])];
            }
            const existing = updateData.meta_data.find(m => m.key === 'gtin');
            if (existing) {
                existing.value = localData.gtin;
            } else {
                updateData.meta_data.push({ key: 'gtin', value: localData.gtin });
            }
            hasUpdates = true;
            console.log(`   ✅ Adding GTIN: ${localData.gtin}`);
        }
        
        // Check description
        const currentDesc = product.description || '';
        if ((!currentDesc || currentDesc.length < 500) && localData?.description) {
            // Convert newlines to HTML breaks
            const htmlDesc = localData.description
                .replace(/\n/g, '<br>')
                .replace(/\*\*/g, '<strong>')
                .replace(/\*/g, '</strong>');
            updateData.description = htmlDesc;
            hasUpdates = true;
            console.log(`   ✅ Updating description (${htmlDesc.length} chars)`);
        }
        
        // Check short description
        const currentShort = product.short_description || '';
        if ((!currentShort || currentShort.length < 200) && localData?.short_description) {
            updateData.short_description = localData.short_description;
            hasUpdates = true;
            console.log(`   ✅ Updating short description`);
        }
        
        // Check images
        const currentImages = product.images || [];
        if (currentImages.length < 5 && localData?.images) {
            updateData.images = localData.images.map((img, idx) => ({
                src: img.startsWith('http') ? img : `${WOOCOMMERCE_CONFIG.url}${img}`,
                alt: `${product.name} - Image ${idx + 1}`
            }));
            hasUpdates = true;
            console.log(`   ✅ Adding ${localData.images.length} images`);
        }
        
        if (hasUpdates) {
            try {
                const updated = await updateProduct(product.id, updateData);
                console.log(`   ✅ Successfully updated product ID ${product.id}`);
            } catch (error) {
                console.log(`   ❌ Update failed: ${error.message}`);
            }
        } else {
            console.log(`   ℹ️  No updates needed`);
        }
    }
    
    console.log('\n\n✨ Update complete!');
}

main().catch(console.error);
