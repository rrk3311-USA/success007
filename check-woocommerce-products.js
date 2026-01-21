/**
 * Check WooCommerce for products, especially bundles
 * This will fetch all products and find the women's multi 5-pack
 */

const WOOCOMMERCE_CONFIG = {
    url: 'https://blueviolet-snake-802946.hostingersite.com',
    consumerKey: 'ck_2a7dcf6903f5d22ed4228abd6da424746d5f80b6',
    consumerSecret: 'cs_448d2cd75368443afcd926cb249bd78e81a80db1',
    apiEndpoint: '/wp-json/wc/v3'
};

async function fetchWooCommerceProducts() {
    console.log('🔍 Fetching products from WooCommerce...\n');
    
    try {
        // Fetch all products
        const response = await fetch(
            `${WOOCOMMERCE_CONFIG.url}${WOOCOMMERCE_CONFIG.apiEndpoint}/products?per_page=100`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Basic ${btoa(`${WOOCOMMERCE_CONFIG.consumerKey}:${WOOCOMMERCE_CONFIG.consumerSecret}`)}`
                }
            }
        );

        if (!response.ok) {
            throw new Error(`WooCommerce API Error ${response.status}: ${await response.text()}`);
        }

        const products = await response.json();
        
        console.log(`✅ Found ${products.length} products\n`);
        
        // Find women's multi products
        const womensMulti = products.filter(p => 
            p.name.toLowerCase().includes('women') && 
            (p.name.toLowerCase().includes('multi') || p.name.toLowerCase().includes('multivitamin'))
        );
        
        console.log('📦 Women\'s Multivitamin Products:');
        console.log('=====================================\n');
        
        womensMulti.forEach(product => {
            console.log(`SKU: ${product.sku || 'N/A'}`);
            console.log(`Name: ${product.name}`);
            console.log(`Price: $${product.price}`);
            console.log(`Description Length: ${product.description?.length || 0} chars`);
            console.log(`Short Description: ${product.short_description?.substring(0, 100) || 'N/A'}...`);
            console.log(`Images: ${product.images?.length || 0}`);
            console.log(`UPC: ${product.upc || 'N/A'}`);
            console.log(`GTIN: ${product.gtin || product.meta_data?.find(m => m.key === 'gtin')?.value || 'N/A'}`);
            console.log(`Stock: ${product.stock_status || 'N/A'}`);
            console.log(`Type: ${product.type || 'simple'}`);
            console.log('---\n');
        });
        
        // Find bundles or 5-pack
        const bundles = products.filter(p => 
            p.name.toLowerCase().includes('5') && 
            (p.name.toLowerCase().includes('pack') || p.name.toLowerCase().includes('bundle'))
        );
        
        if (bundles.length > 0) {
            console.log('📦 Bundle/5-Pack Products:');
            console.log('==========================\n');
            
            bundles.forEach(product => {
                console.log(`SKU: ${product.sku || 'N/A'}`);
                console.log(`Name: ${product.name}`);
                console.log(`Price: $${product.price}`);
                console.log(`Description Length: ${product.description?.length || 0} chars`);
                console.log(`Images: ${product.images?.length || 0}`);
                console.log(`UPC: ${product.upc || 'N/A'}`);
                console.log(`GTIN: ${product.gtin || 'N/A'}`);
                console.log('---\n');
            });
        }
        
        // Save full product data to file for inspection
        const fs = require('fs');
        fs.writeFileSync('woocommerce-products-export.json', JSON.stringify(products, null, 2));
        console.log('💾 Full product data saved to: woocommerce-products-export.json\n');
        
        return { womensMulti, bundles, allProducts: products };
        
    } catch (error) {
        console.error('❌ Error fetching products:', error);
        throw error;
    }
}

// Run if executed directly
if (require.main === module) {
    fetchWooCommerceProducts()
        .then(() => process.exit(0))
        .catch(error => {
            console.error('Failed:', error);
            process.exit(1);
        });
}

module.exports = { fetchWooCommerceProducts };
