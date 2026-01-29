#!/usr/bin/env node
/**
 * Add Google Analytics 4 tracking to all multilingual blog posts
 * Adds gtag.js script to <head> section of each blog HTML file
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// GA4 Measurement ID from config.js
const GA4_MEASUREMENT_ID = 'G-WNZH4JKEL5';

// Google Analytics 4 tracking code
const GA4_TRACKING_CODE = `
    <!-- Google Analytics 4 -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA4_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
            page_title: document.title
        });
    </script>`;

// Blog directories to process
const blogDirs = [
    'deploy-site/blog-md',           // English
    'deploy-site/blog-md/es',        // Spanish
    'deploy-site/blog-md/fr',        // French
    'deploy-site/blog-md/de'         // German
];

let totalFilesProcessed = 0;
let totalFilesUpdated = 0;

// Process each language directory
blogDirs.forEach(dir => {
    const dirPath = path.join(__dirname, dir);
    
    if (!fs.existsSync(dirPath)) {
        console.log(`⚠️  Directory not found: ${dir}`);
        return;
    }
    
    // Get all HTML files in directory
    const files = fs.readdirSync(dirPath).filter(file => file.endsWith('.html'));
    
    console.log(`\n📁 Processing ${dir}/ (${files.length} files)`);
    
    files.forEach(file => {
        const filePath = path.join(dirPath, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        totalFilesProcessed++;
        
        // Check if GA4 tracking already exists
        if (content.includes('googletagmanager.com/gtag/js') || content.includes(GA4_MEASUREMENT_ID)) {
            console.log(`   ✓ ${file} - Already has GA4 tracking`);
            return;
        }
        
        // Insert GA4 tracking code right after <meta name="robots"...> or before </head>
        const robotsMetaMatch = content.match(/(<meta name="robots"[^>]*>)/);
        
        if (robotsMetaMatch) {
            // Insert after robots meta tag
            content = content.replace(
                robotsMetaMatch[0],
                robotsMetaMatch[0] + GA4_TRACKING_CODE
            );
        } else {
            // Fallback: Insert before </head>
            content = content.replace('</head>', `${GA4_TRACKING_CODE}\n</head>`);
        }
        
        // Write updated content back to file
        fs.writeFileSync(filePath, content, 'utf8');
        totalFilesUpdated++;
        console.log(`   ✅ ${file} - GA4 tracking added`);
    });
});

console.log('\n' + '='.repeat(60));
console.log(`✅ Complete! Processed ${totalFilesProcessed} files`);
console.log(`   📊 Updated: ${totalFilesUpdated} files`);
console.log(`   ⏭️  Skipped: ${totalFilesProcessed - totalFilesUpdated} files (already had tracking)`);
console.log('='.repeat(60));
console.log(`\n🎯 GA4 Measurement ID: ${GA4_MEASUREMENT_ID}`);
console.log('\n📈 Next Steps:');
console.log('   1. Commit and push changes');
console.log('   2. Verify in Google Analytics Real-Time reports');
console.log('   3. Check Tag Assistant Chrome extension');
console.log('   4. Monitor page views in GA4 dashboard\n');
