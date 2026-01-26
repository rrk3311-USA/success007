/**
 * Find eBay Leaf Category
 * 
 * Uses Taxonomy API to find the correct leaf category for supplements
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
 * Step 1: Get default category tree ID
 */
async function getDefaultCategoryTreeId() {
    const token = await getAccessToken();
    if (!token) return null;
    
    console.log('Step 1: Getting default category tree ID...');
    console.log('');
    
    const url = `${BASE_URL}/commerce/taxonomy/v1/get_default_category_tree_id?marketplace_id=EBAY_US`;
    
    try {
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            console.error(`❌ Error (${response.status}):`, data);
            return null;
        }
        
        console.log('✅ Category Tree ID:', data.categoryTreeId);
        console.log('');
        return data.categoryTreeId;
    } catch (error) {
        console.error('❌ Error:', error.message);
        return null;
    }
}

/**
 * Step 2: Search categories by keyword
 */
async function searchCategories(treeId, query = 'dietary supplements') {
    const token = await getAccessToken();
    if (!token) return null;
    
    console.log(`Step 2: Searching categories for "${query}"...`);
    console.log('');
    
    const url = `${BASE_URL}/commerce/taxonomy/v1/category_tree/${treeId}/get_category_suggestions?q=${encodeURIComponent(query)}`;
    
    try {
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            console.error(`❌ Error (${response.status}):`, data);
            return null;
        }
        
        if (data.categorySuggestions && data.categorySuggestions.length > 0) {
            console.log(`✅ Found ${data.categorySuggestions.length} category suggestions:`);
            console.log('');
            
            data.categorySuggestions.slice(0, 10).forEach((cat, idx) => {
                console.log(`${idx + 1}. Category ID: ${cat.category.categoryId}`);
                console.log(`   Name: ${cat.category.categoryName}`);
                console.log(`   Path: ${cat.category.categoryNamePath || 'N/A'}`);
                console.log('');
            });
            
            return data.categorySuggestions;
        } else {
            console.log('⚠️  No suggestions found');
            return null;
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
        return null;
    }
}

/**
 * Step 3: Verify if category is a leaf
 */
async function verifyLeafCategory(treeId, categoryId) {
    const token = await getAccessToken();
    if (!token) return null;
    
    console.log(`Step 3: Verifying if category ${categoryId} is a leaf...`);
    console.log('');
    
    const url = `${BASE_URL}/commerce/taxonomy/v1/category_tree/${treeId}/get_category_subtree?category_id=${categoryId}`;
    
    try {
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            console.error(`❌ Error (${response.status}):`, data);
            return null;
        }
        
        if (data.rootCategoryNode) {
            const isLeaf = data.rootCategoryNode.leafCategoryTreeNode === true;
            console.log(`Category: ${data.rootCategoryNode.categoryName}`);
            console.log(`Category ID: ${data.rootCategoryNode.categoryId}`);
            console.log(`Is Leaf: ${isLeaf ? '✅ YES' : '❌ NO'}`);
            
            if (!isLeaf && data.rootCategoryNode.childCategoryTreeNodes) {
                console.log('');
                console.log(`Has ${data.rootCategoryNode.childCategoryTreeNodes.length} child categories`);
                console.log('Child categories:');
                data.rootCategoryNode.childCategoryTreeNodes.slice(0, 5).forEach(child => {
                    console.log(`  - ${child.categoryId}: ${child.categoryName} (Leaf: ${child.leafCategoryTreeNode === true ? 'Yes' : 'No'})`);
                });
            }
            
            console.log('');
            return { isLeaf, node: data.rootCategoryNode };
        }
        
        return null;
    } catch (error) {
        console.error('❌ Error:', error.message);
        return null;
    }
}

/**
 * Find leaf categories recursively
 */
function findLeafCategories(node, results = []) {
    if (node.leafCategoryTreeNode === true) {
        results.push({
            categoryId: node.categoryId,
            categoryName: node.categoryName,
            path: node.categoryNamePath || node.categoryName
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
    console.log('Find eBay Leaf Category');
    console.log('='.repeat(60));
    console.log('');
    
    // Step 1: Get tree ID
    const treeId = await getDefaultCategoryTreeId();
    if (!treeId) {
        console.log('❌ Could not get category tree ID');
        process.exit(1);
    }
    
    // Step 2: Search for supplements
    const suggestions = await searchCategories(treeId, 'dietary supplements');
    
    if (!suggestions || suggestions.length === 0) {
        console.log('⚠️  No suggestions found. Trying alternative searches...');
        const altSuggestions = await searchCategories(treeId, 'vitamins');
        if (altSuggestions) {
            suggestions = altSuggestions;
        }
    }
    
    if (suggestions && suggestions.length > 0) {
        // Try the first suggestion
        const firstCategory = suggestions[0].category;
        console.log('='.repeat(60));
        console.log('Checking first suggestion...');
        console.log('='.repeat(60));
        console.log('');
        
        const verification = await verifyLeafCategory(treeId, firstCategory.categoryId);
        
        if (verification && verification.isLeaf) {
            console.log('='.repeat(60));
            console.log('✅ FOUND LEAF CATEGORY!');
            console.log('='.repeat(60));
            console.log(`Category ID: ${firstCategory.categoryId}`);
            console.log(`Category Name: ${firstCategory.categoryName}`);
            console.log('');
            console.log('💡 Update create-ebay-listing.js with this category ID');
        } else if (verification && !verification.isLeaf) {
            // Find leaf categories in subtree
            console.log('='.repeat(60));
            console.log('Finding leaf categories in subtree...');
            console.log('='.repeat(60));
            console.log('');
            
            const leafCategories = findLeafCategories(verification.node);
            
            if (leafCategories.length > 0) {
                console.log(`Found ${leafCategories.length} leaf categories:`);
                console.log('');
                leafCategories.slice(0, 5).forEach(cat => {
                    console.log(`  Category ID: ${cat.categoryId}`);
                    console.log(`  Name: ${cat.categoryName}`);
                    console.log(`  Path: ${cat.path}`);
                    console.log('');
                });
                
                if (leafCategories.length === 1) {
                    console.log('💡 Use this category ID:', leafCategories[0].categoryId);
                }
            }
        }
    }
    
    console.log('='.repeat(60));
}

main().catch(error => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
});
