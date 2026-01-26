/**
 * Set 2-Pack Hero Image
 * 
 * Usage:
 *   node set-2pack-hero-image.js <image-url>
 *   node set-2pack-hero-image.js "https://blueviolet-snake-802946.hostingersite.com/wp-content/uploads/2026/01/liver-cleanse-2pack-hero.png"
 */

import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const WOOCOMMERCE_CONFIG = {
    url: process.env.WOOCOMMERCE_URL || 'https://blueviolet-snake-802946.hostingersite.com',
    consumerKey: process.env.WOOCOMMERCE_CONSUMER_KEY || 'ck_2a7dcf6903f5d22ed4228abd6da424746d5f80b6',
    consumerSecret: process.env.WOOCOMMERCE_CONSUMER_SECRET || 'cs_448d2cd75368443afcd926cb249bd78e81a80db1',
    apiEndpoint: '/wp-json/wc/v3'
};

function getAuthHeader() {
    return `Basic ${Buffer.from(`${WOOCOMMERCE_CONFIG.consumerKey}:${WOOCOMMERCE_CONFIG.consumerSecret}`).toString('base64')}`;
}

async function main() {
    const imageUrl = process.argv[2];
    const sku = '10777-810-2';
    
    if (!imageUrl) {
        console.log('❌ Please provide the image URL');
        console.log('');
        console.log('Usage:');
        console.log('  node set-2pack-hero-image.js <image-url>');
        console.log('');
        console.log('Example:');
        console.log('  node set-2pack-hero-image.js "https://blueviolet-snake-802946.hostingersite.com/wp-content/uploads/2026/01/liver-cleanse-2pack-hero.png"');
        process.exit(1);
    }
    
    console.log('🖼️  Setting 2-Pack Hero Image\n');
    console.log('='.repeat(70));
    console.log(`Image URL: ${imageUrl}`);
    console.log('');
    
    // Get product
    console.log(`📋 Finding product with SKU: ${sku}...`);
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
    
    // Get existing images (keep them, just reorder)
    const existingImages = product.images || [];
    const otherImages = existingImages.slice(1, 6); // Keep other images
    
    // New images array with new hero first
    const updatedImages = [
        {
            src: imageUrl,
            alt: 'Success Chemistry Liver Cleanse 2-Pack - 2 Bottles with Capsules'
        },
        ...otherImages
    ];
    
    console.log(`\n📸 Updating images...`);
    console.log(`   New hero image: ${imageUrl}`);
    console.log(`   Total images: ${updatedImages.length}`);
    
    // Update product
    try {
        console.log(`\n🚀 Updating product...`);
        const updateResponse = await fetch(
            `${WOOCOMMERCE_CONFIG.url}${WOOCOMMERCE_CONFIG.apiEndpoint}/products/${product.id}`,
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
        
        const updated = await updateResponse.json();
        
        console.log(`✅ Product updated successfully!`);
        console.log(`   New hero image: ${updated.images[0]?.src}`);
        console.log(`   Total images: ${updated.images.length}`);
        console.log(`\n🌐 View: ${WOOCOMMERCE_CONFIG.url}/product/${updated.slug}/`);
        
    } catch (error) {
        console.error(`\n❌ Error updating product:`, error.message);
        process.exit(1);
    }
}

main().catch(error => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
});
