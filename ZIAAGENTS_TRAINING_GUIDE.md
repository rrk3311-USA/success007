# Zoho ZiaAgents Training Guide

This guide explains how to train and interact with your custom Zoho ZiaAgents agent using the provided API.

## Overview

Your custom ZiaAgents agent is configured with:
- **Org ID**: `912788863`
- **Agent ID**: `3497000000002049`
- **API Endpoint**: `https://ziaagents.zoho.com/ziaagents/api/v1/agents/query`
- **OAuth Scope**: `ZiaAgents.agents.TRIGGER`

## Prerequisites

1. **OAuth Token**: You need a valid Zoho OAuth access token with the `ZiaAgents.agents.TRIGGER` scope
2. **Environment Variables**: Configure the following in your `.env` file:
   ```env
   ZIAAGENTS_ORG_ID=912788863
   ZIAAGENTS_AGENT_ID=3497000000002049
   ZOHO_CRM_ACCESS_TOKEN=your_access_token
   ZOHO_REFRESH_TOKEN=your_refresh_token
   ZOHO_CLIENT_ID=your_client_id
   ZOHO_CLIENT_SECRET=your_client_secret
   ```

## Getting OAuth Token with ZiaAgents Scope

To get an OAuth token with the `ZiaAgents.agents.TRIGGER` scope:

1. **Update OAuth Scopes**: Modify `zoho-oauth-helper.js` to include the ZiaAgents scope:
   ```javascript
   const SCOPES = [
       'ZohoCRM.modules.ALL',
       'ZohoCRM.settings.ALL',
       'ZohoCRM.users.READ',
       'ZiaAgents.agents.TRIGGER'  // Add this
   ].join(',');
   ```

2. **Run OAuth Helper**:
   ```bash
   node zoho-oauth-helper.js
   ```

3. **Authorize**: Follow the prompts to authorize and get your tokens

## Training the Agent

The training script loads your knowledge base and training prompts, then sends them to the agent via the API.

### Step 1: Prepare Training Data

Make sure you have:
- `zia-knowledge-base.json` - Contains product information, company details, and business rules
- `zia-training-prompts.json` - Contains training prompts for different scenarios

### Step 2: Train the Agent

Run the training script:

```bash
node train-zoho-zia-agent.js train
```

This will:
1. Load your knowledge base and training prompts
2. Build system arguments with all training data
3. Send an initialization query to the agent
4. Test the agent with a sample query

### What Gets Trained

The agent receives:
- **Knowledge Base**: Complete product catalog (45+ products), company information, business rules, common questions
- **Training Prompts**: Guidelines for product inquiries, order inquiries, customer service, lead management
- **Tools**: Available API tools and CRM access:
  - Search Products API
  - Get Product Details API
  - Access CRM Leads
  - Access CRM Deals
  - Access CRM Contacts
- **Knowledge Sources**: References to:
  - Product Knowledge Base (JSON document)
  - Success Chemistry Website (live URL)
  - Product API (real-time data)
- **API Endpoints**: Direct links to product search and details endpoints
- **Guidelines**: Best practices for interactions and tool usage
- **Guardrails**: Compliance rules (FDA/FTC regulations, no medical advice, etc.)
- **Company Info**: Brand voice, certifications, contact information

## Querying the Agent

### Single Query

Query the agent with a specific message:

```bash
node train-zoho-zia-agent.js query "What products does Success Chemistry offer?"
```

### Interactive Mode

Start an interactive session:

```bash
node train-zoho-zia-agent.js interactive
```

Then type your questions. Type `exit` or `quit` to end the session.

## API Request Format

The script makes POST requests to the ZiaAgents API with this format:

```javascript
{
  "query": "<your message>",
  "systemArgs": "<JSON string with training data>"
}
```

Headers:
```javascript
{
  'X-ZIAAGENTS-ORG': '912788863',
  'X-ZIAAGENTS-AGENT-ID': '3497000000002049',
  'X-ZIAAGENTS-AGENT-SESSION-ID': '<session-id>',
  'Authorization': 'Zoho-oauthtoken <access-token>',
  'Content-Type': 'application/json'
}
```

## System Arguments Structure

The `systemArgs` parameter contains:

```json
{
  "knowledgeBase": {
    "company": {...},
    "products": [...],
    "businessRules": [...],
    "commonQuestions": [...]
  },
  "trainingPrompts": {
    "productInquiries": [...],
    "orderInquiries": [...],
    "customerService": [...],
    "leadManagement": [...]
  },
  "tools": [
    {
      "name": "Search Products",
      "type": "api",
      "endpoint": "https://successchemistry.com/api/zia/products/search",
      "description": "Search products by name, ingredient, or category"
    },
    {
      "name": "Get Product Details",
      "type": "api",
      "endpoint": "https://successchemistry.com/api/zia/products/:sku",
      "description": "Get detailed product information by SKU"
    },
    {
      "name": "Access CRM Leads",
      "type": "crm",
      "module": "Leads",
      "permissions": ["read", "update"],
      "description": "Access and update lead information"
    },
    {
      "name": "Access CRM Deals",
      "type": "crm",
      "module": "Deals",
      "permissions": ["read", "update"],
      "description": "Access and update deal/order information"
    },
    {
      "name": "Access CRM Contacts",
      "type": "crm",
      "module": "Contacts",
      "permissions": ["read", "update"],
      "description": "Access and update contact information"
    }
  ],
  "knowledgeSources": [
    {
      "type": "document",
      "name": "Product Knowledge Base",
      "source": "./zia-knowledge-base.json",
      "description": "Company information, products, and business rules"
    },
    {
      "type": "url",
      "name": "Success Chemistry Website",
      "source": "https://successchemistry.com",
      "description": "Live website data for product information"
    },
    {
      "type": "api",
      "name": "Product API",
      "source": "https://successchemistry.com/api/zia/products",
      "description": "Real-time product data and search"
    }
  ],
  "apiEndpoints": {
    "productSearch": "https://successchemistry.com/api/zia/products/search?q={query}",
    "productDetails": "https://successchemistry.com/api/zia/products/{sku}",
    "allProducts": "https://successchemistry.com/api/zia/products"
  },
  "toolUsage": {
    "Search Products": "Use this tool to search for products by name, ingredient, or category",
    "Get Product Details": "Use this tool to get detailed information about a specific product by SKU",
    "Access CRM Leads": "Use this tool to search, read, or update lead information in Zoho CRM",
    "Access CRM Deals": "Use this tool to search, read, or update deal/order information in Zoho CRM",
    "Access CRM Contacts": "Use this tool to search, read, or update contact information in Zoho CRM"
  },
  "guidelines": [...],
  "guardrails": [...],
  "companyInfo": {...}
}
```

## Troubleshooting

### Token Expired

If you get a 401 error, the script will automatically try to refresh the token. Make sure `ZOHO_REFRESH_TOKEN` is set in your `.env` file.

### Missing Scope

If you get a permission error, ensure your OAuth token includes the `ZiaAgents.agents.TRIGGER` scope. Re-run the OAuth helper with the updated scope.

### Agent Not Responding

1. Verify your `ZIAAGENTS_ORG_ID` and `ZIAAGENTS_AGENT_ID` are correct
2. Check that the agent is active in Zoho ZiaAgents
3. Ensure your OAuth token has the correct permissions

## Example Usage

### Training Example

```bash
$ node train-zoho-zia-agent.js train

🎓 Training Zoho ZiaAgents Agent...

📚 Knowledge Base:
   - Company: Success Chemistry
   - Products: 45 products loaded
   - Categories: 10 categories

📝 Training Prompts:
   - Product Inquiries: 4 prompts
   - Order Inquiries: 4 prompts
   - Customer Service: 4 prompts
   - Lead Management: 4 prompts

🚀 Sending training data to agent...
📤 Querying agent...
   Message: Initialize with the following knowledge base...

✅ Training complete!
```

### Query Example

```bash
$ node train-zoho-zia-agent.js query "Tell me about your prostate health products"

📤 Querying agent...
   Message: Tell me about your prostate health products

📥 Agent Response:
{
  "response": "...",
  "confidence": 0.95,
  ...
}
```

## Integration with Your Application

You can integrate the agent query function into your application:

```javascript
import { queryAgent } from './train-zoho-zia-agent.js';

// In your API route or function
const response = await queryAgent('What products do you have?');
console.log(response);
```

## Next Steps

1. **Train the Agent**: Run `node train-zoho-zia-agent.js train`
2. **Test Queries**: Try different types of questions
3. **Monitor Responses**: Check that the agent uses your knowledge base correctly
4. **Iterate**: Update knowledge base and re-train as needed

## Files

- `train-zoho-zia-agent.js` - Main training and query script
- `zia-knowledge-base.json` - Product and company knowledge
- `zia-training-prompts.json` - Training prompts and guidelines
- `.env` - Configuration (ZIAAGENTS_ORG_ID, ZIAAGENTS_AGENT_ID, OAuth tokens)

## Support

For issues with:
- **ZiaAgents API**: Check [Zoho ZiaAgents Documentation](https://www.zoho.com/zia/agents/)
- **OAuth**: See `zoho-oauth-helper.js` and Zoho API Console
- **Training Data**: Review `zia-knowledge-base.json` and `zia-training-prompts.json`
