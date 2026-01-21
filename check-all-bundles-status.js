// Check status of all bundles
import fetch from 'node-fetch';

const WOOCOMMERCE_CONFIG = {
    url: 'https://blueviolet-snake-802946.hostingersite.com',
    consumerKey: 'ck_2a7dcf6903f5d22ed4228abd6da424746d5f80b6',
    consumerSecret: 'cs_448d2cd75368443afcd926cb249bd78e81a80db1',
    apiEndpoint: '/wp-json/wc/v3'
};

function getAuthHeader() {
    return `Basic ${Buffer.from(`${WOOCOMMERCE_CONFIG.consumerKey}:${WOOCOMMERCE_CONFIG.consumerSecret}`).toString('base64')}`;
}

async function fetchAllProducts() {
    const response = await fetch(
        `${WOOCOMMERCE_CONFIG.url}${WOOCOMMERCE_CONFIG.apiEndpoint}/products?per_page=100`,
        { headers: { 'Authorization': getAuthHeader() } }
    );
    if (!response.ok) throw new Error(`API Error ${response.status}`);
    return await response.json();
}

async function main() {
    console.log('📊 Checking All Bundles Status\n');
    console.log('='.repeat(60));
    
    const products = await fetchAllProducts();
    
    // Find all bundles
    const bundles = products.filter(p => 
        p.sku && (
            p.sku.includes('-2pack') || p.sku.includes('-3pack') || 
            p.sku.includes('-4pack') || p.sku.includes('-5pack') ||
            (p.sku.includes('-2') && p.sku.includes('52274-401')) ||
            (p.sku.includes('-3') && p.sku.includes('52274-401')) ||
            (p.sku.includes('-4') && p.sku.includes('52274-401')) ||
            (p.sku.includes('-5') && p.sku.includes('52274-401'))
        ) && p.sku.includes('52274-401')
    );
    
    console.log(`Found ${bundles.length} Women's Balance bundles:\n`);
    
    bundles.forEach(b => {
        const upc = b.meta_data?.find(m => m.key === 'upc')?.value || '❌ MISSING';
        const gtin = b.meta_data?.find(m => m.key === 'gtin')?.value || '❌ MISSING';
        const images = b.images?.length || 0;
        
        console.log(`📦 ${b.name.substring(0, 70)}`);
        console.log(`   SKU: ${b.sku}`);
        console.log(`   ID: ${b.id}`);
        console.log(`   UPC: ${upc}`);
        console.log(`   GTIN: ${gtin}`);
        console.log(`   Images: ${images > 0 ? `✅ ${images}` : '❌ MISSING'}`);
        console.log('');
    });
}

main().catch(console.error);
