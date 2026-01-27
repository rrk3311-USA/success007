/**
 * Vercel Serverless Function: Get Product by SKU
 * GET /api/zia/products/:sku
 */

import { getProductBySKU } from '../../_utils/products.js';

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({
            success: false,
            error: 'Method not allowed'
        });
    }

    try {
        // Extract SKU from path parameter (Vercel dynamic route)
        // For [sku].js, the parameter is in req.query.sku
        const sku = req.query.sku || (req.url ? req.url.split('/').pop() : null);
        
        if (!sku) {
            return res.status(400).json({
                success: false,
                error: 'SKU parameter is required'
            });
        }
        
        const product = getProductBySKU(sku);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }
        
        res.json({
            success: true,
            product: {
                sku: product.sku,
                name: product.name,
                price: product.price,
                category: product.category,
                description: product.description,
                short_description: product.short_description,
                ingredients: product.ingredients,
                supplement_facts: product.supplement_facts,
                suggested_use: product.suggested_use,
                key_features: product.key_search_terms,
                images: product.images,
                url: `https://successchemistry.com/product?sku=${product.sku}`
            }
        });
    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
}
