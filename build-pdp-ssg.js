#!/usr/bin/env node
/**
 * Static Site Generation (SSG) Build Script for Product Detail Pages
 * 
 * Generates server-rendered HTML files for each product SKU to ensure
 * all critical content is visible in initial HTML for SEO and GPT discoverability.
 * 
 * Usage: node build-pdp-ssg.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const PRODUCTS_DATA_PATH = './deploy-site/products-data.js';
const OUTPUT_DIR = './deploy-site/product';
const TEMPLATE_PATH = './templates/pdp-template.html';

// Read products data
function loadProductsData() {
    const dataFile = fs.readFileSync(PRODUCTS_DATA_PATH, 'utf8');
    
    // Extract PRODUCTS_DATA object from the JavaScript file
    // This is a simple extraction - in production, use a proper JS parser
    const match = dataFile.match(/const PRODUCTS_DATA = ({[\s\S]*?});/);
    if (!match) {
        throw new Error('Could not parse products-data.js');
    }
    
    // Evaluate the object (in production, use a safer method)
    const productsData = eval(`(${match[1]})`);
    return productsData;
}

// Extract primary function from product name/description
function extractPrimaryFunction(product) {
    const name = product.name.toLowerCase();
    const desc = (product.description || '').toLowerCase();
    
    // Common patterns
    if (name.includes('eye') || name.includes('vision') || name.includes('sclera')) {
        return 'Eye Health & Vision Support';
    }
    if (name.includes('liver') || name.includes('detox')) {
        return 'Liver Health & Detoxification Support';
    }
    if (name.includes('lung') || name.includes('respiratory')) {
        return 'Respiratory Health Support';
    }
    if (name.includes('prostate')) {
        return 'Prostate Health Support';
    }
    if (name.includes('testosterone') || name.includes('libido')) {
        return 'Hormonal Balance & Vitality Support';
    }
    if (name.includes('uti') || name.includes('urinary')) {
        return 'Urinary Tract Health Support';
    }
    if (name.includes('weight') || name.includes('keto') || name.includes('fat')) {
        return 'Weight Management & Metabolism Support';
    }
    if (name.includes('immune') || name.includes('mushroom')) {
        return 'Immune System Support';
    }
    if (name.includes('hair') || name.includes('growth')) {
        return 'Hair Health & Growth Support';
    }
    if (name.includes('women') || name.includes('female') || name.includes('balance')) {
        return 'Women\'s Wellness & Hormonal Balance Support';
    }
    
    return 'Premium Dietary Supplement';
}

// Extract "What it does" mechanism from description
function extractWhatItDoes(product) {
    const desc = product.description || '';
    const shortDesc = product.short_description || '';
    
    // Try to extract mechanism-focused content
    // Look for sentences with "supports", "helps", "promotes", "aids"
    const mechanismPatterns = [
        /([^.!?]*(?:supports|helps|promotes|aids|assists|maintains|enhances)[^.!?]*[.!?])/gi,
        /([^.!?]*(?:formulated|designed|crafted|blend|formula)[^.!?]*[.!?])/gi
    ];
    
    let mechanisms = [];
    mechanismPatterns.forEach(pattern => {
        const matches = desc.match(pattern);
        if (matches) {
            mechanisms.push(...matches.slice(0, 3));
        }
    });
    
    if (mechanisms.length === 0) {
        // Fallback: use first 2-3 sentences of short description
        const sentences = shortDesc.split(/[.!?]+/).filter(s => s.trim().length > 20);
        mechanisms = sentences.slice(0, 2);
    }
    
    return mechanisms.join(' ').trim() || shortDesc.substring(0, 200);
}

// Extract "Who it's for" from description/category
function extractWhoItsFor(product) {
    const category = product.category || '';
    const name = product.name.toLowerCase();
    const desc = (product.description || '').toLowerCase();
    
    let targetAudience = [];
    let notFor = [];
    
    // Determine target audience
    if (name.includes('women') || name.includes('female') || category.includes('Women')) {
        targetAudience.push('Women seeking natural wellness support');
    }
    if (name.includes('men') || name.includes('male') || category.includes('Men')) {
        targetAudience.push('Men looking for natural health support');
    }
    if (name.includes('prostate')) {
        targetAudience.push('Men over 40 seeking prostate health support');
    }
    if (name.includes('eye') || name.includes('vision')) {
        targetAudience.push('Adults concerned about eye health and vision');
        targetAudience.push('Individuals with high screen time');
    }
    if (name.includes('weight') || name.includes('keto')) {
        targetAudience.push('Adults following a weight management program');
        notFor.push('Not recommended for pregnant or nursing women');
    }
    if (name.includes('immune')) {
        targetAudience.push('Adults seeking immune system support');
    }
    
    // Default if nothing found
    if (targetAudience.length === 0) {
        targetAudience.push('Adults seeking natural dietary supplement support');
    }
    
    // Standard not-for
    notFor.push('Not intended for children under 18');
    notFor.push('Consult healthcare provider if pregnant, nursing, or taking medications');
    
    return {
        for: targetAudience,
        notFor: notFor
    };
}

// Generate summary paragraph (2-3 sentences)
function generateSummary(product) {
    const shortDesc = product.short_description || '';
    const name = product.name;
    
    // Use short description, split into sentences
    const sentences = shortDesc.split(/[.!?]+/).filter(s => s.trim().length > 10);
    
    if (sentences.length >= 2) {
        return sentences.slice(0, 2).join('. ').trim() + '.';
    }
    
    // Fallback: create from name and category
    const category = product.category || 'Premium Supplement';
    return `${name} is a ${category.toLowerCase()} designed to support your wellness goals. This formula combines carefully selected ingredients to provide natural support for your health journey.`;
}

// Generate key ingredients with explanations
function generateKeyIngredients(product) {
    const ingredients = product.ingredients || '';
    const supplementFacts = product.supplement_facts || '';
    
    // Extract main ingredients from supplement facts
    const ingredientLines = supplementFacts.split('\n').filter(line => {
        return line.match(/^[A-Z][a-zA-Z\s]+(?:Extract|Powder|Oil|Blend)?\s*-\s*\d+/);
    });
    
    const keyIngredients = [];
    
    // Common ingredient explanations (FDA-compliant)
    const ingredientInfo = {
        'lutein': 'Lutein is a carotenoid that supports eye health by filtering blue light and protecting the macula.',
        'zeaxanthin': 'Zeaxanthin works with lutein to support macular health and visual function.',
        'eyebright': 'Eyebright has been traditionally used to support eye comfort and clarity.',
        'bilberry': 'Bilberry extract contains antioxidants that support eye health and visual function.',
        'milk thistle': 'Milk thistle supports liver health and the body\'s natural detoxification processes.',
        'dandelion': 'Dandelion root supports liver function and natural detoxification.',
        'artichoke': 'Artichoke extract supports digestive health and liver function.',
        'saw palmetto': 'Saw palmetto supports prostate health and urinary function in men.',
        'tribulus': 'Tribulus terrestris supports vitality and natural energy levels.',
        'maca': 'Maca root supports hormonal balance and natural energy.',
        'ashwagandha': 'Ashwagandha supports stress response and overall wellness.',
        'd-mannose': 'D-Mannose supports urinary tract health and helps maintain a healthy urinary environment.',
        'cranberry': 'Cranberry extract supports urinary tract health with natural compounds.',
        'l-arginine': 'L-Arginine supports healthy blood flow and circulation.',
        'quercetin': 'Quercetin is an antioxidant that supports healthy inflammation response.',
        'turmeric': 'Turmeric supports healthy inflammation response and joint comfort.',
        'ginger': 'Ginger supports digestive health and healthy inflammation response.',
        'vitamin c': 'Vitamin C is an essential antioxidant that supports immune function.',
        'vitamin e': 'Vitamin E supports cellular health and provides antioxidant protection.',
        'zinc': 'Zinc supports immune function and overall wellness.',
        'magnesium': 'Magnesium supports muscle function and energy metabolism.',
        'biotin': 'Biotin supports healthy hair, skin, and nails.',
        'raspberry ketone': 'Raspberry ketones support metabolism and energy production.',
        'green tea': 'Green tea extract supports metabolism and provides antioxidant support.',
        'african mango': 'African mango extract supports metabolism and weight management goals.',
    };
    
    // Extract first 5-6 main ingredients
    ingredientLines.slice(0, 6).forEach(line => {
        const match = line.match(/^([A-Z][a-zA-Z\s]+(?:Extract|Powder|Oil|Blend)?)\s*-\s*\d+/);
        if (match) {
            const ingName = match[1].toLowerCase().trim();
            const amount = line.match(/-?\s*(\d+(?:\.\d+)?)\s*(mg|mcg|IU|g)/i);
            
            // Find explanation
            let explanation = '';
            for (const [key, value] of Object.entries(ingredientInfo)) {
                if (ingName.includes(key)) {
                    explanation = value;
                    break;
                }
            }
            
            if (!explanation) {
                explanation = `${match[1]} is included in this formula to support your wellness goals.`;
            }
            
            keyIngredients.push({
                name: match[1].trim(),
                amount: amount ? `${amount[1]} ${amount[2]}` : '',
                explanation: explanation
            });
        }
    });
    
    return keyIngredients;
}

// Generate safety disclaimer
function generateSafetyDisclaimer() {
    return `*These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease. Individual results may vary. Consult your healthcare provider before starting any new dietary supplement, especially if you are pregnant, nursing, taking medications, or have a medical condition.`;
}

// Generate trust/manufacturing section
function generateTrustSection(product) {
    return {
        gmp: 'Manufactured in a GMP-certified facility',
        fda: 'FDA-compliant manufacturing practices',
        usa: 'Made in the USA',
        quality: 'Quality tested for purity and potency',
        natural: 'No artificial colors, flavors, or preservatives',
        vegetarian: 'Vegetarian capsules (where applicable)',
        nonGmo: 'Non-GMO ingredients'
    };
}

// Generate JSON-LD Product schema
function generateProductSchema(product, baseUrl) {
    const price = parseFloat(product.price || 0).toFixed(2);
    const mainImage = (product.images && product.images[0]) 
        ? `${baseUrl}${product.images[0]}` 
        : `${baseUrl}/images/placeholder.jpg`;
    
    const images = (product.images || []).map(img => `${baseUrl}${img}`);
    
    return {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product.name,
        "description": product.short_description || product.description?.substring(0, 500) || product.name,
        "image": images.length > 0 ? images : [mainImage],
        "sku": product.sku,
        "brand": {
            "@type": "Brand",
            "name": "Success Chemistry"
        },
        "category": product.category || "Dietary Supplement",
        "offers": {
            "@type": "Offer",
            "url": `${baseUrl}/product/?sku=${product.sku}`,
            "priceCurrency": "USD",
            "price": price,
            "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            "availability": "https://schema.org/InStock",
            "seller": {
                "@type": "Organization",
                "name": "Success Chemistry"
            }
        }
    };
}

// Generate JSON-LD FAQPage schema
function generateFAQSchema(product, baseUrl) {
    if (!product.faqs || product.faqs.length === 0) {
        return null;
    }
    
    return {
        "@context": "https://schema.org/",
        "@type": "FAQPage",
        "mainEntity": product.faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };
}

// Load template
function loadTemplate() {
    if (fs.existsSync(TEMPLATE_PATH)) {
        return fs.readFileSync(TEMPLATE_PATH, 'utf8');
    }
    
    // Return inline template if file doesn't exist
    console.warn(`Template not found at ${TEMPLATE_PATH}, using inline template`);
    return null; // Will use inline template in generateHTML
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    if (!text) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Generate key ingredients HTML
function generateKeyIngredientsHTML(keyIngredients) {
    if (keyIngredients.length === 0) {
        return '<p>This formula contains a blend of carefully selected ingredients to support your wellness goals.</p>';
    }
    
    return keyIngredients.map(ing => `
        <div class="ingredient-item">
            <h4 style="margin: 0 0 0.5rem 0; color: #2854a6;">${escapeHtml(ing.name)}${ing.amount ? ` - ${escapeHtml(ing.amount)}` : ''}</h4>
            <p style="margin: 0; color: #555;">${escapeHtml(ing.explanation)}</p>
        </div>
    `).join('');
}

// Generate FAQ section HTML
function generateFAQSectionHTML(product) {
    if (!product.faqs || product.faqs.length === 0) {
        return '<section class="section"><h2>Frequently Asked Questions</h2><p>No FAQs available for this product.</p></section>';
    }
    
    const faqItems = product.faqs.map(faq => `
        <div class="faq-item">
            <div class="faq-question">${escapeHtml(faq.question)}</div>
            <div class="faq-answer">${escapeHtml(faq.answer)}</div>
        </div>
    `).join('');
    
    return `
        <section class="section">
            <h2>Frequently Asked Questions</h2>
            ${faqItems}
        </section>
    `;
}

// Generate trust badges HTML
function generateTrustBadgesHTML(trustSection) {
    const badges = [];
    if (trustSection.gmp) badges.push(`<span class="trust-badge">${escapeHtml(trustSection.gmp)}</span>`);
    if (trustSection.fda) badges.push(`<span class="trust-badge">${escapeHtml(trustSection.fda)}</span>`);
    if (trustSection.usa) badges.push(`<span class="trust-badge">${escapeHtml(trustSection.usa)}</span>`);
    if (trustSection.quality) badges.push(`<span class="trust-badge">${escapeHtml(trustSection.quality)}</span>`);
    if (trustSection.natural) badges.push(`<span class="trust-badge">${escapeHtml(trustSection.natural)}</span>`);
    if (trustSection.vegetarian) badges.push(`<span class="trust-badge">${escapeHtml(trustSection.vegetarian)}</span>`);
    if (trustSection.nonGmo) badges.push(`<span class="trust-badge">${escapeHtml(trustSection.nonGmo)}</span>`);
    
    return badges.join('');
}

// Generate supplement facts image HTML (if available)
function generateSupplementFactsImageHTML(product) {
    // Look for supplement facts image in product images
    const supplementFactsImage = product.images?.find(img => 
        img.toLowerCase().includes('supplement') || 
        img.toLowerCase().includes('facts') ||
        img.toLowerCase().includes('label')
    );
    
    if (supplementFactsImage) {
        return `<img src="${supplementFactsImage}" alt="Supplement Facts Label" style="max-width: 100%; height: auto; margin-bottom: 1rem; border: 1px solid #e0e0e0; border-radius: 6px;">`;
    }
    
    return '';
}

// Generate "who it's not for" list HTML
function generateWhoItsNotForHTML(notForList) {
    return notForList.map(item => `<li>${escapeHtml(item)}</li>`).join('');
}

// Truncate title to 50-60 chars
function truncateTitle(fullTitle) {
    const maxLength = 60;
    if (fullTitle.length <= maxLength) return fullTitle;
    
    // Try to truncate at word boundary
    const truncated = fullTitle.substring(0, maxLength - 3);
    const lastSpace = truncated.lastIndexOf(' ');
    if (lastSpace > 40) {
        return truncated.substring(0, lastSpace) + '...';
    }
    return truncated + '...';
}

// Truncate meta description to 140-160 chars
function truncateMetaDescription(description) {
    const targetLength = 155; // Aim for middle of 140-160 range
    if (description.length <= targetLength) return description;
    
    // Try to truncate at sentence or word boundary
    const truncated = description.substring(0, targetLength - 3);
    
    // Look for sentence end
    const lastPeriod = truncated.lastIndexOf('.');
    if (lastPeriod > 120) {
        return truncated.substring(0, lastPeriod + 1);
    }
    
    // Look for word boundary
    const lastSpace = truncated.lastIndexOf(' ');
    if (lastSpace > 120) {
        return truncated.substring(0, lastSpace) + '...';
    }
    
    return truncated + '...';
}

// Generate HTML for a product
function generateHTML(product, template) {
    const primaryFunction = extractPrimaryFunction(product);
    const summary = generateSummary(product);
    const whatItDoes = extractWhatItDoes(product);
    const whoItsFor = extractWhoItsFor(product);
    const keyIngredients = generateKeyIngredients(product);
    const safetyDisclaimer = generateSafetyDisclaimer();
    const trustSection = generateTrustSection(product);
    
    const mainImage = (product.images && product.images[0]) 
        ? product.images[0] 
        : '/images/placeholder.jpg';
    
    const price = parseFloat(product.price || 0).toFixed(2);
    const baseUrl = 'https://successchemistry.com'; // Update with actual domain
    
    // Generate SEO-optimized title and description
    const fullTitle = `${product.name} - Success Chemistry`;
    const seoTitle = truncateTitle(fullTitle);
    const shortDescription = truncateMetaDescription(product.short_description || summary);
    
    // Generate schemas
    const productSchema = generateProductSchema(product, baseUrl);
    const faqSchema = generateFAQSchema(product, baseUrl);
    
    // Generate HTML sections
    const keyIngredientsHTML = generateKeyIngredientsHTML(keyIngredients);
    const faqSectionHTML = generateFAQSectionHTML(product);
    const trustBadgesHTML = generateTrustBadgesHTML(trustSection);
    const supplementFactsImageHTML = generateSupplementFactsImageHTML(product);
    const whoItsNotForListHTML = generateWhoItsNotForHTML(whoItsFor.notFor);
    
    // Generate FAQ schema script tag
    const faqSchemaScript = faqSchema 
        ? `<script type="application/ld+json">${JSON.stringify(faqSchema, null, 2)}</script>`
        : '';
    
    // If template file exists, use it; otherwise generate inline
    if (template) {
        // Replace template variables
        return template
            .replace(/\{\{PRODUCT_NAME\}\}/g, escapeHtml(product.name))
            .replace(/\{\{SEO_TITLE\}\}/g, escapeHtml(seoTitle))
            .replace(/\{\{PRIMARY_FUNCTION\}\}/g, escapeHtml(primaryFunction))
            .replace(/\{\{SUMMARY\}\}/g, escapeHtml(summary))
            .replace(/\{\{SHORT_DESCRIPTION\}\}/g, escapeHtml(shortDescription))
            .replace(/\{\{WHAT_IT_DOES\}\}/g, escapeHtml(whatItDoes))
            .replace(/\{\{SUGGESTED_USE\}\}/g, escapeHtml(product.suggested_use || 'As directed by your healthcare professional'))
            .replace(/\{\{WHO_ITS_FOR\}\}/g, escapeHtml(whoItsFor.for.join(', ')))
            .replace(/\{\{WHO_ITS_NOT_FOR_LIST\}\}/g, whoItsNotForListHTML)
            .replace(/\{\{SUPPLEMENT_FACTS\}\}/g, escapeHtml(product.supplement_facts || ''))
            .replace(/\{\{SUPPLEMENT_FACTS_IMAGE\}\}/g, supplementFactsImageHTML)
            .replace(/\{\{SAFETY_DISCLAIMER\}\}/g, escapeHtml(safetyDisclaimer))
            .replace(/\{\{KEY_INGREDIENTS_HTML\}\}/g, keyIngredientsHTML)
            .replace(/\{\{FAQ_SECTION\}\}/g, faqSectionHTML)
            .replace(/\{\{TRUST_BADGES_HTML\}\}/g, trustBadgesHTML)
            .replace(/\{\{PRODUCT_SCHEMA\}\}/g, JSON.stringify(productSchema, null, 2))
            .replace(/\{\{FAQ_SCHEMA_SCRIPT\}\}/g, faqSchemaScript)
            .replace(/\{\{SKU\}\}/g, escapeHtml(product.sku))
            .replace(/\{\{PRICE\}\}/g, price)
            .replace(/\{\{MAIN_IMAGE\}\}/g, mainImage);
    }
    
    // Inline template (fallback) - simplified version
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(product.name)} - Success Chemistry</title>
    <meta name="description" content="${escapeHtml(shortDescription)}">
    <link rel="canonical" href="${baseUrl}/product/?sku=${product.sku}">
    <script type="application/ld+json">${JSON.stringify(productSchema, null, 2)}</script>
    ${faqSchemaScript}
</head>
<body>
    <h1>${escapeHtml(product.name)} - ${escapeHtml(primaryFunction)}</h1>
    <p>${escapeHtml(summary)}</p>
    <h2>What It Does</h2>
    <p>${escapeHtml(whatItDoes)}</p>
    ${keyIngredientsHTML}
    <h2>Suggested Use</h2>
    <p>${escapeHtml(product.suggested_use || 'As directed by your healthcare professional')}</p>
    ${faqSectionHTML}
</body>
</html>`;
}

// Main build function
function buildPDPs() {
    console.log('🚀 Starting PDP SSG Build...\n');
    
    try {
        // Load products
        console.log('📦 Loading products data...');
        const products = loadProductsData();
        const productSKUs = Object.keys(products);
        console.log(`   Found ${productSKUs.length} products\n`);
        
        // Load template
        console.log('📄 Loading template...');
        const template = loadTemplate();
        if (template) {
            console.log('   Template loaded\n');
        } else {
            console.log('   Using inline template\n');
        }
        
        // Create output directory
        if (!fs.existsSync(OUTPUT_DIR)) {
            fs.mkdirSync(OUTPUT_DIR, { recursive: true });
        }
        
        // Generate HTML for each product
        console.log('🔨 Generating static HTML files...\n');
        let successCount = 0;
        let errorCount = 0;
        
        productSKUs.forEach((sku, index) => {
            try {
                const product = products[sku];
                const html = generateHTML(product, template);
                
                // Create product directory
                const productDir = path.join(OUTPUT_DIR, sku);
                if (!fs.existsSync(productDir)) {
                    fs.mkdirSync(productDir, { recursive: true });
                }
                
                // Write HTML file
                const outputPath = path.join(productDir, 'index.html');
                fs.writeFileSync(outputPath, html, 'utf8');
                
                successCount++;
                if ((index + 1) % 10 === 0) {
                    console.log(`   Generated ${index + 1}/${productSKUs.length}...`);
                }
            } catch (error) {
                console.error(`   ❌ Error generating ${sku}:`, error.message);
                errorCount++;
            }
        });
        
        console.log(`\n✅ Build complete!`);
        console.log(`   Success: ${successCount}`);
        console.log(`   Errors: ${errorCount}`);
        console.log(`   Output: ${OUTPUT_DIR}\n`);
        
    } catch (error) {
        console.error('❌ Build failed:', error);
        process.exit(1);
    }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    buildPDPs();
}

export { buildPDPs, generateHTML, generateProductSchema, generateFAQSchema };
