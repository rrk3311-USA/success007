/**
 * Server-Side Rendering for Product Pages
 * 
 * Injects schema, canonical, and meta tags into product HTML
 * before sending to client. Ensures crawler-first, deterministic SEO.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load products data (CommonJS format in ES module context)
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

let PRODUCTS_DATA = {};
let getProductBySKU = null;

try {
    // Load the CommonJS module - need to use .cjs extension or eval
    const productsDataPath = path.join(__dirname, 'deploy-site', 'products-data.js');
    
    // Since package.json has "type": "module", we need to evaluate the CommonJS file
    const productsDataContent = fs.readFileSync(productsDataPath, 'utf8');
    
    // Create a safe evaluation context for CommonJS
    const module = { exports: {} };
    const exports = module.exports;
    
    // Wrap in a function to create proper scope
    const loadModule = new Function('module', 'exports', 'require', productsDataContent);
    loadModule(module, module.exports, require);
    
    // Extract the exports
    if (module.exports.PRODUCTS_DATA) {
        PRODUCTS_DATA = module.exports.PRODUCTS_DATA;
        getProductBySKU = module.exports.getProductBySKU;
        console.log(`✅ Loaded ${Object.keys(PRODUCTS_DATA).length} products for SSR`);
    } else {
        console.warn('⚠️  Products data not found in module.exports');
    }
} catch (error) {
    console.error('❌ Error loading products data for SSR:', error.message);
    // SSR will fall back to client-side rendering
}

/**
 * Generate Product Schema (JSON-LD)
 */
function generateProductSchema(product, canonicalUrl) {
    const price = parseFloat(product.price || 0).toFixed(2);
    const mainImage = (product.images && product.images[0]) 
        ? product.images[0].startsWith('http') 
            ? product.images[0] 
            : `https://successchemistry.com${product.images[0]}`
        : 'https://successchemistry.com/images/placeholder.jpg';
    
    const schema = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product.name,
        "image": product.images && product.images.length > 0
            ? product.images.map(img => 
                img.startsWith('http') ? img : `https://successchemistry.com${img}`
            )
            : [mainImage],
        "description": product.short_description || product.description?.substring(0, 500) || product.name,
        "sku": product.sku,
        "brand": {
            "@type": "Brand",
            "name": "Success Chemistry"
        },
        "offers": {
            "@type": "Offer",
            "url": canonicalUrl,
            "priceCurrency": "USD",
            "price": price,
            "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            "availability": "https://schema.org/InStock",
            "seller": {
                "@type": "Organization",
                "name": "Success Chemistry",
                "url": "https://successchemistry.com"
            }
        }
    };
    
    // Add FAQPage schema if FAQs exist
    if (product.faqs && product.faqs.length > 0) {
        schema.mainEntity = {
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
    
    return schema;
}

/**
 * Render product page with server-side injected metadata
 */
export function renderProductPage(sku, baseUrl = 'http://localhost:8080') {
    // Load the product HTML template
    const templatePath = path.join(__dirname, 'deploy-site', 'product', 'index.html');
    let html = fs.readFileSync(templatePath, 'utf8');
    
    // Get product data
    const product = getProductBySKU ? getProductBySKU(sku) : PRODUCTS_DATA[sku];
    
    if (!product) {
        // Product not found - return template as-is (client will handle 404)
        return html;
    }
    
    const price = parseFloat(product.price || 0).toFixed(2);
    const canonicalUrl = `${baseUrl}/product/?sku=${encodeURIComponent(sku)}`;
    const title = `${product.name} - Success Chemistry`;
    const description = product.short_description || 
                       product.description?.substring(0, 160) || 
                       `${product.name} - Premium supplement from Success Chemistry`;
    
    // Generate schema
    const schema = generateProductSchema(product, canonicalUrl);
    const schemaJSON = JSON.stringify(schema, null, 2);
    
    // Escape HTML special characters (but preserve existing entities)
    const escapeHtml = (str) => {
        if (!str) return '';
        // First, protect existing HTML entities
        return str
            .replace(/&(?!amp;|lt;|gt;|quot;|#39;|#x27;)/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    };
    
    const escapedTitle = escapeHtml(title);
    const escapedDesc = escapeHtml(description);
    
    // Update title - match the exact pattern with id="pageTitle"
    html = html.replace(
        /<title[^>]*id=["']pageTitle["'][^>]*>.*?<\/title>/i,
        `<title id="pageTitle">${escapedTitle}</title>`
    );
    
    // Update meta description - match the exact pattern with id="pageDescription"
    html = html.replace(
        /<meta[^>]*id=["']pageDescription["'][^>]*content=["'][^"']*["'][^>]*>/i,
        `<meta name="description" id="pageDescription" content="${escapedDesc}">`
    );
    
    // Remove existing canonical if present
    html = html.replace(/<link[^>]*rel=["']canonical["'][^>]*>/i, '');
    
    // Remove existing schema scripts with data-schema="product" to prevent duplicates
    html = html.replace(/<script[^>]*data-schema=["']product["'][^>]*>[\s\S]*?<\/script>/gi, '');
    
    // Inject schema and canonical into <head> (before closing </head>)
    const schemaScript = `    <script type="application/ld+json" data-schema="product">
${schemaJSON}
    </script>`;
    const canonicalLink = `    <link rel="canonical" href="${canonicalUrl}">`;
    
    // Find </head> and insert schema + canonical before it
    html = html.replace('</head>', `${schemaScript}\n${canonicalLink}\n</head>`);
    
    // Also update the dynamic title/description elements (for client-side updates)
    html = html.replace(
        'id="pageTitle"',
        `id="pageTitle" data-ssr-title="${title.replace(/"/g, '&quot;')}"`
    );
    html = html.replace(
        'id="pageDescription"',
        `id="pageDescription" data-ssr-content="${description.replace(/"/g, '&quot;')}"`
    );
    
    return html;
}

/**
 * Check if product exists
 */
export function productExists(sku) {
    return getProductBySKU ? !!getProductBySKU(sku) : !!PRODUCTS_DATA[sku];
}
