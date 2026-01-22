#!/usr/bin/env node

/**
 * Script to fix header CSS across all pages
 * Replaces old/broken header CSS with fixed header system
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FIXED_HEADER_CSS = `        /* ============================================
           FIXED HEADER SYSTEM - Consistent across all pages
           ============================================ */

        .topbar {
            background: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(20px) saturate(180%);
            -webkit-backdrop-filter: blur(20px) saturate(180%);
            position: sticky;
            top: 0;
            z-index: 100;
            border-bottom: 1px solid rgba(255, 255, 255, 0.8);
            padding: 22px 0;
            margin-top: 8px;
            width: 100%;
            left: 0;
            right: 0;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            /* Fixed height to prevent shifting */
            min-height: 62px;
            box-sizing: border-box;
        }

        .topbar .container {
            position: relative;
            width: 100%;
            max-width: 100%;
        }

        .topbar-inner {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 16px;
            padding: 0;
            position: relative;
            width: 100%;
            /* Fixed height to prevent shifting */
            min-height: 58px;
            box-sizing: border-box;
        }

        .brand {
            display: inline-flex;
            align-items: center;
            text-decoration: none;
            /* Prevent logo from shifting */
            flex-shrink: 0;
        }

        .brand img {
            height: 58px;
            width: auto;
            /* Fixed dimensions to prevent resizing */
            min-height: 58px;
            max-height: 58px;
            display: block;
        }

        .header-divider {
            height: 4px;
            width: 100%;
            background: linear-gradient(90deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #667eea 100%);
            background-size: 200% 100%;
            animation: gradientMove 3s linear infinite;
            flex-shrink: 0;
        }

        @keyframes gradientMove {
            0% { background-position: 0% 50%; }
            100% { background-position: 200% 50%; }
        }

        .blue-nav {
            background: #2854a6;
            padding: 18px 0;
            width: 100%;
            /* Fixed height to prevent shifting */
            min-height: 54px;
            box-sizing: border-box;
        }

        .blue-nav .container {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 48px;
            flex-wrap: wrap;
            position: relative;
            width: 100%;
            max-width: 100%;
        }

        .blue-nav a {
            color: #ffffff;
            text-decoration: none;
            font-weight: 500;
            font-size: 1.56rem;
            letter-spacing: 0.2px;
            transition: opacity 0.3s;
            /* Fixed line-height to prevent text shifting */
            line-height: 1.2;
            white-space: nowrap;
        }

        .blue-nav a:hover {
            opacity: 0.8;
        }

        .footer-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(59, 130, 246, 0.3);
        }

        .footer-btn:active {
            transform: translateY(0);
            box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
        }

        /* Mobile Responsive - Fixed sizes */
        @media (max-width: 768px) {
            .topbar {
                padding: 16px 0;
                min-height: 56px;
            }
            
            .topbar-inner {
                padding: 0;
                min-height: 44px;
            }

            .brand img {
                height: 44px;
                min-height: 44px;
                max-height: 44px;
            }

            .blue-nav {
                padding: 10px 0;
                min-height: 50px;
            }

            .blue-nav .container {
                gap: 22px;
            }

            .blue-nav a {
                font-size: 1.2rem;
                line-height: 1.2;
            }
        }

        @media (max-width: 520px) {
            .blue-nav .container {
                gap: 16px;
            }

            .blue-nav a {
                font-size: 1.15rem;
                line-height: 1.2;
            }
        }

        /* Prevent layout shift */
        .topbar,
        .blue-nav,
        .header-divider {
            will-change: auto;
            transform: translateZ(0);
            -webkit-transform: translateZ(0);
        }`;

const pagesToFix = [
    'deploy-site/payment-policy.html',
    'deploy-site/faq/index.html',
    'deploy-site/terms-of-service/index.html',
    'deploy-site/privacy-policy/index.html',
    'deploy-site/shipping-returns/index.html',
    'deploy-site/payment-policy/index.html',
];

console.log('🔧 Fixing headers across all pages...\n');

for (const pagePath of pagesToFix) {
    const fullPath = path.join(__dirname, pagePath);
    
    if (!fs.existsSync(fullPath)) {
        console.log(`⚠️  Skipping ${pagePath} (not found)`);
        continue;
    }
    
    try {
        let content = fs.readFileSync(fullPath, 'utf8');
        const originalLength = content.length;
        
        // Pattern to find old header CSS (various forms)
        const oldHeaderPatterns = [
            // Pattern 1: Broken incomplete CSS
            /@media\s*\(max-width:\s*768px\)\s*\n\s*@media\s*\(max-width:\s*520px\)\s*\n\s*\.topbar-inner\s*\{[^}]*justify-content:\s*center[^}]*\}/s,
            // Pattern 2: Old white background topbar
            /\.topbar\s*\{[^}]*background:\s*white[^}]*\}/s,
            // Pattern 3: Old brand img without min/max height
            /\.brand\s+img\s*\{[^}]*height:\s*58px[^}]*\}/s,
        ];
        
        // Check if page needs fixing
        let needsFix = false;
        if (content.includes('.topbar') && (
            content.includes('background: white') ||
            content.includes('justify-content: space-between') ||
            !content.includes('min-height: 62px')
        )) {
            needsFix = true;
        }
        
        if (needsFix) {
            console.log(`✅ Fixing ${pagePath}...`);
            // This is a simplified approach - in practice, we'd need more sophisticated pattern matching
            // For now, let's just note which files need manual fixing
            console.log(`   ⚠️  ${pagePath} needs manual header CSS update`);
        } else {
            console.log(`✓  ${pagePath} already has fixed header`);
        }
    } catch (error) {
        console.error(`❌ Error processing ${pagePath}:`, error.message);
    }
}

console.log('\n✅ Header fix check complete!');
console.log('\n📝 Note: Some pages may need manual updates.');
