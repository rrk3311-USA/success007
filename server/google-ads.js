import { GoogleAdsApi } from 'google-ads-api';

let client = null;

export function initializeGoogleAds() {
  try {
    const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
    const customerId = process.env.GOOGLE_ADS_CUSTOMER_ID;

    if (!serviceAccountJson || !customerId) {
      console.log('⚠️  Google Ads API credentials not configured');
      return null;
    }

    // Parse service account JSON
    const credentials = JSON.parse(serviceAccountJson);

    // Initialize Google Ads API client
    client = new GoogleAdsApi({
      client_id: credentials.client_id,
      client_secret: credentials.private_key,
      developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN || 'PLACEHOLDER',
      refresh_token: credentials.refresh_token,
    });

    console.log('✅ Google Ads API initialized');
    return client;
  } catch (error) {
    console.error('❌ Google Ads API initialization error:', error.message);
    return null;
  }
}

export async function testConnection() {
  try {
    if (!client) {
      client = initializeGoogleAds();
      if (!client) {
        return { success: false, error: 'Google Ads API not configured' };
      }
    }

    const customerId = process.env.GOOGLE_ADS_CUSTOMER_ID;
    const customer = client.Customer({ customer_id: customerId });

    // Try to fetch basic account info
    const query = `
      SELECT
        customer.id,
        customer.descriptive_name,
        customer.currency_code,
        customer.time_zone
      FROM customer
      LIMIT 1
    `;

    const results = await customer.query(query);
    
    return {
      success: true,
      data: results[0] || {},
      message: 'Google Ads API connection successful'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      details: error.stack
    };
  }
}

export async function getCampaignPerformance(dateRange = 'LAST_30_DAYS') {
  try {
    if (!client) {
      client = initializeGoogleAds();
      if (!client) {
        return { success: false, error: 'Google Ads API not configured' };
      }
    }

    const customerId = process.env.GOOGLE_ADS_CUSTOMER_ID;
    const customer = client.Customer({ customer_id: customerId });

    const query = `
      SELECT
        campaign.id,
        campaign.name,
        campaign.status,
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros,
        metrics.conversions,
        metrics.conversions_value
      FROM campaign
      WHERE segments.date DURING ${dateRange}
      ORDER BY metrics.impressions DESC
      LIMIT 10
    `;

    const campaigns = await customer.query(query);

    const formatted = campaigns.map(c => ({
      id: c.campaign.id,
      name: c.campaign.name,
      status: c.campaign.status,
      impressions: c.metrics.impressions,
      clicks: c.metrics.clicks,
      cost: (c.metrics.cost_micros / 1000000).toFixed(2),
      conversions: c.metrics.conversions,
      conversions_value: c.metrics.conversions_value,
      ctr: c.metrics.impressions > 0 ? ((c.metrics.clicks / c.metrics.impressions) * 100).toFixed(2) : 0,
      cpc: c.metrics.clicks > 0 ? ((c.metrics.cost_micros / 1000000) / c.metrics.clicks).toFixed(2) : 0
    }));

    return {
      success: true,
      campaigns: formatted,
      total: campaigns.length
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      details: error.stack
    };
  }
}

export async function getAccountMetrics(dateRange = 'LAST_30_DAYS') {
  try {
    if (!client) {
      client = initializeGoogleAds();
      if (!client) {
        return { success: false, error: 'Google Ads API not configured' };
      }
    }

    const customerId = process.env.GOOGLE_ADS_CUSTOMER_ID;
    const customer = client.Customer({ customer_id: customerId });

    const query = `
      SELECT
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros,
        metrics.conversions,
        metrics.conversions_value
      FROM customer
      WHERE segments.date DURING ${dateRange}
    `;

    const results = await customer.query(query);
    const metrics = results[0]?.metrics || {};

    return {
      success: true,
      metrics: {
        impressions: metrics.impressions || 0,
        clicks: metrics.clicks || 0,
        cost: ((metrics.cost_micros || 0) / 1000000).toFixed(2),
        conversions: metrics.conversions || 0,
        conversions_value: metrics.conversions_value || 0,
        ctr: metrics.impressions > 0 ? ((metrics.clicks / metrics.impressions) * 100).toFixed(2) : 0,
        cpc: metrics.clicks > 0 ? (((metrics.cost_micros || 0) / 1000000) / metrics.clicks).toFixed(2) : 0,
        roas: metrics.cost_micros > 0 ? ((metrics.conversions_value / (metrics.cost_micros / 1000000))).toFixed(2) : 0
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      details: error.stack
    };
  }
}
