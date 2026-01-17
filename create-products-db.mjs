import Database from 'better-sqlite3';
import fs from 'fs';

// Create database
const db = new Database('products.db');

// Create products table
db.exec(`
    CREATE TABLE IF NOT EXISTS products (
        sku TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        category TEXT,
        description TEXT,
        short_description TEXT,
        stock INTEGER DEFAULT 100000,
        upc TEXT,
        ingredients TEXT,
        key_features TEXT,
        images TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE INDEX IF NOT EXISTS idx_category ON products(category);
    CREATE INDEX IF NOT EXISTS idx_price ON products(price);
`);

console.log('✅ Database created with products table');

// Import data from products-data.js
const productsDataContent = fs.readFileSync('products-data.js', 'utf8');
const dataMatch = productsDataContent.match(/const PRODUCTS_DATA = ({[\s\S]*?});/);

if (dataMatch) {
    const productsDataStr = dataMatch[1];
    const PRODUCTS_DATA = eval('(' + productsDataStr + ')');
    
    const insert = db.prepare(`
        INSERT OR REPLACE INTO products 
        (sku, name, price, category, description, short_description, stock, upc, ingredients, key_features, images)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const insertMany = db.transaction((products) => {
        for (const product of products) {
            insert.run(
                product.sku,
                product.name,
                product.price,
                product.category,
                product.description,
                product.short_description || '',
                product.stock || 100000,
                product.upc || '',
                product.ingredients || '',
                product.key_features || '',
                JSON.stringify(product.images)
            );
        }
    });
    
    const productsArray = Object.values(PRODUCTS_DATA);
    insertMany(productsArray);
    
    console.log(`✅ Imported ${productsArray.length} products into database`);
    
    // Show sample data
    const sample = db.prepare('SELECT sku, name, price, category FROM products LIMIT 5').all();
    console.log('\n📦 Sample products in database:');
    sample.forEach(p => {
        console.log(`   ${p.sku}: ${p.name.substring(0, 60)}... - $${p.price}`);
    });
    
    // Show stats
    const stats = db.prepare(`
        SELECT 
            COUNT(*) as total,
            AVG(price) as avg_price,
            MIN(price) as min_price,
            MAX(price) as max_price
        FROM products
    `).get();
    
    console.log('\n📊 Database stats:');
    console.log(`   Total products: ${stats.total}`);
    console.log(`   Average price: $${stats.avg_price.toFixed(2)}`);
    console.log(`   Price range: $${stats.min_price} - $${stats.max_price}`);
    
} else {
    console.error('❌ Could not parse products-data.js');
}

db.close();
console.log('\n✅ Database ready: products.db');
