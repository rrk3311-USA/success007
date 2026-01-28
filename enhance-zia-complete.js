/**
 * Complete Zia Knowledge Base Enhancement
 * Includes all product details: titles, descriptions, SKU, UPC, GTIN, ingredients, labels, etc.
 */

import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read products data file
const productsFilePath = join(__dirname, 'deploy-site/products-data.js');
const productsFileContent = fs.readFileSync(productsFilePath, 'utf-8');

// Extract PRODUCTS_DATA object
const productsMatch = productsFileContent.match(/const PRODUCTS_DATA = ({[\s\S]*?});/);
if (!productsMatch) {
    console.error('❌ Could not find PRODUCTS_DATA in products-data.js');
    process.exit(1);
}

// Parse the products data
let productsData;
try {
    productsData = eval('(' + productsMatch[1] + ')');
} catch (error) {
    console.error('❌ Error parsing products data:', error);
    process.exit(1);
}

// Create comprehensive knowledge base
const knowledgeBase = {
    company: {
        name: "Success Chemistry",
        description: "Premium dietary supplements and vitamins made in USA. 3rd party tested, scientifically formulated with nature's nutrients.",
        tagline: "Nature's nutrients, scientifically formulated — for results you can feel.",
        mission: "Premium dietary supplements made in USA, 3rd party tested, scientifically formulated with nature's nutrients. Built with a quality-first mindset: clean ingredients, clear product pages, and a focus on repeatable routines.",
        certifications: ["GMP-certified", "FDA-compliant", "3rd party tested", "Non-GMO", "Made in USA"],
        contact: {
            email: "info@successchemistry.com",
            website: "https://successchemistry.com"
        }
    },
    
    // Complete product catalog with ALL details
    products: Object.entries(productsData).map(([sku, product]) => ({
        // Identifiers
        sku: product.sku || sku,
        upc: product.upc || '',
        gtin: product.gtin || '',
        
        // Product Information
        title: product.name || '',
        name: product.name || '',
        description: product.description || '',
        short_description: product.short_description || '',
        
        // Pricing & Inventory
        price: product.price || 0,
        stock: product.stock || 0,
        
        // Category & Classification
        category: product.category || '',
        
        // Product Labels & Facts
        supplement_facts: product.supplement_facts || '',
        ingredients: product.ingredients || '',
        suggested_use: product.suggested_use || '',
        
        // Physical Details
        weight: product.weight || '',
        dimensions: product.dimensions || '',
        
        // Images & Media
        images: product.images || [],
        image_urls: (product.images || []).map(img => 
            img.startsWith('http') ? img : `https://successchemistry.com${img}`
        ),
        
        // SEO & Search
        key_search_terms: product.key_search_terms || '',
        seo_targets: product.seo_targets || {},
        
        // URLs
        url: `https://successchemistry.com/product?sku=${product.sku || sku}`,
        product_page: `https://successchemistry.com/product?sku=${product.sku || sku}`
    })),
    
    // Quick lookup indexes
    lookup: {
        by_sku: {},
        by_upc: {},
        by_gtin: {},
        by_category: {},
        by_ingredient: {},
        by_name: {}
    },
    
    // Statistics
    statistics: {
        total_products: 0,
        products_with_upc: 0,
        products_with_gtin: 0,
        products_with_ingredients: 0,
        products_with_supplement_facts: 0,
        categories: [],
        total_categories: 0
    }
};

// Build lookup indexes
knowledgeBase.products.forEach(product => {
    const sku = product.sku;
    
    // SKU lookup
    knowledgeBase.lookup.by_sku[sku] = product;
    
    // UPC lookup
    if (product.upc) {
        knowledgeBase.lookup.by_upc[product.upc] = sku;
        knowledgeBase.statistics.products_with_upc++;
    }
    
    // GTIN lookup
    if (product.gtin) {
        knowledgeBase.lookup.by_gtin[product.gtin] = sku;
        knowledgeBase.statistics.products_with_gtin++;
    }
    
    // Category lookup
    if (product.category) {
        if (!knowledgeBase.lookup.by_category[product.category]) {
            knowledgeBase.lookup.by_category[product.category] = [];
        }
        knowledgeBase.lookup.by_category[product.category].push(sku);
        
        if (!knowledgeBase.statistics.categories.includes(product.category)) {
            knowledgeBase.statistics.categories.push(product.category);
        }
    }
    
    // Name lookup (for search)
    if (product.name) {
        const nameLower = product.name.toLowerCase();
        // Index by first word and key terms
        const words = nameLower.split(/\s+/);
        words.forEach(word => {
            if (word.length > 3) { // Only index meaningful words
                if (!knowledgeBase.lookup.by_name[word]) {
                    knowledgeBase.lookup.by_name[word] = [];
                }
                if (!knowledgeBase.lookup.by_name[word].includes(sku)) {
                    knowledgeBase.lookup.by_name[word].push(sku);
                }
            }
        });
    }
    
    // Ingredient lookup
    if (product.ingredients) {
        const ingredientText = product.ingredients.toLowerCase();
        const commonIngredients = [
            'l-arginine', 'maca', 'ashwagandha', 'ginseng', 'zinc', 
            'vitamin a', 'vitamin b1', 'vitamin b3', 'vitamin b5', 'vitamin b6', 'vitamin b12',
            'vitamin c', 'vitamin d', 'vitamin d3', 'vitamin e',
            'saw palmetto', 'quercetin', 'lutein', 'zeaxanthin', 
            'd-mannose', 'cranberry', 'milk thistle', 'dandelion',
            'turmeric', 'ginger', 'biotin', 'collagen', 'bamboo', 
            'horsetail', 'african mango', 'artichoke', 'pumpkin seed',
            'beta-carotene', 'selenium', 'copper', 'chromium'
        ];
        
        commonIngredients.forEach(ingredient => {
            if (ingredientText.includes(ingredient)) {
                if (!knowledgeBase.lookup.by_ingredient[ingredient]) {
                    knowledgeBase.lookup.by_ingredient[ingredient] = [];
                }
                if (!knowledgeBase.lookup.by_ingredient[ingredient].includes(sku)) {
                    knowledgeBase.lookup.by_ingredient[ingredient].push(sku);
                }
            }
        });
    }
    
    // Count statistics
    if (product.ingredients) knowledgeBase.statistics.products_with_ingredients++;
    if (product.supplement_facts) knowledgeBase.statistics.products_with_supplement_facts++;
});

knowledgeBase.statistics.total_products = knowledgeBase.products.length;
knowledgeBase.statistics.total_categories = knowledgeBase.statistics.categories.length;

// Add business rules and common questions
knowledgeBase.businessRules = [
    "All products are made in USA",
    "All products are 3rd party tested",
    "GMP-certified manufacturing facility",
    "FDA-compliant labeling required",
    "Free shipping on orders over $50",
    "30-day money-back guarantee",
    "Subscription discounts available",
    "Customer service available via contact page"
];

knowledgeBase.commonQuestions = [
    {
        question: "Where are your products made?",
        answer: "All Success Chemistry products are made in the USA in a GMP-certified facility."
    },
    {
        question: "Are your products tested?",
        answer: "Yes, all products undergo 3rd party testing to ensure quality and purity."
    },
    {
        question: "What is your return policy?",
        answer: "We offer a 30-day money-back guarantee. See our shipping & returns page for details."
    },
    {
        question: "Do you offer subscriptions?",
        answer: "Yes, we offer subscription discounts. Visit our subscribe page for more information."
    },
    {
        question: "What certifications do you have?",
        answer: "We are GMP-certified, FDA-compliant, 3rd party tested, and Non-GMO verified."
    }
];

// Save enhanced knowledge base
const knowledgeBasePath = join(__dirname, 'zia-knowledge-base.json');
fs.writeFileSync(knowledgeBasePath, JSON.stringify(knowledgeBase, null, 2));

console.log('✅ Complete Zia Knowledge Base Created!');
console.log(`\n📊 Statistics:`);
console.log(`   Total Products: ${knowledgeBase.statistics.total_products}`);
console.log(`   Products with UPC: ${knowledgeBase.statistics.products_with_upc}`);
console.log(`   Products with GTIN: ${knowledgeBase.statistics.products_with_gtin}`);
console.log(`   Products with Ingredients: ${knowledgeBase.statistics.products_with_ingredients}`);
console.log(`   Products with Supplement Facts: ${knowledgeBase.statistics.products_with_supplement_facts}`);
console.log(`   Categories: ${knowledgeBase.statistics.total_categories}`);
console.log(`   Indexed Ingredients: ${Object.keys(knowledgeBase.lookup.by_ingredient).length}`);
console.log(`\n📦 Sample Product Data:`);
if (knowledgeBase.products.length > 0) {
    const sample = knowledgeBase.products[0];
    console.log(`   SKU: ${sample.sku}`);
    console.log(`   Title: ${sample.title.substring(0, 60)}...`);
    console.log(`   UPC: ${sample.upc || 'N/A'}`);
    console.log(`   GTIN: ${sample.gtin || 'N/A'}`);
    console.log(`   Price: $${sample.price}`);
    console.log(`   Category: ${sample.category}`);
    console.log(`   Has Description: ${!!sample.description}`);
    console.log(`   Has Ingredients: ${!!sample.ingredients}`);
    console.log(`   Has Supplement Facts: ${!!sample.supplement_facts}`);
}
console.log(`\n📁 Saved to: ${knowledgeBasePath}`);
console.log(`\n🎯 Zia can now answer:`);
console.log(`   - "What's the title of SKU 52274-401?"`);
console.log(`   - "Show me description for product with UPC 783325397399"`);
console.log(`   - "What products contain L-Arginine?"`);
console.log(`   - "List all Women's Health products"`);
console.log(`   - "What are the supplement facts for [product name]?"`);
