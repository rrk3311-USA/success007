import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Database from 'better-sqlite3';
import fs from 'fs';
import ucpRouter from './server/ucp-api.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 8080;

// Middleware
app.use(express.json());

// Serve static files
app.use('/public', express.static(join(__dirname, 'public')));
app.use('/images', express.static(join(__dirname, 'images')));
app.use('/css', express.static(join(__dirname, 'css')));
app.use('/js', express.static(join(__dirname, 'js')));

app.use('/review-sorted', express.static(join(__dirname, 'review-repo', 'sorted')));

const reviewSortedRoot = join(__dirname, 'review-repo', 'sorted');

function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function safeResolve(base, rel) {
  const resolved = join(base, rel);
  const normalizedBase = join(base, '/');
  const normalizedResolved = join(resolved, '/');
  if (!normalizedResolved.startsWith(normalizedBase)) {
    return null;
  }
  return resolved;
}

function dirListingHtml(baseUrl, relPath, entries) {
  const title = relPath ? `Review Sorted / ${relPath}` : 'Review Sorted';
  const parentLink = relPath
    ? `<a href="${baseUrl}/${encodeURIComponent(relPath.split('/').slice(0, -1).join('/'))}">..</a>`
    : '';

  const rows = entries
    .map(({ name, isDir }) => {
      const nextRel = relPath ? `${relPath}/${name}` : name;
      const href = `${baseUrl}/${nextRel.split('/').map(encodeURIComponent).join('/')}${isDir ? '/' : ''}`;
      return `<li><a href="${href}">${escapeHtml(name)}${isDir ? '/' : ''}</a></li>`;
    })
    .join('');

  return `<!doctype html>
  <html lang="en"><head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <style>
      body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,sans-serif;margin:0;background:#0b1224;color:#e7ecff;}
      .wrap{max-width:980px;margin:0 auto;padding:22px;}
      .card{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:16px;}
      a{color:#8ab4ff;text-decoration:none}
      a:hover{text-decoration:underline}
      ul{margin:10px 0 0;padding-left:18px;line-height:1.8}
      .meta{opacity:.8;font-size:.9rem;margin-top:8px}
      .quick a{display:inline-block;margin-right:12px;margin-top:8px;padding:8px 10px;border-radius:999px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12)}
    </style>
  </head><body>
    <div class="wrap">
      <div class="card">
        <h2 style="margin:0 0 6px;">${escapeHtml(title)}</h2>
        <div class="quick">
          <a href="/review-sorted/reviews/">reviews/</a>
          <a href="/review-sorted/orders/">orders/</a>
          <a href="/review-sorted/customers/">customers/</a>
          <a href="/review-sorted/SORT_REPORT.json">SORT_REPORT.json</a>
        </div>
        <div class="meta">${escapeHtml(relPath || '/')}</div>
        <ul>
          ${parentLink ? `<li>${parentLink}</li>` : ''}
          ${rows}
        </ul>
      </div>
    </div>
  </body></html>`;
}

app.get('/review-sorted', (req, res) => {
  res.redirect('/review-sorted/');
});

app.get('/review-sorted.html', (req, res) => {
  res.redirect('/review-sorted/');
});

app.get('/review-sorted/*', (req, res, next) => {
  const rel = decodeURIComponent(req.path.replace(/^\/review-sorted\/?/, '')).replace(/^\/+/, '');
  const target = safeResolve(reviewSortedRoot, rel);
  if (!target) return res.status(400).send('Bad path');

  try {
    const stat = fs.statSync(target);
    if (stat.isDirectory()) {
      const entries = fs
        .readdirSync(target, { withFileTypes: true })
        .filter(e => e.name !== '.DS_Store')
        .map(e => ({ name: e.name, isDir: e.isDirectory() }))
        .sort((a, b) => Number(b.isDir) - Number(a.isDir) || a.name.localeCompare(b.name));
      return res.type('html').send(dirListingHtml('/review-sorted', rel.replace(/\/+$/, ''), entries));
    }
    return res.sendFile(target);
  } catch (err) {
    return next();
  }
});

// Serve products-data.js from root with no-cache headers
app.get('/products-data.js', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.sendFile(join(__dirname, 'products-data.js'));
});

// Beautiful URL routes
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'shop.html'));
});

app.get('/shop', (req, res) => {
  res.sendFile(join(__dirname, 'shop.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(join(__dirname, 'unified-dashboard-v2.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(join(__dirname, 'unified-dashboard-v2.html'));
});

app.get('/privacy', (req, res) => {
  res.sendFile(join(__dirname, 'privacy-policy.html'));
});

app.get('/privacy-policy', (req, res) => {
  res.sendFile(join(__dirname, 'privacy-policy.html'));
});

app.get('/product/:id', (req, res) => {
  res.sendFile(join(__dirname, 'product.html'));
});

app.get('/heatmap', (req, res) => {
  res.sendFile(join(__dirname, 'heatmap-viewer.html'));
});

app.get('/command-center', (req, res) => {
  res.sendFile(join(__dirname, 'command-center.html'));
});

app.get('/database', (req, res) => {
  res.sendFile(join(__dirname, 'database-viewer.html'));
});

// Database API endpoints
app.get('/api/db/products', (req, res) => {
  try {
    const db = new Database('products.db', { readonly: true });
    const products = db.prepare('SELECT * FROM products ORDER BY sku').all();
    db.close();
    res.json(products);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/api/db/products/:sku', (req, res) => {
  try {
    const db = new Database('products.db', { readonly: true });
    const product = db.prepare('SELECT * FROM products WHERE sku = ?').get(req.params.sku);
    db.close();
    
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.put('/api/db/products', (req, res) => {
  try {
    const { sku, name, price, category, description, short_description } = req.body;
    const db = new Database('products.db');
    
    const stmt = db.prepare(`
      UPDATE products 
      SET name = ?, price = ?, category = ?, description = ?, short_description = ?, updated_at = CURRENT_TIMESTAMP
      WHERE sku = ?
    `);
    
    const result = stmt.run(name, price, category, description, short_description, sku);
    db.close();
    
    if (result.changes > 0) {
      res.json({ success: true, message: 'Product updated' });
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/api/db/reviews', (req, res) => {
  try {
    const db = new Database(join(__dirname, 'review-repo', 'master-reviews.db'), { readonly: true });
    const reviews = db.prepare('SELECT * FROM reviews ORDER BY id DESC LIMIT 10000').all();
    db.close();
    res.json(reviews);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/api/db/orders', (req, res) => {
  try {
    const db = new Database(join(__dirname, 'review-repo', 'master-reviews.db'), { readonly: true });
    const orders = db.prepare('SELECT * FROM orders ORDER BY id DESC LIMIT 10000').all();
    db.close();
    res.json(orders);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/api/db/customers', (req, res) => {
  try {
    const db = new Database(join(__dirname, 'review-repo', 'master-reviews.db'), { readonly: true });
    const customers = db.prepare('SELECT * FROM customers ORDER BY id DESC LIMIT 10000').all();
    db.close();
    res.json(customers);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// UCP API routes for Google Universal Commerce Protocol
app.use('/api/ucp', ucpRouter);

// Catch-all for other HTML files
app.get('/:page', (req, res) => {
  const page = req.params.page;
  const targetPath = page.endsWith('.html')
    ? join(__dirname, page)
    : join(__dirname, `${page}.html`);

  if (!fs.existsSync(targetPath)) {
    res.status(404).send('Not found');
    return;
  }

  res.sendFile(targetPath);
});

app.listen(PORT, () => {
  console.log('');
  console.log('🎨 ═══════════════════════════════════════════════════════');
  console.log('   Success Chemistry - Beautiful Local URLs');
  console.log('═══════════════════════════════════════════════════════');
  console.log('');
  console.log('🛍️  Shop Page:      http://localhost:8080/shop');
  console.log('📊 Dashboard:      http://localhost:8080/admin');
  console.log('🗄️  Database:       http://localhost:8080/database');
  console.log('🔒 Privacy:        http://localhost:8080/privacy');
  console.log('📈 Heatmap:        http://localhost:8080/heatmap');
  console.log('🤖 Command Center: http://localhost:8080/command-center');
  console.log('');
  console.log('🔧 API Server:     http://localhost:3001');
  console.log('');
  console.log('═══════════════════════════════════════════════════════');
  console.log('');
  console.log('💡 Tip: Add to /etc/hosts for custom domain:');
  console.log('   127.0.0.1  shop.successchemistry.local');
  console.log('   Then access: http://shop.successchemistry.local:8080');
  console.log('');
});
