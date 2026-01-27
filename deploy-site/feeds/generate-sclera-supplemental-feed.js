// Generate Google Merchant Center Supplemental Feed for Sclera Products Only
// This is a supplemental feed that can be used alongside your main feed
// Run this script to create an XML feed specifically for Sclera White products

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read and evaluate products-data.js to get PRODUCTS_DATA
const productsDataPath = path.join(__dirname, '../products-data.js');
const productsDataCode = fs.readFileSync(productsDataPath, 'utf8');

// Create a context and evaluate the code
const context = { module: { exports: {} }, exports: {}, require: () => ({}) };
vm.createContext(context);
vm.runInContext(productsDataCode, context);

// Extract PRODUCTS_DATA from the evaluated context
let PRODUCTS_DATA = null;
try {
    // Try to get it from the global scope after evaluation
    const evalCode = `
        ${productsDataCode}
        PRODUCTS_DATA;
    `;
    PRODUCTS_DATA = vm.runInNewContext(evalCode, {});
} catch (e) {
    // Fallback: read the file and extract the object using regex
    const match = productsDataCode.match(/const PRODUCTS_DATA = ({[\s\S]*?});/);
    if (match) {
        PRODUCTS_DATA = eval('(' + match[1] + ')');
    }
}

// Verify we have the data
if (!PRODUCTS_DATA || typeof PRODUCTS_DATA !== 'object') {
    console.error('❌ Failed to load PRODUCTS_DATA');
    console.error('Trying alternative method...');
    
    // Alternative: Use a simpler eval approach
    const sandbox = { PRODUCTS_DATA: null };
    vm.runInNewContext(productsDataCode, sandbox);
    PRODUCTS_DATA = sandbox.PRODUCTS_DATA;
    
    if (!PRODUCTS_DATA || typeof PRODUCTS_DATA !== 'object') {
        console.error('❌ All methods failed to load PRODUCTS_DATA');
        process.exit(1);
    }
}

// Google Product Category for supplements
const GOOGLE_PRODUCT_CATEGORY = 'Health & Beauty > Health Care > Fitness & Nutrition > Vitamins & Supplements';

// Base URL - Update this to match your production site
// Options: https://successchemistry.com or https://success-chemistry-shop.netlify.app
const BASE_URL = process.env.PRODUCTION_URL || 'https://successchemistry.com';

// Sclera product SKUs to include in this supplemental feed
const SCLERA_SKUS = ['10786-807', '10786-807-2', '10786-807-3'];

// Generate XML feed for Sclera products only
function generateScleraSupplementalFeed() {
    // Filter products to only include Sclera SKUs
    const scleraProducts = SCLERA_SKUS
        .map(sku => PRODUCTS_DATA[sku])
        .filter(product => product !== undefined);
    
    if (scleraProducts.length === 0) {
        console.error('❌ No Sclera products found!');
        return '';
    }
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Success Chemistry - Sclera White Supplemental Feed</title>
    <link>${BASE_URL}</link>
    <description>Supplemental feed for Sclera White eye health products - Premium eye whitening and health supplements</description>
`;

    scleraProducts.forEach(product => {
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
        const gtin = product.gtin || product.upc || '';
        
        // Determine category
        let category = product.category || 'Eye Health Supplements';
        
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
      <g:product_type>Health &gt; Supplements &gt; Eye Health &gt; ${escapeXml(category)}</g:product_type>
      ${gtin ? `<g:gtin>${escapeXml(gtin)}</g:gtin>` : ''}
      <g:merchant_item_id>${escapeXml(id)}</g:merchant_item_id>
      
      <!-- Additional images -->
${product.images && product.images.slice(1, 10).map((img, idx) => {
    const imgUrl = img.startsWith('http') ? img : `${BASE_URL}${img}`;
    return `      <g:additional_image_link>${escapeXml(imgUrl)}</g:additional_image_link>`;
}).join('\n')}
      
      <!-- UCP Attributes for Agentic Commerce -->
      <g:native_commerce>TRUE</g:native_commerce>
      <g:consumer_notice>These statements have not been evaluated by the FDA. This product is not intended to diagnose, treat, cure, or prevent any disease.</g:consumer_notice>
      
      <!-- Supplemental Feed Attributes -->
      <g:custom_label_0>Sclera White</g:custom_label_0>
      <g:custom_label_1>Eye Health</g:custom_label_1>
      <g:custom_label_2>${product.name.includes('Bundle') || product.name.includes('Pack') ? 'Bundle' : 'Single'}</g:custom_label_2>
      <g:custom_label_3>${product.price < 30 ? 'Low Price' : product.price < 50 ? 'Mid Price' : 'High Price'}</g:custom_label_3>
      <g:custom_label_4>Supplemental Feed</g:custom_label_4>
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
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&#8211;/g, '-')
        .replace(/&#8217;/g, "'")
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
const feedXml = generateScleraSupplementalFeed();
const outputPath = path.join(__dirname, 'sclera-supplemental-feed.xml');
fs.writeFileSync(outputPath, feedXml, 'utf8');

const scleraCount = SCLERA_SKUS.filter(sku => PRODUCTS_DATA[sku]).length;

console.log('✅ Sclera Supplemental Feed generated successfully!');
console.log(`📁 Output: ${outputPath}`);
console.log(`📊 Sclera products included: ${scleraCount}`);
console.log(`\n🔗 Feed URL for Google Merchant Center:`);
console.log(`   ${BASE_URL}/feeds/sclera-supplemental-feed.xml`);
console.log(`\n📋 Next Steps:`);
console.log(`   1. Upload this feed as a SUPPLEMENTAL feed in Google Merchant Center`);
console.log(`   2. Go to: https://merchants.google.com → Products → Feeds`);
console.log(`   3. Click "Add supplemental feed"`);
console.log(`   4. Enter feed URL: ${BASE_URL}/feeds/sclera-supplemental-feed.xml`);
console.log(`   5. Set schedule: Daily automatic fetch`);
console.log(`\n💡 Note: This is a supplemental feed - it works alongside your main feed`);
console.log(`   It only includes Sclera White products (SKUs: ${SCLERA_SKUS.join(', ')})`);
