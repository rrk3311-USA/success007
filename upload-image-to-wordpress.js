/**
 * Upload Image to WordPress Media Library
 * Then update WooCommerce product with the new image
 */

import fetch from 'node-fetch';
import { readFileSync } from 'fs';
import { join } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const WOOCOMMERCE_CONFIG = {
    url: process.env.WOOCOMMERCE_URL || 'https://blueviolet-snake-802946.hostingersite.com',
    consumerKey: process.env.WOOCOMMERCE_CONSUMER_KEY || 'ck_2a7dcf6903f5d22ed4228abd6da424746d5f80b6',
    consumerSecret: process.env.WOOCOMMERCE_CONSUMER_SECRET || 'cs_448d2cd75368443afcd926cb249bd78e81a80db1',
    apiEndpoint: '/wp-json/wc/v3'
};

// WordPress REST API for media
const WP_API = '/wp-json/wp/v2';

function getAuthHeader() {
    return `Basic ${Buffer.from(`${WOOCOMMERCE_CONFIG.consumerKey}:${WOOCOMMERCE_CONFIG.consumerSecret}`).toString('base64')}`;
}

async function uploadImageToWordPress(imagePath, filename) {
    console.log(`📤 Uploading image: ${filename}...`);
    
    try {
        const imageBuffer = readFileSync(imagePath);
        const base64Image = imageBuffer.toString('base64');
        
        // WordPress media upload endpoint
        const formData = new FormData();
        const blob = new Blob([imageBuffer], { type: 'image/png' });
        formData.append('file', blob, filename);
        
        // Use fetch with FormData
        const response = await fetch(
            `${WOOCOMMERCE_CONFIG.url}${WP_API}/media`,
            {
                method: 'POST',
                headers: {
                    'Authorization': getAuthHeader(),
                    'Content-Disposition': `attachment; filename="${filename}"`
                },
                body: imageBuffer
            }
        );
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Upload failed: ${errorText}`);
        }
        
        const media = await response.json();
        console.log(`✅ Image uploaded!`);
        console.log(`   Media ID: ${media.id}`);
        console.log(`   URL: ${media.source_url}`);
        return media;
        
    } catch (error) {
        console.error('❌ Error uploading image:', error.message);
        throw error;
    }
}

async function updateProductHeroImage(productId, imageUrl) {
    console.log(`\n🔄 Updating product hero image...`);
    
    // Get current product
    const getResponse = await fetch(
        `${WOOCOMMERCE_CONFIG.url}${WOOCOMMERCE_CONFIG.apiEndpoint}/products/${productId}`,
        {
            method: 'GET',
            headers: {
                'Authorization': getAuthHeader()
            }
        }
    );
    
    const product = await getResponse.json();
    const existingImages = product.images || [];
    const otherImages = existingImages.slice(1, 6); // Keep other images
    
    // Update with new hero image first
    const updatedImages = [
        {
            src: imageUrl,
            alt: 'Success Chemistry Liver Cleanse 2-Pack - 2 Bottles with Capsules'
        },
        ...otherImages
    ];
    
    const updateResponse = await fetch(
        `${WOOCOMMERCE_CONFIG.url}${WOOCOMMERCE_CONFIG.apiEndpoint}/products/${productId}`,
        {
            method: 'PUT',
            headers: {
                'Authorization': getAuthHeader(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ images: updatedImages })
        }
    );
    
    if (!updateResponse.ok) {
        const errorText = await updateResponse.text();
        throw new Error(`Update failed: ${errorText}`);
    }
    
    return await updateResponse.json();
}

async function main() {
    console.log('🖼️  Upload Image to WordPress & Update Product\n');
    console.log('='.repeat(70));
    
    const imagePath = join(process.cwd(), 'deploy-site/images/products/10777-810/02-hero-2pack-main.png');
    const filename = 'liver-cleanse-2pack-hero.png';
    const sku = '10777-810-2';
    
    try {
        // Upload image
        const media = await uploadImageToWordPress(imagePath, filename);
        
        // Get product
        console.log(`\n📋 Finding product with SKU: ${sku}...`);
        const productResponse = await fetch(
            `${WOOCOMMERCE_CONFIG.url}${WOOCOMMERCE_CONFIG.apiEndpoint}/products?sku=${sku}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': getAuthHeader()
                }
            }
        );
        
        const products = await productResponse.json();
        if (products.length === 0) {
            console.error(`❌ Product with SKU "${sku}" not found!`);
            process.exit(1);
        }
        
        const product = products[0];
        console.log(`✅ Found product: ${product.name} (ID: ${product.id})`);
        
        // Update product with new hero image
        const updated = await updateProductHeroImage(product.id, media.source_url);
        
        console.log(`\n✅ Product updated successfully!`);
        console.log(`   New hero image: ${updated.images[0]?.src}`);
        console.log(`   Total images: ${updated.images.length}`);
        console.log(`\n🌐 View: ${WOOCOMMERCE_CONFIG.url}/product/${updated.slug}/`);
        
    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.log('\n💡 Alternative: Upload the image manually via WordPress admin,');
        console.log('   then provide the image URL and I can update the product.');
        process.exit(1);
    }
}

main().catch(error => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
});
