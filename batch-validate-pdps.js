#!/usr/bin/env node
/**
 * Batch PDP Validation Script
 * 
 * Validates multiple product pages and generates reports.
 * 
 * Usage:
 *   node batch-validate-pdps.js urls.txt
 *   node batch-validate-pdps.js --base http://localhost:8080 --skus 10786-807,20647-507
 *   node batch-validate-pdps.js --base http://localhost:8080 --all
 * 
 * Output:
 *   validation_reports/report.json (full details)
 *   validation_reports/report.csv (exec-friendly)
 */

import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function parseArgs() {
    const args = process.argv.slice(2);
    const out = { urlsFile: null, base: null, skus: null, all: false };

    if (!args.length) {
        console.error('Usage:');
        console.error('  node batch-validate-pdps.js urls.txt');
        console.error('  node batch-validate-pdps.js --base <url> --skus <csv>');
        console.error('  node batch-validate-pdps.js --base <url> --all');
        process.exit(1);
    }

    if (args[0] && !args[0].startsWith('--') && args[0].endsWith('.txt')) {
        out.urlsFile = args[0];
        return out;
    }

    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--base') out.base = args[++i];
        if (args[i] === '--skus') out.skus = args[++i];
        if (args[i] === '--all') out.all = true;
    }
    return out;
}

function loadUrls({ urlsFile, base, skus, all }) {
    if (urlsFile) {
        const filePath = path.isAbsolute(urlsFile) ? urlsFile : path.join(process.cwd(), urlsFile);
        return fs.readFileSync(filePath, 'utf8')
            .split('\n')
            .map(l => l.trim())
            .filter(l => l && !l.startsWith('#'));
    }
    
    if (base && all) {
        // Load all SKUs from products-data.js
        try {
            const productsDataPath = path.join(__dirname, 'deploy-site', 'products-data.js');
            const productsContent = fs.readFileSync(productsDataPath, 'utf8');
            
            // Extract SKUs from PRODUCTS_DATA object
            // Filter out non-SKU keys like "seo_targets", "key_search_terms", etc.
            const skuMatches = productsContent.matchAll(/"([^"]+)"\s*:\s*{/g);
            const excludeKeys = ['seo_targets', 'key_search_terms', 'mainEntity', 'offers', 'brand'];
            const skusList = Array.from(skuMatches, m => m[1])
                .filter(sku => {
                    // Valid SKUs are typically: alphanumeric with dashes, 5+ chars, not excluded keys
                    return sku.length >= 5 && 
                           /^[A-Za-z0-9\-_]+$/.test(sku) &&
                           !excludeKeys.includes(sku) &&
                           !sku.includes('target') &&
                           !sku.includes('search') &&
                           !sku.includes('Entity');
                });
            
            console.log(`📦 Found ${skusList.length} products in products-data.js`);
            return skusList.map(sku => `${base.replace(/\/$/, '')}/product/${sku}`);
        } catch (error) {
            console.error('❌ Error loading products:', error.message);
            process.exit(1);
        }
    }
    
    if (base && skus) {
        return skus.split(',').map(s => `${base.replace(/\/$/, '')}/product/${s.trim()}`);
    }
    
    throw new Error('Provide either: urls.txt file, --base + --skus, or --base + --all');
}

function toCsv(rows) {
    const headers = [
        'url',
        'pass',
        'failures',
        'ldjsonCount',
        'productSchemaCount',
        'hasProductSchema',
        'hasFAQSchema',
        'canonical',
        'title',
        'descLen',
        'h1',
        'price',
        'faqCount',
        'firstFaqVisible'
    ];
    
    const escape = (v) => `"${String(v ?? '').replaceAll('"', '""')}"`;
    const lines = [headers.join(',')];

    for (const r of rows) {
        lines.push(
            [
                r.url,
                r.pass,
                (r.failures || []).join('; '),
                r.results?.schema?.count || 0,
                r.results?.schema?.productCount || 0,
                r.results?.schema?.hasProduct || false,
                r.results?.schema?.hasFAQ || false,
                r.results?.meta?.canonical ? 'yes' : 'no',
                r.results?.meta?.title ? 'yes' : 'no',
                (r.results?.meta?.description ? 1 : 0),
                r.results?.content?.h1 ? 'yes' : 'no',
                r.results?.content?.price ? 'yes' : 'no',
                r.results?.faq?.count || 0,
                r.results?.faq?.firstVisible || false
            ].map(escape).join(',')
        );
    }
    return lines.join('\n');
}

async function main() {
    const args = parseArgs();
    let urls;
    
    try {
        urls = loadUrls(args);
    } catch (error) {
        console.error('❌ Error loading URLs:', error.message);
        process.exit(1);
    }
    
    if (urls.length === 0) {
        console.error('❌ No URLs to validate');
        process.exit(1);
    }
    
    console.log(`\n🔍 Batch Validating ${urls.length} PDP(s)\n`);
    console.log('='.repeat(60));
    
    const results = [];
    let anyFail = false;
    let passCount = 0;
    let failCount = 0;

    for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        const progress = `[${i + 1}/${urls.length}]`;
        
        process.stdout.write(`${progress} Validating ${url}... `);
        
        const proc = spawnSync('node', [path.join(__dirname, 'validate-pdp-playwright.js'), url, '--json'], {
            encoding: 'utf8',
            cwd: __dirname
        });

        let json = null;
        try {
            // Extract JSON from stdout (may have console.log before it)
            const stdout = proc.stdout.trim();
            const jsonMatch = stdout.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                json = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error('No JSON found in output');
            }
        } catch (parseError) {
            json = {
                url,
                pass: false,
                failures: [
                    'Validator did not return valid JSON',
                    proc.stderr?.trim(),
                    parseError.message
                ].filter(Boolean),
                rawStdout: proc.stdout.substring(0, 500),
                rawStderr: proc.stderr?.substring(0, 500)
            };
        }

        if (!json.pass) {
            anyFail = true;
            failCount++;
            console.log(`❌ FAIL`);
            if (json.failures && json.failures.length > 0) {
                json.failures.forEach(f => console.log(`   - ${f}`));
            }
        } else {
            passCount++;
            console.log(`✅ PASS`);
        }
        
        results.push(json);
    }

    // Create reports directory
    const outDir = path.join(process.cwd(), 'validation_reports');
    fs.mkdirSync(outDir, { recursive: true });

    // Write reports
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    const jsonPath = path.join(outDir, `report-${timestamp}.json`);
    const csvPath = path.join(outDir, `report-${timestamp}.csv`);
    
    fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2));
    fs.writeFileSync(csvPath, toCsv(results));
    
    // Also write latest symlinks
    fs.writeFileSync(path.join(outDir, 'report.json'), JSON.stringify(results, null, 2));
    fs.writeFileSync(path.join(outDir, 'report.csv'), toCsv(results));

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 BATCH VALIDATION SUMMARY\n');
    console.log(`Total PDPs: ${urls.length}`);
    console.log(`✅ Passed: ${passCount}`);
    console.log(`❌ Failed: ${failCount}`);
    console.log(`\nReports saved to:`);
    console.log(`  📄 ${jsonPath}`);
    console.log(`  📊 ${csvPath}`);
    console.log(`  📄 ${path.join(outDir, 'report.json')} (latest)`);
    console.log(`  📊 ${path.join(outDir, 'report.csv')} (latest)`);

    if (anyFail) {
        console.error('\n❌ One or more PDPs failed validation.');
        console.error('See validation_reports/report.json for details.');
        process.exit(1);
    } else {
        console.log('\n✅ All PDPs passed validation!');
        process.exit(0);
    }
}

main().catch(error => {
    console.error('❌ Fatal error:', error.message);
    console.error(error.stack);
    process.exit(1);
});
