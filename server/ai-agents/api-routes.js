/**
 * API ROUTES FOR FLEET MANAGER AI
 * Endpoints to interact with the Fleet Manager and individual agents
 */

import { FleetManager } from './fleet-manager.js';

export function setupFleetManagerRoutes(app, db) {
  const fleetManager = new FleetManager(db);

  /**
   * Execute Fleet Manager task
   * POST /api/fleet-manager/execute
   */
  app.post('/api/fleet-manager/execute', async (req, res) => {
    try {
      const { task } = req.body;
      
      if (!task) {
        return res.status(400).json({ error: 'Task description required' });
      }

      console.log(`🚀 Fleet Manager executing task: ${task}`);
      const report = await fleetManager.execute(task);
      
      res.json(report);
    } catch (error) {
      console.error('Fleet Manager execution error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * Run daily automated cycle
   * POST /api/fleet-manager/daily-cycle
   */
  app.post('/api/fleet-manager/daily-cycle', async (req, res) => {
    try {
      const report = await fleetManager.runDailyCycle();
      res.json(report);
    } catch (error) {
      console.error('Daily cycle error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * Run weekly strategic review
   * POST /api/fleet-manager/weekly-cycle
   */
  app.post('/api/fleet-manager/weekly-cycle', async (req, res) => {
    try {
      const report = await fleetManager.runWeeklyCycle();
      res.json(report);
    } catch (error) {
      console.error('Weekly cycle error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * Get current metrics dashboard
   * GET /api/fleet-manager/metrics
   */
  app.get('/api/fleet-manager/metrics', async (req, res) => {
    try {
      const metrics = await fleetManager.metrics.getDashboardMetrics();
      res.json(metrics);
    } catch (error) {
      console.error('Metrics error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * Subscription Optimizer - Analyze opportunities
   * GET /api/agents/subscription/opportunities
   */
  app.get('/api/agents/subscription/opportunities', async (req, res) => {
    try {
      const opportunities = await fleetManager.agents.subscription.analyze_opportunities({});
      res.json(opportunities);
    } catch (error) {
      console.error('Subscription opportunities error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * Subscription Optimizer - Generate offer
   * POST /api/agents/subscription/generate-offer
   */
  app.post('/api/agents/subscription/generate-offer', async (req, res) => {
    try {
      const { customer, product } = req.body;
      const offer = fleetManager.agents.subscription.generateSubscriptionOffer(customer, product);
      res.json(offer);
    } catch (error) {
      console.error('Generate offer error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * Upsell Agent - Generate cart upsells
   * POST /api/agents/upsell/cart
   */
  app.post('/api/agents/upsell/cart', async (req, res) => {
    try {
      const { cartItems } = req.body;
      const upsells = await fleetManager.agents.upsell.generate_cart_upsells(cartItems);
      res.json(upsells);
    } catch (error) {
      console.error('Cart upsells error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * Upsell Agent - Generate checkout offers
   * POST /api/agents/upsell/checkout
   */
  app.post('/api/agents/upsell/checkout', async (req, res) => {
    try {
      const { cartTotal, cartItems } = req.body;
      const offers = await fleetManager.agents.upsell.generate_checkout_offers(cartTotal, cartItems);
      res.json(offers);
    } catch (error) {
      console.error('Checkout offers error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * Content Agent - Generate product content
   * POST /api/agents/content/product
   */
  app.post('/api/agents/content/product', async (req, res) => {
    try {
      const { productType } = req.body;
      const content = await fleetManager.agents.content.createProductDescription(productType);
      res.json(content);
    } catch (error) {
      console.error('Content generation error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * Content Agent - Generate blog post
   * POST /api/agents/content/blog
   */
  app.post('/api/agents/content/blog', async (req, res) => {
    try {
      const { topic } = req.body;
      const blog = await fleetManager.agents.content.generate_blog_post(topic);
      res.json(blog);
    } catch (error) {
      console.error('Blog generation error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * Content Agent - Generate social posts
   * POST /api/agents/content/social
   */
  app.post('/api/agents/content/social', async (req, res) => {
    try {
      const { product, platform } = req.body;
      const posts = await fleetManager.agents.content.generate_social_posts(product, platform);
      res.json(posts);
    } catch (error) {
      console.error('Social posts error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * Ad Agent - Generate ad tests
   * POST /api/agents/ad/generate-tests
   */
  app.post('/api/agents/ad/generate-tests', async (req, res) => {
    try {
      const { task } = req.body;
      const tests = await fleetManager.agents.ad.generate_ad_tests({ task });
      res.json(tests);
    } catch (error) {
      console.error('Ad tests error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * Ad Agent - Monitor performance
   * GET /api/agents/ad/performance
   */
  app.get('/api/agents/ad/performance', async (req, res) => {
    try {
      const performance = await fleetManager.agents.ad.monitor_ad_performance();
      res.json(performance);
    } catch (error) {
      console.error('Ad performance error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * Retention Agent - Predict churn
   * GET /api/agents/retention/churn-prediction
   */
  app.get('/api/agents/retention/churn-prediction', async (req, res) => {
    try {
      const predictions = await fleetManager.agents.retention.predict_churn({});
      res.json(predictions);
    } catch (error) {
      console.error('Churn prediction error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * Retention Agent - Generate win-back email
   * POST /api/agents/retention/winback-email
   */
  app.post('/api/agents/retention/winback-email', async (req, res) => {
    try {
      const { customer } = req.body;
      const email = await fleetManager.agents.retention.generate_winback_email(customer);
      res.json(email);
    } catch (error) {
      console.error('Win-back email error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * Trust Agent - Validate compliance
   * POST /api/agents/trust/validate
   */
  app.post('/api/agents/trust/validate', async (req, res) => {
    try {
      const { content } = req.body;
      const validation = await fleetManager.agents.trust.validate_compliance({ content });
      res.json(validation);
    } catch (error) {
      console.error('Compliance validation error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * Trust Agent - Generate testimonials
   * GET /api/agents/trust/testimonials
   */
  app.get('/api/agents/trust/testimonials', async (req, res) => {
    try {
      const testimonials = await fleetManager.agents.trust.generate_testimonials();
      res.json(testimonials);
    } catch (error) {
      console.error('Testimonials error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * Pricing Agent - Analyze pricing
   * GET /api/agents/pricing/analysis
   */
  app.get('/api/agents/pricing/analysis', async (req, res) => {
    try {
      const analysis = await fleetManager.agents.pricing.analyze_pricing({});
      res.json(analysis);
    } catch (error) {
      console.error('Pricing analysis error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * Pricing Agent - Generate tiered pricing
   * POST /api/agents/pricing/tiered
   */
  app.post('/api/agents/pricing/tiered', async (req, res) => {
    try {
      const { product } = req.body;
      const tiered = fleetManager.agents.pricing.generateTieredPricing(product);
      res.json(tiered);
    } catch (error) {
      console.error('Tiered pricing error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  console.log('✅ Fleet Manager API routes initialized');
}
