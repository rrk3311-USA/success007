// Check WooCommerce for the women's multivitamin 5-pack bundle
import fetch from 'node-fetch';

const WOOCOMMERCE_CONFIG = {
    url: 'https://blueviolet-snake-802946.hostingersite.com',
    consumerKey: 'ck_2a7dcf6903f5d22ed4228abd6da424746d5f80b6',
    consumerSecret: 'cs_448d2cd75368443afcd926cb249bd78e81a80db1',
    apiEndpoint: '/wp-json/wc/v3'
};

async function checkWooCommerceProducts() {
    console.log('🔍 Checking WooCommerce for Women\'s Multivitamin 5-Pack...\n');
    
    try {
        // Fetch all products
        const response = await fetch(
            `${WOOCOMMERCE_CONFIG.url}${WOOCOMMERCE_CONFIG.apiEndpoint}/products?per_page=100&search=multivitamin`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Basic ${Buffer.from(`${WOOCOMMERCE_CONFIG.consumerKey}:${WOOCOMMERCE_CONFIG.consumerSecret}`).toString('base64')}`
                }
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`WooCommerce API Error ${response.status}: ${errorText}`);
        }

        const products = await response.json();
        
        console.log(`✅ Found ${products.length} products matching "multivitamin"\n`);
        
        // Filter for women's multivitamin and bundles
        const womensMulti = products.filter(p => 
            (p.name.toLowerCase().includes('women') || p.name.toLowerCase().includes('goddess')) &&
            (p.name.toLowerCase().includes('multi') || p.name.toLowerCase().includes('vitamin'))
        );
        
        const bundles = products.filter(p => 
            (p.name.toLowerCase().includes('5') || p.name.toLowerCase().includes('pack')) &&
            (p.name.toLowerCase().includes('multi') || p.name.toLowerCase().includes('vitamin'))
        );
        
        console.log('📦 Women\'s Multivitamin Products:');
        console.log('===================================\n');
        
        womensMulti.forEach(product => {
            console.log(`SKU: ${product.sku || 'N/A'}`);
            console.log(`Name: ${product.name}`);
            console.log(`Price: $${product.price}`);
            console.log(`Description Length: ${product.description?.length || 0} chars`);
            console.log(`Short Description: ${product.short_description?.substring(0, 150) || 'N/A'}...`);
            console.log(`Images: ${product.images?.length || 0}`);
            if (product.images && product.images.length > 0) {
                console.log(`First Image: ${product.images[0].src}`);
            }
            console.log(`UPC: ${product.meta_data?.find(m => m.key === 'upc')?.value || product.upc || 'N/A'}`);
            console.log(`GTIN: ${product.meta_data?.find(m => m.key === 'gtin')?.value || product.gtin || 'N/A'}`);
            console.log(`Stock: ${product.stock_status || 'N/A'}`);
            console.log(`Type: ${product.type || 'simple'}`);
            console.log('---\n');
        });
        
        if (bundles.length > 0) {
            console.log('\n📦 Bundle/5-Pack Products:');
            console.log('==========================\n');
            
            bundles.forEach(product => {
                console.log(`SKU: ${product.sku || 'N/A'}`);
                console.log(`Name: ${product.name}`);
                console.log(`Price: $${product.price}`);
                console.log(`Description Length: ${product.description?.length || 0} chars`);
                console.log(`Images: ${product.images?.length || 0}`);
                console.log(`UPC: ${product.meta_data?.find(m => m.key === 'upc')?.value || product.upc || 'N/A'}`);
                console.log(`GTIN: ${product.meta_data?.find(m => m.key === 'gtin')?.value || product.gtin || 'N/A'}`);
                console.log('---\n');
            });
        }
        
        // Save to file
        const fs = await import('fs');
        fs.writeFileSync('woocommerce-multivitamin-products.json', JSON.stringify({ womensMulti, bundles, all: products }, null, 2));
        console.log('💾 Data saved to: woocommerce-multivitamin-products.json\n');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

checkWooCommerceProducts();
