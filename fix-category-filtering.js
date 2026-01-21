// Check category mapping in products-data.js
import fs from 'fs';

const filePath = './deploy-site/products-data.js';
const content = fs.readFileSync(filePath, 'utf8');

// Extract all categories
const categoryMatch = content.matchAll(/"category":\s*"([^"]+)"/g);
const categories = new Set();
for (const match of categoryMatch) {
    categories.add(match[1]);
}

console.log('📋 All Categories in products-data.js:\n');
console.log(Array.from(categories).sort().join('\n'));

console.log('\n\n🔍 Category Mapping Needed:\n');
console.log('Shop categories -> Product categories:');
console.log('  bestsellers -> Best Sellers');
console.log('  mens -> Men\'s Health');
console.log('  womens -> Women\'s Health');
console.log('  eye -> Eye Health');
console.log('  weight -> Weight Loss');
console.log('  bundles -> Bundle Deals');
console.log('  unisex -> Unisex');
console.log('  legacy -> Legacy');
