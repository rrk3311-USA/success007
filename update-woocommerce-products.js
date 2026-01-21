// Update WooCommerce products with missing information (UPC, GTIN, descriptions, images)
import fetch from 'node-fetch';
import fs from 'fs';

const WOOCOMMERCE_CONFIG = {
    url: 'https://blueviolet-snake-802946.hostingersite.com',
    consumerKey: 'ck_2a7dcf6903f5d22ed4228abd6da424746d5f80b6',
    consumerSecret: 'cs_448d2cd75368443afcd926cb249bd78e81a80db1',
    apiEndpoint: '/wp-json/wc/v3'
};

// Get auth header
function getAuthHeader() {
    return `Basic ${Buffer.from(`${WOOCOMMERCE_CONFIG.consumerKey}:${WOOCOMMERCE_CONFIG.consumerSecret}`).toString('base64')}`;
}

// Load product data from our local file
let localProducts = {};
try {
    const productsData = fs.readFileSync('./deploy-site/products-data.js', 'utf8');
    // Extract PRODUCTS_DATA object (simple regex extraction)
    const match = productsData.match(/const PRODUCTS_DATA = ({[\s\S]*});/);
    if (match) {
        // Evaluate safely (in production, use a proper parser)
        localProducts = eval('(' + match[1] + ')');
    }
} catch (e) {
    console.log('⚠️  Could not load local products-data.js');
}

async function fetchAllProducts() {
    console.log('🔍 Fetching all products from WooCommerce...\n');
    
    try {
        const response = await fetch(
            `${WOOCOMMERCE_CONFIG.url}${WOOCOMMERCE_CONFIG.apiEndpoint}/products?per_page=100`,
            {
                method: 'GET',
                headers: {
                    'Authorization': getAuthHeader()
                }
            }
        );

        if (!response.ok) {
            throw new Error(`WooCommerce API Error ${response.status}: ${await response.text()}`);
        }

        return await response.json();
    } catch (error) {
        console.error('❌ Error:', error.message);
        throw error;
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
        console.error(`❌ Error updating product ${productId}:`, error.message);
        throw error;
    }
}

async function main() {
    console.log('🚀 Updating WooCommerce Products with Missing Information\n');
    console.log('='.repeat(60));
    
    const products = await fetchAllProducts();
    console.log(`✅ Found ${products.length} products\n`);
    
    // Find products that need updates
    const needsUpdate = [];
    
    products.forEach(product => {
        const issues = [];
        const localData = localProducts[product.sku];
        
        // Check for missing UPC/GTIN
        const upc = product.meta_data?.find(m => m.key === 'upc')?.value || product.upc || '';
        const gtin = product.meta_data?.find(m => m.key === 'gtin')?.value || product.gtin || '';
        
        if (!upc && localData?.upc) issues.push('Missing UPC');
        if (!gtin && localData?.gtin) issues.push('Missing GTIN');
        
        // Check for short descriptions (less than 200 chars)
        if (product.short_description && product.short_description.length < 200) {
            issues.push('Short description too brief');
        }
        
        // Check for missing images
        if (!product.images || product.images.length < 3) {
            issues.push('Missing images');
        }
        
        if (issues.length > 0) {
            needsUpdate.push({
                product,
                issues,
                localData
            });
        }
    });
    
    console.log(`📋 Products needing updates: ${needsUpdate.length}\n`);
    
    // Update each product
    for (const { product, issues, localData } of needsUpdate) {
        console.log(`\n📦 Updating: ${product.name}`);
        console.log(`   SKU: ${product.sku}`);
        console.log(`   Issues: ${issues.join(', ')}`);
        
        const updateData = {};
        let hasUpdates = false;
        
        // Update UPC
        if (issues.includes('Missing UPC') && localData?.upc) {
            updateData.meta_data = product.meta_data || [];
            const upcMeta = updateData.meta_data.find(m => m.key === 'upc');
            if (upcMeta) {
                upcMeta.value = localData.upc;
            } else {
                updateData.meta_data.push({ key: 'upc', value: localData.upc });
            }
            hasUpdates = true;
            console.log(`   ✅ Adding UPC: ${localData.upc}`);
        }
        
        // Update GTIN
        if (issues.includes('Missing GTIN') && localData?.gtin) {
            if (!updateData.meta_data) {
                updateData.meta_data = product.meta_data || [];
            }
            const gtinMeta = updateData.meta_data.find(m => m.key === 'gtin');
            if (gtinMeta) {
                gtinMeta.value = localData.gtin;
            } else {
                updateData.meta_data.push({ key: 'gtin', value: localData.gtin });
            }
            hasUpdates = true;
            console.log(`   ✅ Adding GTIN: ${localData.gtin}`);
        }
        
        // Update description if too short
        if (issues.includes('Short description too brief') && localData?.description) {
            // Clean HTML from local description
            const cleanDesc = localData.description.replace(/\n/g, '<br>');
            updateData.short_description = cleanDesc.substring(0, 400) + '...';
            hasUpdates = true;
            console.log(`   ✅ Updating short description`);
        }
        
        // Update full description if missing
        if (!product.description || product.description.length < 500) {
            if (localData?.description) {
                updateData.description = localData.description.replace(/\n/g, '<br>');
                hasUpdates = true;
                console.log(`   ✅ Updating full description`);
            }
        }
        
        // Update images if missing
        if (issues.includes('Missing images') && localData?.images) {
            updateData.images = localData.images.map(img => ({
                src: `${WOOCOMMERCE_CONFIG.url}${img}`,
                alt: product.name
            }));
            hasUpdates = true;
            console.log(`   ✅ Adding ${localData.images.length} images`);
        }
        
        if (hasUpdates) {
            try {
                await updateProduct(product.id, updateData);
                console.log(`   ✅ Successfully updated!`);
            } catch (error) {
                console.log(`   ❌ Update failed: ${error.message}`);
            }
        } else {
            console.log(`   ⚠️  No updates to apply`);
        }
    }
    
    console.log('\n\n✨ Update process complete!');
}

main().catch(console.error);
