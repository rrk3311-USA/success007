import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { parse } from 'csv-parse/sync';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'products.db'));

// Read and parse CSV
const csvContent = readFileSync(join(__dirname, '..', 'order-history.csv'), 'utf-8');
const records = parse(csvContent, {
  columns: true,
  skip_empty_lines: true,
  trim: true
});

console.log(`Found ${records.length} orders to import`);

// Prepare statements
const customerInsert = db.prepare(`
  INSERT INTO customers (email, name)
  VALUES (?, ?)
  ON CONFLICT(email) DO UPDATE SET name = excluded.name
`);

const orderInsert = db.prepare(`
  INSERT INTO orders (customer_email, status, total, date_created)
  VALUES (?, ?, ?, datetime('now'))
  ON CONFLICT DO NOTHING
`);

let customersAdded = 0;
let ordersAdded = 0;
let skipped = 0;

// Process each record
for (const record of records) {
  try {
    const email = record.Email?.trim();
    const firstName = record['First Name']?.trim() || '';
    const lastName = record['Last Name']?.trim() || '';
    const name = `${firstName} ${lastName}`.trim();
    const totalSpent = parseFloat(record['Total Spent']) || 0;
    const totalOrders = parseInt(record['Total Orders']) || 0;

    if (!email) {
      skipped++;
      continue;
    }

    // Insert customer
    try {
      customerInsert.run(email, name || email);
      customersAdded++;
    } catch (e) {
      // Customer might already exist
    }

    // Insert order(s) for this customer
    if (totalSpent > 0) {
      try {
        orderInsert.run(email, 'completed', totalSpent);
        ordersAdded++;
      } catch (e) {
        // Order might already exist
      }
    }

  } catch (error) {
    console.error(`Error processing record:`, error.message);
    skipped++;
  }
}

console.log('\n=== Import Complete ===');
console.log(`Customers added/updated: ${customersAdded}`);
console.log(`Orders added: ${ordersAdded}`);
console.log(`Skipped: ${skipped}`);
console.log(`Total processed: ${records.length}`);

// Show total counts
const totalCustomers = db.prepare('SELECT COUNT(*) as count FROM customers').get();
const totalOrders = db.prepare('SELECT COUNT(*) as count FROM orders').get();

console.log('\n=== Database Totals ===');
console.log(`Total customers in database: ${totalCustomers.count}`);
console.log(`Total orders in database: ${totalOrders.count}`);

db.close();
