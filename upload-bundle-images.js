// Upload images for 5-pack bundle (52274-401-5pack)
import fetch from 'node-fetch';
import fs from 'fs';

const WOOCOMMERCE_CONFIG = {
    url: 'https://blueviolet-snake-802946.hostingersite.com',
    consumerKey: 'ck_2a7dcf6903f5d22ed4228abd6da424746d5f80b6',
    consumerSecret: 'cs_448d2cd75368443afcd926cb249bd78e81a80db1',
    apiEndpoint: '/wp-json/wc/v3',
    siteUrl: 'https://successchemistry.com' // Public site URL for image URLs
};

function getAuthHeader() {
    return `Basic ${Buffer.from(`${WOOCOMMERCE_CONFIG.consumerKey}:${WOOCOMMERCE_CONFIG.consumerSecret}`).toString('base64')}`;
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

async function getImageUrl(imagePath, altText) {
    // Use the public site URL for images
    // Images should be accessible at successchemistry.com/images/...
    const imageUrl = `${WOOCOMMERCE_CONFIG.siteUrl}${imagePath}`;
    
    // Verify image exists by checking if it's accessible
    try {
        const response = await fetch(imageUrl, { method: 'HEAD' });
        if (response.ok) {
            return { src: imageUrl, alt: altText };
        } else {
            console.log(`   ⚠️  Image not accessible at ${imageUrl} (${response.status})`);
            return { src: imageUrl, alt: altText }; // Still use it, might work
        }
    } catch (error) {
        console.log(`   ⚠️  Could not verify image: ${error.message}`);
        return { src: imageUrl, alt: altText }; // Still use it
    }
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

async function main() {
    console.log('🖼️  Uploading Images for 5-Pack Bundle: 52274-401-5pack\n');
    console.log('='.repeat(60));
    
    // Load base product data
    const productsDataPath = './deploy-site/products-data.js';
    let baseProductImages = [];
    
    try {
        const content = fs.readFileSync(productsDataPath, 'utf8');
        const match = content.match(/"52274-401":\s*{[\s\S]*?"images":\s*\[([\s\S]*?)\]/);
        if (match) {
            const imagesStr = match[1];
            baseProductImages = imagesStr
                .split(',')
                .map(img => img.trim().replace(/["']/g, ''))
                .filter(img => img);
        }
    } catch (e) {
        console.log('⚠️  Could not load products-data.js, using default images');
        baseProductImages = [
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
    }
    
    console.log(`📦 Base product has ${baseProductImages.length} images`);
    console.log(`   Using all ${baseProductImages.length} base product images\n`);
    
    // Fetch the bundle
    const bundle = await fetchProductBySKU('52274-401-5pack');
    if (!bundle) {
        console.log('❌ Bundle 52274-401-5pack not found in WooCommerce');
        return;
    }
    
    console.log(`✅ Found bundle: ${bundle.name}`);
    console.log(`   Current images: ${bundle.images?.length || 0}\n`);
    
    // Use all base product images (they should work)
    // Skip standard images for now since they don't exist yet
    const imagesToUse = baseProductImages;
    
    console.log('📤 Preparing image URLs...\n');
    console.log(`   Using ${imagesToUse.length} base product images\n`);
    const imageList = [];
    
    // Get base product images - use WordPress hosting URL so WooCommerce can fetch them
    for (let i = 0; i < imagesToUse.length; i++) {
        const imgPath = imagesToUse[i];
        const altText = `Women's Balance 5-Pack - Image ${i + 1}`;
        console.log(`   [${i + 1}/${imagesToUse.length}] ${imgPath}`);
        
        // Try public site URL first, fallback to WordPress hosting URL
        const publicUrl = `${WOOCOMMERCE_CONFIG.siteUrl}${imgPath}`;
        const wpUrl = `${WOOCOMMERCE_CONFIG.url}${imgPath}`;
        
        // Check which URL works
        try {
            const check = await fetch(publicUrl, { method: 'HEAD' });
            if (check.ok) {
                imageList.push({ src: publicUrl, alt: altText });
            } else {
                imageList.push({ src: wpUrl, alt: altText });
            }
        } catch (e) {
            imageList.push({ src: publicUrl, alt: altText });
        }
    }
    
    console.log(`\n✅ Prepared ${imageList.length} image URLs`);
    console.log(`\n🔄 Updating product with images...\n`);
    
    try {
        const updated = await updateProductImages(bundle.id, imageList);
        console.log(`✅ Successfully updated bundle with ${updated.images.length} images!`);
        console.log(`\n📋 Image URLs:`);
        updated.images.forEach((img, idx) => {
            console.log(`   ${idx + 1}. ${img.src}`);
        });
    } catch (error) {
        console.log(`❌ Failed to update product: ${error.message}`);
        console.log(`\n💡 Note: If images fail to load, they may need to be uploaded to WordPress media library first.`);
    }
}

main().catch(console.error);
