/**
 * Shared utilities for product API endpoints
 * Loads and searches product data
 */

import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

// Load product data
let PRODUCTS_DATA = {};
try {
    const productsModule = require('../../deploy-site/products-data.js');
    PRODUCTS_DATA = productsModule.PRODUCTS_DATA || {};
} catch (error) {
    console.error('Error loading products data:', error);
}

// Helper function to search products
export function searchProducts(query, field = 'all') {
    const results = [];
    const queryLower = query.toLowerCase();
    
    Object.values(PRODUCTS_DATA).forEach(product => {
        let score = 0;
        let matched = false;
        
        if (field === 'all' || field === 'ingredients') {
            if (product.ingredients?.toLowerCase().includes(queryLower)) {
                score += 3;
                matched = true;
            }
        }
        
        if (field === 'all' || field === 'name') {
            if (product.name?.toLowerCase().includes(queryLower)) {
                score += 2;
                matched = true;
            }
        }
        
        if (field === 'all' || field === 'description') {
            if (product.description?.toLowerCase().includes(queryLower)) {
                score += 2;
                matched = true;
            }
        }
        
        if (field === 'all' || field === 'category') {
            if (product.category?.toLowerCase().includes(queryLower)) {
                score += 2;
                matched = true;
            }
        }
        
        if (field === 'all' || field === 'goals') {
            const searchTerms = product.key_search_terms?.toLowerCase() || '';
            const seoTargets = JSON.stringify(product.seo_targets || {}).toLowerCase();
            if (searchTerms.includes(queryLower) || seoTargets.includes(queryLower)) {
                score += 1;
                matched = true;
            }
        }
        
        if (matched) {
            results.push({ ...product, relevanceScore: score });
        }
    });
    
    return results.sort((a, b) => b.relevanceScore - a.relevanceScore).slice(0, 10);
}

export function getProductBySKU(sku) {
    return PRODUCTS_DATA[sku] || null;
}

export function getAllProducts() {
    return Object.values(PRODUCTS_DATA);
}

export { PRODUCTS_DATA };
