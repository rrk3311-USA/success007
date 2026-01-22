// Simple static file server for frontend (port 8080)
// This serves all your HTML, CSS, JS, and images
// NOW SERVING FROM GITHUB REPO LOCATION (so GitHub Desktop sees all changes!)
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

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
const PORT = 8080;

// Log all incoming requests
app.use((req, res, next) => {
    writeLog({location:'local-server.js:27',message:'Incoming request',data:{method:req.method,path:req.path,url:req.url,ip:req.ip},timestamp:Date.now(),sessionId:'debug-session',runId:'runtime',hypothesisId:'D'});
    next();
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

app.get('/faq', (req, res) => {
    res.sendFile(path.join(__dirname, 'deploy-site/faq/index.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'deploy-site/contact/index.html'));
});

app.get('/product/:sku', (req, res) => {
    res.sendFile(path.join(__dirname, 'deploy-site/product/index.html'));
});

app.get('/product', (req, res) => {
    res.sendFile(path.join(__dirname, 'deploy-site/product/index.html'));
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

// Start server
app.listen(PORT, () => {
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
    console.log(`   👤 My Account: http://localhost:${PORT}/my-account`);
});
