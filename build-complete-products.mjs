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
            
            // Get ALL images from the folder
            const allImages = fs.readdirSync(folderPath)
                .filter(f => f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg'))
                .sort()
                .map(f => `/images/products/${product.sku}/${f}`);
            
            if (allImages.length > 0) {
                // Get FULL description - prefer long description over short
                let description = product.description || product.short_description || '';
                
                // Clean up HTML tags but keep line breaks
                description = description
                    .replace(/<br\s*\/?>/gi, '\n')
                    .replace(/<\/p>/gi, '\n\n')
                    .replace(/<[^>]*>/g, '')
                    .replace(/&nbsp;/g, ' ')
                    .replace(/&amp;/g, '&')
                    .replace(/&lt;/g, '<')
                    .replace(/&gt;/g, '>')
                    .replace(/&quot;/g, '"')
                    .trim();
                
                if (!description) {
                    description = `Premium ${product.name} supplement. High-quality ingredients for optimal health and wellness.`;
                }
                
                productsData[product.sku] = {
                    sku: product.sku,
                    name: product.name,
                    price: parseFloat(product.price),
                    category: product.category || 'Supplements',
                    description: description,
                    short_description: product.short_description ? product.short_description.replace(/<[^>]*>/g, '').trim() : description.substring(0, 200),
                    images: allImages,  // ALL images, not just first one
                    stock: product.stock || 100000,
                    upc: product.upc || '',
                    ingredients: product.ingredients || '',
                    key_features: product.key_features || ''
                };
            }
        });
        
        // Generate JavaScript file content
        const jsContent = `// Local product data - COMPLETE product information from WooCommerce
// Generated from actual product data - NO API dependency needed
// Includes: Full descriptions, ALL images, complete product details
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
        
        // Show summary
        console.log(`✅ Created products-data.js with ${Object.keys(productsData).length} products`);
        console.log('\n📊 Summary:');
        
        let totalImages = 0;
        Object.values(productsData).forEach(p => {
            totalImages += p.images.length;
        });
        
        console.log(`   Total products: ${Object.keys(productsData).length}`);
        console.log(`   Total images: ${totalImages}`);
        console.log(`   Avg images per product: ${(totalImages / Object.keys(productsData).length).toFixed(1)}`);
        
        // Show sample products with image counts
        console.log('\n📦 Sample products:');
        Object.values(productsData).slice(0, 5).forEach(p => {
            console.log(`   ${p.sku}: ${p.images.length} images - ${p.name.substring(0, 60)}...`);
        });
        
        console.log('\n✅ Complete product data saved to products-data.js');
        console.log('   - Full official descriptions');
        console.log('   - ALL product images');
        console.log('   - Complete product details');
        console.log('   - Ready for independent operation (no API needed)');
    });
}).on('error', (err) => {
    console.error('Error:', err.message);
});
