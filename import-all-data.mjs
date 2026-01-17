import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';
import { parse } from 'csv-parse/sync';

const root = process.cwd();
const dbPath = path.join(root, 'review-repo', 'master-reviews.db');
const rawRoot = path.join(root, 'review-repo', 'raw');

const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    review_id TEXT,
    title TEXT,
    body TEXT,
    rating INTEGER,
    review_date TEXT,
    review_type TEXT,
    review_status TEXT,
    source TEXT,
    curated TEXT,
    reviewer_name TEXT,
    reviewer_email TEXT,
    reviewer_type TEXT,
    reviewer_country TEXT,
    reviewer_device_type TEXT,
    product_id TEXT,
    product_handle TEXT,
    product_title TEXT,
    product_description TEXT,
    product_url TEXT,
    product_image_url TEXT,
    product_sku TEXT,
    product_upc TEXT,
    product_brand TEXT,
    reply TEXT,
    reply_date TEXT,
    comment_content TEXT,
    comment_date TEXT,
    picture_urls TEXT,
    video_urls TEXT,
    ip_address TEXT,
    location TEXT,
    sentiment_score TEXT,
    profanity_flag TEXT,
    review_tags TEXT,
    thumbs_up INTEGER,
    thumbs_down INTEGER,
    order_id TEXT,
    order_date TEXT,
    incentivized_flag TEXT,
    imported_from TEXT,
    imported_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id TEXT UNIQUE,
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    phone TEXT,
    company TEXT,
    address_line1 TEXT,
    address_line2 TEXT,
    city TEXT,
    province TEXT,
    country TEXT,
    zip TEXT,
    total_spent REAL DEFAULT 0,
    total_orders INTEGER DEFAULT 0,
    accepts_marketing TEXT,
    accepts_sms_marketing TEXT,
    tags TEXT,
    note TEXT,
    tax_exempt TEXT,
    created_at TEXT,
    imported_from TEXT,
    imported_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_name TEXT,
    sku TEXT,
    gmv REAL,
    units_sold INTEGER,
    item_id TEXT,
    order_date TEXT,
    source TEXT,
    imported_from TEXT,
    imported_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
  CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
  CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
  CREATE INDEX IF NOT EXISTS idx_orders_sku ON orders(sku);
`);

function classify(relPath) {
  const s = relPath.toLowerCase();
  if (
    s.includes('review') ||
    s.includes('judgeme') ||
    s.includes('judge.me') ||
    s.includes('yotpo') ||
    s.includes('walmart review') ||
    s.includes('walmart- review') ||
    s.includes('walmart review sync') ||
    s.includes('testimonials')
  ) {
    return 'reviews';
  }
  if (
    s.includes('order') ||
    s.includes('orders') ||
    s.includes('order history') ||
    s.includes('sales report')
  ) {
    return 'orders';
  }
  if (
    s.includes('customer') ||
    s.includes('customers') ||
    s.includes('contacts') ||
    s.includes('contact')
  ) {
    return 'customers';
  }
  return 'misc';
}

function walkCSVFiles(dir, baseDir) {
  const out = [];
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      if (e.name === '.DS_Store') continue;
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        out.push(...walkCSVFiles(full, baseDir));
      } else if (e.isFile() && e.name.toLowerCase().endsWith('.csv')) {
        out.push({
          full,
          rel: path.relative(baseDir, full),
        });
      }
    }
  } catch (err) {
    console.warn(`⚠️  Failed to scan ${dir}: ${err.message}`);
  }
  return out;
}

function readCSV(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return parse(content, {
      columns: true,
      skip_empty_lines: true,
      relax_quotes: true,
      relax_column_count: true,
    });
  } catch (err) {
    console.warn(`⚠️  Failed to parse ${path.basename(filePath)}: ${err.message}`);
    return [];
  }
}

function importReviews() {
  if (!fs.existsSync(rawRoot)) return 0;

  const allFiles = walkCSVFiles(rawRoot, rawRoot);
  const csvFiles = allFiles.filter(f => classify(f.rel) === 'reviews');

  let count = 0;
  const stmt = db.prepare(`
    INSERT INTO reviews (
      review_id, title, body, rating, review_date, review_type, review_status,
      source, curated, reviewer_name, reviewer_email, reviewer_type, reviewer_country, reviewer_device_type,
      product_id, product_handle, product_title, product_description, product_url, product_image_url,
      product_sku, product_upc, product_brand,
      reply, reply_date, comment_content, comment_date,
      picture_urls, video_urls, ip_address, location,
      sentiment_score, profanity_flag, review_tags, thumbs_up, thumbs_down,
      order_id, order_date, incentivized_flag, imported_from
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const file of csvFiles) {
    const rows = readCSV(file.full);
    const relPath = file.rel;
    for (const row of rows) {
      try {
        stmt.run(
          row['Review ID'] || row.review_id || '',
          row.title || row['Review Title'] || '',
          row.body || row['Review Content'] || '',
          parseInt(row.rating || row['Review Score'] || 0),
          row.review_date || row['Review Creation Date'] || '',
          row['Review Type'] || '',
          row['Review Status'] || row.curated || '',
          row.source || row['Review Source'] || '',
          row.curated || '',
          row.reviewer_name || row['Reviewer Display Name'] || '',
          row.reviewer_email || row['Reviewer Email'] || '',
          row['Reviewer Type'] || '',
          row['Reviewer Country'] || '',
          row['Reviewer Device Type'] || '',
          row.product_id || row['Product ID'] || '',
          row.product_handle || row['Product Handle'] || '',
          row['Product Title'] || '',
          row['Product Description'] || '',
          row['Product URL'] || '',
          row['Product Image URL'] || '',
          row['Product SKU'] || row.product_sku || '',
          row['Product UPC'] || row.product_upc || '',
          row['Product Brand'] || '',
          row.reply || '',
          row.reply_date || '',
          row['Comment Content'] || '',
          row['Comment Date'] || '',
          row.picture_urls || row['Published Image URLs'] || '',
          row['Published Video URLs'] || '',
          row.ip_address || '',
          row.location || '',
          row['Sentiment Score'] || '',
          row['Profanity Flag'] || '',
          row['Review Tags'] || '',
          parseInt(row['Thumbs Up'] || 0),
          parseInt(row['Thumbs Down'] || 0),
          row['Order ID'] || '',
          row['Order Date'] || '',
          row['Incentivized Flag'] || '',
          relPath
        );
        count++;
      } catch (err) {
        console.warn(`⚠️  Review insert failed: ${err.message}`);
      }
    }
  }

  return count;
}

function importCustomers() {
  if (!fs.existsSync(rawRoot)) return 0;

  const allFiles = walkCSVFiles(rawRoot, rawRoot);
  const csvFiles = allFiles.filter(f => classify(f.rel) === 'customers');

  let count = 0;
  const stmt = db.prepare(`
    INSERT OR IGNORE INTO customers (
      customer_id, first_name, last_name, email, phone, company,
      address_line1, address_line2, city, province, country, zip,
      total_spent, total_orders, accepts_marketing, accepts_sms_marketing,
      tags, note, tax_exempt, created_at, imported_from
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const file of csvFiles) {
    const rows = readCSV(file.full);
    const relPath = file.rel;
    for (const row of rows) {
      try {
        stmt.run(
          row['Customer ID'] || row.customer_id || '',
          row['First Name'] || row.first_name || '',
          row['Last Name'] || row.last_name || '',
          row['Email'] || row.email || '',
          row['Phone'] || row.phone || row['Default Address Phone'] || '',
          row['Default Address Company'] || row.company || '',
          row['Default Address Address1'] || row.address_line1 || '',
          row['Default Address Address2'] || row.address_line2 || '',
          row['Default Address City'] || row.city || '',
          row['Default Address Province Code'] || row.province || '',
          row['Default Address Country Code'] || row.country || row['Country'] || '',
          row['Default Address Zip'] || row.zip || row['Zip'] || '',
          parseFloat(row['Total Spent'] || row.total_spent || 0),
          parseInt(row['Total Orders'] || row.total_orders || 0),
          row['Accepts Email Marketing'] || row.accepts_marketing || '',
          row['Accepts SMS Marketing'] || row.accepts_sms_marketing || '',
          row['Tags'] || row.tags || '',
          row['Note'] || row.note || '',
          row['Tax Exempt'] || row.tax_exempt || '',
          row['Created At'] || row.created_at || '',
          relPath
        );
        count++;
      } catch (err) {
        console.warn(`⚠️  Customer insert failed: ${err.message}`);
      }
    }
  }

  return count;
}

function importOrders() {
  if (!fs.existsSync(rawRoot)) return 0;

  const allFiles = walkCSVFiles(rawRoot, rawRoot);
  const csvFiles = allFiles.filter(f => classify(f.rel) === 'orders');

  let count = 0;
  const stmt = db.prepare(`
    INSERT INTO orders (
      item_name, sku, gmv, units_sold, item_id, source, imported_from
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  for (const file of csvFiles) {
    const rows = readCSV(file.full);
    const relPath = file.rel;
    for (const row of rows) {
      try {
        stmt.run(
          row['Item_Name'] || row.item_name || '',
          row['SKU'] || row.sku || '',
          parseFloat(row['GMV'] || row.gmv || 0),
          parseInt(row['Units_Sold'] || row.units_sold || 0),
          row['Item_id'] || row.item_id || '',
          row.source || 'walmart',
          relPath
        );
        count++;
      } catch (err) {
        console.warn(`⚠️  Order insert failed: ${err.message}`);
      }
    }
  }

  return count;
}

console.log('🔄 Importing data from sorted review repo...\n');

const reviewCount = importReviews();
console.log(`✅ Imported ${reviewCount} reviews`);

const customerCount = importCustomers();
console.log(`✅ Imported ${customerCount} customers`);

const orderCount = importOrders();
console.log(`✅ Imported ${orderCount} orders`);

db.close();

console.log(`\n✅ Database ready: ${dbPath}`);
console.log(`📊 Total records: ${reviewCount + customerCount + orderCount}`);
