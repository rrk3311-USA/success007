// Check all 5-pack bundles in WooCommerce
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
    console.log('🔍 Finding All 5-Pack Bundles\n');
    console.log('='.repeat(60));
    
    const products = await fetchAllProducts();
    
    // Find all 5-packs
    const fivePacks = products.filter(p => 
        (p.sku && (p.sku.includes('5pack') || p.sku.includes('5-pack') || p.sku.includes('-5'))) ||
        (p.name && (p.name.toLowerCase().includes('5 pack') || p.name.toLowerCase().includes('5-pack')))
    );
    
    console.log(`Found ${fivePacks.length} five-pack bundles:\n`);
    
    fivePacks.forEach(p => {
        console.log(`📦 ${p.name}`);
        console.log(`   SKU: ${p.sku}`);
        console.log(`   ID: ${p.id}`);
        console.log(`   Price: $${p.price}`);
        
        const upc = p.meta_data?.find(m => m.key === 'upc')?.value || '';
        const gtin = p.meta_data?.find(m => m.key === 'gtin')?.value || '';
        console.log(`   UPC: ${upc || '❌ MISSING'}`);
        console.log(`   GTIN: ${gtin || '❌ MISSING'}`);
        
        const desc = p.description || '';
        console.log(`   Description: ${desc.length > 0 ? `✅ ${desc.length} chars` : '❌ MISSING'}`);
        
        const shortDesc = p.short_description || '';
        console.log(`   Short Description: ${shortDesc.length > 0 ? `✅ ${shortDesc.length} chars` : '❌ MISSING'}`);
        
        console.log(`   Images: ${p.images?.length || 0}`);
        console.log('');
    });
    
    // Specifically check for multivitamin 5-pack
    const multi5Pack = products.find(p => 
        p.sku && p.sku.includes('1989-403') && (p.sku.includes('5') || p.sku.includes('pack'))
    );
    
    console.log('\n' + '='.repeat(60));
    if (multi5Pack) {
        console.log('✅ Found Women\'s Multivitamin 5-Pack:');
        console.log(`   SKU: ${multi5Pack.sku}`);
        console.log(`   Name: ${multi5Pack.name}`);
    } else {
        console.log('❌ Women\'s Multivitamin 5-Pack NOT FOUND');
        console.log('   Looking for SKU containing: 1989-403 and "5" or "pack"');
    }
}

main().catch(console.error);
