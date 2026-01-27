/**
 * Vercel Serverless Function: Get All Products
 * GET /api/zia/products
 */

import { getAllProducts } from '../../_utils/products.js';

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
        const products = getAllProducts().map(p => ({
            sku: p.sku,
            name: p.name,
            price: p.price,
            category: p.category,
            short_description: p.short_description
        }));
        
        res.json({
            success: true,
            count: products.length,
            products
        });
    } catch (error) {
        console.error('Get all products error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
}
