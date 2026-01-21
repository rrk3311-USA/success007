// Read the Walmart upload files to get bundle information
import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Find the files
const files = [
    path.join(process.env.HOME, 'Desktop', 'Walmart 2026 Bundles /Womens Balance Formula/Walmart files uppload for womans/READY_omni-marketplace-en-external-5.0.xlsx'),
    path.join(process.env.HOME, 'Desktop', 'Walmart 2026 Bundles /Womens Balance Formula/Walmart files uppload for womans/2ndomni-marketplace-en-external-5.0.xlsx'),
];

console.log('📖 Reading Walmart Upload Files for Women\'s Multivitamin 5-Pack...\n');

files.forEach((filePath, index) => {
    const fileName = path.basename(filePath);
    console.log(`\n${'='.repeat(60)}`);
    console.log(`File ${index + 1}: ${fileName}`);
    console.log('='.repeat(60));
    
    if (!fs.existsSync(filePath)) {
        console.log('❌ File not found');
        return;
    }
    
    try {
        const workbook = XLSX.readFile(filePath);
        const sheetNames = workbook.SheetNames;
        
        console.log(`📋 Found ${sheetNames.length} sheet(s): ${sheetNames.join(', ')}\n`);
        
        sheetNames.forEach((sheetName) => {
            console.log(`\n📄 Sheet: "${sheetName}"`);
            console.log('-'.repeat(60));
            
            const worksheet = workbook.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
            
            if (data.length > 0) {
                console.log(`Found ${data.length} row(s)`);
                console.log(`\nColumns: ${Object.keys(data[0]).join(', ')}`);
                
                // Show all rows
                data.forEach((row, idx) => {
                    console.log(`\n--- Row ${idx + 1} ---`);
                    Object.keys(row).forEach(key => {
                        const value = row[key];
                        if (value && value.toString().trim()) {
                            // Truncate very long values
                            const displayValue = value.toString().length > 200 
                                ? value.toString().substring(0, 200) + '...' 
                                : value.toString();
                            console.log(`${key}: ${displayValue}`);
                        }
                    });
                });
            } else {
                console.log('Sheet is empty');
            }
        });
        
        // Save to JSON
        const outputFile = path.join(__dirname, `walmart-bundle-${index + 1}-extracted.json`);
        const allData = {};
        sheetNames.forEach(sheetName => {
            const worksheet = workbook.Sheets[sheetName];
            allData[sheetName] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
        });
        
        fs.writeFileSync(outputFile, JSON.stringify(allData, null, 2));
        console.log(`\n✅ Data saved to: ${path.basename(outputFile)}`);
        
    } catch (error) {
        console.error(`❌ Error reading ${fileName}:`, error.message);
    }
});

console.log('\n\n✨ Done! Check the extracted JSON files for bundle information.');
