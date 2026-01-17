/**
 * PRODUCT IMAGE SYNC & MAPPING
 * Downloads and maps product images from WooCommerce
 */

import axios from 'axios';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { pipeline } from 'stream/promises';

/**
 * Download image from URL to local file
 */
async function downloadImage(url, filepath) {
  try {
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'stream'
    });

    await pipeline(response.data, createWriteStream(filepath));
    return true;
  } catch (error) {
    console.error(`Failed to download image from ${url}:`, error.message);
    return false;
  }
}

/**
 * Sync product images from WooCommerce
 */
export async function syncProductImages(wooProducts, publicDir) {
  const results = {
    total: 0,
    downloaded: 0,
    skipped: 0,
    errors: []
  };

  for (const product of wooProducts) {
    const sku = product.sku || `woo-${product.id}`;
    const productDir = join(publicDir, 'images', 'products', sku);

    // Create product image directory
    if (!existsSync(productDir)) {
      mkdirSync(productDir, { recursive: true });
    }

    // Download all product images
    if (product.images && product.images.length > 0) {
      for (let i = 0; i < product.images.length; i++) {
        results.total++;
        const image = product.images[i];
        const imageNum = String(i + 1).padStart(2, '0');
        const ext = image.src.split('.').pop().split('?')[0] || 'jpg';
        const filename = `${imageNum}.${ext}`;
        const filepath = join(productDir, filename);

        // Skip if already exists
        if (existsSync(filepath)) {
          results.skipped++;
          continue;
        }

        // Download image
        const success = await downloadImage(image.src, filepath);
        if (success) {
          results.downloaded++;
        } else {
          results.errors.push({
            sku,
            imageUrl: image.src,
            error: 'Download failed'
          });
        }
      }
    }
  }

  return results;
}

/**
 * Map product images to database
 */
export function mapProductImages(db, sku, imageCount) {
  const imagePaths = [];
  for (let i = 1; i <= imageCount; i++) {
    const imageNum = String(i).padStart(2, '0');
    imagePaths.push(`/images/products/${sku}/${imageNum}.jpg`);
  }

  // Update product with image paths
  const update = db.prepare(`
    UPDATE products 
    SET image_url = ?
    WHERE sku = ?
  `);

  update.run(imagePaths[0] || '', sku);
  
  return imagePaths;
}

/**
 * Get product images from directory
 */
export async function getProductImages(sku, publicDir) {
  const productDir = join(publicDir, 'images', 'products', sku);
  
  if (!existsSync(productDir)) {
    return [];
  }

  const fs = await import('fs');
  const files = fs.readdirSync(productDir);
  
  return files
    .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
    .sort()
    .map(file => `/images/products/${sku}/${file}`);
}

/**
 * Bulk sync all product images
 */
export async function bulkSyncImages(wooProducts, db, publicDir) {
  console.log('Starting bulk image sync...');
  
  const downloadResults = await syncProductImages(wooProducts, publicDir);
  
  console.log(`Downloaded ${downloadResults.downloaded} images, skipped ${downloadResults.skipped}`);
  
  // Map images to database
  let mapped = 0;
  for (const product of wooProducts) {
    const sku = product.sku || `woo-${product.id}`;
    const imageCount = product.images?.length || 0;
    
    if (imageCount > 0) {
      mapProductImages(db, sku, imageCount);
      mapped++;
    }
  }

  return {
    ...downloadResults,
    mapped
  };
}
