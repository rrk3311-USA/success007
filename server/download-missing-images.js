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
        console.error(`Failed: ${error.message}`);
        return false;
    }
}

async function downloadMissingImages() {
    const products = db.prepare('SELECT id, sku FROM products').all();
    const update = db.prepare('UPDATE products SET image_url = ? WHERE id = ?');
    
    let downloaded = 0;
    let errors = 0;

    for (const product of products) {
        const productDir = join(publicDir, 'public', 'images', 'products', product.sku);
        
        // Check if 01.* exists
        if (existsSync(productDir)) {
            const files = readdirSync(productDir);
            const hasImage = files.some(f => f.startsWith('01.'));
            if (hasImage) continue;
        }

        console.log(`Downloading: ${product.sku}`);

        try {
            // Fetch from WooCommerce
            const response = await axios.get(`${WOO_URL}/wp-json/wc/v3/products`, {
                params: { sku: product.sku },
                auth: { username: WOO_KEY, password: WOO_SECRET }
            });

            const wooProduct = response.data[0];
            if (!wooProduct?.images?.[0]?.src) {
                console.log(`  ⚠️ No image found`);
                errors++;
                continue;
            }

            // Create directory
            if (!existsSync(productDir)) {
                mkdirSync(productDir, { recursive: true });
            }

            // Download image
            const imageUrl = wooProduct.images[0].src;
            const ext = imageUrl.split('.').pop().split('?')[0] || 'png';
            const filepath = join(productDir, `01.${ext}`);

            const success = await downloadImage(imageUrl, filepath);
            if (success) {
                console.log(`  ✓ Downloaded`);
                update.run(`/images/products/${product.sku}/01.${ext}`, product.id);
                downloaded++;
            } else {
                errors++;
            }

            await new Promise(r => setTimeout(r, 500));
        } catch (error) {
            console.log(`  ✗ Error: ${error.message}`);
            errors++;
        }
    }

    console.log(`\nDownloaded: ${downloaded}, Errors: ${errors}`);
    db.close();
}

downloadMissingImages();
