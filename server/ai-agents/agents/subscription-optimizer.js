/**
 * SUBSCRIPTION OPTIMIZER AGENT
 * Analyze customer behavior → auto-suggest/enroll subscriptions, win-backs
 * Focus: Maximize MRR, reduce churn, increase subscription adoption
 */

export class SubscriptionOptimizer {
  constructor(db, metrics) {
    this.db = db;
    this.metrics = metrics;
    this.subscriptionDiscount = 0.15; // 15% discount
  }

  /**
   * Analyze subscription opportunities across customer base
   */
  async analyze_opportunities(params) {
    const opportunities = {
      newSubscribers: [],
      winBackCandidates: [],
      upgradeOpportunities: [],
      churnRisk: [],
      projectedMRRIncrease: 0,
    };

    // Find repeat purchasers who aren't subscribed
    const repeatBuyers = await this.findRepeatBuyers();
    opportunities.newSubscribers = repeatBuyers.map(customer => ({
      email: customer.email,
      productSKU: customer.mostPurchasedProduct,
      frequency: customer.purchaseFrequency,
      potentialMRR: customer.averageOrderValue * this.subscriptionDiscount,
      confidence: this.calculateConversionConfidence(customer),
      action: 'send_subscription_offer_email',
    }));

    // Find cancelled subscribers for win-back
    const cancelledSubs = await this.findCancelledSubscriptions();
    opportunities.winBackCandidates = cancelledSubs.map(sub => ({
      email: sub.customer_email,
      productSKU: sub.product_sku,
      cancelledDate: sub.cancelled_at,
      daysSinceCancellation: this.daysSince(sub.cancelled_at),
      winBackOffer: '20% off first month + free shipping',
      action: 'send_winback_campaign',
    }));

    // Find customers who could upgrade to larger quantities
    const upgraders = await this.findUpgradeOpportunities();
    opportunities.upgradeOpportunities = upgraders;

    // Calculate projected MRR increase
    opportunities.projectedMRRIncrease = this.calculateProjectedMRR(opportunities);

    return opportunities;
  }

  /**
   * Auto-enroll eligible customers in subscriptions
   */
  async auto_enroll(customer) {
    // Only auto-enroll if customer has 3+ purchases of same product
    const purchaseHistory = await this.getCustomerPurchases(customer.email);
    const productFrequency = this.analyzeProductFrequency(purchaseHistory);

    const enrollments = [];
    for (const [sku, data] of Object.entries(productFrequency)) {
      if (data.count >= 3 && data.avgDaysBetween <= 35) {
        // High confidence for subscription
        enrollments.push({
          sku,
          frequency: this.determineFrequency(data.avgDaysBetween),
          discount: this.subscriptionDiscount,
          confidence: 'high',
          action: 'create_subscription_with_consent',
        });
      }
    }

    return enrollments;
  }

  /**
   * Predict subscription churn risk
   */
  async predict_churn_risk() {
    const activeSubscriptions = await this.getActiveSubscriptions();
    const churnRisk = [];

    for (const sub of activeSubscriptions) {
      const risk = await this.calculateChurnRisk(sub);
      if (risk.score > 0.6) {
        churnRisk.push({
          subscriptionId: sub.id,
          customerEmail: sub.customer_email,
          productSKU: sub.product_sku,
          riskScore: risk.score,
          riskFactors: risk.factors,
          recommendedAction: this.getRetentionAction(risk.score),
        });
      }
    }

    return churnRisk;
  }

  /**
   * Generate personalized subscription offers
   */
  generateSubscriptionOffer(customer, product) {
    const basePrice = parseFloat(product.price);
    const subscriptionPrice = basePrice * (1 - this.subscriptionDiscount);

    return {
      headline: '🔥 Unlock Your Best Self - Subscribe & Save 15%!',
      product: product.name,
      regularPrice: basePrice.toFixed(2),
      subscriptionPrice: subscriptionPrice.toFixed(2),
      savings: (basePrice - subscriptionPrice).toFixed(2),
      benefits: [
        'Never run out - automatic delivery',
        'Save 15% on every order',
        'Free shipping on subscriptions',
        'Pause, skip, or cancel anytime',
        'Exclusive subscriber-only deals',
      ],
      cta: 'Start My Subscription',
      urgency: 'Limited time: First 100 subscribers get a FREE shaker bottle!',
    };
  }

  // Helper methods
  async findRepeatBuyers() {
    const stmt = this.db.prepare(`
      SELECT 
        c.email,
        c.name,
        COUNT(o.id) as purchase_count,
        AVG(o.total) as average_order_value,
        GROUP_CONCAT(o.product_sku) as products
      FROM customers c
      JOIN orders o ON c.email = o.customer_email
      WHERE c.id NOT IN (SELECT customer_id FROM subscriptions WHERE status = 'active')
      GROUP BY c.email
      HAVING purchase_count >= 2
      ORDER BY purchase_count DESC
    `);
    
    return stmt.all().map(row => {
      const products = row.products.split(',');
      const mostPurchased = this.findMostFrequent(products);
      return {
        ...row,
        mostPurchasedProduct: mostPurchased,
        purchaseFrequency: this.estimateFrequency(row.purchase_count),
      };
    });
  }

  async findCancelledSubscriptions() {
    const stmt = this.db.prepare(`
      SELECT * FROM subscriptions 
      WHERE status = 'cancelled' 
      AND cancelled_at > datetime('now', '-60 days')
      ORDER BY cancelled_at DESC
    `);
    return stmt.all();
  }

  async findUpgradeOpportunities() {
    // Find subscribers who could upgrade to larger sizes or bundles
    const stmt = this.db.prepare(`
      SELECT s.*, p.name, p.price 
      FROM subscriptions s
      JOIN products p ON s.product_sku = p.sku
      WHERE s.status = 'active'
    `);
    
    return stmt.all().map(sub => ({
      subscriptionId: sub.id,
      currentProduct: sub.product_sku,
      upgradeOption: this.findUpgradeProduct(sub.product_sku),
      potentialMRRIncrease: 15.00,
      action: 'send_upgrade_offer',
    }));
  }

  async getActiveSubscriptions() {
    const stmt = this.db.prepare('SELECT * FROM subscriptions WHERE status = ?');
    return stmt.all('active');
  }

  async getCustomerPurchases(email) {
    const stmt = this.db.prepare(`
      SELECT * FROM orders 
      WHERE customer_email = ? 
      ORDER BY created_at DESC
    `);
    return stmt.all(email);
  }

  analyzeProductFrequency(purchases) {
    const frequency = {};
    
    purchases.forEach((purchase, index) => {
      const sku = purchase.product_sku;
      if (!frequency[sku]) {
        frequency[sku] = { count: 0, dates: [] };
      }
      frequency[sku].count++;
      frequency[sku].dates.push(new Date(purchase.created_at));
    });

    // Calculate average days between purchases
    for (const sku in frequency) {
      const dates = frequency[sku].dates.sort((a, b) => a - b);
      if (dates.length > 1) {
        const intervals = [];
        for (let i = 1; i < dates.length; i++) {
          const days = (dates[i] - dates[i - 1]) / (1000 * 60 * 60 * 24);
          intervals.push(days);
        }
        frequency[sku].avgDaysBetween = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      }
    }

    return frequency;
  }

  calculateChurnRisk(subscription) {
    let score = 0;
    const factors = [];

    // Factor 1: Payment failures
    if (subscription.failed_payments > 0) {
      score += 0.3;
      factors.push('Payment failures detected');
    }

    // Factor 2: Skipped deliveries
    if (subscription.skipped_count > 2) {
      score += 0.2;
      factors.push('Multiple skipped deliveries');
    }

    // Factor 3: Time since last engagement
    const daysSinceUpdate = this.daysSince(subscription.updated_at);
    if (daysSinceUpdate > 60) {
      score += 0.25;
      factors.push('No engagement in 60+ days');
    }

    // Factor 4: No upsells/cross-sells
    if (!subscription.has_additional_products) {
      score += 0.15;
      factors.push('Single product subscription');
    }

    return { score: Math.min(score, 1.0), factors };
  }

  getRetentionAction(riskScore) {
    if (riskScore > 0.8) {
      return 'urgent_retention_call';
    } else if (riskScore > 0.6) {
      return 'send_special_offer';
    } else {
      return 'increase_engagement';
    }
  }

  calculateConversionConfidence(customer) {
    if (customer.purchase_count >= 4) return 'very_high';
    if (customer.purchase_count >= 3) return 'high';
    if (customer.purchase_count >= 2) return 'medium';
    return 'low';
  }

  determineFrequency(avgDays) {
    if (avgDays <= 10) return 'weekly';
    if (avgDays <= 20) return 'bi-weekly';
    if (avgDays <= 35) return 'monthly';
    return 'bi-monthly';
  }

  calculateProjectedMRR(opportunities) {
    let mrr = 0;
    mrr += opportunities.newSubscribers.reduce((sum, s) => sum + s.potentialMRR, 0);
    mrr += opportunities.winBackCandidates.length * 45; // Avg subscription value
    mrr += opportunities.upgradeOpportunities.reduce((sum, u) => sum + u.potentialMRRIncrease, 0);
    return mrr;
  }

  findMostFrequent(arr) {
    const frequency = {};
    arr.forEach(item => frequency[item] = (frequency[item] || 0) + 1);
    return Object.keys(frequency).reduce((a, b) => frequency[a] > frequency[b] ? a : b);
  }

  findUpgradeProduct(currentSKU) {
    // Logic to find larger size or bundle version
    return currentSKU + '-XL'; // Simplified
  }

  estimateFrequency(purchaseCount) {
    return purchaseCount >= 4 ? 'monthly' : 'bi-monthly';
  }

  daysSince(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    return Math.floor((now - date) / (1000 * 60 * 60 * 24));
  }
}
