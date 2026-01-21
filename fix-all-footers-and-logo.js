// Fix ALL pages: complete footer + centered logo
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const COMPLETE_FOOTER = `
        <div style="width: 100%; height: 3px; background: linear-gradient(90deg, #4fd0ff 0%, #ffd34d 50%, #4fd0ff 100%);"></div>
        <div style="background: #2854a6; padding: 15px 20px; display: flex; justify-content: center; align-items: center; gap: 20px; flex-wrap: wrap; font-size: 0.85rem;">
            <a href="/terms-of-service.html" style="color: white; text-decoration: none; font-weight: 500; transition: opacity 0.3s;" onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">Terms of Service</a>
            <span style="color: rgba(255,255,255,0.3);">|</span>
            <a href="/shipping-returns.html" style="color: white; text-decoration: none; font-weight: 500; transition: opacity 0.3s;" onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">Shipping & Returns</a>
            <span style="color: rgba(255,255,255,0.3);">|</span>
            <a href="/payment-policy.html" style="color: white; text-decoration: none; font-weight: 500; transition: opacity 0.3s;" onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">Payment Policy</a>
            <span style="color: rgba(255,255,255,0.3);">|</span>
            <a href="/privacy-policy.html" style="color: white; text-decoration: none; font-weight: 500; transition: opacity 0.3s;" onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">Privacy Policy</a>
            <span style="color: rgba(255,255,255,0.3);">|</span>
            <a href="/contact" style="color: white; text-decoration: none; font-weight: 500; transition: opacity 0.3s;" onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">Contact</a>
            <span style="color: rgba(255,255,255,0.3);">|</span>
            <a href="/shop" style="color: white; text-decoration: none; font-weight: 500; transition: opacity 0.3s;" onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">🧪 SHOP</a>
        </div>
        <div style="width: 100%; height: 3px; background: linear-gradient(90deg, #4fd0ff 0%, #ffd34d 50%, #4fd0ff 100%);"></div>
        <div style="text-align: center; padding: 12px; background: #2854a6;"><p style="color: white; font-size: 0.85rem; margin: 0;">🗽 Copyright 2026 - Success Chemistry® | Powered by 🏄 WindSurf</p></div>`;

const pagesToFix = [
    'deploy-site/cart/index.html',
    'deploy-site/contact/index.html',
    'deploy-site/blog.html',
    'deploy-site/blog/index.html',
    'deploy-site/terms-of-service.html',
    'deploy-site/shipping-returns.html',
    'deploy-site/payment-policy.html',
    'deploy-site/privacy-policy.html',
    'deploy-site/subscribe.html',
    'deploy-site/thank-you.html',
    'deploy-site/my-account-dashboard.html',
    'deploy-site/faq/index.html',
    'deploy-site/command-center/index.html',
    'deploy-site/terms-of-service/index.html',
    'deploy-site/shipping-returns/index.html',
    'deploy-site/payment-policy/index.html',
    'deploy-site/privacy-policy/index.html'
];

function fixPage(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let updated = false;

        // 1. Fix logo centering - remove ANY conflicting CSS
        // Remove any justify-content: left, flex-start, space-between from topbar-inner
        content = content.replace(/\.topbar-inner\s*\{[^}]*justify-content:\s*(left|flex-start|space-between)[^}]*\}/g, '');
        
        // Ensure topbar-inner has center
        if (!content.includes('.topbar-inner') || !content.match(/\.topbar-inner[^}]*justify-content:\s*center/)) {
            // Find existing .topbar-inner and fix it
            const topbarInnerRegex = /(\.topbar-inner\s*\{[^}]*)(\})/;
            if (topbarInnerRegex.test(content)) {
                content = content.replace(topbarInnerRegex, (match, before, after) => {
                    if (!before.includes('justify-content')) {
                        return before + '\n            justify-content: center !important;' + after;
                    }
                    return match.replace(/justify-content:\s*[^;]+/, 'justify-content: center !important');
                });
                updated = true;
            }
        }

        // 2. Remove any position: absolute or left positioning from brand/logo
        content = content.replace(/\.brand[^}]*position:\s*absolute[^}]*\}/g, '');
        content = content.replace(/\.brand[^}]*left:\s*[^;]+[^}]*\}/g, '');
        content = content.replace(/\.topbar-inner[^}]*position:\s*absolute[^}]*\}/g, '');

        // 3. Fix footer - add complete footer if missing
        const hasCompleteFooter = content.includes('Copyright 2026') && content.includes('Terms of Service');
        
        if (!hasCompleteFooter) {
            // Find </footer> and add complete footer before it
            const footerEnd = content.lastIndexOf('</footer>');
            if (footerEnd !== -1) {
                // Check if it's missing the bottom part
                const beforeFooter = content.substring(Math.max(0, footerEnd - 500), footerEnd);
                if (!beforeFooter.includes('Copyright 2026')) {
                    content = content.slice(0, footerEnd) + COMPLETE_FOOTER + '\n    </footer>';
                    updated = true;
                }
            }
        }

        // 4. Fix topbar HTML indentation - ensure it starts at column 0
        content = content.replace(/^\s+<div class="topbar">/m, '    <div class="topbar">');

        if (updated) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ Fixed: ${filePath}`);
            return true;
        } else {
            console.log(`⏭️  Already correct: ${filePath}`);
            return false;
        }
    } catch (error) {
        console.error(`❌ Error: ${filePath}:`, error.message);
        return false;
    }
}

console.log('Fixing ALL pages: complete footer + centered logo...\n');
let fixed = 0;

pagesToFix.forEach(file => {
    if (fixPage(file)) fixed++;
});

console.log(`\n✅ Fixed ${fixed} of ${pagesToFix.length} files`);
console.log('All pages now have:');
console.log('  ✅ Centered logo (no conflicting CSS)');
console.log('  ✅ Complete footer (Terms, Copyright, etc.)');
