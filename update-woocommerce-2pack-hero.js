/**
 * Update WooCommerce 2-Pack Product Hero Image
 * 
 * Updates the featured/hero image to the new 2-pack image
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

async function getProduct(sku) {
    try {
        const response = await fetch(
            `${WOOCOMMERCE_CONFIG.url}${WOOCOMMERCE_CONFIG.apiEndpoint}/products?sku=${sku}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': getAuthHeader()
                }
            }
        );
        
        if (!response.ok) {
            throw new Error(`Failed to fetch product: ${response.status}`);
        }
        
        const products = await response.json();
        return products.length > 0 ? products[0] : null;
    } catch (error) {
        console.error('❌ Error fetching product:', error.message);
        return null;
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
        console.error(`❌ Error updating product:`, error.message);
        throw error;
    }
}

async function main() {
    console.log('🖼️  Updating 2-Pack Product Hero Image\n');
    console.log('='.repeat(70));
    
    const sku = '10777-810-2';
    
    // Get existing product
    console.log(`📋 Fetching product with SKU: ${sku}...`);
    const product = await getProduct(sku);
    
    if (!product) {
        console.error(`❌ Product with SKU "${sku}" not found!`);
        process.exit(1);
    }
    
    console.log(`✅ Found product: ${product.name}`);
    console.log(`   Product ID: ${product.id}\n`);
    
    // For now, keep existing images but note that the new image needs to be uploaded
    // The image file is at: deploy-site/images/products/10777-810/02-hero-2pack-main.png
    // It needs to be uploaded to WordPress media library or made accessible via URL
    
    // Use the existing 02.png for now (which shows 2 bottles)
    // User can manually update via WordPress admin if needed
    const existingHero = existingImages.find(img => img.src.includes('02.png')) || existingImages[0];
    
    console.log('⚠️  Note: New hero image needs to be uploaded to WordPress media library first.');
    console.log('   Image file: deploy-site/images/products/10777-810/02-hero-2pack-main.png');
    console.log('   You can upload it via WordPress admin and then update this product.\n');
    
    // Keep current images for now - user can update manually
    const newHeroImage = existingHero ? {
        ...existingHero,
        alt: 'Success Chemistry Liver Cleanse 2-Pack - 2 Bottles with Capsules'
    } : {
        src: 'https://successchemistry.com/images/products/10777-810/02.png',
        alt: 'Success Chemistry Liver Cleanse 2-Pack - 2 Bottles with Capsules'
    };
    
    // Get existing images (keep them, just reorder)
    const existingImages = product.images || [];
    const otherImages = existingImages.filter(img => 
        !img.src.includes('02.png') && 
        !img.src.includes('02-hero')
    );
    
    // New images array with hero first
    const updatedImages = [
        newHeroImage, // New hero image first
        ...otherImages.slice(0, 5) // Keep other images (max 6 total)
    ];
    
    console.log('📸 Updating images...');
    console.log(`   New hero image: ${newHeroImage.src}`);
    console.log(`   Total images: ${updatedImages.length}\n`);
    
    // Update product
    const updateData = {
        images: updatedImages
    };
    
    try {
        console.log('🚀 Updating product...');
        const updated = await updateProduct(product.id, updateData);
        
        console.log('✅ Product updated successfully!');
        console.log(`   Product ID: ${updated.id}`);
        console.log(`   Featured Image: ${updated.images[0]?.src || 'Not set'}`);
        console.log(`   Total Images: ${updated.images.length}`);
        console.log(`\n🌐 View: ${WOOCOMMERCE_CONFIG.url}/product/${updated.slug}/`);
        
    } catch (error) {
        console.error('❌ Failed to update product:', error.message);
        process.exit(1);
    }
}

main().catch(error => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
});
