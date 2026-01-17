import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import vm from 'vm';

const projectRoot = process.cwd();
const dbPath = path.join(projectRoot, 'review-repo', 'master-reviews.db');

fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new Database(dbPath);

db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    sku TEXT PRIMARY KEY,
    upc TEXT,
    gtin TEXT,
    name TEXT NOT NULL,
    category TEXT,
    price REAL,
    status TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_products_upc ON products(upc);
  CREATE INDEX IF NOT EXISTS idx_products_gtin ON products(gtin);

  CREATE TABLE IF NOT EXISTS review_sources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source TEXT NOT NULL,
    filename TEXT,
    imported_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sku TEXT NOT NULL,
    source TEXT NOT NULL,
    external_review_id TEXT,
    external_product_id TEXT,
    rating REAL,
    title TEXT,
    body TEXT,
    reviewer_name TEXT,
    reviewer_id TEXT,
    review_date TEXT,
    verified INTEGER DEFAULT 0,
    language TEXT,
    country TEXT,
    image_urls TEXT,
    raw_payload TEXT,
    source_import_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sku) REFERENCES products(sku) ON DELETE CASCADE,
    FOREIGN KEY (source_import_id) REFERENCES review_sources(id) ON DELETE SET NULL
  );

  CREATE INDEX IF NOT EXISTS idx_reviews_sku ON reviews(sku);
  CREATE INDEX IF NOT EXISTS idx_reviews_source ON reviews(source);
  CREATE INDEX IF NOT EXISTS idx_reviews_ext_prod ON reviews(source, external_product_id);
  CREATE UNIQUE INDEX IF NOT EXISTS idx_reviews_unique_external ON reviews(source, external_review_id);
`);

const productsDataContent = fs.readFileSync(path.join(projectRoot, 'products-data.js'), 'utf8');

// products-data.js contains large HTML blobs and can include sequences like `};` inside strings,
// so regex extraction is brittle. Instead, execute it in a VM sandbox and export PRODUCTS_DATA.
const sandbox = {
  console,
  window: {},
};
vm.createContext(sandbox);

try {
  vm.runInContext(
    `${productsDataContent}\n;globalThis.__PRODUCTS_DATA__ = PRODUCTS_DATA;`,
    sandbox,
    { timeout: 15_000 }
  );
} catch (err) {
  console.error('❌ Failed to evaluate products-data.js in VM');
  console.error(err);
  process.exit(1);
}

const PRODUCTS_DATA = sandbox.__PRODUCTS_DATA__;
if (!PRODUCTS_DATA || typeof PRODUCTS_DATA !== 'object') {
  console.error('❌ PRODUCTS_DATA not found after VM execution');
  process.exit(1);
}

const insert = db.prepare(`
  INSERT OR REPLACE INTO products
  (sku, upc, gtin, name, category, price, status, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
`);

const insertMany = db.transaction((products) => {
  for (const product of products) {
    const upc = (product.upc || '').toString().trim();
    const gtin = upc;
    insert.run(
      product.sku,
      upc || null,
      gtin || null,
      product.name,
      product.category || null,
      typeof product.price === 'number' ? product.price : parseFloat(product.price || 0),
      product.status || 'published'
    );
  }
});

const productsArray = Object.values(PRODUCTS_DATA);
insertMany(productsArray);

const stats = db.prepare(`SELECT COUNT(*) as total FROM products`).get();
console.log(`✅ master-reviews.db ready at ${dbPath}`);
console.log(`✅ Seeded products: ${stats.total}`);

db.close();
