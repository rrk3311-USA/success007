/**
 * METRICS COLLECTOR
 * Centralized metrics tracking for all agents
 * Tracks: MRR, AOV, LTV, Churn Rate, ROAS, Conversion Rate
 */

export class MetricsCollector {
  constructor(db) {
    this.db = db;
  }

  /**
   * Get Monthly Recurring Revenue (MRR)
   */
  async getMRR() {
    const stmt = this.db.prepare(`
      SELECT SUM(CAST(price AS REAL)) as mrr 
      FROM subscriptions 
      WHERE status = 'active'
    `);
    const result = stmt.get();
    return parseFloat(result.mrr || 0).toFixed(2);
  }

  /**
   * Get Average Order Value (AOV)
   */
  async getAOV() {
    const stmt = this.db.prepare(`
      SELECT AVG(CAST(total AS REAL)) as aov 
      FROM orders 
      WHERE created_at > datetime('now', '-30 days')
    `);
    const result = stmt.get();
    return parseFloat(result.aov || 0).toFixed(2);
  }

  /**
   * Get Customer Lifetime Value (LTV)
   */
  async getLTV() {
    const stmt = this.db.prepare(`
      SELECT AVG(customer_total) as ltv
      FROM (
        SELECT customer_email, SUM(CAST(total AS REAL)) as customer_total
        FROM orders
        GROUP BY customer_email
      )
    `);
    const result = stmt.get();
    return parseFloat(result.ltv || 0).toFixed(2);
  }

  /**
   * Get Churn Rate
   */
  async getChurnRate() {
    const totalSubs = this.db.prepare('SELECT COUNT(*) as count FROM subscriptions').get();
    const cancelledSubs = this.db.prepare(`
      SELECT COUNT(*) as count FROM subscriptions 
      WHERE status = 'cancelled' 
      AND cancelled_at > datetime('now', '-30 days')
    `).get();
    
    if (totalSubs.count === 0) return 0;
    return ((cancelledSubs.count / totalSubs.count) * 100).toFixed(1);
  }

  /**
   * Get Return on Ad Spend (ROAS)
   */
  async getROAS() {
    // Simplified - would integrate with actual ad platform data
    const revenue = await this.getRevenue30Days();
    const adSpend = 770; // Placeholder - would come from Meta/Google APIs
    return (revenue / adSpend).toFixed(2);
  }

  /**
   * Get Conversion Rate
   */
  async getConversionRate() {
    // Simplified - would integrate with Google Analytics
    const orders = this.db.prepare(`
      SELECT COUNT(*) as count FROM orders 
      WHERE created_at > datetime('now', '-30 days')
    `).get();
    
    const sessions = 12500; // Placeholder - would come from GA
    return ((orders.count / sessions) * 100).toFixed(2);
  }

  /**
   * Get Subscription Rate (% of customers with active subscriptions)
   */
  async getSubscriptionRate() {
    const totalCustomers = this.db.prepare('SELECT COUNT(*) as count FROM customers').get();
    const subscribedCustomers = this.db.prepare(`
      SELECT COUNT(DISTINCT customer_id) as count FROM subscriptions WHERE status = 'active'
    `).get();
    
    if (totalCustomers.count === 0) return 0;
    return ((subscribedCustomers.count / totalCustomers.count) * 100).toFixed(1);
  }

  /**
   * Get revenue for last 30 days
   */
  async getRevenue30Days() {
    const stmt = this.db.prepare(`
      SELECT SUM(CAST(total AS REAL)) as revenue 
      FROM orders 
      WHERE created_at > datetime('now', '-30 days')
    `);
    const result = stmt.get();
    return parseFloat(result.revenue || 0);
  }

  /**
   * Get comprehensive dashboard metrics
   */
  async getDashboardMetrics() {
    return {
      mrr: await this.getMRR(),
      aov: await this.getAOV(),
      ltv: await this.getLTV(),
      churnRate: await this.getChurnRate(),
      roas: await this.getROAS(),
      conversionRate: await this.getConversionRate(),
      subscriptionRate: await this.getSubscriptionRate(),
      revenue30Days: await this.getRevenue30Days(),
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Track metric changes over time
   */
  async trackMetricTrend(metricName, days = 30) {
    // Placeholder for time-series tracking
    return {
      metric: metricName,
      period: `${days} days`,
      trend: 'increasing',
      change: '+12%',
    };
  }
}
