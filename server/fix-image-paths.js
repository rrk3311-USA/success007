import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, readdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'products.db'));
const publicDir = join(__dirname, '..');

console.log('Fixing product image paths...\n');

const products = db.prepare('SELECT id, sku, image_url FROM products').all();
const update = db.prepare('UPDATE products SET image_url = ? WHERE id = ?');

let fixed = 0;
let notFound = 0;

for (const product of products) {
    const productDir = join(publicDir, 'public', 'images', 'products', product.sku);
    
    if (!existsSync(productDir)) {
        console.log(`❌ ${product.sku} - folder not found`);
        notFound++;
        continue;
    }

    const files = readdirSync(productDir);
    const imageFile = files.find(f => f.startsWith('01.'));
    
    if (imageFile) {
        const newPath = `/images/products/${product.sku}/${imageFile}`;
        if (newPath !== product.image_url) {
            update.run(newPath, product.id);
            console.log(`✓ ${product.sku} - updated to ${imageFile}`);
            fixed++;
        }
    } else {
        console.log(`⚠️  ${product.sku} - no 01.* file found`);
        notFound++;
    }
}

console.log(`\n=== Complete ===`);
console.log(`Fixed: ${fixed}`);
console.log(`Not found: ${notFound}`);
console.log(`Total: ${products.length}`);

db.close();
