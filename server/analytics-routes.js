/**
 * ANALYTICS API ROUTES
 * Endpoints for the analytics dashboard
 */

export function setupAnalyticsRoutes(app, db) {
  
  /**
   * Get analytics overview
   * GET /api/analytics/overview
   */
  app.get('/api/analytics/overview', async (req, res) => {
    try {
      const { timeRange = '7d' } = req.query;
      const days = parseInt(timeRange.replace('d', '')) || 7;

      const overview = {
        revenue: await getRevenue(db, days),
        orders: await getOrders(db, days),
        customers: await getCustomers(db, days),
        products: await getTopProducts(db, days),
        subscriptions: await getSubscriptionStats(db),
        trends: await getTrends(db, days),
      };

      res.json(overview);
    } catch (error) {
      console.error('Analytics overview error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * Get revenue analytics
   * GET /api/analytics/revenue
   */
  app.get('/api/analytics/revenue', async (req, res) => {
    try {
      const { timeRange = '7d' } = req.query;
      const days = parseInt(timeRange.replace('d', '')) || 7;

      const revenue = await getRevenueBreakdown(db, days);
      res.json(revenue);
    } catch (error) {
      console.error('Revenue analytics error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * Get customer analytics
   * GET /api/analytics/customers
   */
  app.get('/api/analytics/customers', async (req, res) => {
    try {
      const analytics = await getCustomerAnalytics(db);
      res.json(analytics);
    } catch (error) {
      console.error('Customer analytics error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * Get product performance
   * GET /api/analytics/products
   */
  app.get('/api/analytics/products', async (req, res) => {
    try {
      const performance = await getProductPerformance(db);
      res.json(performance);
    } catch (error) {
      console.error('Product analytics error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * Get all customers
   * GET /api/customers
   */
  app.get('/api/customers', (req, res) => {
    try {
      const customers = db.prepare('SELECT * FROM customers').all();
      res.json(customers);
    } catch (error) {
      console.error('Get customers error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  console.log('✅ Analytics API routes initialized');
}

// Helper functions

async function getRevenue(db, days) {
  const stmt = db.prepare(`
    SELECT 
      SUM(CAST(total AS REAL)) as total,
      COUNT(*) as orderCount,
      AVG(CAST(total AS REAL)) as average
    FROM orders 
    WHERE created_at > datetime('now', '-${days} days')
  `);
  
  const result = stmt.get();
  return {
    total: parseFloat(result.total || 0).toFixed(2),
    orderCount: result.orderCount || 0,
    average: parseFloat(result.average || 0).toFixed(2),
  };
}

async function getOrders(db, days) {
  const stmt = db.prepare(`
    SELECT * FROM orders 
    WHERE created_at > datetime('now', '-${days} days')
    ORDER BY created_at DESC
    LIMIT 50
  `);
  
  return stmt.all();
}

async function getCustomers(db, days) {
  const totalStmt = db.prepare('SELECT COUNT(*) as count FROM customers');
  const newStmt = db.prepare(`
    SELECT COUNT(*) as count FROM customers 
    WHERE created_at > datetime('now', '-${days} days')
  `);
  
  return {
    total: totalStmt.get().count,
    new: newStmt.get().count,
  };
}

async function getTopProducts(db, days) {
  const stmt = db.prepare(`
    SELECT 
      p.name,
      p.sku,
      COUNT(o.id) as sales,
      SUM(CAST(o.total AS REAL)) as revenue
    FROM products p
    LEFT JOIN orders o ON o.product_sku = p.sku 
      AND o.created_at > datetime('now', '-${days} days')
    GROUP BY p.id
    ORDER BY sales DESC
    LIMIT 10
  `);
  
  return stmt.all();
}

async function getSubscriptionStats(db) {
  const activeStmt = db.prepare(`
    SELECT COUNT(*) as count, SUM(CAST(price AS REAL)) as mrr
    FROM subscriptions 
    WHERE status = 'active'
  `);
  
  const cancelledStmt = db.prepare(`
    SELECT COUNT(*) as count 
    FROM subscriptions 
    WHERE status = 'cancelled' 
    AND cancelled_at > datetime('now', '-30 days')
  `);
  
  const active = activeStmt.get();
  const cancelled = cancelledStmt.get();
  
  return {
    active: active.count || 0,
    mrr: parseFloat(active.mrr || 0).toFixed(2),
    cancelled: cancelled.count || 0,
    churnRate: active.count > 0 ? ((cancelled.count / active.count) * 100).toFixed(1) : 0,
  };
}

async function getTrends(db, days) {
  // Get daily revenue for the period
  const stmt = db.prepare(`
    SELECT 
      DATE(created_at) as date,
      SUM(CAST(total AS REAL)) as revenue,
      COUNT(*) as orders
    FROM orders 
    WHERE created_at > datetime('now', '-${days} days')
    GROUP BY DATE(created_at)
    ORDER BY date ASC
  `);
  
  return stmt.all();
}

async function getRevenueBreakdown(db, days) {
  const byDay = db.prepare(`
    SELECT 
      DATE(created_at) as date,
      SUM(CAST(total AS REAL)) as revenue
    FROM orders 
    WHERE created_at > datetime('now', '-${days} days')
    GROUP BY DATE(created_at)
    ORDER BY date ASC
  `).all();

  const byProduct = db.prepare(`
    SELECT 
      product_sku,
      SUM(CAST(total AS REAL)) as revenue,
      COUNT(*) as orders
    FROM orders 
    WHERE created_at > datetime('now', '-${days} days')
    GROUP BY product_sku
    ORDER BY revenue DESC
    LIMIT 10
  `).all();

  return {
    byDay,
    byProduct,
  };
}

async function getCustomerAnalytics(db) {
  const totalCustomers = db.prepare('SELECT COUNT(*) as count FROM customers').get();
  
  const repeatCustomers = db.prepare(`
    SELECT COUNT(DISTINCT customer_email) as count
    FROM orders
    GROUP BY customer_email
    HAVING COUNT(*) > 1
  `).get();

  const avgOrdersPerCustomer = db.prepare(`
    SELECT AVG(order_count) as avg
    FROM (
      SELECT customer_email, COUNT(*) as order_count
      FROM orders
      GROUP BY customer_email
    )
  `).get();

  const topCustomers = db.prepare(`
    SELECT 
      customer_email,
      COUNT(*) as orders,
      SUM(CAST(total AS REAL)) as totalSpent
    FROM orders
    GROUP BY customer_email
    ORDER BY totalSpent DESC
    LIMIT 10
  `).all();

  return {
    total: totalCustomers.count,
    repeat: repeatCustomers?.count || 0,
    avgOrders: parseFloat(avgOrdersPerCustomer?.avg || 0).toFixed(1),
    topCustomers,
  };
}

async function getProductPerformance(db) {
  const allProducts = db.prepare('SELECT * FROM products').all();
  
  const performance = allProducts.map(product => {
    const sales = db.prepare(`
      SELECT 
        COUNT(*) as orders,
        SUM(CAST(total AS REAL)) as revenue
      FROM orders
      WHERE product_sku = ?
    `).get(product.sku);

    return {
      ...product,
      orders: sales?.orders || 0,
      revenue: parseFloat(sales?.revenue || 0).toFixed(2),
    };
  });

  return performance.sort((a, b) => parseFloat(b.revenue) - parseFloat(a.revenue));
}
