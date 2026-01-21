// Update the 5-pack bundle (52274-401-5pack) with missing information
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

async function fetchProductBySKU(sku) {
    const response = await fetch(
        `${WOOCOMMERCE_CONFIG.url}${WOOCOMMERCE_CONFIG.apiEndpoint}/products?sku=${sku}`,
        { headers: { 'Authorization': getAuthHeader() } }
    );
    if (!response.ok) throw new Error(`API Error ${response.status}`);
    const products = await response.json();
    return products[0] || null;
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
    console.log('🔍 Finding 5-Pack Bundle: 52274-401-5pack\n');
    console.log('='.repeat(60));
    
    const localProducts = loadLocalProducts();
    const baseProduct = localProducts['52274-401']; // Women's Balance base product
    
    if (!baseProduct) {
        console.log('❌ Base product 52274-401 not found in local data');
        return;
    }
    
    console.log(`✅ Found base product: ${baseProduct.name}\n`);
    
    // Fetch the 5-pack bundle from WooCommerce
    const bundle = await fetchProductBySKU('52274-401-5pack');
    
    if (!bundle) {
        console.log('❌ Bundle 52274-401-5pack not found in WooCommerce');
        return;
    }
    
    console.log(`✅ Found bundle in WooCommerce:`);
    console.log(`   ID: ${bundle.id}`);
    console.log(`   Name: ${bundle.name}`);
    console.log(`   Current Description Length: ${(bundle.description || '').length} chars`);
    console.log(`   Current Short Description: ${(bundle.short_description || '').substring(0, 100)}...`);
    
    const currentUPC = bundle.meta_data?.find(m => m.key === 'upc')?.value || '';
    const currentGTIN = bundle.meta_data?.find(m => m.key === 'gtin')?.value || '';
    console.log(`   Current UPC: ${currentUPC || 'MISSING'}`);
    console.log(`   Current GTIN: ${currentGTIN || 'MISSING'}`);
    console.log(`   Current Images: ${bundle.images?.length || 0}\n`);
    
    // Prepare update data
    const updateData = {};
    let hasUpdates = false;
    
    // Update UPC (use base product UPC if available)
    if (!currentUPC && baseProduct.upc) {
        updateData.meta_data = [...(bundle.meta_data || [])];
        const existing = updateData.meta_data.find(m => m.key === 'upc');
        if (existing) {
            existing.value = baseProduct.upc;
        } else {
            updateData.meta_data.push({ key: 'upc', value: baseProduct.upc });
        }
        hasUpdates = true;
        console.log(`✅ Will add UPC: ${baseProduct.upc}`);
    }
    
    // Update GTIN (use base product GTIN if available)
    if (!currentGTIN && baseProduct.gtin) {
        if (!updateData.meta_data) {
            updateData.meta_data = [...(bundle.meta_data || [])];
        }
        const existing = updateData.meta_data.find(m => m.key === 'gtin');
        if (existing) {
            existing.value = baseProduct.gtin;
        } else {
            updateData.meta_data.push({ key: 'gtin', value: baseProduct.gtin });
        }
        hasUpdates = true;
        console.log(`✅ Will add GTIN: ${baseProduct.gtin}`);
    }
    
    // Update description - create bundle-specific description
    const currentDesc = bundle.description || '';
    if (!currentDesc || currentDesc.length < 500) {
        // Create bundle description based on base product
        const bundleDesc = `${baseProduct.description}

5-PACK BUNDLE - EXCELLENT VALUE
This 5-pack bundle provides you with 5 full bottles of ${baseProduct.name}, giving you a total of 300 capsules (5 x 60 capsules). This is perfect for long-term wellness support and offers significant savings compared to buying individual bottles.

Bundle Benefits:
• 5 full bottles (300 capsules total)
• 5-month supply at recommended daily dosage
• Significant savings compared to single bottle purchases
• Convenient bulk purchase for consistent daily use
• Same premium quality and formulation as single bottle

Each bottle contains 60 capsules with 30 servings, providing you with a comprehensive daily supplement to support your wellness goals. Made in the USA in a GMP-certified facility with quality-sourced ingredients.

${baseProduct.supplement_facts ? `Supplement Facts (per serving):\n${baseProduct.supplement_facts}` : ''}

${baseProduct.ingredients ? `Ingredients:\n${baseProduct.ingredients}` : ''}

Suggested Use: ${baseProduct.suggested_use || 'As directed on label'}

*These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.`;
        
        const htmlDesc = bundleDesc
            .replace(/\n/g, '<br>')
            .replace(/\*\*/g, '<strong>')
            .replace(/\*/g, '</strong>');
        
        updateData.description = htmlDesc;
        hasUpdates = true;
        console.log(`✅ Will update description (${htmlDesc.length} chars)`);
    }
    
    // Update short description
    const currentShort = bundle.short_description || '';
    if (!currentShort || currentShort.length < 150) {
        const bundleShort = `${baseProduct.short_description} 5-Pack Bundle - 5 bottles (300 capsules total) - Excellent value for long-term wellness support.`;
        updateData.short_description = bundleShort;
        hasUpdates = true;
        console.log(`✅ Will update short description`);
    }
    
    if (hasUpdates) {
        console.log(`\n🔄 Updating product...\n`);
        try {
            const updated = await updateProduct(bundle.id, updateData);
            console.log(`✅ Successfully updated bundle!`);
            console.log(`\n📋 Updated fields:`);
            if (updateData.meta_data) {
                const upc = updateData.meta_data.find(m => m.key === 'upc')?.value;
                const gtin = updateData.meta_data.find(m => m.key === 'gtin')?.value;
                if (upc) console.log(`   ✅ UPC: ${upc}`);
                if (gtin) console.log(`   ✅ GTIN: ${gtin}`);
            }
            if (updateData.description) console.log(`   ✅ Full description updated`);
            if (updateData.short_description) console.log(`   ✅ Short description updated`);
        } catch (error) {
            console.log(`❌ Update failed: ${error.message}`);
        }
    } else {
        console.log(`\nℹ️  No updates needed - product already has all information`);
    }
    
    console.log(`\n\n💡 Note: Images need to be uploaded to WordPress media library separately.`);
    console.log(`   The standard last 3 images should be added manually:`);
    console.log(`   1. Supplement Facts panel`);
    console.log(`   2. Quality/Certifications graphic`);
    console.log(`   3. Satisfaction Guarantee`);
}

main().catch(console.error);
