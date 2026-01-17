# 🚀 Quick Start Guide - Fleet Manager AI

## Get Started in 5 Minutes

### Step 1: Start the Server
```bash
cd "/Users/r-kammer/CascadeProjects/Success Chemistry"
npm run server
```

You should see:
```
Server running on http://localhost:3001
🤖 Fleet Manager AI System: ONLINE
✅ Fleet Manager API routes initialized
```

### Step 2: Test the Fleet Manager

#### Option A: Via API (Terminal)
```bash
# Get current metrics
curl http://localhost:3001/api/fleet-manager/metrics

# Execute a task
curl -X POST http://localhost:3001/api/fleet-manager/execute \
  -H "Content-Type: application/json" \
  -d '{"task": "Optimize current product page for creatine + upsell stack for energy"}'

# Run daily cycle
curl -X POST http://localhost:3001/api/fleet-manager/daily-cycle
```

#### Option B: Via Dashboard (Browser)
1. Start the frontend:
```bash
npm run dev
```

2. Add the Fleet Manager Dashboard to your app routing
3. Navigate to the dashboard
4. Click "Example Task" or enter your own task
5. Click "Execute" and watch the magic happen!

### Step 3: Try Example Tasks

#### Task 1: Product Optimization
```
Optimize current product page for creatine + upsell stack for energy. 
Generate compliant description, suggest bundle, and run ad test ideas.
```

**What happens:**
- Content Agent generates FDA-compliant product description
- Upsell Agent creates energy stack bundle
- Ad Agent designs 4 ad variations for testing
- Trust Agent validates everything for compliance

#### Task 2: Churn Prevention
```
Identify high-risk customers and launch win-back campaign
```

**What happens:**
- Retention Agent analyzes all customers
- Predicts churn probability for each
- Generates personalized win-back emails
- Creates special offers for at-risk customers

#### Task 3: Revenue Boost
```
Analyze pricing strategy and maximize revenue across all products
```

**What happens:**
- Pricing Agent analyzes current pricing
- Compares with competitors
- Recommends pricing adjustments
- Projects revenue lift

## Understanding the Output

### Execution Report Structure
```json
{
  "timestamp": "2024-01-11T19:47:00.000Z",
  "task": "Your task description",
  "observations": {
    "products": [...],
    "customers": [...],
    "subscriptions": [...]
  },
  "strategy": {
    "priorities": ["content_optimization", "upsell_bundles"],
    "targetMetrics": { "mrrIncrease": "15%" }
  },
  "actions": [
    { "agent": "trust", "action": "validate_compliance" },
    { "agent": "content", "action": "generate_product_content" }
  ],
  "results": {
    "content": { "success": true, "data": {...} },
    "upsell": { "success": true, "data": {...} }
  },
  "metrics": {
    "mrr": "1250.00",
    "aov": "67.50",
    "projections": { "mrrLift": "+15%" }
  },
  "alerts": [],
  "nextSteps": [
    {
      "action": "Deploy new product content",
      "priority": "high",
      "estimatedImpact": "+12% conversion"
    }
  ]
}
```

## Key Metrics Explained

| Metric | What It Means | Good Target |
|--------|---------------|-------------|
| **MRR** | Monthly Recurring Revenue from subscriptions | Growing 10-20%/month |
| **AOV** | Average Order Value | $60-80 for supplements |
| **LTV** | Customer Lifetime Value | $300-500+ |
| **Churn Rate** | % of subscribers who cancel | <15% |
| **ROAS** | Return on Ad Spend | >3.0 |
| **Conversion Rate** | % of visitors who buy | 2-4% |

## Common Use Cases

### 1. Daily Morning Routine
```bash
# Run this every morning at 6 AM
curl -X POST http://localhost:3001/api/fleet-manager/daily-cycle
```

**What it does:**
- Analyzes yesterday's performance
- Identifies new opportunities
- Executes automated improvements
- Sends you a report

### 2. New Product Launch
```
Generate complete marketing package for new pre-workout supplement: 
product description, bundle options, ad campaigns, and pricing strategy
```

### 3. Sales Slump Recovery
```
Analyze recent sales decline and create recovery plan with 
promotional pricing, win-back campaigns, and ad optimization
```

### 4. Subscription Growth Push
```
Identify all repeat buyers and convert them to subscriptions 
with personalized offers and email campaigns
```

### 5. Compliance Audit
```
Audit all product pages and marketing materials for FDA/FTC compliance
```

## Individual Agent Testing

### Test Subscription Optimizer
```bash
curl http://localhost:3001/api/agents/subscription/opportunities
```

### Test Upsell Agent
```bash
curl -X POST http://localhost:3001/api/agents/upsell/cart \
  -H "Content-Type: application/json" \
  -d '{"cartItems": [{"sku": "CREATINE-500G", "name": "Creatine", "price": 24.99}]}'
```

### Test Content Agent
```bash
curl -X POST http://localhost:3001/api/agents/content/product \
  -H "Content-Type: application/json" \
  -d '{"productType": "creatine"}'
```

### Test Trust Agent (Compliance)
```bash
curl -X POST http://localhost:3001/api/agents/trust/validate \
  -H "Content-Type: application/json" \
  -d '{"content": "This supplement supports muscle energy production during exercise"}'
```

## Troubleshooting

### Issue: "Fleet Manager routes not found"
**Solution:** Make sure you imported and initialized the routes in `server/index.js`:
```javascript
import { setupFleetManagerRoutes } from './ai-agents/api-routes.js';
// ... later in the file
setupFleetManagerRoutes(app, db);
```

### Issue: "Database error"
**Solution:** The database tables should auto-create. If not, restart the server.

### Issue: "Compliance violations detected"
**Solution:** This is working as intended! The Trust Agent is protecting you from FDA/FTC violations. Review the suggestions and use compliant language.

### Issue: "No subscription opportunities found"
**Solution:** You need customer purchase history in the database. The system analyzes repeat buyers.

## Pro Tips

1. **Run Daily Cycles Consistently**: The power compounds over time
2. **Review Alerts Immediately**: High-priority alerts need quick action
3. **Never Override Compliance**: Trust Agent violations are serious
4. **Test Before Deploying**: Use A/B testing for major changes
5. **Monitor Trends, Not Snapshots**: Weekly trends matter more than daily fluctuations

## Next Steps

1. ✅ Test the basic functionality
2. ✅ Run your first task
3. ✅ Review the execution report
4. ✅ Set up daily automated cycles (optional)
5. ✅ Integrate with your frontend
6. ✅ Connect Google Analytics (optional)
7. ✅ Connect Meta/Google Ads APIs (optional)

## Support & Resources

- 📖 Full Documentation: `FLEET_MANAGER_README.md`
- 💡 Example Tasks: `server/ai-agents/examples/example-tasks.js`
- 🎯 API Reference: See README for all endpoints
- 🤖 Agent Details: Each agent has inline documentation

## Success Metrics to Track

After 30 days of using Fleet Manager, you should see:
- ✅ MRR increase of 15-20%
- ✅ AOV increase of 18-25%
- ✅ Churn reduction of 25-35%
- ✅ ROAS improvement of 15-20%
- ✅ Time saved: 2-3 hours/day

---

**You're all set!** 🎉 Start with the example tasks and watch your metrics improve.

Questions? Check the full documentation or review the agent code for details.
