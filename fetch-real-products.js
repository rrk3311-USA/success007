const https = require('https');
const fs = require('fs');

// Fetch products from API
https.get('http://localhost:3001/api/products', (res) => {
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
                productsData[product.sku] = {
                    sku: product.sku,
                    name: product.name,
                    price: parseFloat(product.price),
                    category: product.category || 'Supplements',
                    description: product.short_description || product.description || `Premium ${product.name} supplement.`,
                    images: images
                };
            }
        });
        
        console.log(JSON.stringify(productsData, null, 4));
        console.log(`\n// Total products: ${Object.keys(productsData).length}`);
    });
}).on('error', (err) => {
    console.error('Error:', err.message);
});
