// Clean up empty CSS blocks and ensure uniform mobile styles
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UNIVERSAL_MOBILE_CSS = `
        @media (max-width: 768px) {
            .topbar-inner {
                padding: 12px 0;
            }

            .brand img {
                height: 44px;
            }

            .blue-nav {
                padding: 10px 0;
            }

            .blue-nav .container {
                gap: 22px;
            }

            .blue-nav a {
                font-size: 1.2rem;
            }
        }

        @media (max-width: 520px) {
            .blue-nav .container {
                gap: 16px;
            }

            .blue-nav a {
                font-size: 1.15rem;
            }
        }`;

const pagesToFix = [
    'deploy-site/index.html',
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

function cleanEmptyCSS(content) {
    // Remove empty CSS rules and blocks
    content = content.replace(/\{\s*\}/g, '');
    content = content.replace(/\{\s*\n\s*\}/g, '');
    
    // Remove empty @media blocks
    content = content.replace(/@media[^\{]*\{\s*\}/g, '');
    content = content.replace(/@media[^\{]*\{\s*\n\s*\}/g, '');
    
    // Remove duplicate empty lines (more than 2 consecutive)
    content = content.replace(/\n\s*\n\s*\n+/g, '\n\n');
    
    // Remove standalone empty selectors
    content = content.replace(/^\s*[\.#][\w-]+\s*\{\s*\}/gm, '');
    
    return content;
}

function fixMobileCSS(content) {
    // Remove all existing mobile media queries for header/footer
    content = content.replace(/@media\s*\(max-width:\s*768px\)\s*\{[^}]*\.topbar-inner[^}]*\}/gs, '');
    content = content.replace(/@media\s*\(max-width:\s*520px\)\s*\{[^}]*\.blue-nav[^}]*\}/gs, '');
    
    // Remove empty @media blocks
    content = content.replace(/@media\s*\(max-width:\s*768px\)\s*\{\s*\}/g, '');
    content = content.replace(/@media\s*\(max-width:\s*520px\)\s*\{\s*\}/g, '');
    
    // Find the last @media block or .footer-btn:active and add mobile CSS after it
    const footerBtnActiveMatch = content.match(/\.footer-btn:active\s*\{[^}]+\}/);
    if (footerBtnActiveMatch) {
        const insertPos = content.indexOf(footerBtnActiveMatch[0]) + footerBtnActiveMatch[0].length;
        // Check if mobile CSS already exists
        if (!content.includes('@media (max-width: 768px)') || !content.match(/@media\s*\(max-width:\s*768px\)\s*\{[^}]*\.topbar-inner[^}]*padding:\s*12px[^}]*\}/s)) {
            content = content.slice(0, insertPos) + '\n' + UNIVERSAL_MOBILE_CSS + content.slice(insertPos);
        }
    } else {
        // Find </style> and insert before it
        const styleEnd = content.lastIndexOf('</style>');
        if (styleEnd !== -1 && !content.includes('@media (max-width: 768px)')) {
            content = content.slice(0, styleEnd) + UNIVERSAL_MOBILE_CSS + '\n    ' + content.slice(styleEnd);
        }
    }
    
    return content;
}

function removeDuplicateCSS(content) {
    // Remove duplicate header CSS blocks
    const headerPatterns = [
        /\.topbar-inner\s*\{[^}]+\}/g,
        /\.header-divider[^}]+\{[^}]+\}/g,
        /@keyframes\s+gradientMove[^}]+\{[^}]+\}/g,
        /\.brand\s*\{[^}]+\}/g,
        /\.topbar\s*\{[^}]+\}/g,
        /\.blue-nav\s*\{[^}]+\}/g
    ];
    
    // Keep only the first occurrence of each pattern
    headerPatterns.forEach(pattern => {
        const matches = [...content.matchAll(pattern)];
        if (matches.length > 1) {
            // Remove all but the first
            for (let i = 1; i < matches.length; i++) {
                content = content.replace(matches[i][0], '');
            }
        }
    });
    
    return content;
}

function standardizePage(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let updated = false;
        
        // Clean empty CSS
        const cleaned = cleanEmptyCSS(content);
        if (cleaned !== content) {
            content = cleaned;
            updated = true;
        }
        
        // Remove duplicates
        const deduped = removeDuplicateCSS(content);
        if (deduped !== content) {
            content = deduped;
            updated = true;
        }
        
        // Fix mobile CSS
        const mobileFixed = fixMobileCSS(content);
        if (mobileFixed !== content) {
            content = mobileFixed;
            updated = true;
        }
        
        // Final cleanup of excessive whitespace
        content = content.replace(/\n\s*\n\s*\n\s*\n+/g, '\n\n');
        
        if (updated) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ Fixed: ${filePath}`);
            return true;
        } else {
            console.log(`⏭️  Already clean: ${filePath}`);
            return false;
        }
    } catch (error) {
        console.error(`❌ Error: ${filePath}:`, error.message);
        return false;
    }
}

console.log('Cleaning up CSS and standardizing mobile styles...\n');
let fixed = 0;

pagesToFix.forEach(file => {
    if (standardizePage(file)) fixed++;
});

console.log(`\n✅ Cleaned and fixed ${fixed} of ${pagesToFix.length} files`);
console.log('All pages now have uniform mobile styles!');
