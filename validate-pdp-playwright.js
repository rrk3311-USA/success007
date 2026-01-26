#!/usr/bin/env node
/**
 * Playwright-based PDP SEO Validator
 * 
 * Validates rendered DOM (after JS execution):
 * - JSON-LD schema count and types
 * - Canonical URL
 * - Title and meta description
 * - FAQ visibility (no display:none)
 * 
 * Usage: node validate-pdp-playwright.js <url>
 * Example: node validate-pdp-playwright.js "http://localhost:8080/product/?sku=10786-807"
 * 
 * Requires: npm install -D playwright
 *           npx playwright install chromium
 */

import { chromium } from 'playwright';

async function validate(url) {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    try {
        // Wait for network idle so CSR pages settle
        await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
        
        // Additional wait for product data to load
        await page.waitForFunction(() => {
            return typeof window.getProductBySKU === 'function' || 
                   document.querySelector('h1')?.textContent !== 'Loading Product...';
        }, { timeout: 10000 }).catch(() => {
            console.warn('⚠️  Product may not have loaded fully');
        });
        
        // Wait a bit more for schema injection
        await page.waitForTimeout(1000);
        
        const results = await page.evaluate(() => {
            // Get all JSON-LD scripts
            const ldjsonScripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
            const ldjson = ldjsonScripts.map(s => {
                try {
                    return JSON.parse(s.textContent?.trim() || '{}');
                } catch (e) {
                    return null;
                }
            }).filter(Boolean);
            
            // Check for Product and FAQPage schemas
            const productSchemas = ldjson.filter(s => s['@type'] === 'Product');
            const faqSchemas = ldjson.filter(s => s['@type'] === 'FAQPage' || s.mainEntity?.['@type'] === 'FAQPage');
            
            // Get canonical
            const canonical = document.querySelector('link[rel="canonical"]')?.href || null;
            
            // Get title and description
            const title = document.title || null;
            const desc = document.querySelector('meta[name="description"]')?.getAttribute('content') || null;
            
            // Check FAQ visibility
            // Rule: Never use display:none or visibility:hidden
            // Allowed: max-height: 0, opacity: 0 (collapsed but in DOM)
            const faqAnswers = Array.from(document.querySelectorAll('.faq-answer'));
            const faqDisplays = faqAnswers.slice(0, 5).map((el, i) => {
                const style = window.getComputedStyle(el);
                const display = style.display;
                const visibility = style.visibility;
                const height = el.getBoundingClientRect().height;
                const hasDisplayNone = display === 'none';
                const hasVisibilityHidden = visibility === 'hidden';
                
                // Fail if display:none or visibility:hidden (content hidden from crawlers)
                // Pass if display !== 'none' even when collapsed (max-height: 0, opacity: 0)
                const isVisible = !hasDisplayNone && !hasVisibilityHidden;
                
                return {
                    index: i + 1,
                    display,
                    visibility,
                    height,
                    hasDisplayNone,
                    hasVisibilityHidden,
                    isVisible, // true if not display:none and not visibility:hidden
                    isExpanded: height > 10 // Actually expanded (not just in DOM)
                };
            });
            
            // Check for critical content in DOM
            const h1 = document.querySelector('h1')?.textContent?.trim() || null;
            const price = document.querySelector('.price')?.textContent?.trim() || null;
            const productImage = document.querySelector('.main-hero-image, .hero-image img')?.src || null;
            
            return {
                ldjsonCount: ldjson.length,
                productSchemaCount: productSchemas.length,
                hasProductSchema: productSchemas.length > 0,
                hasFAQSchema: faqSchemas.length > 0 || ldjson.some(s => s.mainEntity?.['@type'] === 'FAQPage'),
                productSchema: productSchemas[0] || null,
                canonical,
                title,
                desc,
                h1,
                price,
                productImage: productImage ? 'present' : null,
                faqCount: faqAnswers.length,
                faqDisplays,
                allFaqsVisible: faqDisplays.every(f => f.isVisible),
                firstFaqVisible: faqDisplays[0]?.isVisible || false
            };
        });
        
        await browser.close();
        return results;
    } catch (error) {
        await browser.close();
        throw error;
    }
}

async function main() {
    const url = process.argv[2];
    if (!url) {
        console.error('❌ Usage: node validate-pdp-playwright.js <url>');
        console.error('   Example: node validate-pdp-playwright.js "http://localhost:8080/product/?sku=10786-807"');
        process.exit(1);
    }
    
    const jsonOnly = process.argv.includes('--json');
    
    if (!jsonOnly) {
        console.log('🔍 Playwright PDP SEO Validator\n');
        console.log(`Target URL: ${url}\n`);
        console.log('Loading page and waiting for JavaScript execution...\n');
    }
    
    try {
        const results = await validate(url);
        
        if (!jsonOnly) {
            console.log('📊 VALIDATION RESULTS\n');
            console.log('='.repeat(60));
        }
        
        if (!jsonOnly) {
            // Schema validation
            console.log('\n📋 Schema Markup:');
            console.log(`   JSON-LD scripts: ${results.ldjsonCount}`);
            console.log(`   Product schemas: ${results.productSchemaCount}`);
            console.log(`   Has Product schema: ${results.hasProductSchema ? '✅' : '❌'}`);
            console.log(`   Has FAQPage schema: ${results.hasFAQSchema ? '✅' : '⚠️  (optional)'}`);
            
            if (results.productSchemaCount > 1) {
                console.log(`   ⚠️  WARNING: ${results.productSchemaCount} Product schemas found (should be 1)`);
            }
            
            if (results.productSchema) {
                const schema = results.productSchema;
                console.log(`   Schema details:`);
                console.log(`     - Name: ${schema.name || 'missing'}`);
                console.log(`     - SKU: ${schema.sku || 'missing'}`);
                console.log(`     - Price: ${schema.offers?.price || 'missing'}`);
                console.log(`     - Images: ${Array.isArray(schema.image) ? schema.image.length : schema.image ? 1 : 0}`);
            }
            
            // Meta tags
            console.log('\n📄 Meta Tags:');
            console.log(`   Title: ${results.title ? '✅' : '❌'} ${results.title || 'Missing'}`);
            console.log(`   Description: ${results.desc ? '✅' : '❌'} ${results.desc ? `${results.desc.substring(0, 60)}...` : 'Missing'}`);
            console.log(`   Canonical: ${results.canonical ? '✅' : '❌'} ${results.canonical || 'Missing'}`);
            
            // Content
            console.log('\n📝 Content:');
            console.log(`   H1: ${results.h1 ? '✅' : '❌'} ${results.h1 || 'Missing'}`);
            console.log(`   Price: ${results.price ? '✅' : '❌'} ${results.price || 'Missing'}`);
            console.log(`   Product Image: ${results.productImage ? '✅' : '❌'}`);
            
        // FAQ
        console.log('\n❓ FAQ Visibility:');
        console.log(`   FAQ count: ${results.faqCount}`);
        if (results.faqDisplays.length > 0) {
            results.faqDisplays.forEach((faq, i) => {
                if (faq.hasDisplayNone || faq.hasVisibilityHidden) {
                    console.log(`   FAQ ${faq.index}: ❌ FAIL - ${faq.hasDisplayNone ? 'display:none' : 'visibility:hidden'} (content hidden from crawlers)`);
                } else {
                    const status = faq.isExpanded ? '✅' : '⚠️ ';
                    console.log(`   FAQ ${faq.index}: ${status} display=${faq.display}, height=${faq.height}px (${faq.isExpanded ? 'expanded' : 'collapsed but in DOM'})`);
                }
            });
            console.log(`   First FAQ visible: ${results.firstFaqVisible ? '✅' : '❌'}`);
            console.log(`   All FAQs in DOM (no display:none): ${results.allFaqsVisible ? '✅' : '❌'}`);
        } else {
            console.log('   ⚠️  No FAQs found (this is OK if product has no FAQs)');
        }
            
            // Summary
            console.log('\n' + '='.repeat(60));
            console.log('📊 SUMMARY\n');
        }
        
        const failures = [];
        if (!results.title) failures.push('Missing document.title');
        if (!results.desc) failures.push('Missing meta description');
        if (!results.canonical) failures.push('Missing canonical link');
        if (!results.hasProductSchema) failures.push('Missing Product JSON-LD');
        if (results.productSchemaCount > 1) failures.push(`Duplicate Product schemas (${results.productSchemaCount} found)`);
        
        // Check for display:none or visibility:hidden (SEO violation)
        if (results.faqCount > 0) {
            const hiddenFaqs = results.faqDisplays.filter(f => f.hasDisplayNone || f.hasVisibilityHidden);
            if (hiddenFaqs.length > 0) {
                hiddenFaqs.forEach(f => {
                    failures.push(`FAQ ${f.index} has ${f.hasDisplayNone ? 'display:none' : 'visibility:hidden'} (content must remain in DOM)`);
                });
            }
        }
        
        if (failures.length === 0) {
            console.log('✅ ALL CHECKS PASSED\n');
            console.log('The PDP meets all SEO requirements:');
            console.log('  ✅ Schema markup present and valid');
            console.log('  ✅ Meta tags complete');
            console.log('  ✅ Canonical URL set');
            console.log('  ✅ FAQ content visible');
        } else {
            console.log('❌ SOME CHECKS FAILED\n');
            console.log('Issues to fix:');
            failures.forEach(f => console.log(`  - ${f}`));
        }
        
        console.log('\n' + '='.repeat(60));
        
        // Return structured JSON for CI/CD
        const output = {
            url,
            pass: failures.length === 0,
            failures,
            results: {
                schema: {
                    count: results.ldjsonCount,
                    productCount: results.productSchemaCount,
                    hasProduct: results.hasProductSchema,
                    hasFAQ: results.hasFAQSchema
                },
                meta: {
                    title: !!results.title,
                    description: !!results.desc,
                    canonical: !!results.canonical
                },
                content: {
                    h1: !!results.h1,
                    price: !!results.price,
                    image: !!results.productImage
                },
                faq: {
                    count: results.faqCount,
                    firstVisible: results.firstFaqVisible,
                    allVisible: results.allFaqsVisible
                }
            }
        };
        
        // Output JSON for programmatic use
        if (jsonOnly) {
            // JSON-only mode: output only JSON, no console logs
            console.log(JSON.stringify(output, null, 2));
        } else {
            // Normal mode: show summary and optionally JSON
            if (failures.length === 0) {
                console.log('✅ ALL CHECKS PASSED\n');
                console.log('The PDP meets all SEO requirements:');
                console.log('  ✅ Schema markup present and valid');
                console.log('  ✅ Meta tags complete');
                console.log('  ✅ Canonical URL set');
                console.log('  ✅ FAQ content visible');
            } else {
                console.log('❌ SOME CHECKS FAILED\n');
                console.log('Issues to fix:');
                failures.forEach(f => console.log(`  - ${f}`));
            }
            
            console.log('\n' + '='.repeat(60));
        }
        
        process.exit(failures.length === 0 ? 0 : 1);
    } catch (error) {
        console.error('\n❌ Validation Error:', error.message);
        if (error.message.includes('net::ERR_CONNECTION_REFUSED')) {
            console.error('\n💡 Make sure the server is running on the specified URL');
        }
        process.exit(1);
    }
}

main();
