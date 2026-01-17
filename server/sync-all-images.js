import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import * as woocommerce from './woocommerce.js';
import { bulkSyncImages } from './image-sync.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'products.db'));

async function syncAllProductImages() {
    try {
        console.log('Fetching all products from WooCommerce...');
        const wooProducts = await woocommerce.getAllProducts();
        console.log(`Found ${wooProducts.length} products`);

        const publicDir = join(__dirname, '..');
        
        console.log('\nDownloading product images...');
        const results = await bulkSyncImages(wooProducts, db, publicDir);

        console.log('\n=== Image Sync Complete ===');
        console.log(`Total products: ${results.total}`);
        console.log(`Images downloaded: ${results.downloaded}`);
        console.log(`Already existed: ${results.skipped}`);
        console.log(`Errors: ${results.errors.length}`);

        if (results.errors.length > 0) {
            console.log('\nErrors:');
            results.errors.slice(0, 10).forEach(err => {
                console.log(`- ${err.sku}: ${err.error}`);
            });
        }

        db.close();
    } catch (error) {
        console.error('Error syncing images:', error);
        db.close();
        process.exit(1);
    }
}

syncAllProductImages();
