/**
 * Fill Nutritional Supplement Spreadsheet
 * 
 * Reads the NUTRITIONAL_SUPPLEMENT.xlsm file and fills it with
 * Women's Balance 2-Pack product data.
 * 
 * Usage:
 *   node fill-nutritional-supplement-sheet.js
 */

import XLSX from 'xlsx';
import fs from 'fs';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to the spreadsheet
const spreadsheetPath = '/Users/r-kammer/Downloads/NUTRITIONAL_SUPPLEMENT.xlsm';

// Load product data
let PRODUCTS_DATA;
try {
    const productsPath = join(__dirname, 'deploy-site', 'products-data.js');
    const productsContent = readFileSync(productsPath, 'utf8');
    const modifiedContent = productsContent.replace(/^const PRODUCTS_DATA/, 'var PRODUCTS_DATA') + '\nPRODUCTS_DATA;';
    const func = new Function(modifiedContent + '\nreturn PRODUCTS_DATA;');
    PRODUCTS_DATA = func();
} catch (err) {
    console.error('❌ Could not load products-data.js:', err.message);
    process.exit(1);
}

// Get base product (single pack) and calculate 2-pack data
const baseProduct = PRODUCTS_DATA['52274-401'];
if (!baseProduct) {
    console.error('❌ Product 52274-401 (Women\'s Balance) not found');
    process.exit(1);
}

// Create 2-pack product data
const twoPackProduct = {
    sku: '52274-401-2pack',
    name: baseProduct.name.replace('60 Capsules', '2-Pack - 120 Capsules Total'),
    baseProduct: baseProduct,
    totalCapsules: 120,
    bottles: 2,
    servingsPerBottle: 30,
    totalServings: 60,
    servingSize: '2 Capsules',
    price: baseProduct.price * 2 * 0.93, // ~7% discount for 2-pack
    weight: '6oz', // 2x 3oz
    dimensions: '4 inches wide x 3.5 inches tall',
    upc: baseProduct.upc || '',
    gtin: baseProduct.gtin || baseProduct.upc || ''
};

console.log('='.repeat(70));
console.log('Fill Nutritional Supplement Spreadsheet');
console.log('='.repeat(70));
console.log('');
console.log(`Product: ${twoPackProduct.name}`);
console.log(`SKU: ${twoPackProduct.sku}`);
console.log(`Total Capsules: ${twoPackProduct.totalCapsules}`);
console.log(`Bottles: ${twoPackProduct.bottles}`);
console.log(`Total Servings: ${twoPackProduct.totalServings}`);
console.log('');

// Read the spreadsheet
if (!fs.existsSync(spreadsheetPath)) {
    console.error(`❌ Spreadsheet not found: ${spreadsheetPath}`);
    process.exit(1);
}

console.log('📖 Reading spreadsheet...');
let workbook;
try {
    workbook = XLSX.readFile(spreadsheetPath, { cellDates: true });
} catch (error) {
    console.error('❌ Error reading spreadsheet:', error.message);
    process.exit(1);
}

const sheetNames = workbook.SheetNames;
console.log(`✅ Found ${sheetNames.length} sheet(s)`);
console.log('');

// Get the Template sheet
const templateSheet = workbook.Sheets['Template'];
if (!templateSheet) {
    console.error('❌ Template sheet not found');
    process.exit(1);
}

// Row 4 has headers, Row 5 is where we fill data
const dataRow = 5; // 1-indexed in Excel, but XLSX uses 0-indexed for arrays

// Parse supplement facts
function parseSupplementFacts(factsText) {
    const facts = {};
    const lines = factsText.split('\n').map(l => l.trim()).filter(l => l);
    
    for (const line of lines) {
        const match = line.match(/^(.+?)\s*-\s*(.+)$/);
        if (match) {
            const name = match[1].trim();
            const value = match[2].trim();
            facts[name] = value;
        }
    }
    
    return facts;
}

const supplementFacts = parseSupplementFacts(baseProduct.supplement_facts);

// Helper function to set cell value
function setCell(sheet, col, row, value) {
    const cellAddress = XLSX.utils.encode_cell({ r: row - 1, c: col - 1 }); // Convert to 0-indexed
    if (!sheet[cellAddress]) {
        sheet[cellAddress] = { t: 's', v: String(value) };
    } else {
        sheet[cellAddress].v = String(value);
        sheet[cellAddress].t = 's';
    }
    console.log(`✅ Filled ${XLSX.utils.encode_col(col - 1)}${row}: ${String(value).substring(0, 50)}...`);
}

// Fill the template with product data
console.log('📝 Filling template with product data...\n');

// Column mappings (based on row 4 headers)
// A=1, B=2, C=3, D=4, E=5, F=6, G=7, H=8, I=9, J=10, K=11, etc.

// Listing Identity (Row 4, columns A-C)
setCell(templateSheet, 1, dataRow, twoPackProduct.sku); // A5: SKU
setCell(templateSheet, 2, dataRow, 'HEALTH_PERSONAL_CARE'); // B5: Product Type (Nutritional Supplements)
setCell(templateSheet, 3, dataRow, 'Update'); // C5: Listing Action

// Product Identity (Row 4, columns G-T)
setCell(templateSheet, 7, dataRow, twoPackProduct.name); // G5: Item Name
setCell(templateSheet, 8, dataRow, 'Success Chemistry'); // H5: Brand Name
setCell(templateSheet, 9, dataRow, 'UPC'); // I5: Product Id Type
setCell(templateSheet, 10, dataRow, twoPackProduct.upc || twoPackProduct.gtin); // J5: Product Id
setCell(templateSheet, 11, dataRow, 'Dietary Supplements'); // K5: Item Type Keyword (may need to check valid values)
setCell(templateSheet, 18, dataRow, 'Success Chemistry'); // R5: Manufacturer

// Images (Row 4, columns U-AD)
const baseUrl = 'https://successchemistry.com';
if (baseProduct.images && baseProduct.images.length > 0) {
    setCell(templateSheet, 21, dataRow, baseUrl + baseProduct.images[0]); // U5: Main Image URL
    
    // Fill additional images (V5-AC5)
    for (let i = 1; i < Math.min(9, baseProduct.images.length); i++) {
        const col = 22 + (i - 1); // V=22, W=23, etc.
        setCell(templateSheet, col, dataRow, baseUrl + baseProduct.images[i]);
    }
}

// Product Details (Row 4, columns AE-AJ)
setCell(templateSheet, 31, dataRow, baseProduct.description.substring(0, 2000)); // AE5: Product Description

// Bullet Points (AF5-AJ5)
const bullets = [
    `2-Pack Value Bundle - ${twoPackProduct.totalCapsules} capsules total (${twoPackProduct.bottles} bottles)`,
    `Premium female libido enhancement with L-Arginine, Maca Root, Ashwagandha, and Korean Ginseng`,
    `Supports natural arousal, energy levels, and hormonal balance for women`,
    `${twoPackProduct.totalServings} servings total - ${twoPackProduct.servingsPerBottle} servings per bottle`,
    `Made in USA - Non-GMO, Vegetarian capsules, GMP-certified facility`
];

for (let i = 0; i < Math.min(5, bullets.length); i++) {
    setCell(templateSheet, 32 + i, dataRow, bullets[i]); // AF5-AJ5: Bullet Points
}

// Target Gender (AQ5)
setCell(templateSheet, 43, dataRow, 'Female'); // AQ5: Target Gender

// Number of Items (AX5)
setCell(templateSheet, 50, dataRow, twoPackProduct.bottles.toString()); // AX5: Number of Items

// Item Package Quantity (AY5)
setCell(templateSheet, 51, dataRow, twoPackProduct.totalCapsules.toString()); // AY5: Item Package Quantity

// Serving Quantity (CD5)
setCell(templateSheet, 82, dataRow, '2'); // CD5: Serving Quantity (2 capsules per serving)

// Serving Quantity Unit (CE5)
setCell(templateSheet, 83, dataRow, 'capsules'); // CE5: Serving Quantity Unit

// Fill nutritional information from supplement facts
// Note: The spreadsheet has many nutritional fields. We'll fill the key ones.
// You may need to adjust column numbers based on the actual spreadsheet structure.

console.log('\n📊 Supplement Facts to fill:');
Object.entries(supplementFacts).forEach(([name, value]) => {
    console.log(`   ${name}: ${value}`);
});

console.log('\n⚠️  Note: Nutritional information columns may need manual mapping.');
console.log('   Please review the filled spreadsheet and adjust as needed.');

// Update the sheet reference range
const range = XLSX.utils.decode_range(templateSheet['!ref'] || 'A1:Z100');
range.e.r = Math.max(range.e.r, dataRow - 1); // Extend range to include data row
templateSheet['!ref'] = XLSX.utils.encode_range(range);

// Save the filled spreadsheet
const outputPath = '/Users/r-kammer/Downloads/NUTRITIONAL_SUPPLEMENT_FILLED.xlsm';
try {
    XLSX.writeFile(workbook, outputPath);
    console.log('\n✅ Filled spreadsheet saved to:');
    console.log(`   ${outputPath}`);
    console.log('');
    console.log('📝 Next steps:');
    console.log('   1. Open the filled spreadsheet');
    console.log('   2. Review all fields and adjust as needed');
    console.log('   3. Fill in any missing nutritional information');
    console.log('   4. Verify Item Type Keyword matches Amazon\'s valid values');
    console.log('   5. Check that all required fields are filled');
    console.log('   6. Upload to Amazon Seller Central');
} catch (error) {
    console.error('❌ Error saving spreadsheet:', error.message);
    process.exit(1);
}
