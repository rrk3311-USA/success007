/**
 * Read Nutritional Supplement Spreadsheet Structure
 * 
 * Reads the NUTRITIONAL_SUPPLEMENT.xlsm file to understand its structure
 * before filling it with product data.
 * 
 * Usage:
 *   node read-nutritional-sheet.js
 */

import XLSX from 'xlsx';
import fs from 'fs';

const spreadsheetPath = '/Users/r-kammer/Downloads/NUTRITIONAL_SUPPLEMENT.xlsm';

if (!fs.existsSync(spreadsheetPath)) {
    console.error(`❌ Spreadsheet not found: ${spreadsheetPath}`);
    process.exit(1);
}

console.log('📖 Reading spreadsheet structure...');
console.log('='.repeat(70));
console.log('');

try {
    const workbook = XLSX.readFile(spreadsheetPath, { cellDates: true });
    const sheetNames = workbook.SheetNames;
    
    console.log(`✅ Found ${sheetNames.length} sheet(s): ${sheetNames.join(', ')}`);
    console.log('');
    
    sheetNames.forEach((sheetName, index) => {
        console.log(`\n${'='.repeat(70)}`);
        console.log(`Sheet ${index + 1}: ${sheetName}`);
        console.log('='.repeat(70));
        
        const worksheet = workbook.Sheets[sheetName];
        
        // Get all data as JSON (array of arrays)
        const data = XLSX.utils.sheet_to_json(worksheet, { 
            defval: '', 
            header: 1,
            raw: false 
        });
        
        console.log(`\n📊 Found ${data.length} rows`);
        
        if (data.length > 0) {
            // Show first 20 rows to understand structure
            console.log('\n📋 First 20 rows:');
            console.log('-'.repeat(70));
            
            data.slice(0, 20).forEach((row, idx) => {
                const rowData = row.filter(cell => cell !== '' && cell !== null && cell !== undefined);
                if (rowData.length > 0) {
                    console.log(`\nRow ${idx + 1}:`);
                    row.forEach((cell, colIdx) => {
                        if (cell !== '' && cell !== null && cell !== undefined) {
                            const colLetter = XLSX.utils.encode_col(colIdx);
                            console.log(`  ${colLetter}${idx + 1}: ${String(cell).substring(0, 100)}`);
                        }
                    });
                }
            });
            
            // Also show as JSON for easier understanding
            console.log('\n📋 As JSON (first 10 rows):');
            console.log(JSON.stringify(data.slice(0, 10), null, 2));
        } else {
            console.log('Sheet is empty');
        }
        
        // Get cell range
        if (worksheet['!ref']) {
            console.log(`\n📍 Cell range: ${worksheet['!ref']}`);
        }
    });
    
    console.log('\n' + '='.repeat(70));
    console.log('✅ Structure analysis complete!');
    console.log('='.repeat(70));
    
} catch (error) {
    console.error('❌ Error reading spreadsheet:', error.message);
    console.error(error.stack);
    process.exit(1);
}
