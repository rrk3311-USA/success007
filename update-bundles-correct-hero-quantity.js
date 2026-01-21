// Update bundles with correct hero images showing the quantity (2 bottles, 3 bottles, etc.)
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

function getBundleHeroImage(sku) {
    // Map SKU to the correct hero image showing the quantity
    // These images show 2 bottles, 3 bottles, 4 bottles, 5 bottles respectively
    const heroImages = {
        '52274-401-2pack': '/images/products/52274-401/02.png', // 2-PACK hero (shows 2 bottles)
        '52274-401-3pack': '/images/products/52274-401/03.png', // 3-PACK hero (shows 3 bottles)
        '52274-401-4pack': '/images/products/52274-401/04.png', // 4-PACK hero (shows 4 bottles)
        '52274-401-5pack': '/images/products/52274-401/05.png', // 5-PACK hero (shows 5 bottles)
        '52274-401-1pack': '/images/products/52274-401/01.png', // Single pack (shows 1 bottle)
        '52274-401': '/images/products/52274-401/01.png' // Base product (shows 1 bottle)
    };
    
    return heroImages[sku] || '/images/products/52274-401/01.png';
}

async function main() {
    console.log('🖼️  Updating Bundles with Correct Hero Images (Showing Quantity)\n');
    console.log('='.repeat(60));
    console.log('Hero image mapping (showing quantity in image):');
    console.log('  2-pack -> 02.png (shows 2 bottles)');
    console.log('  3-pack -> 03.png (shows 3 bottles)');
    console.log('  4-pack -> 04.png (shows 4 bottles)');
    console.log('  5-pack -> 05.png (shows 5 bottles)');
    console.log('  1-pack -> 01.png (shows 1 bottle)');
    console.log('='.repeat(60));
    console.log('');
    
    const products = await fetchAllProducts();
    
    // Find all bundles
    const bundles = products.filter(p => 
        p.sku && (
            p.sku.includes('-2pack') || p.sku.includes('-3pack') || 
            p.sku.includes('-4pack') || p.sku.includes('-5pack') ||
            p.sku.includes('-1pack') ||
            (p.sku === '52274-401')
        ) && p.sku.includes('52274-401')
    );
    
    console.log(`Found ${bundles.length} bundles to update:\n`);
    
    // All available images
    const allImages = [
        '/images/products/52274-401/01.png', // Single bottle
        '/images/products/52274-401/02.png', // 2-PACK hero
        '/images/products/52274-401/03.png', // 3-PACK hero
        '/images/products/52274-401/04.png', // 4-PACK hero
        '/images/products/52274-401/05.png', // 5-PACK hero
        '/images/products/52274-401/06.png',
        '/images/products/52274-401/07.png',
        '/images/products/52274-401/08.png',
        '/images/products/52274-401/09.png',
        '/images/products/52274-401/10.png'
    ];
    
    let updated = 0;
    
    for (const bundle of bundles) {
        const heroImage = getBundleHeroImage(bundle.sku);
        
        console.log(`\n📦 ${bundle.name.substring(0, 60)}...`);
        console.log(`   SKU: ${bundle.sku}`);
        console.log(`   Hero image: ${heroImage} (shows correct quantity)`);
        
        // Reorder: hero first, then rest (excluding the hero from the list)
        const otherImages = allImages.filter(img => img !== heroImage);
        const reorderedImages = [heroImage, ...otherImages];
        
        console.log(`   Total images: ${reorderedImages.length}`);
        
        const imageList = [];
        for (let i = 0; i < reorderedImages.length; i++) {
            const imgPath = reorderedImages[i];
            const altText = `${bundle.name} - Image ${i + 1}`;
            const imageData = await getImageUrl(imgPath, altText);
            imageList.push(imageData);
        }
        
        try {
            const updatedProduct = await updateProductImages(bundle.id, imageList);
            console.log(`   ✅ Updated with ${updatedProduct.images.length} images`);
            console.log(`      First image (hero): ${heroImage.split('/').pop()} (shows correct quantity)`);
            updated++;
        } catch (error) {
            console.log(`   ❌ Failed: ${error.message}`);
        }
    }
    
    console.log(`\n\n✨ Complete! Updated ${updated} out of ${bundles.length} bundles.`);
    console.log(`\n📋 Summary:`);
    console.log(`   - Each bundle now has the correct hero image showing the quantity`);
    console.log(`   - 2-pack shows 2 bottles, 3-pack shows 3 bottles, etc.`);
}

main().catch(console.error);
