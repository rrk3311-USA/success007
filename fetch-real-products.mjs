import http from 'http';
import fs from 'fs';

// Fetch products from API
http.get('http://localhost:3001/api/products', (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
        data += chunk;
    });
    
    res.on('end', () => {
        const products = JSON.parse(data);
        
        // Get list of SKUs that have images
        const productFolders = fs.readdirSync('./images/products');
        const skusWithImages = new Set(productFolders);
        
        // Filter products to only those with images
        const productsWithImages = products.filter(p => skusWithImages.has(p.sku));
        
        // Build products data object
        const productsData = {};
        
        productsWithImages.forEach(product => {
            const folderPath = `./images/products/${product.sku}`;
            const images = fs.readdirSync(folderPath)
                .filter(f => f.endsWith('.png') || f.endsWith('.jpg'))
                .sort()
                .map(f => `/images/products/${product.sku}/${f}`);
            
            if (images.length > 0) {
                // Clean up description - remove HTML tags
                let description = product.short_description || product.description || '';
                description = description.replace(/<[^>]*>/g, '').trim();
                if (!description) {
                    description = `Premium ${product.name} supplement. High-quality ingredients for optimal health and wellness.`;
                }
                
                productsData[product.sku] = {
                    sku: product.sku,
                    name: product.name,
                    price: parseFloat(product.price),
                    category: product.category || 'Supplements',
                    description: description,
                    images: images
                };
            }
        });
        
        // Generate JavaScript file content
        const jsContent = `// Local product data - REAL product information from WooCommerce
// Generated from actual product data - NO API dependency needed
const PRODUCTS_DATA = ${JSON.stringify(productsData, null, 4)};

// Get product by SKU - GLOBAL FUNCTION
window.getProductBySKU = function(sku) {
    return PRODUCTS_DATA[sku] || null;
};

// Get all products as array - GLOBAL FUNCTION
window.getAllProducts = function() {
    return Object.values(PRODUCTS_DATA);
};

// Also make PRODUCTS_DATA globally accessible
window.PRODUCTS_DATA = PRODUCTS_DATA;

// Export for Node.js if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PRODUCTS_DATA, getProductBySKU: window.getProductBySKU, getAllProducts: window.getAllProducts };
}
`;
        
        fs.writeFileSync('products-data.js', jsContent);
        console.log(`✅ Created products-data.js with ${Object.keys(productsData).length} products with REAL data`);
        console.log('Sample products:', Object.values(productsData).slice(0, 3).map(p => p.name).join(' | '));
    });
}).on('error', (err) => {
    console.error('Error:', err.message);
});
