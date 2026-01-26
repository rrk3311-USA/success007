/**
 * Create WooCommerce 2-Pack Product
 * 
 * Creates a 2-pack product with:
 * - New SEO-optimized description
 * - 2-bottle hero image
 * - Price: $55.72
 * 
 * Usage:
 *   node create-woocommerce-2pack.js
 */

import fetch from 'node-fetch';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const WOOCOMMERCE_CONFIG = {
    url: process.env.WOOCOMMERCE_URL || 'https://blueviolet-snake-802946.hostingersite.com',
    consumerKey: process.env.WOOCOMMERCE_CONSUMER_KEY || 'ck_2a7dcf6903f5d22ed4228abd6da424746d5f80b6',
    consumerSecret: process.env.WOOCOMMERCE_CONSUMER_SECRET || 'cs_448d2cd75368443afcd926cb249bd78e81a80db1',
    apiEndpoint: '/wp-json/wc/v3'
};

// Get auth header
function getAuthHeader() {
    return `Basic ${Buffer.from(`${WOOCOMMERCE_CONFIG.consumerKey}:${WOOCOMMERCE_CONFIG.consumerSecret}`).toString('base64')}`;
}

// Load products data
let PRODUCTS_DATA;
try {
    const productsPath = join(__dirname, 'deploy-site', 'products-data.js');
    const productsContent = readFileSync(productsPath, 'utf8');
    const modifiedContent = productsContent.replace(/^const PRODUCTS_DATA/, 'var PRODUCTS_DATA') + '\nPRODUCTS_DATA;';
    const func = new Function(modifiedContent + '\nreturn PRODUCTS_DATA;');
    PRODUCTS_DATA = func();
} catch (err) {
    console.error('❌ Could not load products-data.js:', err.message);
    process.exit(1);
}

const baseProduct = PRODUCTS_DATA['10777-810'];
if (!baseProduct) {
    console.error(`❌ Base product 10777-810 not found`);
    process.exit(1);
}

/**
 * Generate NEW SEO-optimized description for 2-pack
 */
function generateSEODescription() {
    return `
<h2>🌿 Success Chemistry Liver Cleanse 2-Pack - Premium Liver Support & Detox Formula</h2>

<p><strong>Get Maximum Value with Our 2-Bottle Bundle - 60 Days of Premium Liver Support!</strong></p>

<p>This exclusive 2-pack bundle offers exceptional value for anyone serious about supporting their liver health. Success Chemistry Liver Cleanse combines the most researched botanical extracts for comprehensive liver support, natural detoxification, and optimal digestive wellness. Each bottle contains 60 vegetarian capsules, providing a full 30-day supply - this 2-pack gives you a complete 60-day liver support program.</p>

<h3>💎 Why Choose the 2-Pack Bundle?</h3>

<ul>
<li><strong>Better Value:</strong> Save money compared to buying two bottles separately</li>
<li><strong>60-Day Supply:</strong> Complete liver support program with consistent daily use</li>
<li><strong>Never Run Out:</strong> Always have your next bottle ready when you need it</li>
<li><strong>Optimal Results:</strong> Extended use allows your liver to fully benefit from the natural detoxification support</li>
</ul>

<h3>✨ Comprehensive Liver Health Benefits</h3>

<ul>
<li><strong>Milk Thistle Liver Support:</strong> Silymarin, the active compound in Milk Thistle, is extensively researched for its ability to support healthy liver function and protect liver cells from oxidative stress. This is one of the most trusted natural ingredients for liver health support.</li>
<li><strong>Dandelion Root Detox Support:</strong> Traditionally used for centuries to support the body's natural detoxification processes, dandelion root aids in healthy bile production and promotes optimal liver and kidney function.</li>
<li><strong>Artichoke Extract for Digestive Health:</strong> Supports healthy digestion and liver function while helping maintain cholesterol levels already within normal range. Works synergistically with other ingredients for comprehensive support.</li>
<li><strong>Turmeric & Ginger Antioxidant Protection:</strong> These powerful antioxidants help maintain a healthy inflammatory response in the liver and throughout the body, providing additional cellular protection.</li>
<li><strong>Complete Botanical Formula:</strong> Includes Alfalfa, Burdock Root, Celery Powder, Feverfew, Grape Seed Extract, and more for holistic liver wellness support.</li>
</ul>

<h3>🔬 Premium Ingredient Profile (Per Serving)</h3>

<p><strong>Milk Thistle Extract (300mg):</strong> The cornerstone of this formula, Silymarin is one of the most studied liver-supporting compounds. Research shows it helps protect liver cells and supports healthy liver regeneration processes.</p>

<p><strong>Dandelion Root (200mg):</strong> A traditional liver and kidney support herb that aids natural detoxification and promotes healthy bile production, essential for optimal digestive function.</p>

<p><strong>Artichoke Extract (150mg):</strong> Supports healthy digestion and liver function. Clinical studies suggest artichoke helps maintain healthy cholesterol levels already within normal range.</p>

<p><strong>Turmeric Extract (100mg):</strong> Provides powerful antioxidant support and helps maintain a healthy inflammatory response throughout the body, including liver tissues.</p>

<p><strong>Ginger Extract (50mg):</strong> Supports digestive health and works in synergy with other ingredients to promote optimal liver function and overall wellness.</p>

<h3>📋 Complete Supplement Facts</h3>

<p><strong>Serving Size:</strong> 2 Capsules | <strong>Servings Per Bottle:</strong> 30 | <strong>Total Servings (2-Pack):</strong> 60</p>

<p><strong>Key Ingredients Per Serving:</strong> Milk Thistle Extract (300mg), Dandelion Root (200mg), Artichoke Extract (150mg), Turmeric Extract (100mg), Ginger Extract (50mg), Alfalfa (50mg), Burdock Root (50mg), Vitamin C (60mg), Selenium (100mcg)</p>

<h3>💊 Suggested Use for Optimal Results</h3>

<p>As a dietary supplement, take two (2) veggie capsules once daily after a meal with an 8oz. glass of water or as directed by your healthcare professional. For best results with this 2-pack, maintain consistent daily use throughout the 60-day period to allow your liver to fully benefit from the natural detoxification support.</p>

<h3>✅ Premium Quality Assurance</h3>

<p>✅ Made in the USA in a GMP-certified facility | ✅ Non-GMO ingredients | ✅ Vegetarian capsules (no gelatin) | ✅ Third-party tested for purity and potency | ✅ No artificial colors, flavors, or preservatives | ✅ Gluten-free and dairy-free | ✅ Quality guaranteed</p>

<h3>🎯 Who Benefits Most from This 2-Pack?</h3>

<p>This comprehensive 2-pack is ideal for adults seeking extended liver support, including those who want to maintain healthy liver function, support their body's natural detoxification processes, promote digestive wellness, enhance antioxidant protection, maintain a healthy inflammatory response, or incorporate liver support into a long-term wellness routine. Perfect for anyone committed to a 60-day liver health program.</p>

<h3>📦 What's Included in This 2-Pack</h3>

<p>You'll receive two (2) full-size bottles, each containing 60 easy-to-swallow vegetarian capsules. This provides a complete 60-day supply when taken as directed - perfect for a comprehensive liver support program without the need to reorder.</p>

<h3>🏆 Why Success Chemistry Liver Cleanse?</h3>

<p>Success Chemistry is dedicated to providing premium-quality supplements backed by scientific research and manufactured to the highest industry standards. Our Liver Cleanse 2-pack formula is carefully crafted with the finest botanical extracts to support your long-term liver wellness journey. This bundle offers exceptional value for those committed to maintaining optimal liver health.</p>

<p><strong>Order your 2-pack today and experience the comprehensive benefits of extended liver support with maximum value!</strong></p>

<p><em>*These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease. Consult with your healthcare provider before starting any new supplement regimen, especially if you are pregnant, nursing, taking medication, or have a medical condition.</em></p>
    `.trim();
}

/**
 * Upload image to WordPress media library
 */
async function uploadImage(imagePath, altText) {
    // For now, we'll use the image URL directly
    // In production, you might want to upload to WordPress media library
    const imageUrl = `${WOOCOMMERCE_CONFIG.url}${imagePath}`;
    return {
        src: imageUrl,
        alt: altText
    };
}

/**
 * Create product in WooCommerce
 */
async function createProduct() {
    console.log('📦 Creating 2-pack product in WooCommerce...\n');
    
    const seoDescription = generateSEODescription();
    const title = 'Success Chemistry Liver Cleanse 2-Pack - Milk Thistle Detox Formula - 120 Capsules';
    const shortDescription = 'Get maximum value with our 2-bottle bundle! 60 days of premium liver support with Milk Thistle, Dandelion Root, and Artichoke Extract. Complete 60-day liver support program.';
    const price = '55.72';
    const sku = '10777-810-2';
    
    // Hero image (2-bottle image) - use 02.png which shows 2 bottles
    const heroImage = '/images/products/10777-810/02.png';
    
    // All product images (hero first, then others)
    const allImages = [
        heroImage, // Hero image first (2-bottle image)
        ...baseProduct.images.filter(img => img !== heroImage) // Other images
    ];
    
    console.log(`✅ Title: ${title}`);
    console.log(`✅ SKU: ${sku}`);
    console.log(`✅ Price: $${price}`);
    console.log(`✅ Hero Image: ${heroImage}`);
    console.log(`✅ Description: ${seoDescription.length} characters\n`);
    
    // Prepare image objects - use full URLs from the site
    // Check if we need to use successchemistry.com domain
    const siteUrl = 'https://successchemistry.com';
    const images = allImages.slice(0, 6).map((imgPath, index) => {
        // Use full URL from the main site
        const fullUrl = imgPath.startsWith('http') 
            ? imgPath 
            : `${siteUrl}${imgPath}`;
        
        return {
            src: fullUrl,
            alt: index === 0 
                ? 'Success Chemistry Liver Cleanse 2-Pack - 2 Bottles' 
                : `Success Chemistry Liver Cleanse ${index + 1}`
        };
    });
    
    const productData = {
        name: title,
        type: 'simple',
        regular_price: price,
        sale_price: '',
        description: seoDescription,
        short_description: shortDescription,
        sku: sku,
        manage_stock: true,
        stock_quantity: baseProduct.stock || 100000,
        stock_status: 'instock',
        weight: '0.375', // 2-pack weight (6oz = 0.375 lbs)
        dimensions: {
            length: '4',
            width: '2',
            height: '3.5'
        },
        images: images,
        categories: [
            {
                id: 15 // Health & Wellness category (adjust if needed)
            }
        ],
        tags: [
            { name: 'Liver Cleanse' },
            { name: '2-Pack' },
            { name: 'Milk Thistle' },
            { name: 'Liver Support' },
            { name: 'Detox' },
            { name: 'Dandelion Root' }
        ],
        meta_data: [
            {
                key: 'upc',
                value: ''
            },
            {
                key: 'gtin',
                value: baseProduct.gtin || ''
            },
            {
                key: 'package_quantity',
                value: '2'
            },
            {
                key: 'total_capsules',
                value: '120'
            }
        ]
    };
    
    try {
        console.log('🚀 Creating product...');
        const response = await fetch(
            `${WOOCOMMERCE_CONFIG.url}${WOOCOMMERCE_CONFIG.apiEndpoint}/products`,
            {
                method: 'POST',
                headers: {
                    'Authorization': getAuthHeader(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productData)
            }
        );
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ Error creating product (${response.status}):`);
            console.error(errorText);
            return null;
        }
        
        const product = await response.json();
        console.log('✅ Product created successfully!');
        console.log(`   Product ID: ${product.id}`);
        console.log(`   SKU: ${product.sku}`);
        console.log(`   Price: $${product.regular_price}`);
        console.log(`   View: ${WOOCOMMERCE_CONFIG.url}/product/${product.slug}/`);
        return product;
        
    } catch (error) {
        console.error('❌ Error creating product:', error.message);
        return null;
    }
}

/**
 * Check if product already exists
 */
async function checkExistingProduct(sku) {
    try {
        const response = await fetch(
            `${WOOCOMMERCE_CONFIG.url}${WOOCOMMERCE_CONFIG.apiEndpoint}/products?sku=${sku}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': getAuthHeader()
                }
            }
        );
        
        if (!response.ok) {
            return null;
        }
        
        const products = await response.json();
        return products.length > 0 ? products[0] : null;
    } catch (error) {
        return null;
    }
}

/**
 * Main function
 */
async function main() {
    console.log('='.repeat(70));
    console.log('WooCommerce 2-Pack Product Creator');
    console.log('='.repeat(70));
    console.log('');
    
    const sku = '10777-810-2';
    
    // Check if product already exists
    const existing = await checkExistingProduct(sku);
    if (existing) {
        console.log(`⚠️  Product with SKU "${sku}" already exists!`);
        console.log(`   Product ID: ${existing.id}`);
        console.log(`   Name: ${existing.name}`);
        console.log(`   View: ${WOOCOMMERCE_CONFIG.url}/product/${existing.slug}/`);
        console.log('');
        console.log('💡 To update it, use update-woocommerce-products.js instead');
        process.exit(1);
    }
    
    // Create the product
    const product = await createProduct();
    
    if (!product) {
        console.error('❌ Failed to create product.');
        process.exit(1);
    }
    
    console.log('');
    console.log('='.repeat(70));
    console.log('✅ 2-Pack Product Created Successfully!');
    console.log('='.repeat(70));
    console.log('');
    console.log('📊 Summary:');
    console.log(`   ✅ Product ID: ${product.id}`);
    console.log(`   ✅ SKU: ${product.sku}`);
    console.log(`   ✅ Title: ${product.name}`);
    console.log(`   ✅ Price: $${product.regular_price}`);
    console.log(`   ✅ Hero Image: 2-bottle image set as featured`);
    console.log(`   ✅ Description: New SEO-optimized content`);
    console.log('');
    console.log(`🌐 View product: ${WOOCOMMERCE_CONFIG.url}/product/${product.slug}/`);
    console.log('');
}

main().catch(error => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
});
