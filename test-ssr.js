import { renderProductPage } from './server-render-product.js';

const sku = '10786-807';
const baseUrl = 'http://localhost:8080';

try {
    console.log('Testing SSR for SKU:', sku);
    const html = renderProductPage(sku, baseUrl);
    
    // Check for schema - look for the script tag with proper content
    const schemaMatch = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*data-schema=["']product["'][^>]*>([\s\S]*?)<\/script>/i);
    const hasSchema = !!schemaMatch;
    let schemaValid = false;
    if (hasSchema && schemaMatch[1]) {
        try {
            const schema = JSON.parse(schemaMatch[1].trim());
            schemaValid = schema['@type'] === 'Product' && !!schema.name && !!schema.sku;
        } catch (e) {
            // Schema exists but not valid JSON
        }
    }
    
    // Check title - decode HTML entities for comparison
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const titleText = titleMatch ? titleMatch[1].replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"') : '';
    const hasTitle = titleText && !titleText.includes('Loading Product') && titleText.includes('Sclera White');
    
    // Check description - decode HTML entities
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
    const descText = descMatch ? descMatch[1].replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&#8211;/g, '-') : '';
    const hasDescription = descText && !descText.includes('Success Chemistry Premium Supplements') && descText.length > 50;
    
    const checks = {
        hasSchema: hasSchema && schemaValid,
        hasCanonical: html.includes('rel="canonical"') && html.includes('href='),
        hasTitle: hasTitle,
        hasDescription: hasDescription
    };
    
    console.log('\nSSR Validation:');
    Object.entries(checks).forEach(([check, passed]) => {
        console.log(`  ${check}: ${passed ? '✅' : '❌'}`);
    });
    
    if (checks.hasSchema) {
        const schemaMatch = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i);
        if (schemaMatch) {
            try {
                const schema = JSON.parse(schemaMatch[1]);
                console.log('\nSchema details:');
                console.log(`  Name: ${schema.name || 'missing'}`);
                console.log(`  SKU: ${schema.sku || 'missing'}`);
                console.log(`  Price: ${schema.offers?.price || 'missing'}`);
            } catch (e) {
                console.log('  Could not parse schema JSON');
            }
        }
    }
    
    if (checks.hasCanonical) {
        const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
        if (canonicalMatch) {
            console.log(`\nCanonical URL: ${canonicalMatch[1]}`);
        }
    }
    
    if (checks.hasTitle) {
        const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
        if (titleMatch) {
            console.log(`\nTitle: ${titleMatch[1]}`);
        }
    }
    
    const allPassed = Object.values(checks).every(v => v);
    console.log(`\n${allPassed ? '✅' : '❌'} SSR Status: ${allPassed ? 'PASS' : 'FAIL'}`);
    
    if (!allPassed) {
        console.log('\nFirst 800 chars of <head>:');
        const headMatch = html.match(/<head>([\s\S]{0,800})/i);
        if (headMatch) {
            console.log(headMatch[1]);
        }
    }
    
    process.exit(allPassed ? 0 : 1);
} catch (error) {
    console.error('Error:', error.message);
    console.error(error.stack);
    process.exit(1);
}
