// Add images to all bundles that are missing them
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

async function fetchAllProducts() {
    const response = await fetch(
        `${WOOCOMMERCE_CONFIG.url}${WOOCOMMERCE_CONFIG.apiEndpoint}/products?per_page=100`,
        { headers: { 'Authorization': getAuthHeader() } }
    );
    if (!response.ok) throw new Error(`API Error ${response.status}`);
    return await response.json();
}

async function updateProductImages(productId, images) {
    const response = await fetch(
        `${WOOCOMMERCE_CONFIG.url}${WOOCOMMERCE_CONFIG.apiEndpoint}/products/${productId}`,
        {
            method: 'PUT',
            headers: {
                'Authorization': getAuthHeader(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ images: images })
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
    return { src: imageUrl, alt: altText };
}

async function main() {
    console.log('🖼️  Adding Images to All Bundles\n');
    console.log('='.repeat(60));
    
    const products = await fetchAllProducts();
    
    // Find all bundles missing images
    const bundles = products.filter(p => 
        p.sku && (
            p.sku.includes('-2pack') || p.sku.includes('-3pack') || 
            p.sku.includes('-4pack') || p.sku.includes('-5pack') ||
            p.sku.includes('-2') || p.sku.includes('-3') || 
            p.sku.includes('-4') || p.sku.includes('-5')
        ) && p.sku.includes('52274-401') && (!p.images || p.images.length === 0)
    );
    
    console.log(`Found ${bundles.length} bundles missing images:\n`);
    bundles.forEach(b => {
        console.log(`   - ${b.name.substring(0, 60)}... (SKU: ${b.sku}, ID: ${b.id})`);
    });
    console.log('');
    
    // Base product images
    const baseImages = [
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
        console.log(`\n📦 Adding images to: ${bundle.name}`);
        console.log(`   SKU: ${bundle.sku}`);
        
        const imageList = [];
        for (let i = 0; i < baseImages.length; i++) {
            const imgPath = baseImages[i];
            const altText = `${bundle.name} - Image ${i + 1}`;
            const imageData = await getImageUrl(imgPath, altText);
            imageList.push(imageData);
        }
        
        try {
            const updatedProduct = await updateProductImages(bundle.id, imageList);
            console.log(`   ✅ Successfully added ${updatedProduct.images.length} images!`);
            updated++;
        } catch (error) {
            console.log(`   ❌ Failed: ${error.message}`);
        }
    }
    
    console.log(`\n\n✨ Complete! Added images to ${updated} out of ${bundles.length} bundles.`);
}

main().catch(console.error);
