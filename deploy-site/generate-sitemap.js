// Generate sitemap.xml from products data
// Run: node deploy-site/generate-sitemap.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base URL - UPDATE THIS when you have your domain
// For localhost testing, use: http://localhost:8080
// For production, use: https://successchemistry.com
const BASE_URL = process.env.SITE_URL || 'https://successchemistry.com';

// Read products data file directly
const productsDataPath = path.join(__dirname, 'products-data.js');
const productsDataContent = fs.readFileSync(productsDataPath, 'utf8');

// Extract PRODUCTS_DATA object using eval (safe in this context)
// Find the PRODUCTS_DATA assignment
const match = productsDataContent.match(/const PRODUCTS_DATA\s*=\s*({[\s\S]*?});/);
if (!match) {
    throw new Error('Could not find PRODUCTS_DATA in products-data.js');
}

// Evaluate the object (safe since it's our own file)
const PRODUCTS_DATA = eval('(' + match[1] + ')');

// Get all product SKUs
const products = Object.values(PRODUCTS_DATA);
const productUrls = products.map(p => ({
    loc: `${BASE_URL}/product/${p.sku}`,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: '0.8'
}));

// Static pages
const staticPages = [
    { loc: `${BASE_URL}/`, priority: '1.0', changefreq: 'daily' },
    { loc: `${BASE_URL}/shop`, priority: '0.9', changefreq: 'daily' },
    { loc: `${BASE_URL}/blog`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${BASE_URL}/faq`, priority: '0.7', changefreq: 'monthly' },
    { loc: `${BASE_URL}/contact`, priority: '0.7', changefreq: 'monthly' },
    { loc: `${BASE_URL}/cart`, priority: '0.6', changefreq: 'monthly' },
    { loc: `${BASE_URL}/privacy-policy`, priority: '0.5', changefreq: 'yearly' },
    { loc: `${BASE_URL}/shipping-returns`, priority: '0.6', changefreq: 'monthly' },
    { loc: `${BASE_URL}/terms-of-service`, priority: '0.5', changefreq: 'yearly' },
    { loc: `${BASE_URL}/payment-policy`, priority: '0.5', changefreq: 'yearly' },
];

// Generate sitemap XML
function generateSitemap() {
    const today = new Date().toISOString().split('T')[0];
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
`;

    // Add static pages
    staticPages.forEach(page => {
        xml += `  <url>
    <loc>${escapeXml(page.loc)}</loc>
    <lastmod>${page.lastmod || today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
    });

    // Add product pages
    productUrls.forEach(product => {
        xml += `  <url>
    <loc>${escapeXml(product.loc)}</loc>
    <lastmod>${product.lastmod}</lastmod>
    <changefreq>${product.changefreq}</changefreq>
    <priority>${product.priority}</priority>
  </url>
`;
    });

    xml += `</urlset>`;

    return xml;
}

function escapeXml(text) {
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

// Write sitemap
const sitemap = generateSitemap();
const sitemapPath = path.join(__dirname, 'sitemap.xml');
fs.writeFileSync(sitemapPath, sitemap, 'utf8');

console.log(`✅ Sitemap generated: ${sitemapPath}`);
console.log(`   Total URLs: ${staticPages.length + productUrls.length}`);
console.log(`   - Static pages: ${staticPages.length}`);
console.log(`   - Product pages: ${productUrls.length}`);
console.log(`\n📍 Update BASE_URL in this script when you have your domain!`);
