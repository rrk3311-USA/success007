import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readdirSync, existsSync, mkdirSync } from 'fs';
import * as walmart from './walmart.js';
import * as woocommerce from './woocommerce.js';
import * as googleAds from './google-ads.js';
import { setupFleetManagerRoutes } from './ai-agents/api-routes.js';
import { setupAnalyticsRoutes } from './analytics-routes.js';
import { setupTrackingRoutes } from './tracking-routes.js';
import { bulkSyncImages } from './image-sync.js';
import paypalRoutes from './paypal-routes.js';
import paypalCheckoutRoutes from './paypal-checkout.js';
import { setupSubscriptionForCartItem, calculateSubscriptionSavings } from './subscription-manager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use('/images', express.static(join(__dirname, '..', 'public', 'images')));

const db = new Database(join(__dirname, 'products.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sku TEXT UNIQUE,
    upc TEXT,
    name TEXT NOT NULL,
    description TEXT,
    short_description TEXT,
    price REAL NOT NULL,
    image_url TEXT,
    stock INTEGER DEFAULT 0,
    category TEXT,
    ingredients TEXT,
    key_features TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    stripe_customer_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS subscriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    stripe_subscription_id TEXT,
    status TEXT DEFAULT 'active',
    frequency TEXT DEFAULT 'monthly',
    quantity INTEGER DEFAULT 1,
    price REAL NOT NULL,
    next_billing_date DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS woo_customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    woo_customer_id INTEGER UNIQUE,
    email TEXT,
    first_name TEXT,
    last_name TEXT,
    username TEXT,
    total_spent REAL DEFAULT 0,
    orders_count INTEGER DEFAULT 0,
    avatar_url TEXT,
    date_created DATETIME,
    last_synced DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    woo_order_id INTEGER UNIQUE,
    customer_email TEXT,
    status TEXT,
    total REAL,
    subtotal REAL,
    tax_total REAL,
    shipping_total REAL,
    payment_method TEXT,
    date_created DATETIME,
    date_modified DATETIME,
    line_items TEXT,
    last_synced DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS analytics_cache (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    metric_type TEXT,
    metric_data TEXT,
    date_range TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

const existingProducts = db.prepare('SELECT COUNT(*) as count FROM products').get();
if (existingProducts.count === 0) {
  const insert = db.prepare(`
    INSERT INTO products (sku, upc, name, short_description, description, price, image_url, stock, category, ingredients, key_features)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  const description = `Rediscover Balance, Confidence & Connection

Women's Balance by Success Chemistry is thoughtfully crafted to support feminine wellness from the inside out. Modern life, stress, and hormonal changes can affect energy, mood, and responsiveness. This formula is designed to help support the body's natural balance so you can feel more in tune with yourself.*

Advanced Botanical & Nutrient Support

This unique blend combines time-honored botanicals with modern nutritional science. Ingredients such as Maca root, Ashwagandha, Ginseng, and Damiana have been traditionally used to support vitality and female wellness. L-Arginine supports healthy blood flow, while essential vitamins and minerals help support energy metabolism and overall health.*

Designed for Daily Use

Women's Balance is intended for consistent daily use as part of a healthy lifestyle. With 30 servings per bottle, it fits seamlessly into your routine to support long-term wellness goals.*

Clean, Thoughtful Formulation

• Vegetarian capsules
• Non-GMO ingredients
• Manufactured in the USA
• Quality tested for purity and potency

Feel supported, balanced, and confident — naturally.*

*These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.`;

  const keyFeatures = `• Supports female arousal, response, and intimate wellness*
• Formulated with L-Arginine to support healthy circulation*
• Includes Maca root, Ashwagandha, Ginseng, and Damiana extracts*
• Enriched with essential B-vitamins, Vitamin A, and Zinc*
• Designed to support energy, vitality, and overall balance*
• BioPerine® black pepper extract to enhance nutrient absorption*
• Non-GMO ingredients with vegetarian capsules
• 60 capsules per bottle | 30 servings
• Made in the USA in a GMP-compliant facility*
• No artificial colors, flavors, or preservatives`;

  const ingredients = `Active Ingredients: Vitamin A (as Beta-Carotene), Thiamin (Vitamin B1), Niacin (Vitamin B3), Vitamin B6, Vitamin B12, Pantothenic Acid (Vitamin B5), Zinc, L-Arginine, BioPerine® Black Pepper Extract, Proprietary Botanical Blend (Epimedium, Tribulus, Catuaba, Dong Quai, Ginkgo, Asian Ginseng, Damiana, Turmeric, Ashwagandha, Ginger, Maca, Muira Puama, L-Phenylalanine, Asparagus Extract, Chinese Smilax).

Other Ingredients: Rice Flour, Hypromellose (Vegetable Capsule), Magnesium Stearate (Vegetable), Silicon Dioxide.`;

  insert.run(
    '52274-401',
    '783325397399',
    'Success Chemistry Women\'s Balance – Female Libido & Arousal Support Supplement with L-Arginine, Maca, Ashwagandha, Ginseng & Zinc – 60 Capsules',
    'Female Libido & Arousal Support Supplement with L-Arginine, Maca, Ashwagandha, Ginseng & Zinc',
    description,
    34.99,
    '/images/products/52274-401/',
    -1,
    'Women\'s Health Supplements',
    ingredients,
    keyFeatures
  );
  
  console.log('Women\'s Balance product added to database');
}

app.get('/api/products', (req, res) => {
  const products = db.prepare('SELECT * FROM products').all();
  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

app.get('/api/products/:sku/images', (req, res) => {
  const imagesDir = join(__dirname, '..', 'public', 'images', 'products', req.params.sku);
  
  if (!existsSync(imagesDir)) {
    return res.json([]);
  }
  
  const files = readdirSync(imagesDir)
    .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
    .sort()
    .map(file => `/images/products/${req.params.sku}/${file}`);
  
  res.json(files);
});

app.post('/api/products', (req, res) => {
  const { sku, upc, name, short_description, description, price, image_url, stock, category, ingredients, key_features } = req.body;
  const insert = db.prepare(`
    INSERT INTO products (sku, upc, name, short_description, description, price, image_url, stock, category, ingredients, key_features)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  const result = insert.run(sku, upc, name, short_description, description, price, image_url, stock, category, ingredients, key_features);
  res.json({ id: result.lastInsertRowid, ...req.body });
});

app.put('/api/products/:id', (req, res) => {
  const { sku, upc, name, short_description, description, price, image_url, stock, category, ingredients, key_features } = req.body;
  const update = db.prepare(`
    UPDATE products 
    SET sku = ?, upc = ?, name = ?, short_description = ?, description = ?, price = ?, image_url = ?, stock = ?, category = ?, ingredients = ?, key_features = ?
    WHERE id = ?
  `);
  
  update.run(sku, upc, name, short_description, description, price, image_url, stock, category, ingredients, key_features, req.params.id);
  res.json({ id: req.params.id, ...req.body });
});

app.delete('/api/products/:id', (req, res) => {
  const del = db.prepare('DELETE FROM products WHERE id = ?');
  del.run(req.params.id);
  res.json({ message: 'Product deleted' });
});

// ============ RECOMMENDATION ENGINE ============

app.post('/api/recommendations', (req, res) => {
  try {
    const { tags } = req.body;
    
    if (!tags || tags.length === 0) {
      return res.json({ recommendations: [] });
    }
    
    const products = db.prepare('SELECT * FROM products WHERE stock != 0').all();
    
    const scoredProducts = products.map(product => {
      let matchScore = 0;
      const matchedTags = [];
      
      const searchableText = `${product.name} ${product.description} ${product.short_description} ${product.category} ${product.key_features || ''} ${product.ingredients || ''}`.toLowerCase();
      
      tags.forEach(tag => {
        const tagLower = tag.toLowerCase();
        if (searchableText.includes(tagLower)) {
          matchScore += 20;
          matchedTags.push(tag);
        }
      });
      
      if (product.category) {
        const categoryLower = product.category.toLowerCase();
        tags.forEach(tag => {
          if (categoryLower.includes(tag.toLowerCase())) {
            matchScore += 15;
          }
        });
      }
      
      const nameWords = product.name.toLowerCase().split(/\s+/);
      tags.forEach(tag => {
        if (nameWords.some(word => word.includes(tag.toLowerCase()))) {
          matchScore += 10;
        }
      });
      
      return {
        ...product,
        match_score: Math.min(matchScore, 100),
        matched_tags: matchedTags
      };
    });
    
    const recommendations = scoredProducts
      .filter(p => p.match_score > 0)
      .sort((a, b) => b.match_score - a.match_score)
      .slice(0, 6);
    
    res.json({ recommendations });
  } catch (error) {
    console.error('Recommendation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============ WOOCOMMERCE API ROUTES ============

app.get('/api/woocommerce/test', async (req, res) => {
  try {
    const result = await woocommerce.testConnection();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/woocommerce/products', async (req, res) => {
  try {
    const products = await woocommerce.getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/woocommerce/sync-products', async (req, res) => {
  try {
    const wooProducts = await woocommerce.getAllProducts();
    const { downloadImages = true } = req.body;
    
    const upsert = db.prepare(`
      INSERT INTO products (sku, upc, name, short_description, description, price, image_url, stock, category)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(sku) DO UPDATE SET
        name = excluded.name,
        short_description = excluded.short_description,
        description = excluded.description,
        price = excluded.price,
        image_url = excluded.image_url,
        stock = excluded.stock,
        category = excluded.category
    `);
    
    let synced = 0;
    let skipped = 0;
    const errors = [];
    
    for (const product of wooProducts) {
      try {
        const sku = product.sku || `woo-${product.id}`;
        const category = product.categories?.[0]?.name || 'Uncategorized';
        const imageUrl = product.images?.[0]?.src || '';
        const stock = product.stock_quantity ?? (product.in_stock ? -1 : 0);
        
        upsert.run(
          sku,
          '',
          product.name,
          product.short_description?.replace(/<[^>]*>/g, '') || '',
          product.description?.replace(/<[^>]*>/g, '') || '',
          parseFloat(product.price) || 0,
          `/images/products/${sku}/01.jpg`,
          stock,
          category
        );
        
        // Create image folder for product
        const imgDir = join(__dirname, '..', 'public', 'images', 'products', sku);
        if (!existsSync(imgDir)) {
          mkdirSync(imgDir, { recursive: true });
        }
        
        synced++;
      } catch (e) {
        errors.push({ sku: product.sku, error: e.message });
        skipped++;
      }
    }
    
    // Download images if requested
    let imageResults = null;
    if (downloadImages) {
      try {
        const publicDir = join(__dirname, '..');
        imageResults = await bulkSyncImages(wooProducts, db, publicDir);
      } catch (e) {
        console.error('Image sync error:', e);
      }
    }
    
    res.json({ 
      success: true, 
      synced, 
      skipped,
      total: wooProducts.length,
      errors: errors.slice(0, 10),
      images: imageResults
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/woocommerce/sync-customers', async (req, res) => {
  try {
    // Fetch ALL customers by paginating through all pages
    console.log('Starting customer sync - fetching all customers...');
    const wooCustomers = await woocommerce.getAllCustomers();
    console.log(`Total customers fetched: ${wooCustomers.length}`);
    
    // Filter to only paying customers (total_spent > 0)
    const payingCustomers = wooCustomers.filter(c => parseFloat(c.total_spent || 0) > 0);
    console.log(`Paying customers (spent > $0): ${payingCustomers.length}`);
    
    const upsert = db.prepare(`
      INSERT INTO woo_customers (woo_customer_id, email, first_name, last_name, username, total_spent, orders_count, date_created)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(woo_customer_id) DO UPDATE SET
        email = excluded.email,
        first_name = excluded.first_name,
        last_name = excluded.last_name,
        total_spent = excluded.total_spent,
        orders_count = excluded.orders_count
    `);
    
    const customerInsert = db.prepare(`
      INSERT INTO customers (email, name)
      VALUES (?, ?)
      ON CONFLICT(email) DO UPDATE SET name = excluded.name
    `);
    
    let synced = 0;
    let skipped = 0;
    const errors = [];
    
    for (const customer of payingCustomers) {
      try {
        upsert.run(
          customer.id,
          customer.email,
          customer.first_name || '',
          customer.last_name || '',
          customer.username || '',
          parseFloat(customer.total_spent || 0),
          customer.orders_count || 0,
          customer.date_created
        );
        
        customerInsert.run(
          customer.email,
          `${customer.first_name} ${customer.last_name}`.trim() || customer.username
        );
        
        synced++;
      } catch (e) {
        console.error(`Failed to sync customer ${customer.id}:`, e.message);
        errors.push({ customerId: customer.id, error: e.message });
        skipped++;
      }
    }
    
    console.log(`Customer sync complete: ${synced} synced, ${skipped} skipped`);
    
    res.json({ 
      success: true, 
      synced, 
      skipped,
      total: payingCustomers.length,
      totalFetched: wooCustomers.length,
      filtered: wooCustomers.length - payingCustomers.length,
      errors: errors.slice(0, 10)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/woocommerce/sync-orders', async (req, res) => {
  try {
    // Fetch ALL orders by paginating through all pages
    let allOrders = [];
    let page = 1;
    let totalPages = 1;
    
    console.log('Starting order sync - fetching all orders...');
    
    do {
      const result = await woocommerce.getOrders('any', page, 100);
      allOrders = allOrders.concat(result.orders);
      totalPages = result.totalPages;
      console.log(`Fetched page ${page}/${totalPages} (${result.orders.length} orders)`);
      page++;
    } while (page <= totalPages);
    
    console.log(`Total orders fetched: ${allOrders.length}`);
    
    // Filter to only completed/processing orders (no pending, failed, cancelled, refunded)
    const validStatuses = ['completed', 'processing'];
    const validOrders = allOrders.filter(o => validStatuses.includes(o.status) && parseFloat(o.total || 0) > 0);
    console.log(`Valid orders (completed/processing with total > $0): ${validOrders.length}`);
    
    const upsert = db.prepare(`
      INSERT INTO orders (woo_order_id, customer_email, status, total, subtotal, tax_total, shipping_total, payment_method, date_created, date_modified, line_items)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(woo_order_id) DO UPDATE SET
        status = excluded.status,
        total = excluded.total,
        date_modified = excluded.date_modified
    `);
    
    let synced = 0;
    let skipped = 0;
    const errors = [];
    
    for (const order of validOrders) {
      try {
        upsert.run(
          order.id,
          order.billing?.email || '',
          order.status,
          parseFloat(order.total || 0),
          parseFloat(order.subtotal || 0),
          parseFloat(order.total_tax || 0),
          parseFloat(order.shipping_total || 0),
          order.payment_method || '',
          order.date_created,
          order.date_modified,
          JSON.stringify(order.line_items || [])
        );
        synced++;
      } catch (e) {
        console.error(`Failed to sync order ${order.id}:`, e.message);
        errors.push({ orderId: order.id, error: e.message });
        skipped++;
      }
    }
    
    console.log(`Order sync complete: ${synced} synced, ${skipped} skipped`);
    
    res.json({ 
      success: true, 
      synced, 
      skipped,
      total: validOrders.length,
      totalFetched: allOrders.length,
      filtered: allOrders.length - validOrders.length,
      errors: errors.slice(0, 10)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/woocommerce/customers', async (req, res) => {
  try {
    const { page = 1, per_page = 100 } = req.query;
    const customers = await woocommerce.getCustomers(parseInt(page), parseInt(per_page));
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/woocommerce/orders', async (req, res) => {
  try {
    const { status = 'any', page = 1 } = req.query;
    const orders = await woocommerce.getOrders(status, parseInt(page));
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/woocommerce/orders/:id', async (req, res) => {
  try {
    const order = await woocommerce.getOrder(req.params.id);
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/woocommerce/orders/:id', async (req, res) => {
  try {
    const order = await woocommerce.updateOrder(req.params.id, req.body);
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/woocommerce/products/:id/inventory', async (req, res) => {
  try {
    const { stock_quantity } = req.body;
    const product = await woocommerce.updateInventory(req.params.id, stock_quantity);
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ WALMART API ROUTES ============

app.get('/api/walmart/test', async (req, res) => {
  try {
    const result = await walmart.testWalmartConnection();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/walmart/items', async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;
    const items = await walmart.getWalmartItems(parseInt(limit), parseInt(offset));
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/walmart/items/:sku', async (req, res) => {
  try {
    const item = await walmart.getWalmartItem(req.params.sku);
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/walmart/sync-items', async (req, res) => {
  try {
    const walmartItems = await walmart.getWalmartItems(100, 0);
    const items = walmartItems.ItemResponse || [];
    
    const upsert = db.prepare(`
      INSERT INTO products (sku, upc, name, price, stock, category)
      VALUES (?, ?, ?, ?, ?, 'Walmart Import')
      ON CONFLICT(sku) DO UPDATE SET
        price = excluded.price,
        stock = excluded.stock
    `);
    
    let synced = 0;
    for (const item of items) {
      try {
        upsert.run(
          item.sku,
          item.upc || '',
          item.productName || item.sku,
          item.price?.amount || 0,
          item.inventory?.quantity || 0
        );
        synced++;
      } catch (e) {
        console.error(`Failed to sync ${item.sku}:`, e.message);
      }
    }
    
    res.json({ success: true, synced, total: items.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/walmart/inventory/:sku', async (req, res) => {
  try {
    const { quantity } = req.body;
    const result = await walmart.updateWalmartInventory(req.params.sku, quantity);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/walmart/orders', async (req, res) => {
  try {
    const { status = 'Created', limit = 100 } = req.query;
    const orders = await walmart.getWalmartOrders(status, parseInt(limit));
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/walmart/orders/:purchaseOrderId', async (req, res) => {
  try {
    const order = await walmart.getWalmartOrder(req.params.purchaseOrderId);
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/walmart/orders/:purchaseOrderId/acknowledge', async (req, res) => {
  try {
    const result = await walmart.acknowledgeWalmartOrder(req.params.purchaseOrderId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/walmart/orders/:purchaseOrderId/ship', async (req, res) => {
  try {
    const result = await walmart.shipWalmartOrder(req.params.purchaseOrderId, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ IMAGE IMPORT ============

app.post('/api/products/import-images', async (req, res) => {
  try {
    const products = db.prepare('SELECT * FROM products WHERE image_url IS NOT NULL AND image_url != ""').all();
    const axios = (await import('axios')).default;
    const fs = (await import('fs')).default;
    const path = (await import('path')).default;
    const https = (await import('https')).default;
    
    let imported = 0;
    let errors = [];
    
    for (const product of products) {
      try {
        if (!product.image_url || !product.sku) continue;
        
        const imageDir = join(__dirname, '..', 'public', 'images', 'products', product.sku);
        if (!existsSync(imageDir)) {
          mkdirSync(imageDir, { recursive: true });
        }
        
        const imageUrl = product.image_url;
        const ext = imageUrl.split('.').pop().split('?')[0] || 'jpg';
        const imagePath = join(imageDir, `01.${ext}`);
        
        if (existsSync(imagePath)) {
          continue;
        }
        
        const response = await axios({
          method: 'get',
          url: imageUrl,
          responseType: 'stream',
          httpsAgent: new https.Agent({ rejectUnauthorized: false })
        });
        
        const writer = fs.createWriteStream(imagePath);
        response.data.pipe(writer);
        
        await new Promise((resolve, reject) => {
          writer.on('finish', resolve);
          writer.on('error', reject);
        });
        
        imported++;
      } catch (e) {
        errors.push({ sku: product.sku, error: e.message });
      }
    }
    
    res.json({ success: true, imported, total: products.length, errors: errors.slice(0, 10) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ CUSTOMER MANAGEMENT ============

app.get('/api/customers', (req, res) => {
  try {
    const customers = db.prepare('SELECT * FROM customers ORDER BY created_at DESC').all();
    res.json(customers);
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/orders', (req, res) => {
  try {
    const orders = db.prepare('SELECT * FROM orders ORDER BY date_created DESC').all();
    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/woocommerce/sync-customers', async (req, res) => {
  try {
    const customers = await woocommerce.getAllCustomers();
    
    const upsert = db.prepare(`
      INSERT INTO woo_customers (woo_customer_id, email, first_name, last_name, username, total_spent, orders_count, avatar_url, date_created)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(woo_customer_id) DO UPDATE SET
        email = excluded.email,
        first_name = excluded.first_name,
        last_name = excluded.last_name,
        total_spent = excluded.total_spent,
        orders_count = excluded.orders_count,
        last_synced = CURRENT_TIMESTAMP
    `);
    
    let synced = 0;
    for (const customer of customers) {
      try {
        upsert.run(
          customer.id,
          customer.email,
          customer.first_name,
          customer.last_name,
          customer.username,
          parseFloat(customer.total_spent) || 0,
          customer.orders_count || 0,
          customer.avatar_url,
          customer.date_created
        );
        synced++;
      } catch (e) {
        console.error(`Failed to sync customer ${customer.id}:`, e.message);
      }
    }
    
    res.json({ success: true, synced, total: customers.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/woocommerce/customer/:id', async (req, res) => {
  try {
    const customer = await woocommerce.getCustomer(req.params.id);
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ ORDER MANAGEMENT ============

app.post('/api/woocommerce/sync-orders', async (req, res) => {
  try {
    const { status = 'any', limit = 100 } = req.body;
    const result = await woocommerce.getOrders(status, 1, limit);
    const orders = result.orders;
    
    const upsert = db.prepare(`
      INSERT INTO orders (woo_order_id, customer_email, status, total, subtotal, tax_total, shipping_total, payment_method, date_created, date_modified, line_items)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(woo_order_id) DO UPDATE SET
        status = excluded.status,
        total = excluded.total,
        date_modified = excluded.date_modified,
        last_synced = CURRENT_TIMESTAMP
    `);
    
    let synced = 0;
    for (const order of orders) {
      try {
        upsert.run(
          order.id,
          order.billing?.email || '',
          order.status,
          parseFloat(order.total) || 0,
          parseFloat(order.subtotal) || 0,
          parseFloat(order.total_tax) || 0,
          parseFloat(order.shipping_total) || 0,
          order.payment_method_title || '',
          order.date_created,
          order.date_modified,
          JSON.stringify(order.line_items)
        );
        synced++;
      } catch (e) {
        console.error(`Failed to sync order ${order.id}:`, e.message);
      }
    }
    
    res.json({ success: true, synced, total: orders.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/orders', (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;
    
    let query = 'SELECT * FROM orders';
    const params = [];
    
    if (status && status !== 'all') {
      query += ' WHERE status = ?';
      params.push(status);
    }
    
    query += ' ORDER BY date_created DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    
    const orders = db.prepare(query).all(...params);
    const total = db.prepare('SELECT COUNT(*) as count FROM orders').get();
    
    res.json({ orders, total: total.count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/orders/:id', (req, res) => {
  try {
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
    if (order) {
      order.line_items = JSON.parse(order.line_items || '[]');
      res.json(order);
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ ANALYTICS & REPORTS ============

app.get('/api/analytics/dashboard', async (req, res) => {
  try {
    const totalRevenue = db.prepare('SELECT SUM(total) as revenue FROM orders WHERE status IN ("completed", "processing")').get();
    const totalOrders = db.prepare('SELECT COUNT(*) as count FROM orders').get();
    const totalCustomers = db.prepare('SELECT COUNT(*) as count FROM woo_customers').get();
    const avgOrderValue = totalOrders.count > 0 ? (totalRevenue.revenue || 0) / totalOrders.count : 0;
    
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);
    const recentRevenue = db.prepare('SELECT SUM(total) as revenue FROM orders WHERE date_created >= ? AND status IN ("completed", "processing")').get(last30Days.toISOString());
    const recentOrders = db.prepare('SELECT COUNT(*) as count FROM orders WHERE date_created >= ?').get(last30Days.toISOString());
    
    const topProducts = db.prepare(`
      SELECT p.name, p.sku, COUNT(*) as order_count, SUM(p.price) as revenue
      FROM orders o, json_each(o.line_items) as item
      JOIN products p ON p.id = json_extract(item.value, '$.product_id')
      WHERE o.status IN ('completed', 'processing')
      GROUP BY p.id
      ORDER BY order_count DESC
      LIMIT 10
    `).all();
    
    const topCustomers = db.prepare(`
      SELECT customer_email, COUNT(*) as order_count, SUM(total) as lifetime_value
      FROM orders
      WHERE status IN ('completed', 'processing')
      GROUP BY customer_email
      ORDER BY lifetime_value DESC
      LIMIT 10
    `).all();
    
    const ordersByStatus = db.prepare(`
      SELECT status, COUNT(*) as count, SUM(total) as revenue
      FROM orders
      GROUP BY status
    `).all();
    
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayRevenue = db.prepare(`
        SELECT SUM(total) as revenue, COUNT(*) as orders
        FROM orders
        WHERE date(date_created) = ? AND status IN ('completed', 'processing')
      `).get(dateStr);
      
      last7Days.push({
        date: dateStr,
        revenue: dayRevenue.revenue || 0,
        orders: dayRevenue.orders || 0
      });
    }
    
    res.json({
      overview: {
        totalRevenue: totalRevenue.revenue || 0,
        totalOrders: totalOrders.count,
        totalCustomers: totalCustomers.count,
        avgOrderValue: avgOrderValue,
        last30DaysRevenue: recentRevenue.revenue || 0,
        last30DaysOrders: recentOrders.count
      },
      topProducts,
      topCustomers,
      ordersByStatus,
      last7Days
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/analytics/sales-report', async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    
    let query = 'SELECT date(date_created) as date, SUM(total) as revenue, COUNT(*) as orders FROM orders WHERE status IN ("completed", "processing")';
    const params = [];
    
    if (start_date) {
      query += ' AND date_created >= ?';
      params.push(start_date);
    }
    if (end_date) {
      query += ' AND date_created <= ?';
      params.push(end_date);
    }
    
    query += ' GROUP BY date(date_created) ORDER BY date DESC';
    
    const report = db.prepare(query).all(...params);
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/analytics/customer-lifetime-value', (req, res) => {
  try {
    const clv = db.prepare(`
      SELECT 
        customer_email,
        COUNT(*) as total_orders,
        SUM(total) as lifetime_value,
        AVG(total) as avg_order_value,
        MIN(date_created) as first_order,
        MAX(date_created) as last_order
      FROM orders
      WHERE status IN ('completed', 'processing')
      GROUP BY customer_email
      ORDER BY lifetime_value DESC
      LIMIT 100
    `).all();
    
    res.json(clv);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/analytics/product-performance', (req, res) => {
  try {
    const performance = db.prepare(`
      SELECT 
        p.id,
        p.sku,
        p.name,
        p.price,
        p.stock,
        COUNT(DISTINCT o.id) as times_ordered,
        SUM(json_extract(item.value, '$.quantity')) as units_sold,
        SUM(json_extract(item.value, '$.total')) as revenue
      FROM products p
      LEFT JOIN orders o ON o.status IN ('completed', 'processing')
      LEFT JOIN json_each(o.line_items) as item ON json_extract(item.value, '$.product_id') = p.id
      GROUP BY p.id
      ORDER BY revenue DESC
    `).all();
    
    res.json(performance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/analytics/inventory-alerts', (req, res) => {
  try {
    const lowStock = db.prepare(`
      SELECT id, sku, name, stock, price
      FROM products
      WHERE stock > 0 AND stock <= 10
      ORDER BY stock ASC
    `).all();
    
    const outOfStock = db.prepare(`
      SELECT id, sku, name, price
      FROM products
      WHERE stock = 0
    `).all();
    
    res.json({ lowStock, outOfStock });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ SUBSCRIPTION MANAGEMENT ============

let stripe = null;
if (process.env.STRIPE_SECRET_KEY) {
  const Stripe = (await import('stripe')).default;
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
}

app.post('/api/customers', (req, res) => {
  try {
    const { email, name } = req.body;
    const insert = db.prepare('INSERT INTO customers (email, name) VALUES (?, ?)');
    const result = insert.run(email, name);
    res.json({ id: result.lastInsertRowid, email, name });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/customers/:email', (req, res) => {
  try {
    const customer = db.prepare('SELECT * FROM customers WHERE email = ?').get(req.params.email);
    if (customer) {
      res.json(customer);
    } else {
      res.status(404).json({ error: 'Customer not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/subscriptions', async (req, res) => {
  try {
    const { customer_email, product_id, frequency, quantity } = req.body;
    
    let customer = db.prepare('SELECT * FROM customers WHERE email = ?').get(customer_email);
    if (!customer) {
      const insert = db.prepare('INSERT INTO customers (email) VALUES (?)');
      const result = insert.run(customer_email);
      customer = { id: result.lastInsertRowid, email: customer_email };
    }
    
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(product_id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const discountedPrice = product.price * 0.85;
    
    let stripeSubscriptionId = null;
    if (stripe && customer_email) {
      try {
        let stripeCustomer;
        if (customer.stripe_customer_id) {
          stripeCustomer = await stripe.customers.retrieve(customer.stripe_customer_id);
        } else {
          stripeCustomer = await stripe.customers.create({
            email: customer_email,
            metadata: { customer_id: customer.id.toString() }
          });
          db.prepare('UPDATE customers SET stripe_customer_id = ? WHERE id = ?')
            .run(stripeCustomer.id, customer.id);
        }
        
        const priceData = await stripe.prices.create({
          unit_amount: Math.round(discountedPrice * 100),
          currency: 'usd',
          recurring: { interval: frequency === 'weekly' ? 'week' : 'month' },
          product_data: {
            name: product.name,
            metadata: { product_id: product.id.toString() }
          }
        });
        
        const subscription = await stripe.subscriptions.create({
          customer: stripeCustomer.id,
          items: [{ price: priceData.id, quantity: quantity || 1 }],
          metadata: { product_id: product.id.toString() }
        });
        
        stripeSubscriptionId = subscription.id;
      } catch (stripeError) {
        console.error('Stripe error:', stripeError);
      }
    }
    
    const nextBillingDate = new Date();
    if (frequency === 'weekly') {
      nextBillingDate.setDate(nextBillingDate.getDate() + 7);
    } else {
      nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
    }
    
    const insert = db.prepare(`
      INSERT INTO subscriptions (customer_id, product_id, stripe_subscription_id, frequency, quantity, price, next_billing_date)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = insert.run(
      customer.id,
      product_id,
      stripeSubscriptionId,
      frequency,
      quantity || 1,
      discountedPrice,
      nextBillingDate.toISOString()
    );
    
    res.json({ 
      id: result.lastInsertRowid, 
      customer_id: customer.id,
      product_id,
      frequency,
      price: discountedPrice,
      stripe_subscription_id: stripeSubscriptionId
    });
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/subscriptions/customer/:email', (req, res) => {
  try {
    const customer = db.prepare('SELECT * FROM customers WHERE email = ?').get(req.params.email);
    if (!customer) {
      return res.json([]);
    }
    
    const subscriptions = db.prepare(`
      SELECT s.*, p.name as product_name, p.image_url, p.sku
      FROM subscriptions s
      JOIN products p ON s.product_id = p.id
      WHERE s.customer_id = ? AND s.status = 'active'
      ORDER BY s.created_at DESC
    `).all(customer.id);
    
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/subscriptions/:id', async (req, res) => {
  try {
    const { status, frequency, quantity } = req.body;
    const subscription = db.prepare('SELECT * FROM subscriptions WHERE id = ?').get(req.params.id);
    
    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }
    
    if (stripe && subscription.stripe_subscription_id && status === 'cancelled') {
      await stripe.subscriptions.cancel(subscription.stripe_subscription_id);
    }
    
    const update = db.prepare(`
      UPDATE subscriptions 
      SET status = ?, frequency = ?, quantity = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    
    update.run(
      status || subscription.status,
      frequency || subscription.frequency,
      quantity || subscription.quantity,
      req.params.id
    );
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/subscriptions/:id', async (req, res) => {
  try {
    const subscription = db.prepare('SELECT * FROM subscriptions WHERE id = ?').get(req.params.id);
    
    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }
    
    if (stripe && subscription.stripe_subscription_id) {
      await stripe.subscriptions.cancel(subscription.stripe_subscription_id);
    }
    
    db.prepare('UPDATE subscriptions SET status = ? WHERE id = ?').run('cancelled', req.params.id);
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ PAYPAL ORDER PROCESSING ============
app.post('/api/orders/paypal', async (req, res) => {
  try {
    const { orderId, product, paypalOrder } = req.body;
    
    // Extract customer info from PayPal order
    const payer = paypalOrder.payer;
    const customerEmail = payer.email_address;
    const customerName = `${payer.name.given_name} ${payer.name.surname}`;
    
    // Get shipping address
    const shipping = paypalOrder.purchase_units[0].shipping;
    const billingInfo = shipping ? JSON.stringify({
      name: shipping.name?.full_name || customerName,
      address_1: shipping.address?.address_line_1 || '',
      city: shipping.address?.admin_area_2 || '',
      state: shipping.address?.admin_area_1 || '',
      postcode: shipping.address?.postal_code || '',
      country: shipping.address?.country_code || 'US'
    }) : null;
    
    // Insert order into database
    const insertOrder = db.prepare(`
      INSERT INTO orders (
        woo_order_id, customer_email, status, total, 
        payment_method, date_created, line_items, billing
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const lineItems = JSON.stringify([{
      sku: product.sku,
      name: product.name,
      quantity: 1,
      price: product.price
    }]);
    
    insertOrder.run(
      `paypal_${orderId}`,
      customerEmail,
      'completed',
      product.price,
      'paypal',
      new Date().toISOString(),
      lineItems,
      billingInfo
    );
    
    console.log(`✅ PayPal order saved: ${orderId} - ${customerEmail}`);
    
    res.json({ success: true, orderId });
  } catch (error) {
    console.error('PayPal order error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============ SEO BULK UPDATE ENDPOINT ============
app.post('/api/products/bulk-update-seo', async (req, res) => {
  try {
    const { products } = req.body;
    
    const update = db.prepare(`
      UPDATE products 
      SET name = ?, description = ?
      WHERE id = ?
    `);
    
    let updated = 0;
    for (const product of products) {
      update.run(product.name, product.description, product.id);
      updated++;
    }
    
    res.json({ success: true, updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ GOOGLE ADS API ENDPOINTS ============
app.get('/api/google-ads/test', async (req, res) => {
  try {
    const result = await googleAds.testConnection();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/google-ads/campaigns', async (req, res) => {
  try {
    const dateRange = req.query.dateRange || 'LAST_30_DAYS';
    const result = await googleAds.getCampaignPerformance(dateRange);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/google-ads/metrics', async (req, res) => {
  try {
    const dateRange = req.query.dateRange || 'LAST_30_DAYS';
    const result = await googleAds.getAccountMetrics(dateRange);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============ SET ALL INVENTORY TO 100,000 ============
db.prepare('UPDATE products SET stock = 100000').run();
console.log('✅ All product inventory set to 100,000');

// ============ TRACKING & LEAD MAGNET ROUTES ============
setupTrackingRoutes(app, db);

// ============ ANALYTICS ROUTES ============
setupAnalyticsRoutes(app, db);

// ============ FLEET MANAGER AI ROUTES ============
setupFleetManagerRoutes(app, db);

// ============ PAYPAL & SUBSCRIPTION ROUTES ============
app.use('/api/paypal', paypalRoutes);
app.use('/api/paypal-checkout', paypalCheckoutRoutes);

app.post('/api/subscription/setup', async (req, res) => {
  try {
    const { cartItem } = req.body;
    const subscriptionInfo = await setupSubscriptionForCartItem(cartItem);
    res.json({ success: true, subscription: subscriptionInfo });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/subscription/calculate-savings', async (req, res) => {
  try {
    const { price, quantity } = req.body;
    const savings = calculateSubscriptionSavings(price, quantity);
    res.json({ success: true, savings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('🤖 Fleet Manager AI System: ONLINE');
  console.log('📊 Analytics Dashboard: READY');
  console.log('🎯 Tracking & Lead Magnets: ACTIVE');
  console.log('📦 Inventory: All products set to 100,000 units');
  console.log('💳 PayPal Agent Toolkit: READY');
  console.log('🔄 Subscribe & Save: ACTIVE');
});
