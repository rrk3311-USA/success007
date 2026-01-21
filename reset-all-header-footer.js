// RESET ALL PAGES: Copy EXACT header/footer from homepage
import fs from 'fs';

// Read PERFECT homepage
const homepage = fs.readFileSync('deploy-site/index.html', 'utf8');

// Extract EXACT header HTML (from <div class="topbar"> to </div> after blue-nav)
const headerMatch = homepage.match(/<div class="topbar">[\s\S]*?<div class="header-divider"><\/div>\s*<div class="blue-nav">[\s\S]*?<div class="header-divider"><\/div>/);
const PERFECT_HEADER = headerMatch ? headerMatch[0] : null;

// Extract EXACT footer HTML
const footerMatch = homepage.match(/<footer class="footer">[\s\S]*?<\/footer>/);
const PERFECT_FOOTER = footerMatch ? footerMatch[0] : null;

// Extract EXACT header CSS (all .topbar, .blue-nav, .brand styles)
const styleMatch = homepage.match(/<style>([\s\S]*?)<\/style>/);
const allStyles = styleMatch ? styleMatch[1] : '';

// Extract header CSS specifically
const headerCSSMatch = allStyles.match(/(\.topbar-inner[\s\S]*?@media[\s\S]*?520px[\s\S]*?\{[\s\S]*?\})/);
const PERFECT_HEADER_CSS = headerCSSMatch ? headerCSSMatch[1] : '';

if (!PERFECT_HEADER || !PERFECT_FOOTER) {
    console.error('❌ Could not extract header/footer from homepage!');
    process.exit(1);
}

console.log('✅ Extracted perfect header/footer from homepage\n');

const pagesToFix = [
    'deploy-site/shop/index.html',
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

function resetPage(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let changed = false;

        // 1. Replace header HTML with PERFECT header
        const oldHeaderRegex = /<div class="topbar">[\s\S]*?<div class="header-divider"><\/div>\s*<div class="blue-nav">[\s\S]*?<div class="header-divider"><\/div>/;
        if (oldHeaderRegex.test(content)) {
            content = content.replace(oldHeaderRegex, PERFECT_HEADER);
            changed = true;
        }

        // 2. Replace footer HTML with PERFECT footer
        const oldFooterRegex = /<footer class="footer">[\s\S]*?<\/footer>/;
        if (oldFooterRegex.test(content)) {
            content = content.replace(oldFooterRegex, PERFECT_FOOTER);
            changed = true;
        }

        // 3. Fix header CSS - ensure .topbar-inner has justify-content: center !important
        content = content.replace(/\.topbar-inner\s*\{[^}]*justify-content:\s*[^;]+/g, 
            (match) => match.replace(/justify-content:\s*[^;]+/, 'justify-content: center !important'));
        
        // If .topbar-inner doesn't have justify-content, add it
        if (!content.match(/\.topbar-inner[^}]*justify-content:\s*center/)) {
            const topbarInnerRegex = /(\.topbar-inner\s*\{[^}]*?)(\})/;
            if (topbarInnerRegex.test(content)) {
                content = content.replace(topbarInnerRegex, 
                    (match, before, after) => {
                        if (!before.includes('justify-content')) {
                            return before + '\n            justify-content: center !important;' + after;
                        }
                        return match;
                    });
                changed = true;
            }
        }

        // 4. Fix "Home" link - make sure it goes to "/" not "/cart"
        content = content.replace(/<a[^>]*href="\/"[^>]*>Home<\/a>/g, 
            '<a href="/">Home</a>');
        content = content.replace(/<a[^>]*href="\/cart"[^>]*>Home<\/a>/g, 
            '<a href="/">Home</a>');

        // 5. Ensure header doesn't move - remove any position: absolute from topbar/brand
        content = content.replace(/\.topbar[^}]*position:\s*absolute[^}]*\}/g, '');
        content = content.replace(/\.brand[^}]*position:\s*absolute[^}]*\}/g, '');
        content = content.replace(/\.topbar-inner[^}]*position:\s*absolute[^}]*\}/g, '');

        if (changed) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ RESET: ${filePath}`);
            return true;
        } else {
            console.log(`⏭️  Already perfect: ${filePath}`);
            return false;
        }
    } catch (error) {
        console.error(`❌ Error: ${filePath}:`, error.message);
        return false;
    }
}

console.log('🔄 RESETTING ALL PAGES with PERFECT header/footer from homepage...\n');
let fixed = 0;

pagesToFix.forEach(file => {
    if (resetPage(file)) fixed++;
});

console.log(`\n✅ RESET ${fixed} of ${pagesToFix.length} pages`);
console.log('All pages now have:');
console.log('  ✅ EXACT header from homepage (centered logo, static)');
console.log('  ✅ EXACT footer from homepage (complete with Terms/Copyright)');
console.log('  ✅ Fixed "Home" link');
