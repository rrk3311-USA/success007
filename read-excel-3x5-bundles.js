// Script to read the 3x5 bundles Excel file
import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Find the file
let excelFile = null;
try {
    const found = execSync(`find "${process.env.HOME}/Desktop" -name "Womens_Balance_3x5_SEO_Bundles.xlsx" 2>/dev/null | head -1`, { encoding: 'utf-8' }).trim();
    if (found) {
        excelFile = found;
    }
} catch (e) {}

if (!excelFile) {
    excelFile = path.join(process.env.HOME, 'Desktop', 'Walmart 2026 Bundles /Womens Balance Formula/Womens_Balance_3x5_SEO_Bundles.xlsx');
}

console.log('📖 Reading Excel file:', excelFile);
console.log('');

try {
    const workbook = XLSX.readFile(excelFile);
    const sheetNames = workbook.SheetNames;
    
    console.log('📋 Found sheets:', sheetNames.join(', '));
    console.log('');
    
    const allData = {};
    sheetNames.forEach((sheetName) => {
        console.log(`\n📄 Sheet: ${sheetName}`);
        console.log('='.repeat(50));
        
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
        
        allData[sheetName] = data;
        
        if (data.length > 0) {
            console.log(`Found ${data.length} rows`);
            console.log('\nColumns:', Object.keys(data[0]).join(', '));
            console.log('\nAll rows:');
            console.log(JSON.stringify(data, null, 2));
        }
    });
    
    const outputFile = path.join(__dirname, 'bundle-3x5-data-extracted.json');
    fs.writeFileSync(outputFile, JSON.stringify(allData, null, 2));
    console.log(`\n✅ Data saved to: ${outputFile}`);
    
} catch (error) {
    console.error('❌ Error:', error.message);
}
