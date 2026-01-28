
# Zia AI Assistant Setup Instructions

## Files Created:
1. **zia-knowledge-base.json** - Product and company knowledge
2. **zia-training-prompts.json** - Training prompts for Zia
3. **zia-agent-studio-config.json** - Complete Agent Studio configuration

## Next Steps:

### Option 1: Zia Agent Studio (Recommended)
1. Go to: https://www.zoho.com/zia/agents/agent-studio.html
2. Click "Create Agent"
3. Use the configuration from **zia-agent-studio-config.json**:
   - Agent Name: Success Chemistry CRM Assistant
   - LLM: Zoho LLM (or OpenAI GPT-4 mini)
   - Knowledge Sources: Upload zia-knowledge-base.json
   - Tools: Configure API endpoints and CRM access
   - Guidelines: Copy from config file
   - Guardrails: Copy from config file

### Option 2: Manual Zia Training in CRM
1. Go to Zoho CRM → Settings → Zia → Training
2. Upload knowledge base document
3. Configure data access permissions
4. Test with sample questions

### Option 3: Zia Skills (SalesIQ Chat)
1. Go to Zoho SalesIQ → Zia Skills
2. Create new skill
3. Use invokeUrl to connect to:
   - https://successchemistry.com/api/zia/products/search
   - https://successchemistry.com/api/zia/products/:sku

## Testing:
- Ask Zia: "What products do you have?"
- Ask Zia: "Tell me about Success Chemistry"
- Ask Zia: "Search for L-Arginine products"
- Ask Zia: "Show me recent leads"

## API Endpoints Available:
- GET /api/zia/products/search?q=QUERY
- GET /api/zia/products/:sku
- GET /api/zia/products

## CRM Access:
Zia can now access:
- Leads (read/update)
- Deals (read/update)
- Contacts (read/update)
- Accounts (read/update)
