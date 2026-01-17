import Database from 'better-sqlite3';
import axios from 'axios';
import { createWriteStream, existsSync, mkdirSync, readdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { pipeline } from 'stream/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'products.db'));
const publicDir = join(__dirname, '..');

const WOO_URL = 'https://successchemistry.com';
const WOO_KEY = 'ck_413616975bb7e130772de00cf6262656238905f8';
const WOO_SECRET = 'cs_8c3604def60b23c471469da8021dfb7fa3a741f0';

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
        return false;
    }
}

async function downloadAllProductImages() {
    const products = db.prepare('SELECT id, sku FROM products').all();
    console.log(`Processing ${products.length} products...\n`);

    let totalDownloaded = 0;
    let totalSkipped = 0;
    let totalErrors = 0;

    for (const product of products) {
        console.log(`\n${product.sku}:`);

        try {
            // Fetch product from WooCommerce
            const response = await axios.get(`${WOO_URL}/wp-json/wc/v3/products`, {
                params: { sku: product.sku },
                auth: { username: WOO_KEY, password: WOO_SECRET }
            });

            const wooProduct = response.data[0];
            if (!wooProduct?.images || wooProduct.images.length === 0) {
                console.log(`  ⚠️ No images found`);
                totalErrors++;
                continue;
            }

            // Create product directory
            const productDir = join(publicDir, 'public', 'images', 'products', product.sku);
            if (!existsSync(productDir)) {
                mkdirSync(productDir, { recursive: true });
            }

            // Get existing files
            const existingFiles = existsSync(productDir) ? readdirSync(productDir) : [];

            // Download ALL images
            for (let i = 0; i < wooProduct.images.length; i++) {
                const image = wooProduct.images[i];
                const imageNum = String(i + 1).padStart(2, '0');
                const ext = image.src.split('.').pop().split('?')[0] || 'png';
                const filename = `${imageNum}.${ext}`;
                const filepath = join(productDir, filename);

                // Check if already exists
                const alreadyExists = existingFiles.some(f => f.startsWith(imageNum + '.'));
                
                if (alreadyExists) {
                    console.log(`  ${imageNum} - skipped (exists)`);
                    totalSkipped++;
                    continue;
                }

                const success = await downloadImage(image.src, filepath);
                if (success) {
                    console.log(`  ${imageNum} - downloaded`);
                    totalDownloaded++;
                } else {
                    console.log(`  ${imageNum} - failed`);
                    totalErrors++;
                }
            }

            // Small delay
            await new Promise(r => setTimeout(r, 300));

        } catch (error) {
            console.log(`  ✗ Error: ${error.message}`);
            totalErrors++;
        }
    }

    console.log(`\n=== Complete ===`);
    console.log(`Downloaded: ${totalDownloaded}`);
    console.log(`Skipped: ${totalSkipped}`);
    console.log(`Errors: ${totalErrors}`);

    db.close();
}

downloadAllProductImages();
