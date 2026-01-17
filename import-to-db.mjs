import Database from 'better-sqlite3';
import http from 'http';

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

// Fetch products from API and import
http.get('http://localhost:3001/api/products', (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
        data += chunk;
    });
    
    res.on('end', () => {
        const products = JSON.parse(data);
        
        const insert = db.prepare(`
            INSERT OR REPLACE INTO products 
            (sku, name, price, category, description, short_description, stock, upc, ingredients, key_features, images)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        const insertMany = db.transaction((products) => {
            for (const product of products) {
                // Clean description
                let desc = product.description || product.short_description || '';
                desc = desc.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
                
                let shortDesc = product.short_description || '';
                shortDesc = shortDesc.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
                
                // Get images from local folder
                const images = product.images || [];
                
                insert.run(
                    product.sku,
                    product.name,
                    parseFloat(product.price),
                    product.category || 'Supplements',
                    desc,
                    shortDesc,
                    product.stock || 100000,
                    product.upc || '',
                    product.ingredients || '',
                    product.key_features || '',
                    JSON.stringify(images)
                );
            }
        });
        
        insertMany(products);
        
        console.log(`✅ Imported ${products.length} products into database`);
        
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
        
        db.close();
        console.log('\n✅ Database ready: products.db');
    });
}).on('error', (err) => {
    console.error('Error:', err.message);
    db.close();
});
