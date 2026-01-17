/**
 * EXAMPLE TASKS FOR FLEET MANAGER AI
 * Copy these examples to test the Fleet Manager system
 */

export const exampleTasks = {
  
  // ============ PRODUCT OPTIMIZATION ============
  
  productPageOptimization: {
    task: "Optimize current product page for creatine + upsell stack for energy. Generate compliant description, suggest bundle, and run ad test ideas.",
    expectedAgents: ['content', 'upsell', 'ad', 'trust'],
    expectedOutputs: [
      'Compliant product description with FDA disclaimer',
      'Energy stack bundle with 4 products',
      '4 ad variations for A/B testing',
      'Compliance validation report'
    ],
    estimatedTime: '2-3 seconds',
    projectedImpact: {
      conversionIncrease: '+12%',
      aovIncrease: '+18%',
      revenueImpact: '+$2,400/month'
    }
  },

  // ============ CHURN PREVENTION ============
  
  churnPrevention: {
    task: "Identify high-risk customers and launch win-back campaign with personalized offers",
    expectedAgents: ['retention', 'pricing', 'ad'],
    expectedOutputs: [
      'List of high-risk customers with churn scores',
      'Personalized win-back email sequences',
      'Special discount offers',
      'Retargeting campaign setup'
    ],
    estimatedTime: '3-4 seconds',
    projectedImpact: {
      churnReduction: '-25%',
      ltvSaved: '$3,200',
      customersRetained: '15-20'
    }
  },

  // ============ SUBSCRIPTION GROWTH ============
  
  subscriptionGrowth: {
    task: "Analyze repeat buyers and convert them to subscriptions with compelling offers",
    expectedAgents: ['subscription', 'upsell', 'content'],
    expectedOutputs: [
      'List of 45+ subscription opportunities',
      'Personalized subscription offers',
      'Email campaign templates',
      'Projected MRR increase'
    ],
    estimatedTime: '2-3 seconds',
    projectedImpact: {
      mrrIncrease: '+$1,800/month',
      subscriptionConversion: '+30%',
      newSubscribers: '25-35'
    }
  },

  // ============ REVENUE OPTIMIZATION ============
  
  revenueOptimization: {
    task: "Analyze pricing strategy across all products and maximize revenue with dynamic pricing",
    expectedAgents: ['pricing', 'upsell', 'subscription'],
    expectedOutputs: [
      'Comprehensive pricing analysis',
      'Competitor comparison',
      'Pricing recommendations (5+)',
      'Bundle pricing optimization',
      'Projected revenue lift'
    ],
    estimatedTime: '3-4 seconds',
    projectedImpact: {
      revenueIncrease: '+$8,240/month',
      marginImprovement: '+6%',
      aovIncrease: '+15%'
    }
  },

  // ============ AD CAMPAIGN OPTIMIZATION ============
  
  adCampaignOptimization: {
    task: "Create new ad campaign for creatine with 4 variations and retargeting strategy",
    expectedAgents: ['ad', 'content', 'trust'],
    expectedOutputs: [
      '4 ad variations (Meta + Google)',
      'Compliant ad copy',
      'Retargeting campaign setup',
      'Budget allocation strategy',
      'Expected ROAS projections'
    ],
    estimatedTime: '2-3 seconds',
    projectedImpact: {
      roasIncrease: '+15%',
      cpaReduction: '-20%',
      conversionsIncrease: '+35'
    }
  },

  // ============ CONTENT GENERATION ============
  
  contentGeneration: {
    task: "Generate blog post about creatine benefits, social media posts, and email campaign",
    expectedAgents: ['content', 'trust'],
    expectedOutputs: [
      'SEO-optimized blog post (800+ words)',
      'Instagram, Facebook, Twitter posts',
      'Email campaign template',
      'All content compliance-validated'
    ],
    estimatedTime: '2-3 seconds',
    projectedImpact: {
      organicTraffic: '+25%',
      emailEngagement: '+18%',
      socialReach: '+40%'
    }
  },

  // ============ BUNDLE CREATION ============
  
  bundleCreation: {
    task: "Create 3 science-backed supplement stacks: Performance, Wellness, and Cognitive",
    expectedAgents: ['upsell', 'content', 'pricing', 'trust'],
    expectedOutputs: [
      '3 complete product bundles',
      'Compliant descriptions for each',
      'Optimized bundle pricing',
      'Usage instructions',
      'Marketing copy'
    ],
    estimatedTime: '3-4 seconds',
    projectedImpact: {
      aovIncrease: '+22%',
      bundleSales: '+45 units/month',
      revenueIncrease: '+$3,600/month'
    }
  },

  // ============ DAILY OPTIMIZATION ============
  
  dailyOptimization: {
    task: "Run daily optimization cycle: analyze metrics, identify opportunities, execute improvements",
    expectedAgents: ['all'],
    expectedOutputs: [
      'Comprehensive metrics dashboard',
      'Opportunity analysis',
      'Automated improvements',
      'Alert notifications',
      'Next steps recommendations'
    ],
    estimatedTime: '4-5 seconds',
    projectedImpact: {
      cumulativeImpact: 'Compounds daily',
      timesSaved: '2-3 hours/day',
      revenueOptimization: 'Continuous'
    }
  },

  // ============ COMPLIANCE AUDIT ============
  
  complianceAudit: {
    task: "Audit all product descriptions and marketing materials for FDA/FTC compliance",
    expectedAgents: ['trust', 'content'],
    expectedOutputs: [
      'Compliance validation report',
      'List of violations (if any)',
      'Revised compliant content',
      'Recommendations for improvement'
    ],
    estimatedTime: '2-3 seconds',
    projectedImpact: {
      riskReduction: '100%',
      brandProtection: 'Critical',
      legalCompliance: 'Ensured'
    }
  },

  // ============ CUSTOMER SEGMENTATION ============
  
  customerSegmentation: {
    task: "Segment customers by behavior and create personalized marketing strategies for each segment",
    expectedAgents: ['retention', 'subscription', 'upsell'],
    expectedOutputs: [
      'Customer segments (high-value, at-risk, one-time, etc.)',
      'Personalized strategies per segment',
      'Targeted offers and campaigns',
      'Projected LTV by segment'
    ],
    estimatedTime: '3-4 seconds',
    projectedImpact: {
      ltvIncrease: '+28%',
      conversionIncrease: '+20%',
      personalizedEngagement: '+45%'
    }
  }
};

/**
 * HOW TO USE THESE EXAMPLES
 * 
 * Via API:
 * ```javascript
 * const response = await fetch('http://localhost:3001/api/fleet-manager/execute', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({ task: exampleTasks.productPageOptimization.task })
 * });
 * const report = await response.json();
 * ```
 * 
 * Via Dashboard:
 * 1. Open Fleet Manager Dashboard
 * 2. Click "Example Task" button
 * 3. Or copy any task from above into the input field
 * 4. Click "Execute"
 * 5. Review comprehensive report
 */

/**
 * TESTING INDIVIDUAL AGENTS
 */

export const individualAgentTests = {
  
  subscriptionOptimizer: {
    endpoint: 'GET /api/agents/subscription/opportunities',
    description: 'Get list of subscription opportunities',
    expectedOutput: {
      newSubscribers: 'Array of customers',
      winBackCandidates: 'Array of cancelled subscribers',
      projectedMRR: 'Dollar amount'
    }
  },

  upsellAgent: {
    endpoint: 'POST /api/agents/upsell/cart',
    body: { cartItems: [{ sku: 'CREATINE-500G', name: 'Creatine', price: 24.99 }] },
    description: 'Get cart upsell recommendations',
    expectedOutput: {
      recommendations: 'Array of complementary products'
    }
  },

  contentAgent: {
    endpoint: 'POST /api/agents/content/product',
    body: { productType: 'creatine' },
    description: 'Generate compliant product description',
    expectedOutput: {
      title: 'Product title',
      description: 'Full description with disclaimer',
      seoKeywords: 'Array of keywords'
    }
  },

  adAgent: {
    endpoint: 'GET /api/agents/ad/performance',
    description: 'Monitor ad campaign performance',
    expectedOutput: {
      performance: 'Meta and Google metrics',
      analysis: 'Performance analysis',
      recommendations: 'Optimization suggestions'
    }
  },

  retentionAgent: {
    endpoint: 'GET /api/agents/retention/churn-prediction',
    description: 'Predict customer churn',
    expectedOutput: {
      highRisk: 'Array of high-risk customers',
      actionPlan: 'Retention strategies'
    }
  },

  trustAgent: {
    endpoint: 'POST /api/agents/trust/validate',
    body: { content: 'This product cures diabetes' },
    description: 'Validate content compliance',
    expectedOutput: {
      isCompliant: false,
      violations: 'Array of violations',
      suggestions: 'Compliance recommendations'
    }
  },

  pricingAgent: {
    endpoint: 'GET /api/agents/pricing/analysis',
    description: 'Analyze pricing strategy',
    expectedOutput: {
      currentPricing: 'Pricing analysis',
      recommendations: 'Pricing adjustments',
      projectedRevenueLift: 'Dollar amount'
    }
  }
};

/**
 * SCHEDULED AUTOMATION EXAMPLES
 */

export const scheduledTasks = {
  
  dailyCycle: {
    schedule: 'Every day at 6:00 AM',
    endpoint: 'POST /api/fleet-manager/daily-cycle',
    description: 'Automated daily optimization',
    actions: [
      'Analyze all metrics',
      'Identify opportunities',
      'Execute improvements',
      'Generate report'
    ]
  },

  weeklyCycle: {
    schedule: 'Every Monday at 9:00 AM',
    endpoint: 'POST /api/fleet-manager/weekly-cycle',
    description: 'Strategic weekly review',
    actions: [
      'Deep trend analysis',
      'A/B test results',
      'Strategic adjustments',
      'Forecast planning'
    ]
  }
};

/**
 * CRON JOB SETUP (Optional)
 * 
 * Add to your server or use a service like cron-job.org:
 * 
 * Daily (6 AM):
 * 0 6 * * * curl -X POST http://localhost:3001/api/fleet-manager/daily-cycle
 * 
 * Weekly (Monday 9 AM):
 * 0 9 * * 1 curl -X POST http://localhost:3001/api/fleet-manager/weekly-cycle
 */
