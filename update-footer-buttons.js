// Update all footer buttons to matching CSS buttons
import fs from 'fs';
import { glob } from 'glob';

const footerButtonPattern = /<div style="background: #2854a6; padding: 20px; text-align: center;">[\s\S]*?<div style="display: flex; justify-content: center; align-items: center; gap: 15px; flex-wrap: wrap; margin-bottom: 10px;">[\s\S]*?<\/div>[\s\S]*?<div style="display: flex; justify-content: center; align-items: center; gap: 15px; flex-wrap: wrap; margin-top: 10px;">[\s\S]*?<\/div>/;

const newFooterButtons = `            <div style="display: flex; justify-content: center; align-items: center; gap: 15px; flex-wrap: wrap;">
                <a href="/shop" class="footer-btn" style="background: white; color: #2854a6; padding: 14px 32px; font-size: 0.9rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; border-radius: 50px; border: 3px solid transparent; background-image: linear-gradient(white, white), linear-gradient(135deg, #5eead4 0%, #3b82f6 50%, #8b5cf6 100%); background-origin: border-box; background-clip: padding-box, border-box; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.2); cursor: pointer; text-decoration: none; transition: all 0.3s ease; display: inline-block;">VIEW ALL</a>
                <a href="/cart" class="footer-btn" style="background: white; color: #2854a6; padding: 14px 32px; font-size: 0.9rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; border-radius: 50px; border: 3px solid transparent; background-image: linear-gradient(white, white), linear-gradient(135deg, #5eead4 0%, #3b82f6 50%, #8b5cf6 100%); background-origin: border-box; background-clip: padding-box, border-box; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.2); cursor: pointer; text-decoration: none; transition: all 0.3s ease; display: inline-block;">VIEW CART</a>
            </div>
            <div style="display: flex; justify-content: center; align-items: center; gap: 15px; flex-wrap: wrap; margin-top: 20px;">
                <img src="/public/images/Footer-Badges-.png" alt="Certification Badges" style="max-width: 350px; height: auto;">
            </div>`;

const files = [
    'deploy-site/shop/index.html',
    'deploy-site/product/index.html',
    'deploy-site/cart/index.html',
    'deploy-site/blog/index.html',
    'deploy-site/blog.html',
    'deploy-site/subscribe.html',
    'deploy-site/contact/index.html',
    'deploy-site/product/52274-401.html',
    'deploy-site/product/10775-506/index.html',
    'deploy-site/terms-of-service.html',
    'deploy-site/terms-of-service/index.html',
    'deploy-site/shipping-returns.html',
    'deploy-site/shipping-returns/index.html',
    'deploy-site/payment-policy.html',
    'deploy-site/payment-policy/index.html',
    'deploy-site/privacy-policy.html',
    'deploy-site/privacy-policy/index.html'
];

files.forEach(file => {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        
        // Replace the old footer button section
        content = content.replace(
            /<div style="display: flex; justify-content: center; align-items: center; gap: 15px; flex-wrap: wrap; margin-bottom: 10px;">[\s\S]*?<\/div>\s*<div style="display: flex; justify-content: center; align-items: center; gap: 15px; flex-wrap: wrap; margin-top: 10px;">[\s\S]*?view-all-button[\s\S]*?view-cart-button[\s\S]*?<\/div>/,
            newFooterButtons
        );
        
        // Also try simpler pattern
        content = content.replace(
            /<a href="\/shop"[^>]*>[\s\S]*?view-all-button[\s\S]*?<\/a>\s*<\/div>\s*<div[^>]*>\s*<a href="\/cart"[^>]*>[\s\S]*?view-cart-button[\s\S]*?<\/a>/,
            newFooterButtons
        );
        
        // Add CSS if not present
        if (!content.includes('.footer-btn:hover')) {
            content = content.replace(
                /\.footer \{[\s\S]*?font-weight: 400;\s*\}/,
                `.footer {
            margin-top: 60px;
            background: #2854a6;
            color: rgba(255,255,255,0.92);
            padding: 0;
            font-weight: 400;
        }

        .footer-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(59, 130, 246, 0.3);
        }

        .footer-btn:active {
            transform: translateY(0);
            box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
        }`
            );
        }
        
        fs.writeFileSync(file, content);
        console.log(`✅ Updated: ${file}`);
    }
});

console.log('\n✨ All footer buttons updated!');
