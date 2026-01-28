/**
 * Enhance Zia Knowledge Base with Complete Product Data
 * Extracts all product details (SKU, UPC, GTIN, ingredients, labels) from products-data.js
 */

import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read products data file
const productsFilePath = join(__dirname, 'deploy-site/products-data.js');
const productsFileContent = fs.readFileSync(productsFilePath, 'utf-8');

// Extract PRODUCTS_DATA object using regex
const productsMatch = productsFileContent.match(/const PRODUCTS_DATA = ({[\s\S]*?});/);
if (!productsMatch) {
    console.error('❌ Could not find PRODUCTS_DATA in products-data.js');
    process.exit(1);
}

// Parse the products data
let productsData;
try {
    // Use eval in a safe way to parse the object
    productsData = eval('(' + productsMatch[1] + ')');
} catch (error) {
    console.error('❌ Error parsing products data:', error);
    process.exit(1);
}

// Read existing knowledge base
const knowledgeBasePath = join(__dirname, 'zia-knowledge-base.json');
let knowledgeBase = {};
if (fs.existsSync(knowledgeBasePath)) {
    knowledgeBase = JSON.parse(fs.readFileSync(knowledgeBasePath, 'utf-8'));
}

// Extract product details for Zia
const productDetails = Object.entries(productsData).map(([sku, product]) => {
    return {
        sku: product.sku || sku,
        name: product.name || '',
        price: product.price || 0,
        category: product.category || '',
        upc: product.upc || '',
        gtin: product.gtin || '',
        ingredients: product.ingredients || product.description?.match(/Ingredients?:[\s\S]*?(?=\n\n|\n✅|$)/i)?.[0] || '',
        supplement_facts: product.supplement_facts || '',
        suggested_use: product.suggested_use || '',
        short_description: product.short_description || '',
        key_search_terms: product.key_search_terms || '',
        weight: product.weight || '',
        dimensions: product.dimensions || '',
        stock: product.stock || 0,
        images: product.images || [],
        url: `https://successchemistry.com/product?sku=${product.sku || sku}`
    };
});

// Enhance knowledge base with product catalog
knowledgeBase.productCatalog = {
    totalProducts: productDetails.length,
    products: productDetails.map(p => ({
        sku: p.sku,
        name: p.name,
        category: p.category,
        price: p.price,
        upc: p.upc,
        gtin: p.gtin,
        ingredients: p.ingredients,
        supplement_facts: p.supplement_facts,
        suggested_use: p.suggested_use,
        key_search_terms: p.key_search_terms,
        url: p.url
    }))
};

// Add product lookup by SKU
knowledgeBase.productLookup = {};
productDetails.forEach(product => {
    knowledgeBase.productLookup[product.sku] = {
        name: product.name,
        category: product.category,
        price: product.price,
        upc: product.upc,
        gtin: product.gtin,
        ingredients: product.ingredients,
        supplement_facts: product.supplement_facts,
        suggested_use: product.suggested_use,
        short_description: product.short_description,
        weight: product.weight,
        dimensions: product.dimensions,
        stock: product.stock,
        url: product.url
    };
});

// Add product lookup by UPC
knowledgeBase.upcLookup = {};
productDetails.forEach(product => {
    if (product.upc) {
        knowledgeBase.upcLookup[product.upc] = product.sku;
    }
});

// Add product lookup by GTIN
knowledgeBase.gtinLookup = {};
productDetails.forEach(product => {
    if (product.gtin) {
        knowledgeBase.gtinLookup[product.gtin] = product.sku;
    }
});

// Add ingredient search index
knowledgeBase.ingredientIndex = {};
productDetails.forEach(product => {
    if (product.ingredients) {
        // Extract ingredient names (simple extraction)
        const ingredientText = product.ingredients.toLowerCase();
        const commonIngredients = [
            'l-arginine', 'maca', 'ashwagandha', 'ginseng', 'zinc', 'vitamin a', 'vitamin b', 'vitamin c', 'vitamin d', 'vitamin e',
            'saw palmetto', 'quercetin', 'lutein', 'zeaxanthin', 'd-mannose', 'cranberry', 'milk thistle', 'dandelion',
            'turmeric', 'ginger', 'biotin', 'collagen', 'bamboo', 'horsetail', 'african mango', 'artichoke'
        ];
        
        commonIngredients.forEach(ingredient => {
            if (ingredientText.includes(ingredient)) {
                if (!knowledgeBase.ingredientIndex[ingredient]) {
                    knowledgeBase.ingredientIndex[ingredient] = [];
                }
                knowledgeBase.ingredientIndex[ingredient].push(product.sku);
            }
        });
    }
});

// Add category index
knowledgeBase.categoryIndex = {};
productDetails.forEach(product => {
    if (product.category) {
        if (!knowledgeBase.categoryIndex[product.category]) {
            knowledgeBase.categoryIndex[product.category] = [];
        }
        knowledgeBase.categoryIndex[product.category].push(product.sku);
    }
});

// Save enhanced knowledge base
fs.writeFileSync(knowledgeBasePath, JSON.stringify(knowledgeBase, null, 2));

console.log('✅ Enhanced Zia Knowledge Base with Product Data!');
console.log(`\n📊 Statistics:`);
console.log(`   Total Products: ${productDetails.length}`);
console.log(`   Products with UPC: ${productDetails.filter(p => p.upc).length}`);
console.log(`   Products with GTIN: ${productDetails.filter(p => p.gtin).length}`);
console.log(`   Products with Ingredients: ${productDetails.filter(p => p.ingredients).length}`);
console.log(`   Products with Supplement Facts: ${productDetails.filter(p => p.supplement_facts).length}`);
console.log(`   Unique Categories: ${Object.keys(knowledgeBase.categoryIndex).length}`);
console.log(`   Ingredient Index Entries: ${Object.keys(knowledgeBase.ingredientIndex).length}`);
console.log(`\n📁 Saved to: ${knowledgeBasePath}`);
console.log(`\n🎯 Zia can now answer questions about:`);
console.log(`   - Product SKUs, UPCs, and GTINs`);
console.log(`   - Ingredients and supplement facts`);
console.log(`   - Product categories and pricing`);
console.log(`   - Product labels and usage instructions`);
console.log(`   - Search by ingredient or category`);
