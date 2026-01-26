/**
 * Find eBay Leaf Category for Vitamins/Supplements
 * Uses eBay Taxonomy API to find the correct leaf category
 */

import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const ACCESS_TOKEN = process.env.EBAY_ACCESS_TOKEN;
const BASE_URL = 'https://api.ebay.com';

if (!ACCESS_TOKEN) {
    console.error('❌ EBAY_ACCESS_TOKEN not found in .env');
    process.exit(1);
}

async function findCategory() {
    console.log('🔍 Finding leaf category for Vitamins & Supplements...\n');
    
    // Step 1: Get default category tree ID
    const treeResponse = await fetch(`${BASE_URL}/commerce/taxonomy/v1/get_default_category_tree_id?marketplace_id=EBAY_US`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
        }
    });
    
    const treeData = await treeResponse.json();
    
    if (!treeResponse.ok) {
        console.error('❌ Error getting category tree:', JSON.stringify(treeData, null, 2));
        process.exit(1);
    }
    
    const categoryTreeId = treeData.categoryTreeId;
    console.log(`✅ Category Tree ID: ${categoryTreeId}\n`);
    
    // Step 2: Get category suggestions
    const suggestionsResponse = await fetch(`${BASE_URL}/commerce/taxonomy/v1/category_tree/${categoryTreeId}/get_category_suggestions?q=vitamins+dietary+supplements+liver+cleanse`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
        }
    });
    
    const suggestionsData = await suggestionsResponse.json();
    
    if (!suggestionsResponse.ok) {
        console.error('❌ Error getting category suggestions:', JSON.stringify(suggestionsData, null, 2));
        process.exit(1);
    }
    
    console.log('📋 Category Suggestions:');
    console.log('='.repeat(70));
    
    if (suggestionsData.categorySuggestions && suggestionsData.categorySuggestions.length > 0) {
        suggestionsData.categorySuggestions.forEach((cat, index) => {
            console.log(`\n${index + 1}. ${cat.category.categoryName}`);
            console.log(`   Category ID: ${cat.category.categoryId}`);
            console.log(`   Full Path: ${cat.category.categoryTreeNodeAncestors?.map(a => a.categoryName).join(' > ') || 'N/A'} > ${cat.category.categoryName}`);
            console.log(`   Leaf Category: ${cat.category.leafCategoryTreeNode ? 'Yes ✅' : 'No ❌'}`);
        });
        
        // Find first leaf category
        const leafCategory = suggestionsData.categorySuggestions.find(cat => cat.category.leafCategoryTreeNode);
        if (leafCategory) {
            console.log('\n' + '='.repeat(70));
            console.log(`\n✅ Recommended Leaf Category:`);
            console.log(`   Name: ${leafCategory.category.categoryName}`);
            console.log(`   ID: ${leafCategory.category.categoryId}`);
            console.log(`\n💡 Use this category ID in your listing: ${leafCategory.category.categoryId}`);
        } else {
            console.log('\n⚠️  No leaf categories found in suggestions. Try a more specific search.');
        }
    } else {
        console.log('No category suggestions found.');
    }
}

findCategory().catch(error => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
});
