#!/usr/bin/env node
/**
 * Single-PDP SEO Validation Script
 * 
 * Validates:
 * 1. Schema injection (single, no duplication)
 * 2. FAQ visibility in DOM (not display:none)
 * 3. Rendered HTML structure
 * 
 * Usage: node validate-pdp-seo.js <product-url>
 * Example: node validate-pdp-seo.js http://localhost:8080/product/?sku=10786-807
 */

import https from 'https';
import http from 'http';
import { URL } from 'url';

// Handle URL argument - quote it to prevent shell glob expansion
const targetUrl = process.argv[2] ? process.argv[2] : 'http://localhost:8080/product/?sku=10786-807';

console.log('🔍 PDP SEO Validation Tool\n');
console.log(`Target URL: ${targetUrl}\n`);

function fetchHTML(url) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const client = urlObj.protocol === 'https:' ? https : http;
        
        client.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                if (res.statusCode === 200) {
                    resolve(data);
                } else {
                    reject(new Error(`HTTP ${res.statusCode}`));
                }
            });
        }).on('error', reject);
    });
}

function validateSchema(html) {
    console.log('📋 Validating Schema Markup...\n');
    
    // Find all JSON-LD scripts
    const schemaMatches = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
    
    if (!schemaMatches || schemaMatches.length === 0) {
        console.log('❌ No schema markup found');
        return { valid: false, issues: ['No JSON-LD schema found'] };
    }
    
    console.log(`   Found ${schemaMatches.length} schema script(s)`);
    
    // Check for duplicates
    const schemaContents = schemaMatches.map(match => {
        const content = match.match(/<script[^>]*>([\s\S]*?)<\/script>/i)[1];
        try {
            return JSON.parse(content);
        } catch (e) {
            return null;
        }
    }).filter(Boolean);
    
    // Check for Product schema
    const productSchemas = schemaContents.filter(s => s['@type'] === 'Product');
    
    if (productSchemas.length === 0) {
        console.log('❌ No Product schema found');
        return { valid: false, issues: ['No Product schema type found'] };
    }
    
    if (productSchemas.length > 1) {
        console.log(`⚠️  Found ${productSchemas.length} Product schemas (should be 1)`);
        return { valid: false, issues: [`Duplicate Product schemas: ${productSchemas.length} found`] };
    }
    
    console.log('✅ Single Product schema found');
    
    // Validate required fields
    const product = productSchemas[0];
    const required = ['name', 'image', 'description', 'sku', 'offers'];
    const missing = required.filter(field => !product[field]);
    
    if (missing.length > 0) {
        console.log(`⚠️  Missing required fields: ${missing.join(', ')}`);
        return { valid: false, issues: [`Missing required fields: ${missing.join(', ')}`] };
    }
    
    console.log('✅ All required fields present');
    console.log(`   - Name: ${product.name}`);
    console.log(`   - SKU: ${product.sku}`);
    console.log(`   - Images: ${Array.isArray(product.image) ? product.image.length : 1}`);
    
    return { valid: true, schema: product };
}

function validateFAQ(html) {
    console.log('\n❓ Validating FAQ Visibility...\n');
    
    // Check for FAQ elements
    const faqMatches = html.match(/<div[^>]*class=["'][^"']*faq[^"']*["'][^>]*>/gi);
    
    if (!faqMatches || faqMatches.length === 0) {
        console.log('⚠️  No FAQ elements found in HTML');
        return { valid: false, issues: ['No FAQ elements found'] };
    }
    
    console.log(`   Found ${faqMatches.length} FAQ element(s)`);
    
    // Check for display:none on FAQ answers
    const faqAnswerMatches = html.match(/<div[^>]*class=["'][^"']*faq-answer[^"']*["'][^>]*>/gi);
    
    if (!faqAnswerMatches) {
        console.log('⚠️  No FAQ answer elements found');
        return { valid: false, issues: ['No FAQ answer elements found'] };
    }
    
    // Check each FAQ answer for display:none
    const issues = [];
    faqAnswerMatches.forEach((match, index) => {
        // Extract style attribute
        const styleMatch = match.match(/style=["']([^"']*)["']/i);
        if (styleMatch) {
            const styles = styleMatch[1];
            if (styles.includes('display:none') || styles.includes('display: none')) {
                issues.push(`FAQ answer ${index + 1} has display:none`);
            }
        }
    });
    
    if (issues.length > 0) {
        console.log(`⚠️  ${issues.length} FAQ answer(s) hidden with display:none:`);
        issues.forEach(issue => console.log(`   - ${issue}`));
        return { valid: false, issues };
    }
    
    console.log('✅ FAQ answers visible in DOM (no display:none)');
    
    // Check for FAQ content
    const faqContent = html.match(/faq.*question|faq.*answer/gi);
    if (faqContent && faqContent.length > 0) {
        console.log(`✅ FAQ content found (${faqContent.length} matches)`);
    }
    
    return { valid: true };
}

function validateRenderedHTML(html) {
    console.log('\n📄 Validating Rendered HTML Structure...\n');
    
    // Check for critical content in initial HTML
    const checks = {
        'Product name in <h1>': /<h1[^>]*>.*?<\/h1>/i.test(html),
        'Product price visible': /\$\d+\.\d{2}/.test(html),
        'Product image': /<img[^>]*alt[^>]*>/i.test(html),
        'Meta description': /<meta[^>]*name=["']description["'][^>]*>/i.test(html),
        'Canonical URL': /<link[^>]*rel=["']canonical["'][^>]*>/i.test(html),
    };
    
    const results = Object.entries(checks).map(([check, passed]) => {
        console.log(`   ${passed ? '✅' : '❌'} ${check}`);
        return { check, passed };
    });
    
    const allPassed = results.every(r => r.passed);
    
    return { valid: allPassed, results };
}

async function main() {
    try {
        console.log('Fetching HTML...\n');
        const html = await fetchHTML(targetUrl);
        
        const schemaResult = validateSchema(html);
        const faqResult = validateFAQ(html);
        const htmlResult = validateRenderedHTML(html);
        
        console.log('\n' + '='.repeat(60));
        console.log('📊 VALIDATION SUMMARY');
        console.log('='.repeat(60));
        console.log(`Schema: ${schemaResult.valid ? '✅ PASS' : '❌ FAIL'}`);
        console.log(`FAQ: ${faqResult.valid ? '✅ PASS' : '❌ FAIL'}`);
        console.log(`HTML: ${htmlResult.valid ? '✅ PASS' : '❌ FAIL'}`);
        
        const allPassed = schemaResult.valid && faqResult.valid && htmlResult.valid;
        
        console.log('\n' + '='.repeat(60));
        console.log(allPassed ? '✅ ALL CHECKS PASSED' : '❌ SOME CHECKS FAILED');
        console.log('='.repeat(60));
        
        if (!allPassed) {
            console.log('\nIssues to fix:');
            if (!schemaResult.valid) {
                schemaResult.issues?.forEach(issue => console.log(`  - Schema: ${issue}`));
            }
            if (!faqResult.valid) {
                faqResult.issues?.forEach(issue => console.log(`  - FAQ: ${issue}`));
            }
            if (!htmlResult.valid) {
                htmlResult.results
                    .filter(r => !r.passed)
                    .forEach(r => console.log(`  - HTML: ${r.check}`));
            }
        }
        
        process.exit(allPassed ? 0 : 1);
    } catch (error) {
        console.error('\n❌ Error:', error.message);
        process.exit(1);
    }
}

main();
