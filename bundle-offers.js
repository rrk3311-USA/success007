// Bundle Offers Data
// Separate from single products - this is for multi-pack bundles
// Structure: Same as products-data.js but for bundles only

const BUNDLE_OFFERS_DATA = {
    // Example structure - will be populated with actual bundle data
    // "1989-403-5": {
    //     "sku": "1989-403-5",
    //     "name": "Goddess Unleashed Women's Multivitamin - 5 Pack (300 Capsules Total)",
    //     "price": 0, // Will be set
    //     "category": "Bundle Deals",
    //     "description": "", // Full description from Walmart API or provided
    //     "short_description": "", // Short version
    //     "suggested_use": "", // Same as single product
    //     "supplement_facts": "", // Same as single product
    //     "ingredients": "", // Same as single product
    //     "weight": "", // 5x single product weight
    //     "dimensions": "", // Bundle dimensions
    //     "images": [
    //         // Bundle-specific images (5 bottles together)
    //         // If not available, can use single product images
    //     ],
    //     "stock": 100000,
    //     "upc": "", // Will get from Walmart API or provided
    //     "gtin": "", // Will get from Walmart API or provided
    //     "base_product_sku": "1989-403", // Reference to single product
    //     "quantity": 5, // Number of bottles in bundle
    //     "key_search_terms": "",
    //     "seo_targets": {
    //         "long_tail": [],
    //         "short_tail": []
    //     }
    // }
};

// Helper functions (same as products-data.js)
function getBundleBySKU(sku) {
    return BUNDLE_OFFERS_DATA[sku] || null;
}

function getAllBundles() {
    return Object.values(BUNDLE_OFFERS_DATA);
}

function getBundlesByCategory(category) {
    return Object.values(BUNDLE_OFFERS_DATA).filter(bundle => 
        bundle.category === category
    );
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        BUNDLE_OFFERS_DATA,
        getBundleBySKU,
        getAllBundles,
        getBundlesByCategory
    };
}
