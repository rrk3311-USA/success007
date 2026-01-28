// Simple static file server for frontend (port 8080)
// This serves all your HTML, CSS, JS, and images
// NOW SERVING FROM GITHUB REPO LOCATION (so GitHub Desktop sees all changes!)
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { renderProductPage } from './server-render-product.js';
import { syncLeadToZoho } from './zoho-crm-integration.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOG_FILE = path.join(__dirname, '.cursor/debug.log');

// Helper to write log
function writeLog(entry) {
    try {
        fs.appendFileSync(LOG_FILE, JSON.stringify(entry) + '\n');
    } catch (e) {}
}

// #region agent log
writeLog({location:'local-server.js:12',message:'Server initialization',data:{dirname:__dirname,deploySitePath:path.join(__dirname,'deploy-site')},timestamp:Date.now(),sessionId:'debug-session',runId:'init',hypothesisId:'B'});
// #endregion agent log

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware for parsing JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log all incoming requests
app.use((req, res, next) => {
    writeLog({location:'local-server.js:27',message:'Incoming request',data:{method:req.method,path:req.path,url:req.url,ip:req.ip},timestamp:Date.now(),sessionId:'debug-session',runId:'runtime',hypothesisId:'D'});
    next();
});

// Handle favicon requests to prevent 404 errors
app.get('/favicon.ico', (req, res) => {
    // Return a minimal 1x1 transparent PNG as favicon
    const favicon = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    res.send(favicon);
});

// Route handling for clean URLs (BEFORE static middleware to prevent redirects)
app.get('/', (req, res) => {
    // #region agent log
    const indexPath = path.join(__dirname, 'deploy-site/index.html');
    writeLog({location:'local-server.js:35',message:'Route / hit',data:{path:req.path,filePath:indexPath,exists:fs.existsSync(indexPath)},timestamp:Date.now(),sessionId:'debug-session',runId:'runtime',hypothesisId:'D'});
    // #endregion agent log
    res.sendFile(indexPath, (err) => {
        if (err) {
            writeLog({location:'local-server.js:38',message:'Error sending index.html',data:{error:err.message,code:err.code},timestamp:Date.now(),sessionId:'debug-session',runId:'runtime',hypothesisId:'C'});
            res.status(500).send('Error loading page');
        }
    });
});

app.get('/shop', (req, res) => {
    // #region agent log
    const shopPath = path.join(__dirname, 'deploy-site/shop/index.html');
    writeLog({location:'local-server.js:45',message:'Route /shop hit',data:{path:req.path,filePath:shopPath,exists:fs.existsSync(shopPath)},timestamp:Date.now(),sessionId:'debug-session',runId:'runtime',hypothesisId:'D'});
    // #endregion agent log
    res.sendFile(shopPath, (err) => {
        if (err) {
            writeLog({location:'local-server.js:48',message:'Error sending shop/index.html',data:{error:err.message,code:err.code},timestamp:Date.now(),sessionId:'debug-session',runId:'runtime',hypothesisId:'C'});
            res.status(500).send('Error loading shop page');
        }
    });
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'deploy-site/admin/index.html'));
});

app.get('/cart', (req, res) => {
    res.sendFile(path.join(__dirname, 'deploy-site/cart/index.html'));
});

app.get('/blog', (req, res) => {
    res.sendFile(path.join(__dirname, 'deploy-site/blog/index.html'));
});

// Serve individual blog post pages (with .html extension)
app.get('/blog/:slug.html', (req, res) => {
    const slug = req.params.slug;
    const blogPostPath = path.join(__dirname, 'deploy-site/blog', `${slug}.html`);
    
    // Check if file exists
    if (fs.existsSync(blogPostPath)) {
        res.sendFile(blogPostPath);
    } else {
        // Fallback to blog listing page
        res.redirect('/blog');
    }
});

// Also support clean URLs without .html (redirect to .html version)
app.get('/blog/:slug', (req, res) => {
    const slug = req.params.slug;
    const blogPostPath = path.join(__dirname, 'deploy-site/blog', `${slug}.html`);
    
    // Check if file exists
    if (fs.existsSync(blogPostPath)) {
        res.redirect(`/blog/${slug}.html`);
    } else {
        // Fallback to blog listing page
        res.redirect('/blog');
    }
});

app.get('/faq', (req, res) => {
    res.sendFile(path.join(__dirname, 'deploy-site/faq/index.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'deploy-site/contact/index.html'));
});

app.get('/product/:sku', (req, res) => {
    const sku = req.params.sku;
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    try {
        // Server-side render with schema, canonical, and meta tags
        const html = renderProductPage(sku, baseUrl);
        res.send(html);
    } catch (error) {
        console.error('Error rendering product page:', error);
        // Fallback to static file
        res.sendFile(path.join(__dirname, 'deploy-site/product/index.html'));
    }
});

app.get('/product', (req, res) => {
    const sku = req.query.sku;
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    // Check for specific static product pages first
    if (sku === '10777-810') {
        // Serve the new server-rendered Liver Cleanse page
        res.sendFile(path.join(__dirname, 'deploy-site/product/liver-cleanse-10777-810.html'));
        return;
    }
    
    if (sku) {
        try {
            // Server-side render with schema, canonical, and meta tags
            const html = renderProductPage(sku, baseUrl);
            res.send(html);
        } catch (error) {
            console.error('Error rendering product page:', error);
            // Fallback to static file
            res.sendFile(path.join(__dirname, 'deploy-site/product/index.html'));
        }
    } else {
        // No SKU provided, serve static file
        res.sendFile(path.join(__dirname, 'deploy-site/product/index.html'));
    }
});

// Additional pages - support both folder and .html versions
app.get('/privacy-policy', (req, res) => {
    const htmlFile = path.join(__dirname, 'deploy-site/privacy-policy.html');
    const folderFile = path.join(__dirname, 'deploy-site/privacy-policy/index.html');
    res.sendFile(fs.existsSync(htmlFile) ? htmlFile : folderFile);
});

app.get('/privacy-policy.html', (req, res) => {
    const htmlFile = path.join(__dirname, 'deploy-site/privacy-policy.html');
    const folderFile = path.join(__dirname, 'deploy-site/privacy-policy/index.html');
    res.sendFile(fs.existsSync(htmlFile) ? htmlFile : folderFile);
});

app.get('/shipping-returns', (req, res) => {
    const htmlFile = path.join(__dirname, 'deploy-site/shipping-returns.html');
    const folderFile = path.join(__dirname, 'deploy-site/shipping-returns/index.html');
    res.sendFile(fs.existsSync(htmlFile) ? htmlFile : folderFile);
});

app.get('/shipping-returns.html', (req, res) => {
    const htmlFile = path.join(__dirname, 'deploy-site/shipping-returns.html');
    const folderFile = path.join(__dirname, 'deploy-site/shipping-returns/index.html');
    res.sendFile(fs.existsSync(htmlFile) ? htmlFile : folderFile);
});

app.get('/terms-of-service', (req, res) => {
    const htmlFile = path.join(__dirname, 'deploy-site/terms-of-service.html');
    const folderFile = path.join(__dirname, 'deploy-site/terms-of-service/index.html');
    res.sendFile(fs.existsSync(htmlFile) ? htmlFile : folderFile);
});

app.get('/terms-of-service.html', (req, res) => {
    const htmlFile = path.join(__dirname, 'deploy-site/terms-of-service.html');
    const folderFile = path.join(__dirname, 'deploy-site/terms-of-service/index.html');
    res.sendFile(fs.existsSync(htmlFile) ? htmlFile : folderFile);
});

app.get('/payment-policy', (req, res) => {
    const htmlFile = path.join(__dirname, 'deploy-site/payment-policy.html');
    const folderFile = path.join(__dirname, 'deploy-site/payment-policy/index.html');
    res.sendFile(fs.existsSync(htmlFile) ? htmlFile : folderFile);
});

app.get('/payment-policy.html', (req, res) => {
    const htmlFile = path.join(__dirname, 'deploy-site/payment-policy.html');
    const folderFile = path.join(__dirname, 'deploy-site/payment-policy/index.html');
    res.sendFile(fs.existsSync(htmlFile) ? htmlFile : folderFile);
});

app.get('/subscribe', (req, res) => {
    res.sendFile(path.join(__dirname, 'deploy-site/subscribe.html'));
});

app.get('/thank-you', (req, res) => {
    res.sendFile(path.join(__dirname, 'deploy-site/thank-you.html'));
});

app.get('/my-account', (req, res) => {
    res.sendFile(path.join(__dirname, 'deploy-site/my-account-dashboard.html'));
});

app.get('/command-center', (req, res) => {
    res.sendFile(path.join(__dirname, 'deploy-site/command-center/index.html'));
});

app.get('/vision-board', (req, res) => {
    res.sendFile(path.join(__dirname, 'deploy-site/vision-board/index.html'));
});

app.get('/ebay-auth-denied', (req, res) => {
    res.sendFile(path.join(__dirname, 'deploy-site/ebay-auth-denied.html'));
});

app.get('/ebay-auth-ok', (req, res) => {
    res.sendFile(path.join(__dirname, 'deploy-site/ebay-auth-ok.html'));
});

// Sclera i18n subdomain-style pages (12 languages)
const SCLERA_LANGS = ['en', 'es', 'fr', 'de', 'pt', 'it', 'zh', 'ja', 'ar', 'ru', 'hi', 'ko', 'nl'];
app.get('/sclera', (req, res) => res.redirect('/sclera/en'));
app.get('/sclera/', (req, res) => res.redirect('/sclera/en'));
app.get('/sclera/:lang', (req, res) => {
    const lang = req.params.lang;
    if (!SCLERA_LANGS.includes(lang)) {
        return res.redirect('/sclera/en');
    }
    const indexPath = path.join(__dirname, 'deploy-site/sclera', lang, 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.redirect('/sclera/en');
    }
});
app.get('/sclera/:lang/', (req, res) => {
    const lang = req.params.lang;
    if (!SCLERA_LANGS.includes(lang)) {
        return res.redirect('/sclera/en');
    }
    const indexPath = path.join(__dirname, 'deploy-site/sclera', lang, 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.redirect('/sclera/en');
    }
});

// Handle images with spaces in filenames (URL-encoded or with spaces)
app.get('/public/images/real-factory-images/:filename(*)', (req, res) => {
    let filename = req.params.filename;
    // Decode URL encoding if present
    filename = decodeURIComponent(filename);
    const filePath = path.join(__dirname, 'deploy-site', 'public', 'images', 'real-factory-images', filename);
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        // Try with original spaces if URL-encoded didn't work
        const altPath = path.join(__dirname, 'deploy-site', 'public', 'images', 'real-factory-images', req.params.filename);
        if (fs.existsSync(altPath)) {
            res.sendFile(altPath);
        } else {
            res.status(404).send('File not found');
        }
    }
});

// Serve Phosphor Icons font files with proper MIME types and CORS headers (for mobile compatibility)
app.get('/public/phosphor-icons/Fonts/:weight/:filename', (req, res) => {
    const { weight, filename } = req.params;
    const filePath = path.join(__dirname, 'deploy-site', 'public', 'phosphor-icons', 'Fonts', weight, filename);
    
    if (fs.existsSync(filePath)) {
        // Set proper MIME types for font files
        const ext = path.extname(filename).toLowerCase();
        const mimeTypes = {
            '.woff2': 'font/woff2',
            '.woff': 'font/woff',
            '.ttf': 'font/ttf',
            '.svg': 'image/svg+xml',
            '.css': 'text/css'
        };
        const contentType = mimeTypes[ext] || 'application/octet-stream';
        
        res.setHeader('Content-Type', contentType);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        res.sendFile(filePath);
    } else {
        res.status(404).send('Font file not found');
    }
});

// ============================================
// ZOHO OAUTH CALLBACK - Handle OAuth redirect
// Must be BEFORE static middleware
// ============================================
app.get('/zoho/callback', async (req, res) => {
    try {
        const { code, state, error } = req.query;

        if (error) {
            console.error('Zoho OAuth error:', error);
            return res.status(400).send(`
                <html>
                    <head><title>Zoho OAuth Error</title></head>
                    <body style="font-family: Arial; padding: 40px; text-align: center;">
                        <h1 style="color: #d32f2f;">❌ Authorization Failed</h1>
                        <p>Error: ${error}</p>
                        <p><a href="/admin">Return to Admin</a></p>
                    </body>
                </html>
            `);
        }

        if (!code) {
            return res.status(400).send(`
                <html>
                    <head><title>Zoho OAuth Error</title></head>
                    <body style="font-family: Arial; padding: 40px; text-align: center;">
                        <h1 style="color: #d32f2f;">❌ No Authorization Code</h1>
                        <p>No authorization code received from Zoho.</p>
                        <p><a href="/admin">Return to Admin</a></p>
                    </body>
                </html>
            `);
        }

        // Exchange code for tokens
        const ZOHO_CLIENT_ID = process.env.ZOHO_CLIENT_ID;
        const ZOHO_CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET;
        const ZOHO_REDIRECT_URI = process.env.ZOHO_REDIRECT_URI || `http://localhost:${PORT}/zoho/callback`;
        const ZOHO_TOKEN_URL = 'https://accounts.zoho.com/oauth/v2/token';

        const tokenResponse = await fetch(ZOHO_TOKEN_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                client_id: ZOHO_CLIENT_ID,
                client_secret: ZOHO_CLIENT_SECRET,
                redirect_uri: ZOHO_REDIRECT_URI,
                code: code
            })
        });

        if (!tokenResponse.ok) {
            const error = await tokenResponse.text();
            console.error('Token exchange failed:', error);
            return res.status(500).send(`
                <html>
                    <head><title>Zoho OAuth Error</title></head>
                    <body style="font-family: Arial; padding: 40px; text-align: center;">
                        <h1 style="color: #d32f2f;">❌ Token Exchange Failed</h1>
                        <p>Failed to exchange authorization code for tokens.</p>
                        <p><a href="/admin">Return to Admin</a></p>
                    </body>
                </html>
            `);
        }

        const tokenData = await tokenResponse.json();
        
        // Update .env file with tokens
        const envPath = path.join(__dirname, '.env');
        let envContent = fs.readFileSync(envPath, 'utf8');

        // Update access token
        if (envContent.includes('ZOHO_CRM_ACCESS_TOKEN=')) {
            envContent = envContent.replace(
                /ZOHO_CRM_ACCESS_TOKEN=.*/,
                `ZOHO_CRM_ACCESS_TOKEN=${tokenData.access_token}`
            );
        } else {
            envContent += `\nZOHO_CRM_ACCESS_TOKEN=${tokenData.access_token}`;
        }

        // Update refresh token if provided
        if (tokenData.refresh_token) {
            if (envContent.includes('ZOHO_REFRESH_TOKEN=')) {
                envContent = envContent.replace(
                    /ZOHO_REFRESH_TOKEN=.*/,
                    `ZOHO_REFRESH_TOKEN=${tokenData.refresh_token}`
                );
            } else {
                envContent += `\nZOHO_REFRESH_TOKEN=${tokenData.refresh_token}`;
            }
        }

        fs.writeFileSync(envPath, envContent);
        console.log('✅ Zoho tokens saved to .env');

        // Show success page
        res.send(`
            <html>
                <head>
                    <title>Zoho OAuth Success</title>
                    <meta http-equiv="refresh" content="3;url=/admin">
                </head>
                <body style="font-family: Arial; padding: 40px; text-align: center; background: #f5f5f5;">
                    <div style="background: white; padding: 40px; border-radius: 8px; max-width: 500px; margin: 0 auto; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                        <h1 style="color: #4caf50;">✅ Authorization Successful!</h1>
                        <p>Your Zoho CRM access token has been saved.</p>
                        <p style="color: #666; font-size: 14px;">Redirecting to admin panel in 3 seconds...</p>
                        <p><a href="/admin" style="color: #1976d2; text-decoration: none;">Go to Admin Now →</a></p>
                    </div>
                </body>
            </html>
        `);

    } catch (error) {
        console.error('Zoho callback error:', error);
        res.status(500).send(`
            <html>
                <head><title>Zoho OAuth Error</title></head>
                <body style="font-family: Arial; padding: 40px; text-align: center;">
                    <h1 style="color: #d32f2f;">❌ Error</h1>
                    <p>${error.message}</p>
                    <p><a href="/admin">Return to Admin</a></p>
                </body>
            </html>
        `);
    }
});

// Serve static files from deploy-site directory (AFTER routes to prevent conflicts)
// IMPORTANT: This serves from GitHub repo ONLY, not CascadeProjects
// Cache-busting headers prevent browser from serving stale cached files
app.use(express.static(path.join(__dirname, 'deploy-site'), {
    // Disable caching in development to prevent stale files
    setHeaders: (res, filePath) => {
        // Only disable cache for HTML/JS/CSS in development
        if (process.env.NODE_ENV !== 'production') {
            if (filePath.endsWith('.html') || filePath.endsWith('.js') || filePath.endsWith('.css')) {
                res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
                res.setHeader('Pragma', 'no-cache');
                res.setHeader('Expires', '0');
            }
        }
    }
}));

// Serve blog-posts.json from root with correct Content-Type
app.get('/blog-posts.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.sendFile(path.join(__dirname, 'deploy-site/blog-posts.json'));
});

// Serve products-data.js from root with correct Content-Type
app.get('/products-data.js', (req, res) => {
    res.setHeader('Content-Type', 'application/javascript');
    res.sendFile(path.join(__dirname, 'deploy-site/products-data.js'));
});

// Serve sitemap.xml
app.get('/sitemap.xml', (req, res) => {
    res.sendFile(path.join(__dirname, 'deploy-site/sitemap.xml'));
});

// Serve robots.txt
app.get('/robots.txt', (req, res) => {
    res.sendFile(path.join(__dirname, 'deploy-site/robots.txt'));
});

// Serve llms.txt for AI agents
app.get('/llms.txt', (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.sendFile(path.join(__dirname, 'deploy-site/llms.txt'));
});

// Contact form API endpoint
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        
        // Validate input
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                error: 'All fields are required'
            });
        }
        
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid email address'
            });
        }
        
        // Log contact form submission
        const contactLog = {
            timestamp: new Date().toISOString(),
            name: name,
            email: email,
            message: message
        };
        
        // Write to log file
        const contactLogPath = path.join(__dirname, '.cursor/contact-submissions.log');
        try {
            fs.appendFileSync(contactLogPath, JSON.stringify(contactLog) + '\n');
            console.log('✅ Contact form submission logged:', { name, email });
        } catch (logError) {
            console.error('Failed to log contact submission:', logError);
            // Continue even if logging fails
        }
        
        // Optional: Send to Capsule CRM if integration is available
        // This would require importing the Capsule integration module
        // For now, we'll just log it
        
        // Return success
        res.json({
            success: true,
            message: 'Contact form submitted successfully'
        });
        
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// ============================================
// ZIA SKILLS API ENDPOINTS - For Zoho SalesIQ
// ============================================

// Load product data dynamically
let PRODUCTS_DATA = {};
try {
    const { createRequire } = await import('module');
    const require = createRequire(import.meta.url);
    const productsModule = require('./deploy-site/products-data.js');
    PRODUCTS_DATA = productsModule.PRODUCTS_DATA || {};
    console.log(`✅ Loaded ${Object.keys(PRODUCTS_DATA).length} products for Zia Skills API`);
} catch (error) {
    console.error('⚠️ Error loading products data:', error);
}

// Helper function to search products
function searchProducts(query, field = 'all') {
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

// API: Search products (for Zia Skills)
app.get('/api/zia/products/search', (req, res) => {
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
});

// API: Get product by SKU
app.get('/api/zia/products/:sku', (req, res) => {
    try {
        const { sku } = req.params;
        const product = PRODUCTS_DATA[sku];
        
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
});

// API: Get all products (summary)
app.get('/api/zia/products', (req, res) => {
    try {
        const products = Object.values(PRODUCTS_DATA).map(p => ({
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
});

// ============================================
// SALESIQ LEAD CAPTURE WEBHOOK - Sync to Capsule & Zoho CRM
// ============================================

// Capsule CRM configuration
const CAPSULE_API_URL = 'https://api.capsulecrm.com/api/v2';
const CAPSULE_API_TOKEN = 'FPH4ltmX3v307MaUMCYkECGl9a16eXPh37TpUbWjOM83kd3cyW4z2vk8Kk+GcxJA';

// Helper: Create contact in Capsule CRM
async function createCapsuleContact(customerData) {
    try {
        const response = await fetch(`${CAPSULE_API_URL}/parties`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${CAPSULE_API_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                party: {
                    type: 'person',
                    firstName: customerData.firstName || customerData.name?.split(' ')[0] || 'Lead',
                    lastName: customerData.lastName || customerData.name?.split(' ').slice(1).join(' ') || '',
                    emails: customerData.email ? [{ address: customerData.email }] : [],
                    phoneNumbers: customerData.phone ? [{ number: customerData.phone }] : []
                }
            })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Capsule API error: ${response.status} ${error}`);
        }

        const data = await response.json();
        return data.party;
    } catch (error) {
        console.error('Error creating Capsule contact:', error);
        throw error;
    }
}

// Helper: Find contact by email in Capsule CRM
async function findCapsuleContactByEmail(email) {
    try {
        const response = await fetch(`${CAPSULE_API_URL}/parties?q=${encodeURIComponent(email)}`, {
            headers: {
                'Authorization': `Bearer ${CAPSULE_API_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        return data.parties?.find(p => p.emails?.some(e => e.address === email));
    } catch (error) {
        return null;
    }
}

// Webhook: Receive lead from SalesIQ and sync to both CRMs
app.post('/api/webhooks/salesiq/lead', async (req, res) => {
    try {
        console.log('📥 Received SalesIQ lead:', req.body);

        const leadData = req.body;
        
        // Extract lead information (SalesIQ format may vary)
        const customerData = {
            firstName: leadData.firstName || leadData.first_name || leadData.name?.split(' ')[0] || 'Lead',
            lastName: leadData.lastName || leadData.last_name || leadData.name?.split(' ').slice(1).join(' ') || '',
            email: leadData.email || leadData.Email || '',
            phone: leadData.phone || leadData.Phone || leadData.phoneNumber || '',
            name: leadData.name || `${leadData.firstName || ''} ${leadData.lastName || ''}`.trim(),
            message: leadData.message || leadData.Message || leadData.description || '',
            source: 'SalesIQ Chat',
            company: leadData.company || 'Success Chemistry Customer',
            customFields: {
                ...(leadData.customFields || {}),
                Lead_Source: 'SalesIQ Chat',
                Description: leadData.message || leadData.description || ''
            }
        };

        // Validate required fields
        if (!customerData.email) {
            return res.status(400).json({
                success: false,
                error: 'Email is required'
            });
        }

        const results = {
            capsule: null,
            zoho: null
        };

        // Sync to Capsule CRM
        try {
            let capsuleContact = await findCapsuleContactByEmail(customerData.email);
            
            if (!capsuleContact) {
                capsuleContact = await createCapsuleContact(customerData);
                console.log('✅ Lead created in Capsule CRM:', capsuleContact?.id);
            } else {
                console.log('✅ Lead already exists in Capsule CRM:', capsuleContact?.id);
            }
            
            results.capsule = {
                success: true,
                contactId: capsuleContact?.id
            };
        } catch (error) {
            console.error('❌ Capsule CRM sync failed:', error);
            results.capsule = {
                success: false,
                error: error.message
            };
        }

        // Sync to Zoho CRM
        try {
            const zohoResult = await syncLeadToZoho(customerData);
            results.zoho = zohoResult;
        } catch (error) {
            console.error('❌ Zoho CRM sync failed:', error);
            results.zoho = {
                success: false,
                error: error.message
            };
        }

        // Log lead capture
        const leadLog = {
            timestamp: new Date().toISOString(),
            customerData: customerData,
            results: results
        };
        
        const leadLogPath = path.join(__dirname, '.cursor/lead-captures.log');
        try {
            fs.appendFileSync(leadLogPath, JSON.stringify(leadLog) + '\n');
        } catch (logError) {
            console.error('Failed to log lead capture:', logError);
        }

        // Return success even if one CRM fails
        res.json({
            success: true,
            message: 'Lead captured and synced',
            results: results
        });

    } catch (error) {
        console.error('Lead capture webhook error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// Start server
app.listen(PORT, '127.0.0.1', () => {
    // #region agent log
    writeLog({location:'local-server.js:100',message:'Server started successfully',data:{port:PORT,status:'listening'},timestamp:Date.now(),sessionId:'debug-session',runId:'init',hypothesisId:'A'});
    // #endregion agent log
    console.log(`🚀 Frontend server running on http://localhost:${PORT}`);
    console.log(`📦 Serving from: ${__dirname}/deploy-site/`);
    console.log(`✅ NOW SERVING FROM GITHUB REPO (GitHub Desktop will see all changes!)`);
    console.log(`\n📍 Available URLs:`);
    console.log(`   🏠 Home: http://localhost:${PORT}/`);
    console.log(`   🛍️  Shop: http://localhost:${PORT}/shop`);
    console.log(`   📊 Admin: http://localhost:${PORT}/admin`);
    console.log(`   🛒 Cart: http://localhost:${PORT}/cart`);
    console.log(`   📝 Blog: http://localhost:${PORT}/blog`);
    console.log(`   ❓ FAQ: http://localhost:${PORT}/faq`);
    console.log(`   📧 Contact: http://localhost:${PORT}/contact`);
    console.log(`   🔒 Privacy: http://localhost:${PORT}/privacy-policy`);
    console.log(`   📦 Shipping: http://localhost:${PORT}/shipping-returns`);
    console.log(`   📄 Terms: http://localhost:${PORT}/terms-of-service`);
    console.log(`   💳 Payment: http://localhost:${PORT}/payment-policy`);
    console.log(`   📧 Subscribe: http://localhost:${PORT}/subscribe`);
    console.log(`   ✅ Thank You: http://localhost:${PORT}/thank-you`);
    console.log(`   🌐 Sclera i18n: http://localhost:${PORT}/sclera/en | /sclera/fr | /sclera/de | … (${SCLERA_LANGS.length} langs)`);
    console.log(`   👤 My Account: http://localhost:${PORT}/my-account`);
});
