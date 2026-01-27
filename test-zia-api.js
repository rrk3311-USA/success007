/**
 * Test Zia Skills API Endpoints
 * 
 * Run this script to test your Zia Skills API integration:
 *   node test-zia-api.js
 * 
 * Make sure your server is running first:
 *   npm run start
 */

const BASE_URL = 'http://localhost:8080';

async function testEndpoint(name, url, expectedStatus = 200) {
    try {
        console.log(`\n🧪 Testing: ${name}`);
        console.log(`   URL: ${url}`);
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (response.status === expectedStatus) {
            console.log(`   ✅ Status: ${response.status}`);
            console.log(`   ✅ Response: ${JSON.stringify(data, null, 2).substring(0, 200)}...`);
            return { success: true, data };
        } else {
            console.log(`   ❌ Expected status ${expectedStatus}, got ${response.status}`);
            return { success: false, error: `Status ${response.status}` };
        }
    } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
        return { success: false, error: error.message };
    }
}

async function runTests() {
    console.log('🧪 Testing Zia Skills API Endpoints...\n');
    console.log('⚠️  Make sure your server is running: npm run start\n');

    const results = [];

    // Test 1: Search products by ingredient
    const searchTest = await testEndpoint(
        'Search Products (L-Arginine)',
        `${BASE_URL}/api/zia/products/search?q=L-Arginine&field=ingredients`
    );
    results.push({ name: 'Search Products', ...searchTest });

    // Test 2: Search products by name
    const nameSearchTest = await testEndpoint(
        'Search Products (Women)',
        `${BASE_URL}/api/zia/products/search?q=Women&field=name`
    );
    results.push({ name: 'Search by Name', ...nameSearchTest });

    // Test 3: Get product by SKU
    const skuTest = await testEndpoint(
        'Get Product by SKU',
        `${BASE_URL}/api/zia/products/52274-401`
    );
    results.push({ name: 'Get Product by SKU', ...skuTest });

    // Test 4: Get all products
    const allProductsTest = await testEndpoint(
        'Get All Products',
        `${BASE_URL}/api/zia/products`
    );
    results.push({ name: 'Get All Products', ...allProductsTest });

    // Test 5: Search without query (should fail)
    const errorTest = await testEndpoint(
        'Search without query (should fail)',
        `${BASE_URL}/api/zia/products/search`,
        400
    );
    results.push({ name: 'Error Handling', ...errorTest });

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 Test Summary:');
    console.log('='.repeat(50));
    
    const passed = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    
    results.forEach(result => {
        const icon = result.success ? '✅' : '❌';
        console.log(`${icon} ${result.name}`);
    });
    
    console.log('\n' + '='.repeat(50));
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log('='.repeat(50));

    if (failed > 0) {
        console.log('\n⚠️  Some tests failed. Please check:');
        console.log('   - Server is running on port 8080');
        console.log('   - API endpoints are added to local-server.js');
        console.log('   - Products data is loaded correctly');
        process.exit(1);
    } else {
        console.log('\n🎉 All tests passed! Your Zia Skills API is ready to use.');
        console.log('\n📝 Next steps:');
        console.log('   1. In Zoho SalesIQ → Zia Skills, use invokeUrl:');
        console.log('      response = invokeUrl [');
        console.log('          url: "https://successchemistry.com/api/zia/products/search?q=L-Arginine"');
        console.log('          type: GET');
        console.log('          connection: "ide"');
        console.log('      ];');
    }
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
    console.error('❌ This script requires Node.js 18+ or install node-fetch');
    process.exit(1);
}

runTests().catch(error => {
    console.error('❌ Test failed:', error);
    process.exit(1);
});
