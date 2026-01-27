/**
 * Vercel Serverless Function: Search Products
 * GET /api/zia/products/search?q=QUERY&field=ingredients
 */

import { searchProducts } from '../../_utils/products.js';

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
        const { q, field } = req.query;
        
        if (!q) {
            return res.status(400).json({
                success: false,
                error: 'Query parameter "q" is required'
            });
        }
        
        const results = searchProducts(q, field || 'all');
        
        res.json({
            success: true,
            query: q,
            count: results.length,
            products: results.map(p => ({
                sku: p.sku,
                name: p.name,
                price: p.price,
                category: p.category,
                short_description: p.short_description,
                ingredients: p.ingredients,
                key_features: p.key_search_terms,
                url: `https://successchemistry.com/product?sku=${p.sku}`
            }))
        });
    } catch (error) {
        console.error('Product search error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
}
