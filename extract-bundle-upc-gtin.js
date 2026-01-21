// Extract UPC/GTIN from Walmart files for bundles
import fs from 'fs';

const files = [
    './walmart-bundle-1-extracted.json',
    './walmart-bundle-2-extracted.json'
];

function findBundleData(data, skuPattern) {
    const results = [];
    
    // Data structure: { sheetName: [rows...] }
    Object.keys(data).forEach(sheetName => {
        const rows = data[sheetName];
        if (Array.isArray(rows)) {
            rows.forEach((row, idx) => {
                const rowStr = JSON.stringify(row).toLowerCase();
                if (rowStr.includes(skuPattern.toLowerCase())) {
                    // Find SKU, UPC, GTIN columns
                    const sku = Object.keys(row).find(k => 
                        k.toLowerCase().includes('sku') && row[k] && row[k].toString().includes(skuPattern)
                    ) ? row[Object.keys(row).find(k => k.toLowerCase().includes('sku'))] : null;
                    
                    // Try to find UPC/GTIN in any column
                    let upc = null;
                    let gtin = null;
                    
                    Object.keys(row).forEach(k => {
                        const val = String(row[k] || '').trim();
                        // Look for UPC/GTIN patterns (12-14 digit numbers)
                        if (/^\d{12,14}$/.test(val)) {
                            if (!upc) upc = val;
                            if (!gtin) gtin = val;
                        }
                        // Also check column names
                        if (k.toLowerCase().includes('upc') && val) {
                            upc = val;
                        }
                        if (k.toLowerCase().includes('gtin') && val) {
                            gtin = val;
                        }
                    });
                    
                    if (sku || rowStr.includes(skuPattern)) {
                        // Show all column values for debugging
                        if (!upc && !gtin) {
                            console.log(`\n⚠️  No UPC/GTIN found for ${skuPattern} in row ${idx + 1}`);
                            console.log('   Available columns:', Object.keys(row).slice(0, 10).join(', '));
                            // Show first few non-empty values
                            const sample = Object.keys(row).slice(0, 15).map(k => `${k}: ${String(row[k] || '').substring(0, 50)}`).filter(v => v.split(':')[1].trim()).join('\n   ');
                            if (sample) console.log('   Sample values:\n   ' + sample);
                        }
                        
                        results.push({
                            sheet: sheetName,
                            row: idx + 1,
                            sku: sku || skuPattern,
                            upc: upc || null,
                            gtin: gtin || upc || null,
                            allData: row
                        });
                    }
                }
            });
        }
    });
    
    return results;
}

console.log('🔍 Extracting UPC/GTIN for Women\'s Balance Bundles\n');
console.log('='.repeat(60));

const bundleData = {};

files.forEach(filePath => {
    if (!fs.existsSync(filePath)) {
        console.log(`⚠️  File not found: ${filePath}`);
        return;
    }
    
    try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        console.log(`\n📄 Reading: ${filePath}`);
        
        // Look for different SKU patterns
        const patterns = ['52274-401-2', '52274-401-3', '52274-401-4', '52274-401-5', '52274-401-2pack', '52274-401-3pack', '52274-401-4pack', '52274-401-5pack'];
        
        patterns.forEach(pattern => {
            const found = findBundleData(data, pattern);
            if (found.length > 0) {
                found.forEach(item => {
                    const sku = item.sku || pattern;
                    if (!bundleData[sku]) {
                        bundleData[sku] = item;
                    }
                });
            }
        });
        
    } catch (error) {
        console.log(`❌ Error reading ${filePath}: ${error.message}`);
    }
});

console.log(`\n\n📦 Found Bundle Data:\n`);
Object.keys(bundleData).forEach(sku => {
    const item = bundleData[sku];
    console.log(`SKU: ${sku}`);
    console.log(`  UPC: ${item.upc || 'NOT FOUND'}`);
    console.log(`  GTIN: ${item.gtin || 'NOT FOUND'}`);
    console.log(`  Sheet: ${item.sheet}, Row: ${item.row}`);
    console.log('');
});

// Save to a simple lookup file
const lookup = {};
Object.keys(bundleData).forEach(sku => {
    const item = bundleData[sku];
    lookup[sku] = {
        upc: item.upc || null,
        gtin: item.gtin || null
    };
});

fs.writeFileSync('./bundle-upc-gtin-lookup.json', JSON.stringify(lookup, null, 2));
console.log('✅ Saved lookup to: bundle-upc-gtin-lookup.json');
