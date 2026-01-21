// Update bundles with correct hero images - 2-pack uses 02, 3-pack uses 03, etc.
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

function getBundleHeroImageNumber(sku) {
    // Extract pack number from SKU
    // 52274-401-2pack -> 2, 52274-401-3pack -> 3, etc.
    const match = sku.match(/-(\d+)pack/);
    if (match) {
        return parseInt(match[1]);
    }
    // Try without 'pack' suffix
    const match2 = sku.match(/-(\d+)$/);
    if (match2) {
        return parseInt(match2[1]);
    }
    return 1; // Default to 1 for single pack
}

async function main() {
    console.log('🖼️  Updating Bundles with Correct Hero Images\n');
    console.log('='.repeat(60));
    console.log('Hero image mapping:');
    console.log('  2-pack -> 02.png (hero)');
    console.log('  3-pack -> 03.png (hero)');
    console.log('  4-pack -> 04.png (hero)');
    console.log('  5-pack -> 05.png (hero)');
    console.log('='.repeat(60));
    console.log('');
    
    const products = await fetchAllProducts();
    
    // Find all bundles
    const bundles = products.filter(p => 
        p.sku && (
            p.sku.includes('-2pack') || p.sku.includes('-3pack') || 
            p.sku.includes('-4pack') || p.sku.includes('-5pack') ||
            (p.sku.includes('-2') && p.sku.includes('52274-401') && !p.sku.includes('52274-401-2pack')) ||
            (p.sku.includes('-3') && p.sku.includes('52274-401') && !p.sku.includes('52274-401-3pack')) ||
            (p.sku.includes('-4') && p.sku.includes('52274-401') && !p.sku.includes('52274-401-4pack')) ||
            (p.sku.includes('-5') && p.sku.includes('52274-401') && !p.sku.includes('52274-401-5pack'))
        ) && p.sku.includes('52274-401')
    );
    
    console.log(`Found ${bundles.length} bundles to update:\n`);
    
    // Base images (all 10)
    const allImages = [
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
        const packNumber = getBundleHeroImageNumber(bundle.sku);
        const heroImageIndex = packNumber - 1; // 0-based index
        
        console.log(`\n📦 ${bundle.name.substring(0, 60)}...`);
        console.log(`   SKU: ${bundle.sku}`);
        console.log(`   Pack: ${packNumber}-pack`);
        console.log(`   Hero image: ${allImages[heroImageIndex]}`);
        
        // Reorder images: hero first, then rest
        const reorderedImages = [
            allImages[heroImageIndex], // Hero image first
            ...allImages.slice(0, heroImageIndex), // Images before hero
            ...allImages.slice(heroImageIndex + 1) // Images after hero
        ];
        
        // Remove duplicate hero image if it appears twice
        const uniqueImages = [...new Set(reorderedImages)];
        
        console.log(`   Image order: ${uniqueImages.map(img => img.split('/').pop()).join(', ')}`);
        
        const imageList = [];
        for (let i = 0; i < uniqueImages.length; i++) {
            const imgPath = uniqueImages[i];
            const altText = `${bundle.name} - Image ${i + 1}`;
            const imageData = await getImageUrl(imgPath, altText);
            imageList.push(imageData);
        }
        
        try {
            const updatedProduct = await updateProductImages(bundle.id, imageList);
            console.log(`   ✅ Updated with ${updatedProduct.images.length} images (hero: ${uniqueImages[0].split('/').pop()})`);
            updated++;
        } catch (error) {
            console.log(`   ❌ Failed: ${error.message}`);
        }
    }
    
    console.log(`\n\n✨ Complete! Updated ${updated} out of ${bundles.length} bundles with correct hero images.`);
}

main().catch(console.error);
