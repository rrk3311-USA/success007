// Script to read Excel files and extract bundle information
// This will help us get the 5-pack women's multi data

import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try both possible paths (with and without space variations)
const possiblePaths = [
    path.join(process.env.HOME, 'Desktop', 'Walmart 2026 Bundles ', 'Womens Balance Formula', 'Womens_Balance_5_SEO_Versions.xlsx'),
    path.join(process.env.HOME, 'Desktop', 'Walmart 2026 Bundles', 'Womens Balance Formula', 'Womens_Balance_5_SEO_Versions.xlsx'),
    path.join(process.env.HOME, 'Desktop', 'Walmart 2026 Bundles /Womens Balance Formula/Womens_Balance_5_SEO_Versions.xlsx'),
];

let excelFile = null;
for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
        excelFile = p;
        break;
    }
}

if (!excelFile) {
    // Try to find it
    console.log('🔍 Searching for file...');
    const { execSync } = require('child_process');
    try {
        const found = execSync(`find "${process.env.HOME}/Desktop" -name "Womens_Balance_5_SEO_Versions.xlsx" 2>/dev/null | head -1`, { encoding: 'utf-8' }).trim();
        if (found) {
            excelFile = found;
            console.log('✅ Found:', excelFile);
        }
    } catch (e) {}
}

console.log('📖 Reading Excel file:', excelFile);
console.log('');

try {
    // Read the Excel file
    const workbook = XLSX.readFile(excelFile);
    
    // Get all sheet names
    const sheetNames = workbook.SheetNames;
    console.log('📋 Found sheets:', sheetNames.join(', '));
    console.log('');
    
    // Read each sheet
    sheetNames.forEach((sheetName, index) => {
        console.log(`\n📄 Sheet ${index + 1}: ${sheetName}`);
        console.log('='.repeat(50));
        
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
        
        if (data.length > 0) {
            console.log(`Found ${data.length} rows`);
            console.log('\nColumns:', Object.keys(data[0]).join(', '));
            console.log('\nFirst few rows:');
            console.log(JSON.stringify(data.slice(0, 3), null, 2));
        } else {
            console.log('Sheet is empty');
        }
    });
    
    // Save as JSON for easier processing
    const outputFile = path.join(__dirname, 'bundle-data-extracted.json');
    const allData = {};
    sheetNames.forEach(sheetName => {
        const worksheet = workbook.Sheets[sheetName];
        allData[sheetName] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
    });
    
    fs.writeFileSync(outputFile, JSON.stringify(allData, null, 2));
    console.log(`\n✅ Data saved to: ${outputFile}`);
    
} catch (error) {
    console.error('❌ Error reading file:', error.message);
    console.log('\n💡 Trying alternative method...');
    
    // Try to read as text (might work for some Excel formats)
    try {
        const fileContent = fs.readFileSync(excelFile);
        console.log('File size:', fileContent.length, 'bytes');
        console.log('File type: Excel (XLSX)');
        console.log('\n⚠️  Need xlsx package to read. Install with: npm install xlsx');
    } catch (err) {
        console.error('Could not read file:', err.message);
    }
}
