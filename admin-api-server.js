// Simple Admin API Server - Mock Data for Admin Dashboard
// Runs on port 3001. Optional MySQL for WooCommerce API config & orders.
import express from 'express';
import cors from 'cors';
import 'dotenv/config';

const app = express();
const PORT = 3001;

// Optional MySQL (set MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE or DATABASE_URL)
let db = null;
(async () => {
    try {
        if (process.env.DATABASE_URL) {
            const mysql = await import('mysql2/promise');
            db = mysql.default.createPool(process.env.DATABASE_URL);
            await db.getConnection();
            console.log('✅ MySQL connected via DATABASE_URL');
        } else if (process.env.MYSQL_HOST && process.env.MYSQL_USER && process.env.MYSQL_DATABASE) {
            const mysql = await import('mysql2/promise');
            db = mysql.default.createPool({
                host: process.env.MYSQL_HOST,
                user: process.env.MYSQL_USER,
                password: process.env.MYSQL_PASSWORD || '',
                database: process.env.MYSQL_DATABASE,
                waitForConnections: true,
                connectionLimit: 10
            });
            await db.getConnection();
            console.log('✅ MySQL connected');
        }
    } catch (e) {
        if (process.env.MYSQL_HOST || process.env.DATABASE_URL) {
            console.warn('ℹ️ MySQL connection failed:', e.message);
        }
    }
})();

// In-memory fallback when MySQL not used (editable in admin)
// Auto-load from .env if available
let wooConfigMemory = {
    site_url: process.env.WOOCOMMERCE_URL || '',
    consumer_key: process.env.WOOCOMMERCE_CONSUMER_KEY || '',
    consumer_secret: process.env.WOOCOMMERCE_CONSUMER_SECRET || ''
};

// In-memory order cache (when MySQL not available)
let wooOrdersMemory = [];
// In-memory customers from WooCommerce
let wooCustomersMemory = [];

// Middleware
app.use(cors());
app.use(express.json());

// Mock data
const mockProducts = [
    { sku: '10777-810', name: 'Liver Cleanse', category: 'Detox', price: 29.99, stock: 150, status: 'active' },
    { sku: '31410-836', name: 'Sclera 2-Pack', category: 'Vision', price: 49.99, stock: 200, status: 'active' },
    { sku: '10777-811', name: 'Prostate Support', category: 'Men\'s Health', price: 34.99, stock: 100, status: 'active' },
    { sku: '10777-812', name: 'Lung Support', category: 'Respiratory', price: 39.99, stock: 120, status: 'active' },
    { sku: '10777-813', name: 'Women\'s Balance', category: 'Women\'s Health', price: 32.99, stock: 90, status: 'active' }
];

const mockOrders = [
    { id: 1, order_number: 'ORD-001', customer_name: 'John Doe', customer_email: 'john@example.com', created_at: new Date().toISOString(), total: 79.98, status: 'processing', payment_status: 'paid', items: [{ product_sku: '10777-810', product_name: 'Liver Cleanse', quantity: 2, price: 29.99, subtotal: 59.98 }] },
    { id: 2, order_number: 'ORD-002', customer_name: 'Jane Smith', customer_email: 'jane@example.com', created_at: new Date(Date.now() - 86400000).toISOString(), total: 49.99, status: 'shipped', payment_status: 'paid', items: [{ product_sku: '31410-836', product_name: 'Sclera 2-Pack', quantity: 1, price: 49.99, subtotal: 49.99 }] },
    { id: 3, order_number: 'ORD-003', customer_name: 'Bob Johnson', customer_email: 'bob@example.com', created_at: new Date(Date.now() - 172800000).toISOString(), total: 104.97, status: 'delivered', payment_status: 'paid', items: [{ product_sku: '10777-811', product_name: 'Prostate Support', quantity: 3, price: 34.99, subtotal: 104.97 }] }
];

const mockUsers = [
    { id: 1, email: 'john@example.com', name: 'John Doe', role: 'customer', order_count: 5, total_spent: 250.00, created_at: new Date(Date.now() - 2592000000).toISOString() },
    { id: 2, email: 'jane@example.com', name: 'Jane Smith', role: 'customer', order_count: 3, total_spent: 150.00, created_at: new Date(Date.now() - 1728000000).toISOString() },
    { id: 3, email: 'bob@example.com', name: 'Bob Johnson', role: 'customer', order_count: 2, total_spent: 104.97, created_at: new Date(Date.now() - 864000000).toISOString() }
];

// Simple authentication (mock - no real security)
let authTokens = new Set();
const ADMIN_EMAIL = 'admin@successchemistry.com';
const ADMIN_PASSWORD = 'admin123';

// Auth endpoints
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    
    // Accept any credentials for demo, or check against admin credentials
    if (email && password) {
        const token = `mock-token-${Date.now()}`;
        authTokens.add(token);
        
        res.json({
            token,
            user: {
                id: 1,
                email: email,
                name: 'Admin User',
                role: 'admin'
            }
        });
    } else {
        res.status(400).json({ error: 'Email and password required' });
    }
});

app.post('/api/auth/logout', (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token) {
        authTokens.delete(token);
    }
    res.json({ success: true });
});

app.get('/api/auth/verify', (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token && authTokens.has(token)) {
        res.json({ valid: true });
    } else {
        res.json({ valid: false });
    }
});

// Middleware to check auth (optional for demo)
function checkAuth(req, res, next) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token && authTokens.has(token)) {
        next();
    } else {
        // For demo, allow all requests
        next();
    }
}

// Analytics
app.get('/api/analytics/overview', checkAuth, (req, res) => {
    res.json({
        products: {
            total: mockProducts.length,
            active: mockProducts.filter(p => p.status === 'active').length
        },
        sales: {
            all_time: {
                orders: mockOrders.length,
                revenue: mockOrders.reduce((sum, o) => sum + parseFloat(o.total), 0)
            },
            this_month: {
                orders: mockOrders.length,
                revenue: mockOrders.reduce((sum, o) => sum + parseFloat(o.total), 0)
            }
        },
        recentOrders: mockOrders.slice(0, 5)
    });
});

// Orders
app.get('/api/orders', checkAuth, (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    
    res.json({
        orders: mockOrders,
        pagination: {
            page,
            limit,
            total: mockOrders.length,
            pages: Math.ceil(mockOrders.length / limit)
        }
    });
});

app.get('/api/orders/:id', checkAuth, (req, res) => {
    const order = mockOrders.find(o => o.id === parseInt(req.params.id));
    if (order) {
        res.json(order);
    } else {
        res.status(404).json({ error: 'Order not found' });
    }
});

app.put('/api/orders/:id', checkAuth, (req, res) => {
    const order = mockOrders.find(o => o.id === parseInt(req.params.id));
    if (order) {
        Object.assign(order, req.body);
        res.json(order);
    } else {
        res.status(404).json({ error: 'Order not found' });
    }
});

// Products
app.get('/api/products', checkAuth, (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    
    res.json({
        products: mockProducts,
        pagination: {
            page,
            limit,
            total: mockProducts.length,
            pages: Math.ceil(mockProducts.length / limit)
        }
    });
});

app.get('/api/products/:sku', checkAuth, (req, res) => {
    const product = mockProducts.find(p => p.sku === req.params.sku);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ error: 'Product not found' });
    }
});

app.delete('/api/products/:sku', checkAuth, (req, res) => {
    const index = mockProducts.findIndex(p => p.sku === req.params.sku);
    if (index !== -1) {
        mockProducts.splice(index, 1);
        res.json({ success: true });
    } else {
        res.status(404).json({ error: 'Product not found' });
    }
});

// AI – stub; set OPENAI_API_KEY (or similar) and implement real LLM call to go live
app.post('/api/ai/ask', checkAuth, async (req, res) => {
    const { prompt } = req.body || {};
    if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ error: 'Prompt is required' });
    }
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
        try {
            const openai = await import('openai');
            const client = new openai.default({ apiKey });
            const completion = await client.chat.completions.create({
                model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 1024
            });
            const text = completion.choices?.[0]?.message?.content?.trim() || 'No response.';
            return res.json({ text });
        } catch (err) {
            return res.status(502).json({ error: err.message || 'AI request failed' });
        }
    }
    // No API key: return a friendly stub so the UI still works
    res.json({
        text: `[Stub] You asked: "${prompt.slice(0, 80)}${prompt.length > 80 ? '…' : ''}"\n\nTo get real AI responses, set OPENAI_API_KEY in .env and restart the admin API server.`
    });
});

// Users
app.get('/api/users', checkAuth, (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    
    res.json({
        users: mockUsers,
        pagination: {
            page,
            limit,
            total: mockUsers.length,
            pages: Math.ceil(mockUsers.length / limit)
        }
    });
});

app.get('/api/users/:id', checkAuth, (req, res) => {
    const user = mockUsers.find(u => u.id === parseInt(req.params.id));
    if (user) {
        res.json({ ...user, orders: mockOrders.filter(o => o.customer_email === user.email) });
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

// --- WooCommerce API config & orders (MySQL or in-memory) ---

async function getWooConfig() {
    if (db) {
        try {
            const [rows] = await db.query('SELECT site_url, consumer_key, consumer_secret FROM woo_api_config WHERE id = 1 LIMIT 1');
            if (rows && rows[0]) return rows[0];
        } catch (e) {
            console.warn('getWooConfig DB error:', e.message);
        }
    }
    return wooConfigMemory;
}

async function setWooConfig(site_url, consumer_key, consumer_secret) {
    if (db) {
        try {
            await db.query(
                'INSERT INTO woo_api_config (id, site_url, consumer_key, consumer_secret) VALUES (1,?,?,?) ON DUPLICATE KEY UPDATE site_url=?, consumer_key=?, consumer_secret=?',
                [site_url || '', consumer_key || '', consumer_secret || '', site_url || '', consumer_key || '', consumer_secret || '']
            );
            return { ok: true };
        } catch (e) {
            console.warn('setWooConfig DB error:', e.message);
            return { ok: false, error: e.message };
        }
    }
    wooConfigMemory = { site_url: site_url || '', consumer_key: consumer_key || '', consumer_secret: consumer_secret || '' };
    return { ok: true };
}

app.get('/api/woo/config', checkAuth, async (req, res) => {
    try {
        const config = await getWooConfig();
        res.json(config);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.put('/api/woo/config', checkAuth, async (req, res) => {
    const { site_url, consumer_key, consumer_secret } = req.body || {};
    const result = await setWooConfig(site_url, consumer_key, consumer_secret);
    if (result.ok) res.json(await getWooConfig()); else res.status(500).json({ error: result.error });
});

app.get('/api/woo/orders', checkAuth, async (req, res) => {
    const limit = Math.min(parseInt(req.query.limit) || 100, 500);
    const offset = parseInt(req.query.offset) || 0;
    if (db) {
        try {
            const [rows] = await db.query(
                'SELECT id, woo_order_id, number, status, total, currency, customer_email, customer_name, line_items_json, created_at_woo, synced_at FROM woo_orders ORDER BY created_at_woo DESC LIMIT ? OFFSET ?',
                [limit, offset]
            );
            const countResult = await db.query('SELECT COUNT(*) as c FROM woo_orders');
            const total = countResult[0]?.[0]?.c ?? 0;
            res.json({ orders: rows, total });
        } catch (e) {
            res.json({ orders: [], total: 0, error: e.message });
        }
    } else {
        // Return in-memory orders
        const sorted = [...wooOrdersMemory].sort((a, b) => {
            const dateA = a.created_at_woo ? new Date(a.created_at_woo) : new Date(0);
            const dateB = b.created_at_woo ? new Date(b.created_at_woo) : new Date(0);
            return dateB - dateA;
        });
        res.json({ orders: sorted.slice(offset, offset + limit), total: sorted.length });
    }
});

app.post('/api/woo/sync', checkAuth, async (req, res) => {
    const config = await getWooConfig();
    const base = (config.site_url || '').replace(/\/$/, '');
    if (!base || !config.consumer_key || !config.consumer_secret) {
        return res.status(400).json({ error: 'WooCommerce API not configured. Save Site URL, Consumer Key, and Consumer Secret in WooCommerce API settings first.' });
    }
    const auth = Buffer.from(`${config.consumer_key}:${config.consumer_secret}`).toString('base64');
    const orders = [];
    let page = 1;
    let hasMore = true;
    while (hasMore) {
        const url = `${base}/wp-json/wc/v3/orders?page=${page}&per_page=100&status=any`;
        try {
            const response = await fetch(url, { headers: { Authorization: `Basic ${auth}` } });
            if (!response.ok) {
                const errorText = await response.text().catch(() => '');
                throw new Error(`WooCommerce API ${response.status}: ${errorText.substring(0, 200)}`);
            }
            const data = await response.json();
            if (!Array.isArray(data) || data.length === 0) hasMore = false;
            else {
                orders.push(...data);
                const totalPages = parseInt(response.headers.get('x-wp-totalpages') || '1');
                if (page >= totalPages) hasMore = false;
                else page++;
            }
        } catch (e) {
            return res.status(502).json({ error: 'Failed to fetch WooCommerce orders: ' + e.message });
        }
    }
    // Store in memory if MySQL not available
    if (!db) {
        wooOrdersMemory = orders.map(o => {
            const billing = o.billing || {};
            return {
                woo_order_id: o.id,
                number: o.number || String(o.id),
                status: o.status || 'processing',
                total: parseFloat(o.total) || 0,
                currency: o.currency || 'USD',
                customer_email: billing.email || '',
                customer_name: [billing.first_name, billing.last_name].filter(Boolean).join(' ') || '',
                line_items_json: Array.isArray(o.line_items) ? o.line_items.map(l => ({ name: l.name, quantity: l.quantity, total: l.total })) : [],
                created_at_woo: o.date_created ? new Date(o.date_created) : null
            };
        });
        return res.json({ synced: orders.length, total: orders.length, message: 'MySQL not configured – orders stored in memory. Configure MYSQL_* or DATABASE_URL to persist.', orders: orders.slice(0, 50) });
    }
    let inserted = 0;
    for (const o of orders) {
        const billing = o.billing || {};
        const lineItems = Array.isArray(o.line_items) ? o.line_items.map(l => ({ name: l.name, quantity: l.quantity, total: l.total })) : [];
        try {
            await db.query(
                `INSERT INTO woo_orders (woo_order_id, number, status, total, currency, customer_email, customer_name, line_items_json, created_at_woo)
                 VALUES (?,?,?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE status=VALUES(status), total=VALUES(total), customer_name=VALUES(customer_name), line_items_json=VALUES(line_items_json), synced_at=CURRENT_TIMESTAMP`,
                [
                    o.id,
                    o.number || String(o.id),
                    o.status || 'processing',
                    parseFloat(o.total) || 0,
                    o.currency || 'USD',
                    billing.email || o.billing?.email || '',
                    [billing.first_name, billing.last_name].filter(Boolean).join(' ') || (o.billing && (o.billing.first_name + ' ' + o.billing.last_name)) || '',
                    JSON.stringify(lineItems),
                    o.date_created ? new Date(o.date_created) : null
                ]
            );
            inserted++;
        } catch (e) {
            console.warn('Insert order error:', e.message);
        }
    }
    res.json({ synced: inserted, total: orders.length });
});

// WooCommerce customers (fetch from API, store in memory)
app.get('/api/woo/customers', checkAuth, async (req, res) => {
    const limit = Math.min(parseInt(req.query.limit) || 200, 500);
    res.json({ customers: wooCustomersMemory.slice(0, limit), total: wooCustomersMemory.length });
});

app.post('/api/woo/sync-customers', checkAuth, async (req, res) => {
    const config = await getWooConfig();
    const base = (config.site_url || '').replace(/\/$/, '');
    if (!base || !config.consumer_key || !config.consumer_secret) {
        return res.status(400).json({ error: 'WooCommerce API not configured.' });
    }
    const auth = Buffer.from(`${config.consumer_key}:${config.consumer_secret}`).toString('base64');
    const customers = [];
    let page = 1;
    let hasMore = true;
    while (hasMore) {
        const url = `${base}/wp-json/wc/v3/customers?page=${page}&per_page=100`;
        try {
            const response = await fetch(url, { headers: { Authorization: `Basic ${auth}` } });
            if (!response.ok) throw new Error(`WooCommerce API ${response.status}`);
            const data = await response.json();
            if (!Array.isArray(data) || data.length === 0) hasMore = false;
            else {
                customers.push(...data);
                const totalPages = parseInt(response.headers.get('x-wp-totalpages') || '1');
                if (page >= totalPages) hasMore = false;
                else page++;
            }
        } catch (e) {
            return res.status(502).json({ error: 'Failed to fetch customers: ' + e.message });
        }
    }
    wooCustomersMemory = customers.map(c => ({
        id: c.id,
        email: c.email || '',
        first_name: c.first_name || '',
        last_name: c.last_name || '',
        username: c.username || '',
        orders_count: c.orders_count != null ? c.orders_count : 0,
        total_spent: c.total_spent || '0',
        date_created: c.date_created || null
    }));
    res.json({ synced: wooCustomersMemory.length, total: wooCustomersMemory.length });
});

// --- PayPal REST API (create order + capture for Smart Buttons) ---
const PAYPAL_MODE = (process.env.PAYPAL_MODE || 'live').toLowerCase();
const PAYPAL_BASE = PAYPAL_MODE === 'sandbox' ? 'https://api-m.sandbox.paypal.com' : 'https://api-m.paypal.com';
const PAYPAL_CLIENT_ID = PAYPAL_MODE === 'sandbox' ? process.env.PAYPAL_SANDBOX_CLIENT_ID : process.env.PAYPAL_PRODUCTION_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = PAYPAL_MODE === 'sandbox' ? process.env.PAYPAL_SANDBOX_CLIENT_SECRET : process.env.PAYPAL_PRODUCTION_CLIENT_SECRET;

async function getPayPalAccessToken() {
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
    const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: `Basic ${auth}` },
        body: 'grant_type=client_credentials'
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`PayPal auth failed: ${res.status} ${text}`);
    }
    const json = await res.json();
    return json.access_token;
}

app.post('/api/paypal/orders', async (req, res) => {
    try {
        if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
            return res.status(500).json({ error: 'PayPal not configured. Set PAYPAL_PRODUCTION_CLIENT_ID and PAYPAL_PRODUCTION_CLIENT_SECRET in .env' });
        }
        const token = await getPayPalAccessToken();
        const body = req.body || {};
        const payload = body.purchase_units ? { intent: body.intent || 'CAPTURE', purchase_units: body.purchase_units } : {
            intent: 'CAPTURE',
            purchase_units: [{ amount: { currency_code: body.currency_code || 'USD', value: String(body.amount || '0.00') } }]
        };
        const orderRes = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify(payload)
        });
        const orderJson = await orderRes.json();
        if (!orderRes.ok) {
            return res.status(orderRes.status).json({ success: false, error: orderJson.message || orderJson.details?.[0]?.description || 'PayPal error' });
        }
        res.json({ success: true, order: { id: orderJson.id } });
    } catch (e) {
        console.error('PayPal create order error:', e.message);
        res.status(500).json({ success: false, error: e.message || 'Failed to create PayPal order' });
    }
});

app.post('/api/paypal/orders/:orderID/pay', async (req, res) => {
    try {
        if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
            return res.status(500).json({ error: 'PayPal not configured' });
        }
        const token = await getPayPalAccessToken();
        const { orderID } = req.params;
        const captureRes = await fetch(`${PAYPAL_BASE}/v2/checkout/orders/${orderID}/capture`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({})
        });
        const captureJson = await captureRes.json();
        if (!captureRes.ok) {
            return res.status(captureRes.status).json({ success: false, error: captureJson.message || captureJson.details?.[0]?.description || 'PayPal capture failed' });
        }
        res.json({ success: true, order: captureJson });
    } catch (e) {
        console.error('PayPal capture error:', e.message);
        res.status(500).json({ error: e.message || 'Failed to capture PayPal order' });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, '127.0.0.1', () => {
    console.log(`🚀 Admin API Server running on http://localhost:${PORT}`);
    console.log(`📊 Mock data loaded: ${mockProducts.length} products, ${mockOrders.length} orders, ${mockUsers.length} users`);
    
    // Show WooCommerce config status
    if (wooConfigMemory.site_url && wooConfigMemory.consumer_key) {
        console.log(`\n✅ WooCommerce API loaded from .env:`);
        console.log(`   Site: ${wooConfigMemory.site_url}`);
        console.log(`   Key: ${wooConfigMemory.consumer_key.substring(0, 20)}...`);
    } else {
        console.log(`\n⚠️  WooCommerce API not configured in .env`);
        console.log(`   Set WOOCOMMERCE_URL, WOOCOMMERCE_CONSUMER_KEY, WOOCOMMERCE_CONSUMER_SECRET`);
    }
    
    if (db) {
        console.log(`\n💾 MySQL: Connected - WooCommerce orders will be persisted`);
    } else {
        console.log(`\n💾 MySQL: Not configured - WooCommerce orders stored in memory only`);
        console.log(`   Set DATABASE_URL or MYSQL_* env vars to enable persistence`);
    }
    
    if (PAYPAL_CLIENT_ID && PAYPAL_CLIENT_SECRET) {
        console.log(`\n💳 PayPal: ${PAYPAL_MODE} mode – /api/paypal/orders ready`);
    } else {
        console.log(`\n⚠️  PayPal: Set PAYPAL_PRODUCTION_CLIENT_ID and PAYPAL_PRODUCTION_CLIENT_SECRET in .env for checkout`);
    }
    console.log(`\n🔐 Demo Login Credentials:`);
    console.log(`   Email: admin@successchemistry.com (or any email)`);
    console.log(`   Password: admin123 (or any password)`);
});
