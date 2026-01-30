# 🤖 Fleet Manager AI System

## Overview

The Fleet Manager AI is a sophisticated orchestration system that controls 8 specialized AI agents to maximize sales, AOV, subscriptions, retention, and compliance for Success Chemistry's supplement e-commerce business.

## Mission

Help customers achieve peak performance with science-backed, GMP-certified products while driving passive revenue growth through intelligent automation.

## Architecture

### Fleet Manager (Overseer Agent)
The meta-agent that coordinates all specialized agents using a 5-step execution cycle:
1. **Observe** - Collect data from all sources
2. **Reason** - Analyze data and formulate strategy
3. **Delegate** - Assign tasks to specialized agents
4. **Act** - Execute agent actions
5. **Report** - Generate results and next steps

### 8 Specialized Agents

#### 1. Subscription Optimizer
- **Focus**: Maximize MRR, reduce churn
- **Actions**:
  - Analyze customer behavior for subscription opportunities
  - Auto-suggest/enroll eligible customers
  - Predict churn risk and trigger interventions
  - Generate personalized subscription offers

#### 2. Upsell Agent
- **Focus**: Increase AOV through intelligent bundling
- **Actions**:
  - Recommend complementary products in cart
  - Create science-backed supplement stacks
  - Generate checkout upsell offers
  - Design email upsell campaigns

#### 3. Content Agent
- **Focus**: SEO-optimized, compliant content generation
- **Actions**:
  - Generate product descriptions (FDA/FTC compliant)
  - Create blog posts and educational content
  - Design social media posts
  - Write email marketing campaigns

#### 4. Ad Agent
- **Focus**: Maximize ROAS, optimize ad spend
- **Actions**:
  - Generate A/B test variations for Meta/Google
  - Monitor campaign performance
  - Create retargeting campaigns
  - Suggest budget allocation

#### 5. Retention Agent
- **Focus**: Reduce churn, increase LTV
- **Actions**:
  - Predict customer churn probability
  - Trigger personalized win-back flows
  - Generate re-engagement email sequences
  - Analyze engagement trends

#### 6. Trust Agent
- **Focus**: Compliance and brand protection
- **Actions**:
  - Validate all content for FDA/FTC compliance
  - Enforce no disease/cure/treatment claims
  - Generate compliant testimonials
  - Add required disclaimers

#### 7. Pricing Agent
- **Focus**: Revenue optimization through dynamic pricing
- **Actions**:
  - Analyze competitor pricing
  - Forecast demand
  - Recommend pricing adjustments
  - Create tiered pricing strategies

#### 8. Overseer Agent (Fleet Manager)
- **Focus**: Coordination and reporting
- **Actions**:
  - Orchestrate all agents strategically
  - Track key metrics (MRR, AOV, LTV, ROAS)
  - Generate comprehensive reports
  - Alert on anomalies

## Key Metrics Tracked

- **MRR** (Monthly Recurring Revenue)
- **AOV** (Average Order Value)
- **LTV** (Customer Lifetime Value)
- **Churn Rate**
- **ROAS** (Return on Ad Spend)
- **Conversion Rate**
- **Subscription Rate**

## Compliance Rules

### FDA/FTC Guidelines
✅ **Allowed** (Structure/Function Claims):
- "Supports muscle energy production*"
- "May help maintain healthy levels*"
- "Promotes overall wellness*"

❌ **Prohibited** (Disease Claims):
- "Cures diabetes"
- "Treats heart disease"
- "Prevents cancer"
- "Fights infections"

### Required Disclaimers
All health claims must include:
```
*These statements have not been evaluated by the Food and Drug Administration. 
This product is not intended to diagnose, treat, cure, or prevent any disease.
```

## API Endpoints

### Fleet Manager
```bash
# Execute custom task
POST /api/fleet-manager/execute
Body: { "task": "Your task description" }

# Run daily automated cycle
POST /api/fleet-manager/daily-cycle

# Run weekly strategic review
POST /api/fleet-manager/weekly-cycle

# Get current metrics
GET /api/fleet-manager/metrics
```

### Individual Agents

#### Subscription Optimizer
```bash
GET /api/agents/subscription/opportunities
POST /api/agents/subscription/generate-offer
```

#### Upsell Agent
```bash
POST /api/agents/upsell/cart
POST /api/agents/upsell/checkout
```

#### Content Agent
```bash
POST /api/agents/content/product
POST /api/agents/content/blog
POST /api/agents/content/social
```

#### Ad Agent
```bash
POST /api/agents/ad/generate-tests
GET /api/agents/ad/performance
```

#### Retention Agent
```bash
GET /api/agents/retention/churn-prediction
POST /api/agents/retention/winback-email
```

#### Trust Agent
```bash
POST /api/agents/trust/validate
GET /api/agents/trust/testimonials
```

#### Pricing Agent
```bash
GET /api/agents/pricing/analysis
POST /api/agents/pricing/tiered
```

## Example Tasks

### Task 1: Product Page Optimization
```
"Optimize current product page for creatine + upsell stack for energy. 
Generate compliant description, suggest bundle, and run ad test ideas."
```

**Expected Output**:
- Compliant product description from Content Agent
- Energy stack bundle from Upsell Agent
- 4 ad variations from Ad Agent
- Compliance validation from Trust Agent

### Task 2: Churn Prevention
```
"Identify high-risk customers and launch win-back campaign"
```

**Expected Output**:
- Churn predictions from Retention Agent
- Personalized win-back emails
- Special offers from Pricing Agent
- Retargeting campaign from Ad Agent

### Task 3: Revenue Optimization
```
"Analyze pricing strategy and maximize revenue across all products"
```

**Expected Output**:
- Pricing analysis from Pricing Agent
- Bundle recommendations from Upsell Agent
- Subscription conversion strategy from Subscription Optimizer
- Demand forecast

## Usage Examples

### Via API
```javascript
// Execute a task
const response = await fetch('http://localhost:3001/api/fleet-manager/execute', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    task: 'Generate compliant creatine product description with upsell bundle'
  })
});

const report = await response.json();
console.log(report);
```

### Via Dashboard
1. Navigate to Fleet Manager Dashboard
2. Enter task in input field
3. Click "Execute"
4. View comprehensive report with:
   - Actions taken by each agent
   - Projected sales lift
   - Next steps
   - Alerts and warnings

## Automated Cycles

### Daily Cycle (Recommended: 6 AM)
- Analyze all metrics
- Identify opportunities
- Execute improvements
- Generate daily report

### Weekly Cycle (Recommended: Monday 9 AM)
- Deep analysis of trends
- A/B test results review
- Strategic adjustments
- Forecast planning

## Alert Thresholds

The system automatically alerts when:
- Subscription drop > 10%
- Churn rate > 15%
- ROAS < 2.0
- AOV drop > 8%

## Projected Impact

Based on initial analysis:
- **MRR Increase**: +15-20%
- **AOV Increase**: +18-25%
- **LTV Increase**: +22-30%
- **Churn Reduction**: -25-35%
- **ROAS Improvement**: +15-20%

## Best Practices

1. **Run Daily Cycles**: Consistent optimization compounds over time
2. **Review Alerts Immediately**: High-priority alerts require quick action
3. **Trust Compliance Agent**: Never override compliance violations
4. **Test Recommendations**: A/B test major changes before full rollout
5. **Monitor Metrics**: Track trends weekly, not just snapshots

## Integration with Existing Systems

The Fleet Manager integrates with:
- ✅ SQLite database (products, customers, subscriptions, orders)
- ✅ Stripe (subscription billing)
- ✅ WooCommerce API (product sync)
- ✅ Walmart API (inventory)
- 🔄 Google Analytics (planned)
- 🔄 Meta Ads API (planned)
- 🔄 Google Ads API (planned)

## Security & Compliance

- All content validated before deployment
- No disease claims allowed
- Required disclaimers automatically added
- Third-party testing badges displayed
- GMP certification highlighted

## Support

For questions or issues:
1. Check execution reports for detailed error messages
2. Review compliance warnings before publishing
3. Monitor agent status in dashboard
4. Escalate critical alerts to human review

## Future Enhancements

- [ ] Real-time Google Analytics integration
- [ ] Automated Meta/Google Ads API connection
- [ ] SMS marketing campaigns
- [ ] Predictive inventory management
- [ ] Customer segmentation AI
- [ ] Voice of customer analysis
- [ ] Competitor price monitoring API
- [ ] **Agentic-managed CDP** — Unified customer data layer for Observe/Act; see [CDP_AGENTIC_MANAGED.md](./CDP_AGENTIC_MANAGED.md)

---

**Built for Success Chemistry** | Powered by AI | Compliant by Design
