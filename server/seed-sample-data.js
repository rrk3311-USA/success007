/**
 * SEED SAMPLE DATA
 * Creates sample customers and orders for testing
 */

import Database from 'better-sqlite3';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'products.db'));

console.log('🌱 Seeding sample data...\n');

// Sample customers
const customers = [
  { email: 'john.smith@example.com', name: 'John Smith' },
  { email: 'sarah.johnson@example.com', name: 'Sarah Johnson' },
  { email: 'mike.williams@example.com', name: 'Mike Williams' },
  { email: 'emily.brown@example.com', name: 'Emily Brown' },
  { email: 'david.jones@example.com', name: 'David Jones' },
  { email: 'lisa.garcia@example.com', name: 'Lisa Garcia' },
  { email: 'james.miller@example.com', name: 'James Miller' },
  { email: 'maria.davis@example.com', name: 'Maria Davis' },
  { email: 'robert.rodriguez@example.com', name: 'Robert Rodriguez' },
  { email: 'jennifer.martinez@example.com', name: 'Jennifer Martinez' },
];

const customerInsert = db.prepare(`
  INSERT OR IGNORE INTO customers (email, name, created_at)
  VALUES (?, ?, datetime('now', '-' || ? || ' days'))
`);

let customersAdded = 0;
customers.forEach((customer, index) => {
  const daysAgo = Math.floor(Math.random() * 180); // Random date in last 6 months
  customerInsert.run(customer.email, customer.name, daysAgo);
  customersAdded++;
});

console.log(`✅ Added ${customersAdded} sample customers`);

// Sample orders
const orderStatuses = ['completed', 'processing', 'pending', 'cancelled'];
const orderInsert = db.prepare(`
  INSERT INTO orders (customer_email, status, total, subtotal, tax_total, shipping_total, payment_method, date_created, date_modified)
  VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now', '-' || ? || ' days'), datetime('now', '-' || ? || ' days'))
`);

let ordersAdded = 0;
for (let i = 0; i < 50; i++) {
  const customer = customers[Math.floor(Math.random() * customers.length)];
  const status = orderStatuses[Math.floor(Math.random() * orderStatuses.length)];
  const subtotal = (Math.random() * 150 + 20).toFixed(2);
  const tax = (subtotal * 0.08).toFixed(2);
  const shipping = status === 'cancelled' ? 0 : 5.99;
  const total = (parseFloat(subtotal) + parseFloat(tax) + shipping).toFixed(2);
  const daysAgo = Math.floor(Math.random() * 90); // Last 3 months
  
  orderInsert.run(
    customer.email,
    status,
    total,
    subtotal,
    tax,
    shipping,
    'credit_card',
    daysAgo,
    daysAgo
  );
  ordersAdded++;
}

console.log(`✅ Added ${ordersAdded} sample orders`);

// Sample subscriptions
const frequencies = ['weekly', 'bi-weekly', 'monthly'];
const subscriptionInsert = db.prepare(`
  INSERT INTO subscriptions (customer_id, product_id, status, frequency, price, next_billing_date, created_at)
  VALUES (
    (SELECT id FROM customers WHERE email = ?),
    1,
    ?,
    ?,
    ?,
    datetime('now', '+' || ? || ' days'),
    datetime('now', '-' || ? || ' days')
  )
`);

let subscriptionsAdded = 0;
for (let i = 0; i < 15; i++) {
  const customer = customers[Math.floor(Math.random() * customers.length)];
  const status = Math.random() > 0.2 ? 'active' : 'cancelled';
  const frequency = frequencies[Math.floor(Math.random() * frequencies.length)];
  const price = (Math.random() * 50 + 25).toFixed(2);
  const nextBilling = Math.floor(Math.random() * 30);
  const createdDaysAgo = Math.floor(Math.random() * 120);
  
  try {
    subscriptionInsert.run(
      customer.email,
      status,
      frequency,
      price,
      nextBilling,
      createdDaysAgo
    );
    subscriptionsAdded++;
  } catch (e) {
    // Skip if customer already has subscription
  }
}

console.log(`✅ Added ${subscriptionsAdded} sample subscriptions`);

console.log('\n🎉 Sample data seeding complete!\n');
console.log('Summary:');
console.log(`  - ${customersAdded} customers`);
console.log(`  - ${ordersAdded} orders`);
console.log(`  - ${subscriptionsAdded} subscriptions`);
console.log('\n✨ You can now view this data in your dashboards!');

db.close();
