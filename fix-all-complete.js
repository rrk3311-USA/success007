// COMPLETE FIX: Add full footer + force logo center with !important
import fs from 'fs';

const COMPLETE_FOOTER_BOTTOM = `        </div>
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
        <div style="text-align: center; padding: 12px; background: #2854a6;"><p style="color: white; font-size: 0.85rem; margin: 0;">🗽 Copyright 2026 - Success Chemistry® | Powered by 🏄 WindSurf</p></div>
    </footer>`;

const pages = [
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

pages.forEach(file => {
    try {
        let content = fs.readFileSync(file, 'utf8');
        let changed = false;

        // 1. FORCE logo center with !important
        content = content.replace(/\.topbar-inner\s*\{[^}]*justify-content:\s*[^;]+/g, 
            (match) => match.replace(/justify-content:\s*[^;]+/, 'justify-content: center !important'));
        
        if (!content.includes('.topbar-inner') || !content.includes('justify-content: center')) {
            const topbarMatch = content.match(/\.topbar-inner\s*\{[^}]*\}/);
            if (topbarMatch) {
                content = content.replace(/\.topbar-inner\s*\{[^}]*\}/, 
                    `.topbar-inner {
            display: flex;
            align-items: center;
            justify-content: center !important;
            gap: 16px;
            padding: 0;
        }`);
                changed = true;
            }
        }

        // 2. Remove ANY conflicting justify-content from .container inside .topbar
        content = content.replace(/\.topbar\s+\.container[^}]*justify-content:\s*(left|flex-start|space-between)[^}]*\}/g, '');

        // 3. Fix footer - check if it ends with just badges (missing bottom)
        const hasCompleteFooter = content.includes('Copyright 2026') && content.includes('Terms of Service');
        
        if (!hasCompleteFooter) {
            // Find where footer ends (before </footer>)
            const footerEndMatch = content.match(/(<img[^>]*Footer-Badges[^>]*>[\s\n]*<\/div>[\s\n]*)(<\/footer>)/);
            if (footerEndMatch) {
                content = content.replace(footerEndMatch[0], footerEndMatch[1] + COMPLETE_FOOTER_BOTTOM);
                changed = true;
            } else {
                // Try finding </footer> and add before it
                const footerPos = content.lastIndexOf('</footer>');
                if (footerPos > 0) {
                    const beforeFooter = content.substring(Math.max(0, footerPos - 200), footerPos);
                    if (beforeFooter.includes('Footer-Badges') && !beforeFooter.includes('Copyright')) {
                        content = content.slice(0, footerPos) + COMPLETE_FOOTER_BOTTOM;
                        changed = true;
                    }
                }
            }
        }

        // 4. Fix topbar HTML indentation
        content = content.replace(/^\s{8,12}<div class="topbar">/m, '    <div class="topbar">');

        if (changed) {
            fs.writeFileSync(file, content, 'utf8');
            console.log(`✅ FIXED: ${file}`);
        } else {
            console.log(`⏭️  ${file}`);
        }
    } catch (error) {
        console.error(`❌ ${file}:`, error.message);
    }
});

console.log('\n✅ DONE! All pages fixed.');
