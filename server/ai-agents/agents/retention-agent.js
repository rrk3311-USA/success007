/**
 * RETENTION AGENT
 * Predict churn → trigger personalized re-engagement flows
 * Focus: Reduce churn, increase LTV, win back customers
 */

export class RetentionAgent {
  constructor(db, metrics) {
    this.db = db;
    this.metrics = metrics;
    this.churnThreshold = 0.65; // 65% churn probability triggers action
  }

  /**
   * Predict customer churn risk
   */
  async predict_churn(params) {
    const predictions = {
      highRisk: [],
      mediumRisk: [],
      lowRisk: [],
      totalAnalyzed: 0,
      actionPlan: {},
    };

    // Analyze all active customers and subscribers
    const customers = await this.getActiveCustomers();
    
    for (const customer of customers) {
      const churnScore = await this.calculateChurnScore(customer);
      const prediction = {
        email: customer.email,
        name: customer.name,
        churnScore: churnScore.score,
        riskFactors: churnScore.factors,
        ltv: await this.calculateCustomerLTV(customer.email),
        recommendedAction: this.getRetentionAction(churnScore.score),
        priority: this.getPriority(churnScore.score, customer),
      };

      if (churnScore.score >= 0.75) {
        predictions.highRisk.push(prediction);
      } else if (churnScore.score >= 0.50) {
        predictions.mediumRisk.push(prediction);
      } else {
        predictions.lowRisk.push(prediction);
      }
    }

    predictions.totalAnalyzed = customers.length;
    predictions.actionPlan = this.createRetentionActionPlan(predictions);

    return predictions;
  }

  /**
   * Calculate churn probability score (0-1)
   */
  async calculateChurnScore(customer) {
    let score = 0;
    const factors = [];

    // Factor 1: Days since last purchase
    const daysSinceLastPurchase = await this.getDaysSinceLastPurchase(customer.email);
    if (daysSinceLastPurchase > 60) {
      score += 0.30;
      factors.push(`No purchase in ${daysSinceLastPurchase} days`);
    } else if (daysSinceLastPurchase > 45) {
      score += 0.15;
      factors.push(`${daysSinceLastPurchase} days since last purchase`);
    }

    // Factor 2: Declining order frequency
    const orderTrend = await this.analyzeOrderTrend(customer.email);
    if (orderTrend === 'declining') {
      score += 0.25;
      factors.push('Declining order frequency');
    }

    // Factor 3: Subscription status
    const hasActiveSubscription = await this.hasActiveSubscription(customer.email);
    if (!hasActiveSubscription) {
      score += 0.20;
      factors.push('No active subscription');
    }

    // Factor 4: Email engagement
    const emailEngagement = await this.getEmailEngagement(customer.email);
    if (emailEngagement < 0.2) {
      score += 0.15;
      factors.push('Low email engagement');
    }

    // Factor 5: Support tickets/complaints
    const hasRecentComplaints = await this.hasRecentComplaints(customer.email);
    if (hasRecentComplaints) {
      score += 0.10;
      factors.push('Recent support issues');
    }

    return {
      score: Math.min(score, 1.0),
      factors,
      confidence: factors.length >= 3 ? 'high' : 'medium',
    };
  }

  /**
   * Create retention action plan
   */
  createRetentionActionPlan(predictions) {
    const plan = {
      immediate: [],
      thisWeek: [],
      thisMonth: [],
      projectedSavings: 0,
    };

    // High risk - immediate action
    predictions.highRisk.forEach(customer => {
      plan.immediate.push({
        customer: customer.email,
        action: 'personal_outreach',
        tactic: 'Phone call or personal email from founder',
        offer: '25% off next order + free gift',
        timeline: 'Within 24 hours',
        expectedRetention: '40%',
      });
    });

    // Medium risk - this week
    predictions.mediumRisk.forEach(customer => {
      plan.thisWeek.push({
        customer: customer.email,
        action: 'automated_winback_sequence',
        tactic: '3-email sequence with escalating offers',
        offer: 'Start with 15%, escalate to 20% if no response',
        timeline: 'Days 1, 3, 7',
        expectedRetention: '25%',
      });
    });

    // Calculate projected savings
    const highRiskLTV = predictions.highRisk.reduce((sum, c) => sum + c.ltv, 0);
    const mediumRiskLTV = predictions.mediumRisk.reduce((sum, c) => sum + c.ltv, 0);
    plan.projectedSavings = (highRiskLTV * 0.40) + (mediumRiskLTV * 0.25);

    return plan;
  }

  /**
   * Generate personalized win-back email
   */
  async generate_winback_email(customer) {
    const daysSinceLastPurchase = await this.getDaysSinceLastPurchase(customer.email);
    const lastProduct = await this.getLastPurchasedProduct(customer.email);

    return {
      subject: `${customer.name}, we miss you! 🎁 Here's 20% off`,
      preheader: 'Your exclusive comeback offer inside',
      body: `
Hi ${customer.name},

We noticed it's been ${daysSinceLastPurchase} days since your last order, and we wanted to reach out personally.

**We miss you!** 💙

Your health and fitness journey matters to us, and we want to make sure you have everything you need to succeed.

**Here's a special offer just for you:**
✨ 20% OFF your next order
✨ FREE shipping (no minimum)
✨ FREE shaker bottle with any purchase
✨ Priority customer support

Use code: **COMEBACK20** at checkout

**Quick reorder:** ${lastProduct.name}
[REORDER NOW BUTTON]

Or browse our full catalog of premium supplements:
[SHOP ALL BUTTON]

**Why customers come back to Success Chemistry:**
✓ Third-party tested for purity
✓ GMP-certified manufacturing
✓ 30-day money-back guarantee
✓ Subscribe & save 15% on every order

Questions? Just reply to this email - I'm here to help!

To your success,
[Team Member Name]
Success Chemistry

P.S. This offer expires in 7 days. Don't miss out!

---
*These statements have not been evaluated by the FDA. Products are not intended to diagnose, treat, cure, or prevent any disease.
`,
      timing: 'Send immediately',
      followUp: {
        day3: 'Reminder email if no open',
        day7: 'Final chance email with urgency',
      },
    };
  }

  /**
   * Generate re-engagement sequence
   */
  async generate_reengagement_sequence(customer) {
    return {
      name: 'Win-Back Sequence - 3 Emails',
      customer: customer.email,
      emails: [
        {
          day: 1,
          subject: 'We miss you, ${name}! 🎁',
          focus: 'Emotional reconnection + 15% off',
          cta: 'Come Back & Save',
        },
        {
          day: 3,
          subject: '${name}, your 20% discount is waiting...',
          focus: 'Increased offer + social proof',
          cta: 'Claim My 20% Off',
        },
        {
          day: 7,
          subject: 'Last chance: 25% off expires tonight!',
          focus: 'Urgency + maximum discount + free gift',
          cta: 'Don\'t Miss Out',
        },
      ],
      exitCriteria: 'Stop if customer makes purchase',
      expectedConversion: '15-25%',
    };
  }

  /**
   * Trigger personalized re-engagement flow
   */
  async trigger_reengagement(customer) {
    const churnScore = await this.calculateChurnScore(customer);
    
    const flow = {
      customer: customer.email,
      churnScore: churnScore.score,
      flow: null,
      channels: [],
    };

    if (churnScore.score >= 0.75) {
      // High risk - multi-channel approach
      flow.flow = 'high_risk_intervention';
      flow.channels = [
        { channel: 'email', action: 'personal_email_from_founder' },
        { channel: 'sms', action: 'text_with_exclusive_offer' },
        { channel: 'phone', action: 'courtesy_call_if_ltv_>_500' },
        { channel: 'retargeting', action: 'facebook_instagram_ads' },
      ];
    } else if (churnScore.score >= 0.50) {
      // Medium risk - automated sequence
      flow.flow = 'automated_winback_sequence';
      flow.channels = [
        { channel: 'email', action: '3_email_sequence' },
        { channel: 'retargeting', action: 'display_ads' },
      ];
    } else {
      // Low risk - gentle nudge
      flow.flow = 'gentle_reminder';
      flow.channels = [
        { channel: 'email', action: 'product_recommendation' },
      ];
    }

    return flow;
  }

  /**
   * Analyze customer engagement trends
   */
  async analyze_engagement_trends() {
    const trends = {
      overall: {},
      bySegment: {},
      recommendations: [],
    };

    // Overall engagement metrics
    const totalCustomers = await this.getTotalCustomers();
    const activeCustomers = await this.getActiveCustomers();
    const churnedCustomers = totalCustomers.length - activeCustomers.length;

    trends.overall = {
      totalCustomers: totalCustomers.length,
      activeCustomers: activeCustomers.length,
      churnedCustomers,
      churnRate: ((churnedCustomers / totalCustomers.length) * 100).toFixed(1),
      avgDaysBetweenPurchases: await this.getAvgDaysBetweenPurchases(),
    };

    // Segment analysis
    trends.bySegment = {
      subscribers: await this.analyzeSubscriberEngagement(),
      oneTimeBuyers: await this.analyzeOneTimeBuyers(),
      repeatBuyers: await this.analyzeRepeatBuyers(),
    };

    // Generate recommendations
    if (parseFloat(trends.overall.churnRate) > 15) {
      trends.recommendations.push({
        priority: 'high',
        action: 'Launch aggressive retention campaign',
        impact: 'Could save $' + (churnedCustomers * 150).toFixed(0) + ' in LTV',
      });
    }

    return trends;
  }

  // Helper methods
  async getActiveCustomers() {
    const stmt = this.db.prepare(`
      SELECT DISTINCT c.* FROM customers c
      JOIN orders o ON c.email = o.customer_email
      WHERE o.created_at > datetime('now', '-90 days')
    `);
    return stmt.all();
  }

  async getTotalCustomers() {
    const stmt = this.db.prepare('SELECT * FROM customers');
    return stmt.all();
  }

  async getDaysSinceLastPurchase(email) {
    const stmt = this.db.prepare(`
      SELECT MAX(created_at) as last_purchase 
      FROM orders 
      WHERE customer_email = ?
    `);
    const result = stmt.get(email);
    if (!result || !result.last_purchase) return 999;
    
    const lastPurchase = new Date(result.last_purchase);
    const now = new Date();
    return Math.floor((now - lastPurchase) / (1000 * 60 * 60 * 24));
  }

  async analyzeOrderTrend(email) {
    const stmt = this.db.prepare(`
      SELECT created_at FROM orders 
      WHERE customer_email = ? 
      ORDER BY created_at DESC 
      LIMIT 5
    `);
    const orders = stmt.all(email);
    
    if (orders.length < 3) return 'insufficient_data';
    
    // Calculate intervals between orders
    const intervals = [];
    for (let i = 1; i < orders.length; i++) {
      const date1 = new Date(orders[i - 1].created_at);
      const date2 = new Date(orders[i].created_at);
      const days = (date1 - date2) / (1000 * 60 * 60 * 24);
      intervals.push(days);
    }
    
    // Check if intervals are increasing (declining frequency)
    const avgFirst = intervals.slice(0, 2).reduce((a, b) => a + b, 0) / 2;
    const avgLast = intervals.slice(-2).reduce((a, b) => a + b, 0) / 2;
    
    return avgLast > avgFirst * 1.3 ? 'declining' : 'stable';
  }

  async hasActiveSubscription(email) {
    const stmt = this.db.prepare(`
      SELECT COUNT(*) as count FROM subscriptions 
      WHERE customer_email = ? AND status = 'active'
    `);
    const result = stmt.get(email);
    return result.count > 0;
  }

  async getEmailEngagement(email) {
    // Placeholder - would integrate with email service provider
    return Math.random() * 0.5; // Simulated engagement rate
  }

  async hasRecentComplaints(email) {
    // Placeholder - would integrate with support ticket system
    return Math.random() > 0.9; // 10% chance of recent complaint
  }

  async calculateCustomerLTV(email) {
    const stmt = this.db.prepare(`
      SELECT SUM(CAST(total AS REAL)) as ltv 
      FROM orders 
      WHERE customer_email = ?
    `);
    const result = stmt.get(email);
    return result.ltv || 0;
  }

  async getLastPurchasedProduct(email) {
    const stmt = this.db.prepare(`
      SELECT p.* FROM orders o
      JOIN products p ON o.product_sku = p.sku
      WHERE o.customer_email = ?
      ORDER BY o.created_at DESC
      LIMIT 1
    `);
    return stmt.get(email) || { name: 'your favorite products' };
  }

  getRetentionAction(churnScore) {
    if (churnScore >= 0.75) return 'immediate_personal_outreach';
    if (churnScore >= 0.50) return 'automated_winback_sequence';
    if (churnScore >= 0.30) return 'gentle_reminder_email';
    return 'monitor';
  }

  getPriority(churnScore, customer) {
    if (churnScore >= 0.75) return 'critical';
    if (churnScore >= 0.50) return 'high';
    if (churnScore >= 0.30) return 'medium';
    return 'low';
  }

  async getAvgDaysBetweenPurchases() {
    // Simplified calculation
    return 35;
  }

  async analyzeSubscriberEngagement() {
    const stmt = this.db.prepare('SELECT COUNT(*) as count FROM subscriptions WHERE status = "active"');
    const result = stmt.get();
    return { activeSubscriptions: result.count, churnRate: '8%' };
  }

  async analyzeOneTimeBuyers() {
    const stmt = this.db.prepare(`
      SELECT COUNT(DISTINCT customer_email) as count 
      FROM orders 
      GROUP BY customer_email 
      HAVING COUNT(*) = 1
    `);
    const result = stmt.get();
    return { count: result?.count || 0, conversionOpportunity: 'high' };
  }

  async analyzeRepeatBuyers() {
    const stmt = this.db.prepare(`
      SELECT COUNT(DISTINCT customer_email) as count 
      FROM orders 
      GROUP BY customer_email 
      HAVING COUNT(*) >= 2
    `);
    const result = stmt.get();
    return { count: result?.count || 0, avgLTV: 450 };
  }
}
