// Find all products missing UPC, GTIN, descriptions and update them
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
    } catch (e) {
        console.log('⚠️  Could not load products-data.js');
    }
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
    console.log('🔍 Finding All Products Missing Information\n');
    console.log('='.repeat(60));
    
    const localProducts = loadLocalProducts();
    const products = await fetchAllProducts();
    
    console.log(`📦 Local products: ${Object.keys(localProducts).length}`);
    console.log(`🛒 WooCommerce products: ${products.length}\n`);
    
    // Find products needing updates
    const needsUpdate = [];
    
    products.forEach(product => {
        const issues = [];
        const baseSKU = product.sku?.split('-')[0] + '-' + product.sku?.split('-')[1]; // Get base SKU (e.g., "1989-403" from "1989-403-5pack")
        const localData = localProducts[baseSKU] || localProducts[product.sku];
        
        // Check UPC
        const upc = product.meta_data?.find(m => m.key === 'upc')?.value || '';
        if (!upc && localData?.upc) issues.push('Missing UPC');
        
        // Check GTIN
        const gtin = product.meta_data?.find(m => m.key === 'gtin')?.value || product.gtin || '';
        if (!gtin && localData?.gtin) issues.push('Missing GTIN');
        
        // Check description
        const desc = product.description || '';
        if ((!desc || desc.length < 500) && localData?.description) {
            issues.push('Missing/Short description');
        }
        
        // Check short description
        const shortDesc = product.short_description || '';
        if ((!shortDesc || shortDesc.length < 150) && localData?.short_description) {
            issues.push('Missing/Short short description');
        }
        
        // Check images
        const images = product.images || [];
        if (images.length < 3 && localData?.images) {
            issues.push('Missing images');
        }
        
        if (issues.length > 0) {
            needsUpdate.push({ product, issues, localData, baseSKU });
        }
    });
    
    console.log(`\n📋 Products needing updates: ${needsUpdate.length}\n`);
    
    // Show summary
    needsUpdate.forEach(({ product, issues }) => {
        console.log(`  • ${product.name.substring(0, 60)}...`);
        console.log(`    SKU: ${product.sku} | Issues: ${issues.join(', ')}`);
    });
    
    console.log(`\n\n🔄 Starting updates...\n`);
    
    // Update each product
    let updated = 0;
    for (const { product, issues, localData, baseSKU } of needsUpdate) {
        console.log(`\n📦 ${product.name}`);
        console.log(`   SKU: ${product.sku}`);
        
        const updateData = {};
        let hasUpdates = false;
        
        // Update UPC
        if (issues.includes('Missing UPC') && localData?.upc) {
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
        
        // Update GTIN
        if (issues.includes('Missing GTIN') && localData?.gtin) {
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
        
        // Update description
        if (issues.includes('Missing/Short description') && localData?.description) {
            const htmlDesc = localData.description
                .replace(/\n/g, '<br>')
                .replace(/\*\*/g, '<strong>')
                .replace(/\*/g, '</strong>');
            updateData.description = htmlDesc;
            hasUpdates = true;
            console.log(`   ✅ Updating description`);
        }
        
        // Update short description
        if (issues.includes('Missing/Short short description') && localData?.short_description) {
            updateData.short_description = localData.short_description;
            hasUpdates = true;
            console.log(`   ✅ Updating short description`);
        }
        
        // Update images
        if (issues.includes('Missing images') && localData?.images) {
            updateData.images = localData.images.map((img, idx) => ({
                src: img.startsWith('http') ? img : `${WOOCOMMERCE_CONFIG.url}${img}`,
                alt: `${product.name} - Image ${idx + 1}`
            }));
            hasUpdates = true;
            console.log(`   ✅ Adding ${localData.images.length} images`);
        }
        
        if (hasUpdates) {
            try {
                await updateProduct(product.id, updateData);
                updated++;
                console.log(`   ✅ Updated successfully!`);
            } catch (error) {
                console.log(`   ❌ Failed: ${error.message}`);
            }
        }
    }
    
    console.log(`\n\n✨ Complete! Updated ${updated} out of ${needsUpdate.length} products.`);
}

main().catch(console.error);
