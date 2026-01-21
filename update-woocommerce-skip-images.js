// Update WooCommerce products - skip images, focus on UPC, GTIN, descriptions
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
    console.log('🚀 Updating WooCommerce Products (UPC, GTIN, Descriptions)\n');
    console.log('='.repeat(60));
    
    const localProducts = loadLocalProducts();
    const products = await fetchAllProducts();
    
    console.log(`📦 Local products: ${Object.keys(localProducts).length}`);
    console.log(`🛒 WooCommerce products: ${products.length}\n`);
    
    // Find products needing updates (skip images)
    const needsUpdate = [];
    
    products.forEach(product => {
        const issues = [];
        const baseSKU = product.sku?.split('-')[0] + '-' + product.sku?.split('-')[1];
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
        
        if (issues.length > 0) {
            needsUpdate.push({ product, issues, localData, baseSKU });
        }
    });
    
    console.log(`📋 Products needing updates: ${needsUpdate.length}\n`);
    
    // Update each product
    let updated = 0;
    let failed = 0;
    
    for (const { product, issues, localData, baseSKU } of needsUpdate) {
        console.log(`\n📦 ${product.name.substring(0, 70)}...`);
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
            console.log(`   ✅ Updating description (${htmlDesc.length} chars)`);
        }
        
        // Update short description
        if (issues.includes('Missing/Short short description') && localData?.short_description) {
            updateData.short_description = localData.short_description;
            hasUpdates = true;
            console.log(`   ✅ Updating short description`);
        }
        
        if (hasUpdates) {
            try {
                await updateProduct(product.id, updateData);
                updated++;
                console.log(`   ✅ Updated successfully!`);
            } catch (error) {
                failed++;
                console.log(`   ❌ Failed: ${error.message.substring(0, 100)}`);
            }
        }
    }
    
    console.log(`\n\n✨ Complete! Updated ${updated} products. Failed: ${failed}`);
    
    // Check for women's multivitamin 5-pack
    console.log(`\n\n🔍 Checking for Women's Multivitamin 5-Pack...\n`);
    const multi5Pack = products.find(p => 
        (p.sku && p.sku.includes('1989-403') && p.sku.includes('5')) ||
        (p.name.toLowerCase().includes('goddess') && p.name.toLowerCase().includes('multi') && (p.name.toLowerCase().includes('5') || p.name.toLowerCase().includes('pack')))
    );
    
    if (multi5Pack) {
        console.log(`✅ Found 5-pack bundle:`);
        console.log(`   SKU: ${multi5Pack.sku}`);
        console.log(`   Name: ${multi5Pack.name}`);
        console.log(`   ID: ${multi5Pack.id}`);
    } else {
        console.log(`❌ No 5-pack bundle found for women's multivitamin`);
        console.log(`   Looking for SKU containing: 1989-403 and "5" or "pack"`);
    }
}

main().catch(console.error);
