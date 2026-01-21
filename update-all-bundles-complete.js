// Update ALL bundles with UPC/GTIN and images
import fetch from 'node-fetch';
import fs from 'fs';

const WOOCOMMERCE_CONFIG = {
    url: 'https://blueviolet-snake-802946.hostingersite.com',
    consumerKey: 'ck_2a7dcf6903f5d22ed4228abd6da424746d5f80b6',
    consumerSecret: 'cs_448d2cd75368443afcd926cb249bd78e81a80db1',
    apiEndpoint: '/wp-json/wc/v3',
    siteUrl: 'https://successchemistry.com'
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

function loadWalmartData() {
    const walmartData = {};
    try {
        // Load the lookup file first
        if (fs.existsSync('./bundle-upc-gtin-lookup.json')) {
            const lookup = JSON.parse(fs.readFileSync('./bundle-upc-gtin-lookup.json', 'utf8'));
            Object.keys(lookup).forEach(sku => {
                walmartData[sku] = lookup[sku];
            });
        }
        
        // Also try to extract from the raw files
        const file2 = JSON.parse(fs.readFileSync('./walmart-bundle-2-extracted.json', 'utf8'));
        const rows = file2['Product Content And Site Exp'] || [];
        
        rows.forEach(row => {
            const sku = row['__EMPTY_2'];
            const upc = row['__EMPTY_5'];
            if (sku && sku.toString().includes('52274-401') && upc) {
                // Map SKU formats: 52274-401-2 -> 52274-401-2pack
                const skuBase = sku.toString();
                const mappedSku = skuBase.includes('pack') ? skuBase : skuBase + 'pack';
                walmartData[mappedSku] = { upc: upc.toString(), gtin: upc.toString() };
                // Also store original format
                walmartData[skuBase] = { upc: upc.toString(), gtin: upc.toString() };
            }
        });
    } catch (e) {
        console.log('⚠️  Could not load Walmart data files:', e.message);
    }
    return walmartData;
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

async function getImageUrl(imagePath, altText) {
    const imageUrl = `${WOOCOMMERCE_CONFIG.siteUrl}${imagePath}`;
    try {
        const response = await fetch(imageUrl, { method: 'HEAD' });
        if (response.ok) {
            return { src: imageUrl, alt: altText };
        }
    } catch (error) {}
    return { src: imageUrl, alt: altText };
}

async function main() {
    console.log('🔍 Finding All Bundles and Updating UPC/GTIN + Images\n');
    console.log('='.repeat(60));
    
    const localProducts = loadLocalProducts();
    const walmartData = loadWalmartData();
    const products = await fetchAllProducts();
    
    // Find all bundles (products with -2pack, -3pack, -4pack, -5pack, etc.)
    const bundles = products.filter(p => 
        p.sku && (
            p.sku.includes('-2pack') || p.sku.includes('-3pack') || 
            p.sku.includes('-4pack') || p.sku.includes('-5pack') ||
            p.sku.includes('-2') || p.sku.includes('-3') || 
            p.sku.includes('-4') || p.sku.includes('-5')
        ) && p.sku.includes('52274-401') // Women's Balance bundles
    );
    
    console.log(`Found ${bundles.length} Women's Balance bundles:\n`);
    bundles.forEach(b => {
        console.log(`   - ${b.name.substring(0, 60)}... (SKU: ${b.sku})`);
    });
    console.log('');
    
    // Get base product images
    const baseProduct = localProducts['52274-401'];
    const baseImages = baseProduct?.images || [
        '/images/products/52274-401/01.png',
        '/images/products/52274-401/02.png',
        '/images/products/52274-401/03.png',
        '/images/products/52274-401/04.png',
        '/images/products/52274-401/05.png',
        '/images/products/52274-401/06.png',
        '/images/products/52274-401/07.png',
        '/images/products/52274-401/08.png',
        '/images/products/52274-401/09.png',
        '/images/products/52274-401/10.png'
    ];
    
    let updated = 0;
    
    for (const bundle of bundles) {
        console.log(`\n📦 Processing: ${bundle.name}`);
        console.log(`   SKU: ${bundle.sku}`);
        console.log(`   ID: ${bundle.id}`);
        
        const updateData = {};
        let hasUpdates = false;
        
        // Check UPC/GTIN
        const currentUPC = bundle.meta_data?.find(m => m.key === 'upc')?.value || '';
        const currentGTIN = bundle.meta_data?.find(m => m.key === 'gtin')?.value || '';
        
        // Get UPC/GTIN from Walmart data or base product
        let upc = '';
        let gtin = '';
        
        // Try exact SKU match first
        if (walmartData[bundle.sku]) {
            upc = walmartData[bundle.sku].upc || walmartData[bundle.sku].gtin || '';
            gtin = walmartData[bundle.sku].gtin || walmartData[bundle.sku].upc || '';
        }
        
        // Try without 'pack' suffix (e.g., 52274-401-5pack -> 52274-401-5)
        if (!upc && bundle.sku.includes('pack')) {
            const skuNoPack = bundle.sku.replace('pack', '');
            if (walmartData[skuNoPack]) {
                upc = walmartData[skuNoPack].upc || walmartData[skuNoPack].gtin || '';
                gtin = walmartData[skuNoPack].gtin || walmartData[skuNoPack].upc || '';
            }
        }
        
        // Fallback to base product
        if (!upc && baseProduct?.upc) {
            upc = baseProduct.upc;
        }
        if (!gtin && baseProduct?.gtin) {
            gtin = baseProduct.gtin;
        }
        
        console.log(`   Current UPC: ${currentUPC || 'MISSING'}`);
        console.log(`   Current GTIN: ${currentGTIN || 'MISSING'}`);
        if (upc) console.log(`   Found UPC from data: ${upc}`);
        if (gtin) console.log(`   Found GTIN from data: ${gtin}`);
        
        // Update UPC (replace if wrong or missing)
        if (upc && currentUPC !== upc) {
            if (!updateData.meta_data) {
                updateData.meta_data = [...(bundle.meta_data || [])];
            }
            const existing = updateData.meta_data.find(m => m.key === 'upc');
            if (existing) {
                existing.value = upc;
            } else {
                updateData.meta_data.push({ key: 'upc', value: upc });
            }
            hasUpdates = true;
            console.log(`   ✅ Will ${currentUPC ? 'update' : 'add'} UPC: ${upc}`);
        }
        
        // Update GTIN (replace if wrong or missing)
        if (gtin && currentGTIN !== gtin) {
            if (!updateData.meta_data) {
                updateData.meta_data = [...(bundle.meta_data || [])];
            }
            const existing = updateData.meta_data.find(m => m.key === 'gtin');
            if (existing) {
                existing.value = gtin;
            } else {
                updateData.meta_data.push({ key: 'gtin', value: gtin });
            }
            hasUpdates = true;
            console.log(`   ✅ Will ${currentGTIN ? 'update' : 'add'} GTIN: ${gtin}`);
        }
        
        // Update images
        const currentImages = bundle.images || [];
        if (currentImages.length === 0 && baseImages.length > 0) {
            console.log(`   📤 Preparing ${baseImages.length} images...`);
            const imageList = [];
            for (let i = 0; i < baseImages.length; i++) {
                const imgPath = baseImages[i];
                const altText = `${bundle.name} - Image ${i + 1}`;
                const imageData = await getImageUrl(imgPath, altText);
                imageList.push(imageData);
            }
            updateData.images = imageList;
            hasUpdates = true;
            console.log(`   ✅ Will add ${imageList.length} images`);
        }
        
        if (hasUpdates) {
            try {
                const updatedProduct = await updateProduct(bundle.id, updateData);
                console.log(`   ✅ Successfully updated!`);
                if (updateData.meta_data) {
                    const newUPC = updateData.meta_data.find(m => m.key === 'upc')?.value;
                    const newGTIN = updateData.meta_data.find(m => m.key === 'gtin')?.value;
                    if (newUPC) console.log(`      UPC: ${newUPC}`);
                    if (newGTIN) console.log(`      GTIN: ${newGTIN}`);
                }
                if (updateData.images) {
                    console.log(`      Images: ${updatedProduct.images.length} added`);
                }
                updated++;
            } catch (error) {
                console.log(`   ❌ Failed: ${error.message}`);
            }
        } else {
            console.log(`   ℹ️  No updates needed`);
        }
    }
    
    console.log(`\n\n✨ Complete! Updated ${updated} out of ${bundles.length} bundles.`);
}

main().catch(console.error);
