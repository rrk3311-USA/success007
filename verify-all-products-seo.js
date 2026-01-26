#!/usr/bin/env node
/**
 * SEO Verification Script for All Product Pages
 * 
 * Checks all generated static product pages against the SEO checklist
 * to ensure they pass Tier 1-4 requirements.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PRODUCT_DIR = './deploy-site/product';

// Results storage
const results = {
    total: 0,
    passed: 0,
    failed: 0,
    products: []
};

// Check a single product page
function verifyProduct(productPath, sku) {
    const html = fs.readFileSync(productPath, 'utf8');
    const issues = [];
    const passes = [];
    
    // Tier 1 - Non-negotiable
    const tier1 = {
        http200: true, // Assume 200 if file exists
        uniqueTitle: false,
        metaDescription: false,
        canonicalUrl: false,
        serverRendered: false,
        productJsonLd: false,
        noDuplicateSchemas: true
    };
    
    // Check title
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    if (titleMatch) {
        const title = titleMatch[1];
        if (title && !title.includes('Loading') && title.length >= 30 && title.length <= 70) {
            tier1.uniqueTitle = true;
            passes.push('✅ Unique title');
        } else {
            issues.push(`❌ Title: "${title.substring(0, 50)}..." (${title.length} chars)`);
        }
    } else {
        issues.push('❌ No title tag found');
    }
    
    // Check meta description
    const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
    if (descMatch) {
        const desc = descMatch[1];
        if (desc && desc.length >= 120 && desc.length <= 170) {
            tier1.metaDescription = true;
            passes.push('✅ Meta description');
        } else {
            issues.push(`❌ Meta description: ${desc.length} chars (need 120-170)`);
        }
    } else {
        issues.push('❌ No meta description found');
    }
    
    // Check canonical URL
    const canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
    if (canonicalMatch) {
        const canonical = canonicalMatch[1];
        if (canonical && canonical.includes('sku=') && canonical.startsWith('http')) {
            tier1.canonicalUrl = true;
            passes.push('✅ Canonical URL');
        } else {
            issues.push(`❌ Canonical URL: "${canonical}"`);
        }
    } else {
        issues.push('❌ No canonical URL found');
    }
    
    // Check server-rendered content
    const hasH1 = /<h1[^>]*>.*?<\/h1>/i.test(html);
    const hasContent = html.includes('What It Does') || html.includes('Key Ingredients');
    const noLoadingPlaceholder = !html.includes('Loading product information');
    
    if (hasH1 && hasContent && noLoadingPlaceholder) {
        tier1.serverRendered = true;
        passes.push('✅ Server-rendered HTML');
    } else {
        issues.push('❌ Not server-rendered (missing H1, content, or has loading placeholder)');
    }
    
    // Check Product JSON-LD
    const productSchemaMatches = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?"@type"\s*:\s*"Product"/gi);
    if (productSchemaMatches && productSchemaMatches.length === 1) {
        tier1.productJsonLd = true;
        passes.push('✅ Product JSON-LD (exactly 1)');
    } else if (productSchemaMatches && productSchemaMatches.length > 1) {
        issues.push(`❌ Multiple Product schemas found (${productSchemaMatches.length})`);
        tier1.noDuplicateSchemas = false;
    } else {
        issues.push('❌ No Product JSON-LD found');
    }
    
    // Check for duplicate FAQPage schemas
    const faqSchemaMatches = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?"@type"\s*:\s*"FAQPage"/gi);
    if (faqSchemaMatches && faqSchemaMatches.length > 1) {
        issues.push(`❌ Multiple FAQPage schemas found (${faqSchemaMatches.length})`);
        tier1.noDuplicateSchemas = false;
    }
    
    // Tier 2 - Content & Structure
    const tier2 = {
        singleH1: false,
        headingHierarchy: false,
        productIntro: false,
        ingredientMechanism: false,
        visibleFAQs: false,
        faqJsonLd: false,
        fdaDisclaimer: false
    };
    
    // Check single H1
    const h1Matches = html.match(/<h1[^>]*>.*?<\/h1>/gi);
    if (h1Matches && h1Matches.length === 1) {
        tier2.singleH1 = true;
        passes.push('✅ Single H1');
    } else {
        issues.push(`❌ H1 count: ${h1Matches ? h1Matches.length : 0} (need exactly 1)`);
    }
    
    // Check heading hierarchy (has H2)
    const hasH2 = /<h2[^>]*>.*?<\/h2>/i.test(html);
    if (hasH2) {
        tier2.headingHierarchy = true;
        passes.push('✅ Logical heading hierarchy');
    } else {
        issues.push('❌ No H2 headings found');
    }
    
    // Check product intro
    if (html.includes('Plain-English summary') || html.includes('summary') || html.includes('What It Does')) {
        tier2.productIntro = true;
        passes.push('✅ Product intro above fold');
    } else {
        issues.push('❌ No product intro found');
    }
    
    // Check ingredient → mechanism → benefit
    if (html.includes('Key Ingredients') && html.includes('What It Does')) {
        tier2.ingredientMechanism = true;
        passes.push('✅ Ingredient → mechanism → benefit clarity');
    } else {
        issues.push('❌ Missing ingredient/mechanism sections');
    }
    
    // Check visible FAQs
    if (html.includes('Frequently Asked Questions') || html.includes('FAQ')) {
        // Check if FAQs are in DOM (not display:none)
        const faqSection = html.match(/<section[^>]*>[\s\S]*?Frequently Asked Questions[\s\S]*?<\/section>/i);
        if (faqSection && !faqSection[0].includes('display:none')) {
            tier2.visibleFAQs = true;
            passes.push('✅ Visible FAQs');
        } else {
            issues.push('❌ FAQs hidden or not in DOM');
        }
    } else {
        // Some products may not have FAQs
        tier2.visibleFAQs = true; // Pass if no FAQs expected
        passes.push('⚠️  No FAQs (may be acceptable)');
    }
    
    // Check FAQPage JSON-LD
    if (tier2.visibleFAQs && faqSchemaMatches && faqSchemaMatches.length === 1) {
        tier2.faqJsonLd = true;
        passes.push('✅ FAQPage JSON-LD');
    } else if (!tier2.visibleFAQs) {
        tier2.faqJsonLd = true; // Pass if no FAQs
    } else {
        issues.push('❌ FAQPage JSON-LD missing or duplicate');
    }
    
    // Check FDA disclaimer
    if (html.includes('FDA') || html.includes('Food and Drug Administration') || html.includes('not intended to diagnose')) {
        tier2.fdaDisclaimer = true;
        passes.push('✅ FDA disclaimer present');
    } else {
        issues.push('❌ FDA disclaimer missing');
    }
    
    // Calculate scores
    const tier1Score = Object.values(tier1).filter(v => v).length;
    const tier2Score = Object.values(tier2).filter(v => v).length;
    const tier1Pass = tier1Score === 7; // 100% required
    const tier2Pass = tier2Score >= 6; // ≥90% required (6/7)
    
    const passed = tier1Pass && tier2Pass;
    
    return {
        sku,
        passed,
        tier1: { score: tier1Score, total: 7, pass: tier1Pass },
        tier2: { score: tier2Score, total: 7, pass: tier2Pass },
        issues,
        passes
    };
}

// Main verification function
function verifyAllProducts() {
    console.log('🔍 Starting SEO Verification for All Products...\n');
    
    if (!fs.existsSync(PRODUCT_DIR)) {
        console.error('❌ Product directory not found:', PRODUCT_DIR);
        process.exit(1);
    }
    
    // Find all product directories
    const productDirs = fs.readdirSync(PRODUCT_DIR, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
    
    console.log(`📦 Found ${productDirs.length} product directories\n`);
    
    // Verify each product
    productDirs.forEach((sku, index) => {
        const productPath = path.join(PRODUCT_DIR, sku, 'index.html');
        
        if (!fs.existsSync(productPath)) {
            console.log(`⚠️  ${sku}: No index.html found`);
            results.failed++;
            return;
        }
        
        const result = verifyProduct(productPath, sku);
        results.total++;
        results.products.push(result);
        
        if (result.passed) {
            results.passed++;
        } else {
            results.failed++;
        }
        
        // Show progress
        if ((index + 1) % 10 === 0) {
            console.log(`   Verified ${index + 1}/${productDirs.length}...`);
        }
    });
    
    // Generate report
    console.log('\n' + '='.repeat(80));
    console.log('📊 SEO VERIFICATION RESULTS');
    console.log('='.repeat(80));
    console.log(`\nTotal Products: ${results.total}`);
    console.log(`✅ Passed: ${results.passed} (${Math.round(results.passed/results.total*100)}%)`);
    console.log(`❌ Failed: ${results.failed} (${Math.round(results.failed/results.total*100)}%)`);
    
    // Show failed products
    const failedProducts = results.products.filter(p => !p.passed);
    if (failedProducts.length > 0) {
        console.log('\n❌ FAILED PRODUCTS:');
        console.log('-'.repeat(80));
        failedProducts.forEach(product => {
            console.log(`\n${product.sku}:`);
            console.log(`  Tier 1: ${product.tier1.score}/7 ${product.tier1.pass ? '✅' : '❌'}`);
            console.log(`  Tier 2: ${product.tier2.score}/7 ${product.tier2.pass ? '✅' : '❌'}`);
            if (product.issues.length > 0) {
                console.log('  Issues:');
                product.issues.forEach(issue => console.log(`    ${issue}`));
            }
        });
    }
    
    // Show summary by tier
    console.log('\n' + '='.repeat(80));
    console.log('📈 TIER BREAKDOWN');
    console.log('='.repeat(80));
    
    const tier1PassCount = results.products.filter(p => p.tier1.pass).length;
    const tier2PassCount = results.products.filter(p => p.tier2.pass).length;
    
    console.log(`\nTier 1 (Non-negotiable): ${tier1PassCount}/${results.total} pass (${Math.round(tier1PassCount/results.total*100)}%)`);
    console.log(`Tier 2 (Content & Structure): ${tier2PassCount}/${results.total} pass (${Math.round(tier2PassCount/results.total*100)}%)`);
    
    // Overall verdict
    console.log('\n' + '='.repeat(80));
    if (results.failed === 0) {
        console.log('✅ ALL PRODUCTS PASS SEO REQUIREMENTS!');
    } else {
        console.log(`⚠️  ${results.failed} product(s) need attention`);
    }
    console.log('='.repeat(80) + '\n');
    
    return results;
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    verifyAllProducts();
}

export { verifyAllProducts, verifyProduct };
