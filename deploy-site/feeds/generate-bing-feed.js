// Generate Bing Shopping Feed from products-data.js
// Run this script to create an XML feed for Bing Merchant Center (Microsoft Advertising)
// Usage: node generate-bing-feed.js > bing-shopping-feed.xml

const BASE_URL = 'https://successchemistry.com';
const BING_CATEGORY = 'Health & Beauty > Health Care > Vitamins & Supplements';

// Load products data (assumes products-data.js is available)
// In browser: load products-data.js first
// In Node.js: require('./products-data.js')

function escapeXml(text) {
    if (!text) return '';
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function cleanText(text) {
    if (!text) return '';
    // Remove HTML tags
    let cleaned = text.replace(/<[^>]*>/g, '');
    // Replace special characters
    cleaned = cleaned.replace(/&nbsp;/g, ' ');
    cleaned = cleaned.replace(/&amp;/g, '&');
    cleaned = cleaned.replace(/&lt;/g, '<');
    cleaned = cleaned.replace(/&gt;/g, '>');
    // Clean up whitespace
    cleaned = cleaned.replace(/\s+/g, ' ').trim();
    return cleaned;
}

// Generate Bing Shopping XML feed
function generateBingFeed(productsData) {
    const products = Object.values(productsData);
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0" xmlns:c="http://www.bing.com/shopping/ns/1.0">
  <channel>
    <title>Success Chemistry Product Feed - Bing Shopping</title>
    <link>${BASE_URL}</link>
    <description>Premium health supplements and wellness products</description>
`;

    products.forEach(product => {
        const id = product.sku;
        const title = cleanText(product.name).substring(0, 255); // Max 255 chars for Bing
        const description = cleanText(product.short_description || product.description || '').substring(0, 5000); // Max 5000 chars
        const link = `${BASE_URL}/product/?sku=${encodeURIComponent(product.sku)}`;
        const imageLink = product.images && product.images[0] ? 
            (product.images[0].startsWith('http') ? product.images[0] : `${BASE_URL}${product.images[0]}`) : '';
        const price = `${product.price} USD`;
        const availability = product.stock > 0 ? 'in stock' : 'out of stock';
        const brand = 'Success Chemistry';
        const condition = 'new';
        const mpn = product.sku; // Bing uses MPN (Manufacturer Part Number) = SKU
        const gtin = product.gtin || product.upc || '';
        
        // Determine category for Bing
        let category = product.category || 'Health Supplements';
        
        // Bing category mapping
        let bingCategory = 'Health & Beauty > Health Care > Fitness & Nutrition > Vitamins & Supplements';
        if (category.toLowerCase().includes('women')) {
            bingCategory = 'Health & Beauty > Health Care > Fitness & Nutrition > Vitamins & Supplements > Women\'s Health';
        } else if (category.toLowerCase().includes('men')) {
            bingCategory = 'Health & Beauty > Health Care > Fitness & Nutrition > Vitamins & Supplements > Men\'s Health';
        } else if (category.toLowerCase().includes('eye') || category.toLowerCase().includes('vision')) {
            bingCategory = 'Health & Beauty > Health Care > Fitness & Nutrition > Vitamins & Supplements > Eye Health';
        } else if (category.toLowerCase().includes('weight')) {
            bingCategory = 'Health & Beauty > Health Care > Fitness & Nutrition > Vitamins & Supplements > Weight Management';
        }
        
        xml += `    <item>
      <g:id>${escapeXml(id)}</g:id>
      <g:title>${escapeXml(title)}</g:title>
      <g:description>${escapeXml(description)}</g:description>
      <g:link>${escapeXml(link)}</g:link>
      <g:image_link>${escapeXml(imageLink)}</g:image_link>
      <g:price>${price}</g:price>
      <g:availability>${availability}</g:availability>
      <g:brand>${escapeXml(brand)}</g:brand>
      <g:condition>${condition}</g:condition>
      <g:product_type>${escapeXml(bingCategory)}</g:product_type>
      <g:mpn>${escapeXml(mpn)}</g:mpn>
      ${gtin ? `<g:gtin>${escapeXml(gtin)}</g:gtin>` : ''}
      <g:google_product_category>${escapeXml(bingCategory)}</g:google_product_category>
`;

        // Additional images (Bing supports up to 10 additional images)
        if (product.images && product.images.length > 1) {
            product.images.slice(1, 11).forEach(img => {
                const imgUrl = img.startsWith('http') ? img : `${BASE_URL}${img}`;
                xml += `      <g:additional_image_link>${escapeXml(imgUrl)}</g:additional_image_link>\n`;
            });
        }
        
        // Bing-specific fields
        xml += `      <g:shipping>
        <g:country>US</g:country>
        <g:service>Standard</g:service>
        <g:price>0 USD</g:price>
      </g:shipping>
      <g:shipping>
        <g:country>US</g:country>
        <g:service>Express</g:service>
        <g:price>15 USD</g:price>
      </g:shipping>
`;
        
        // Custom labels for segmentation
        xml += `      <g:custom_label_0>${escapeXml(category)}</g:custom_label_0>
      <g:custom_label_1>${product.price < 30 ? 'Low Price' : product.price < 50 ? 'Mid Price' : 'High Price'}</g:custom_label_1>
      <g:custom_label_2>${product.name.includes('Bundle') || product.name.includes('Pack') ? 'Bundle' : 'Single'}</g:custom_label_2>
    </item>
`;
    });

    xml += `  </channel>
</rss>`;

    return xml;
}

// Export for use in Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { generateBingFeed, escapeXml, cleanText };
    
    // If products-data.js is available, generate feed
    try {
        const productsData = require('../products-data.js');
        if (productsData && productsData.PRODUCTS_DATA) {
            const feedXml = generateBingFeed(productsData.PRODUCTS_DATA);
            console.log(feedXml);
        } else {
            console.error('Products data not found. Make sure products-data.js exports PRODUCTS_DATA.');
        }
    } catch (e) {
        console.error('Could not load products-data.js:', e.message);
        console.error('Run this in browser after loading products-data.js, or use: node generate-bing-feed.js');
    }
}

// For browser use
if (typeof window !== 'undefined') {
    window.generateBingFeed = generateBingFeed;
}
