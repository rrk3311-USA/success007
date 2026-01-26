/**
 * Find eBay Category
 * 
 * Uses Taxonomy API to find correct leaf category for vitamins/supplements
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load config
let CONFIG;
try {
    const configPath = join(__dirname, 'deploy-site', 'config.js');
    const configModule = await import(`file://${configPath}?update=${Date.now()}`);
    CONFIG = configModule.CONFIG || configModule.default || configModule;
} catch (err) {
    console.error('❌ Could not load config.js:', err.message);
    process.exit(1);
}

const EBAY_CONFIG = CONFIG.EBAY_API;
const BASE_URL = EBAY_CONFIG.USE_SANDBOX ? EBAY_CONFIG.SANDBOX_BASE_URL : EBAY_CONFIG.BASE_URL;

async function getAccessToken() {
    return EBAY_CONFIG.ACCESS_TOKEN;
}

/**
 * Get category subtree for Health & Beauty
 */
async function getCategorySubtree(categoryId = '26395') {
    const token = await getAccessToken();
    if (!token) return null;
    
    // Use Commerce Taxonomy API
    const url = `${BASE_URL}/commerce/taxonomy/v1/category_tree/0/get_category_subtree?category_id=${categoryId}`;
    
    try {
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'
            }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            console.error(`❌ Error (${response.status}):`, data);
            return null;
        }
        
        return data;
    } catch (error) {
        console.error('❌ Error:', error.message);
        return null;
    }
}

/**
 * Recursively find leaf categories
 */
function findLeafCategories(node, results = []) {
    if (node.leafCategoryTreeNode === true) {
        results.push({
            categoryId: node.categoryId,
            categoryName: node.categoryName,
            fullPath: node.categoryNamePath || node.categoryName
        });
    }
    
    if (node.childCategoryTreeNodes) {
        node.childCategoryTreeNodes.forEach(child => {
            findLeafCategories(child, results);
        });
    }
    
    return results;
}

async function main() {
    console.log('='.repeat(60));
    console.log('Find eBay Category');
    console.log('='.repeat(60));
    console.log('');
    console.log('Searching for Vitamins & Dietary Supplements category...');
    console.log('');
    
    const subtree = await getCategorySubtree('26395'); // Health & Beauty
    
    if (subtree && subtree.rootCategoryNode) {
        const leafCategories = findLeafCategories(subtree.rootCategoryNode);
        
        // Filter for vitamins/supplements related
        const supplementCategories = leafCategories.filter(cat => 
            cat.categoryName.toLowerCase().includes('vitamin') ||
            cat.categoryName.toLowerCase().includes('supplement') ||
            cat.categoryName.toLowerCase().includes('dietary')
        );
        
        if (supplementCategories.length > 0) {
            console.log('✅ Found supplement-related leaf categories:');
            console.log('');
            supplementCategories.forEach(cat => {
                console.log(`   Category ID: ${cat.categoryId}`);
                console.log(`   Name: ${cat.categoryName}`);
                console.log(`   Path: ${cat.fullPath}`);
                console.log('');
            });
            
            if (supplementCategories.length === 1) {
                console.log('💡 Use this category ID:', supplementCategories[0].categoryId);
            }
        } else {
            console.log('⚠️  No supplement categories found in leaf categories');
            console.log('');
            console.log('Showing first 10 leaf categories:');
            leafCategories.slice(0, 10).forEach(cat => {
                console.log(`   ${cat.categoryId}: ${cat.categoryName}`);
            });
        }
    } else {
        console.log('❌ Could not retrieve category tree');
    }
}

main().catch(console.error);
