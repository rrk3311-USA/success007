/**
 * TRACKING & LEAD MAGNET ROUTES
 * Analytics tracking, heatmaps, page flow, and email capture
 */

export function setupTrackingRoutes(app, db) {
  
  // Create tables for tracking
  db.exec(`
    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL,
      source TEXT,
      magnet TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS page_views (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      page TEXT,
      session_id TEXT,
      user_agent TEXT,
      referrer TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_name TEXT,
      event_data TEXT,
      session_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS heatmap_clicks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      page TEXT,
      x INTEGER,
      y INTEGER,
      element TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  /**
   * Capture lead email (for infographics/lead magnets)
   * POST /api/leads
   */
  app.post('/api/leads', async (req, res) => {
    try {
      const { email, source, magnet } = req.body;

      if (!email || !email.includes('@')) {
        return res.status(400).json({ error: 'Valid email required' });
      }

      // Check if lead already exists
      const existing = db.prepare('SELECT * FROM leads WHERE email = ?').get(email);
      
      if (!existing) {
        // Insert new lead
        const insert = db.prepare(`
          INSERT INTO leads (email, source, magnet)
          VALUES (?, ?, ?)
        `);
        insert.run(email, source || 'unknown', magnet || 'general');
      }

      // Send infographic (in production, this would trigger an email)
      const infographic = getInfographic(magnet);

      res.json({
        success: true,
        message: 'Lead captured successfully',
        downloadUrl: infographic.url,
        infographic
      });
    } catch (error) {
      console.error('Lead capture error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * Track page view
   * POST /api/analytics/track
   */
  app.post('/api/analytics/track', async (req, res) => {
    try {
      const { event, data, page, sessionId } = req.body;

      if (event === 'page_view') {
        const insert = db.prepare(`
          INSERT INTO page_views (page, session_id, user_agent, referrer)
          VALUES (?, ?, ?, ?)
        `);
        insert.run(
          page || data?.page || 'unknown',
          sessionId || 'anonymous',
          req.headers['user-agent'] || '',
          req.headers['referer'] || ''
        );
      } else {
        // Track custom event
        const insert = db.prepare(`
          INSERT INTO events (event_name, event_data, session_id)
          VALUES (?, ?, ?)
        `);
        insert.run(
          event,
          JSON.stringify(data || {}),
          sessionId || 'anonymous'
        );
      }

      res.json({ success: true });
    } catch (error) {
      console.error('Tracking error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * Track heatmap click
   * POST /api/analytics/heatmap
   */
  app.post('/api/analytics/heatmap', async (req, res) => {
    try {
      const { page, x, y, element } = req.body;

      const insert = db.prepare(`
        INSERT INTO heatmap_clicks (page, x, y, element)
        VALUES (?, ?, ?, ?)
      `);
      insert.run(page, x, y, element || '');

      res.json({ success: true });
    } catch (error) {
      console.error('Heatmap tracking error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * Get all leads
   * GET /api/leads
   */
  app.get('/api/leads', (req, res) => {
    try {
      const leads = db.prepare('SELECT * FROM leads ORDER BY created_at DESC').all();
      res.json(leads);
    } catch (error) {
      console.error('Get leads error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * Get page flow analytics
   * GET /api/analytics/page-flow
   */
  app.get('/api/analytics/page-flow', (req, res) => {
    try {
      const { days = 7 } = req.query;

      const pageViews = db.prepare(`
        SELECT page, COUNT(*) as views
        FROM page_views
        WHERE created_at > datetime('now', '-${days} days')
        GROUP BY page
        ORDER BY views DESC
      `).all();

      const sessionFlows = db.prepare(`
        SELECT session_id, GROUP_CONCAT(page, ' -> ') as flow
        FROM page_views
        WHERE created_at > datetime('now', '-${days} days')
        GROUP BY session_id
        LIMIT 100
      `).all();

      res.json({
        pageViews,
        sessionFlows,
        totalSessions: sessionFlows.length
      });
    } catch (error) {
      console.error('Page flow error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * Get heatmap data
   * GET /api/analytics/heatmap/:page
   */
  app.get('/api/analytics/heatmap/:page', (req, res) => {
    try {
      const { page } = req.params;
      const { days = 7 } = req.query;

      const clicks = db.prepare(`
        SELECT x, y, element, COUNT(*) as count
        FROM heatmap_clicks
        WHERE page = ? AND created_at > datetime('now', '-${days} days')
        GROUP BY x, y, element
      `).all(page);

      res.json({ page, clicks, total: clicks.length });
    } catch (error) {
      console.error('Heatmap data error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * Get conversion funnel
   * GET /api/analytics/funnel
   */
  app.get('/api/analytics/funnel', (req, res) => {
    try {
      const funnel = {
        pageViews: db.prepare('SELECT COUNT(*) as count FROM page_views').get().count,
        addToCart: db.prepare(`SELECT COUNT(*) as count FROM events WHERE event_name = 'add_to_cart'`).get().count,
        checkoutStarted: db.prepare(`SELECT COUNT(*) as count FROM events WHERE event_name = 'checkout_page_view'`).get().count,
        checkoutCompleted: db.prepare(`SELECT COUNT(*) as count FROM events WHERE event_name = 'checkout_completed'`).get().count,
      };

      funnel.cartConversion = funnel.pageViews > 0 ? ((funnel.addToCart / funnel.pageViews) * 100).toFixed(2) : 0;
      funnel.checkoutConversion = funnel.addToCart > 0 ? ((funnel.checkoutStarted / funnel.addToCart) * 100).toFixed(2) : 0;
      funnel.purchaseConversion = funnel.checkoutStarted > 0 ? ((funnel.checkoutCompleted / funnel.checkoutStarted) * 100).toFixed(2) : 0;

      res.json(funnel);
    } catch (error) {
      console.error('Funnel error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  console.log('✅ Tracking & Lead Magnet routes initialized');
}

/**
 * Get infographic details based on type
 */
function getInfographic(magnet) {
  const infographics = {
    supplement_success_guide: {
      title: '10 Science-Backed Ways to Maximize Your Supplement Results',
      url: '/downloads/supplement-success-guide.pdf',
      description: 'Expert strategies for optimal supplement absorption and effectiveness',
      topics: [
        'Optimal timing for supplement intake',
        'Food combinations that boost absorption',
        'Common mistakes that reduce effectiveness',
        'How to track your progress',
        'Expert stacking strategies',
        'Hydration and supplement synergy',
        'Sleep optimization for recovery',
        'Cycling protocols for best results',
        'Quality indicators to look for',
        'When to adjust your dosage'
      ]
    },
    creatine_guide: {
      title: 'The Complete Creatine Guide',
      url: '/downloads/creatine-guide.pdf',
      description: 'Everything you need to know about creatine supplementation',
      topics: [
        'What is creatine and how it works',
        'Loading vs maintenance phases',
        'Best time to take creatine',
        'Creatine and hydration',
        'Combining creatine with other supplements'
      ]
    },
    workout_nutrition: {
      title: 'Pre & Post Workout Nutrition Blueprint',
      url: '/downloads/workout-nutrition.pdf',
      description: 'Optimize your nutrition timing for maximum gains',
      topics: [
        'Pre-workout meal timing',
        'Intra-workout supplementation',
        'Post-workout recovery window',
        'Protein timing strategies',
        'Carb cycling for performance'
      ]
    }
  };

  return infographics[magnet] || infographics.supplement_success_guide;
}
