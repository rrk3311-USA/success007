import Database from 'better-sqlite3';
import axios from 'axios';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { pipeline } from 'stream/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'products.db'));

async function downloadImage(url, filepath) {
    try {
        const response = await axios({
            method: 'GET',
            url: url,
            responseType: 'stream',
            timeout: 30000
        });

        await pipeline(response.data, createWriteStream(filepath));
        return true;
    } catch (error) {
        console.error(`Failed to download ${url}:`, error.message);
        return false;
    }
}

async function downloadAllProductImages() {
    console.log('Fetching products from database...');
    const products = db.prepare('SELECT id, sku, name FROM products').all();
    console.log(`Found ${products.length} products\n`);

    const publicDir = join(__dirname, '..');
    let downloaded = 0;
    let skipped = 0;
    let errors = 0;

    // Fetch from WooCommerce API directly
    const WOO_URL = 'https://successchemistry.com';
    const WOO_KEY = 'ck_413616975bb7e130772de00cf6262656238905f8';
    const WOO_SECRET = 'cs_8c3604def60b23c471469da8021dfb7fa3a741f0';

    for (const product of products) {
        try {
            console.log(`Processing: ${product.sku} - ${product.name.substring(0, 50)}...`);
            
            // Fetch product from WooCommerce by SKU
            const response = await axios.get(`${WOO_URL}/wp-json/wc/v3/products`, {
                params: { sku: product.sku },
                auth: {
                    username: WOO_KEY,
                    password: WOO_SECRET
                }
            });

            const wooProduct = response.data[0];
            if (!wooProduct || !wooProduct.images || wooProduct.images.length === 0) {
                console.log(`  ⚠️  No images found`);
                errors++;
                continue;
            }

            // Create product directory
            const productDir = join(publicDir, 'public', 'images', 'products', product.sku);
            if (!existsSync(productDir)) {
                mkdirSync(productDir, { recursive: true });
            }

            // Download first image as 01.jpg
            const imageUrl = wooProduct.images[0].src;
            const ext = imageUrl.split('.').pop().split('?')[0] || 'jpg';
            const filepath = join(productDir, `01.${ext}`);

            if (existsSync(filepath)) {
                console.log(`  ✓ Already exists`);
                skipped++;
            } else {
                const success = await downloadImage(imageUrl, filepath);
                if (success) {
                    console.log(`  ✓ Downloaded`);
                    downloaded++;
                } else {
                    console.log(`  ✗ Failed`);
                    errors++;
                }
            }

            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 500));

        } catch (error) {
            console.log(`  ✗ Error: ${error.message}`);
            errors++;
        }
    }

    console.log('\n=== Download Complete ===');
    console.log(`Downloaded: ${downloaded}`);
    console.log(`Skipped: ${skipped}`);
    console.log(`Errors: ${errors}`);
    console.log(`Total: ${products.length}`);

    db.close();
}

downloadAllProductImages();
