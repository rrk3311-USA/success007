// Generate Google Merchant Center Product Feed from products-data.js
// Run this script to create an XML feed for Google Merchant Center

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import products data directly
const productsModule = await import('../products-data.js');
const PRODUCTS_DATA = productsModule.PRODUCTS_DATA || productsModule.default;

// Google Product Category for supplements
const GOOGLE_PRODUCT_CATEGORY = 'Health & Beauty > Health Care > Fitness & Nutrition > Vitamins & Supplements';

// Base URL for your site
const BASE_URL = 'https://success007-git-main-rrk3311-usas-projects.vercel.app';

// Generate XML feed
function generateMerchantFeed() {
    const products = Object.values(PRODUCTS_DATA);
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Success Chemistry Product Feed</title>
    <link>${BASE_URL}</link>
    <description>Premium health supplements and wellness products</description>
`;

    products.forEach(product => {
        const id = product.sku;
        const title = cleanText(product.name).substring(0, 150); // Max 150 chars
        const description = cleanText(product.short_description || product.description || '').substring(0, 5000); // Max 5000 chars
        const link = `${BASE_URL}/product?sku=${encodeURIComponent(product.sku)}`;
        const imageLink = product.images && product.images[0] ? 
            (product.images[0].startsWith('http') ? product.images[0] : `${BASE_URL}${product.images[0]}`) : '';
        const price = `${product.price} USD`;
        const availability = product.stock > 0 ? 'in stock' : 'out of stock';
        const brand = 'Success Chemistry';
        const condition = 'new';
        const gtin = product.upc || '';
        
        // Determine category
        let category = product.category || 'Health Supplements';
        
        xml += `
    <item>
      <g:id>${escapeXml(id)}</g:id>
      <g:title>${escapeXml(title)}</g:title>
      <g:description>${escapeXml(description)}</g:description>
      <g:link>${escapeXml(link)}</g:link>
      <g:image_link>${escapeXml(imageLink)}</g:image_link>
      <g:price>${price}</g:price>
      <g:availability>${availability}</g:availability>
      <g:brand>${brand}</g:brand>
      <g:condition>${condition}</g:condition>
      <g:google_product_category>${GOOGLE_PRODUCT_CATEGORY}</g:google_product_category>
      <g:product_type>Health &gt; Supplements &gt; ${escapeXml(category)}</g:product_type>
      ${gtin ? `<g:gtin>${gtin}</g:gtin>` : ''}
      
      <!-- Additional images -->
${product.images && product.images.slice(1, 10).map((img, idx) => {
    const imgUrl = img.startsWith('http') ? img : `${BASE_URL}${img}`;
    return `      <g:additional_image_link>${escapeXml(imgUrl)}</g:additional_image_link>`;
}).join('\n')}
      
      <!-- UCP Attributes for Agentic Commerce -->
      <g:native_commerce>TRUE</g:native_commerce>
      <g:consumer_notice>These statements have not been evaluated by the FDA. This product is not intended to diagnose, treat, cure, or prevent any disease.</g:consumer_notice>
      
      <!-- Custom Labels for Campaign Segmentation -->
      <g:custom_label_0>${escapeXml(category)}</g:custom_label_0>
      <g:custom_label_1>${product.price < 30 ? 'Low Price' : product.price < 50 ? 'Mid Price' : 'High Price'}</g:custom_label_1>
      <g:custom_label_2>${product.name.includes('Bundle') || product.name.includes('Pack') ? 'Bundle' : 'Single'}</g:custom_label_2>
    </item>
`;
    });

    xml += `  </channel>
</rss>`;

    return xml;
}

function cleanText(text) {
    if (!text) return '';
    return text
        .replace(/\n+/g, ' ')
        .replace(/\s+/g, ' ')
        .replace(/[^\x20-\x7E]/g, '') // Remove non-ASCII
        .trim();
}

function escapeXml(text) {
    if (!text) return '';
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

// Generate and save feed
const feedXml = generateMerchantFeed();
const outputPath = path.join(__dirname, 'google-merchant-feed.xml');
fs.writeFileSync(outputPath, feedXml, 'utf8');

console.log('✅ Google Merchant Center feed generated successfully!');
console.log(`📁 Output: ${outputPath}`);
console.log(`📊 Total products: ${Object.keys(PRODUCTS_DATA).length}`);
console.log(`\n🔗 Upload this feed to Google Merchant Center:`);
console.log(`   Manual upload: https://merchants.google.com`);
console.log(`   Or host at: ${BASE_URL}/feeds/google-merchant-feed.xml`);
