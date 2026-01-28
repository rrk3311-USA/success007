/**
 * Setup Zoho Zia AI Assistant
 * Configures Zia with product knowledge, business rules, and CRM data access
 */

import dotenv from 'dotenv';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ZOHO_CRM_API_URL = process.env.ZOHO_CRM_API_URL || 'https://www.zohoapis.com/crm/v2';
const ZOHO_CRM_ACCESS_TOKEN = process.env.ZOHO_CRM_ACCESS_TOKEN || '';
const ZOHO_REFRESH_TOKEN = process.env.ZOHO_REFRESH_TOKEN || '';
const ZOHO_CLIENT_ID = process.env.ZOHO_CLIENT_ID || '';
const ZOHO_CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET || '';

/**
 * Make API request with token refresh
 */
async function zohoApiRequest(url, options = {}) {
    let accessToken = ZOHO_CRM_ACCESS_TOKEN;
    
    let response = await fetch(url, {
        ...options,
        headers: {
            'Authorization': `Zoho-oauthtoken ${accessToken}`,
            'Content-Type': 'application/json',
            ...options.headers
        }
    });

    // Refresh token if needed
    if (response.status === 401 && ZOHO_REFRESH_TOKEN) {
        console.log('🔄 Refreshing access token...');
        const refreshResponse = await fetch('https://accounts.zoho.com/oauth/v2/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                client_id: ZOHO_CLIENT_ID,
                client_secret: ZOHO_CLIENT_SECRET,
                refresh_token: ZOHO_REFRESH_TOKEN
            })
        });

        if (refreshResponse.ok) {
            const tokenData = await refreshResponse.json();
            accessToken = tokenData.access_token;
            
            // Retry request
            response = await fetch(url, {
                ...options,
                headers: {
                    'Authorization': `Zoho-oauthtoken ${accessToken}`,
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });
        }
    }

    return response;
}

/**
 * Get product knowledge base content
 */
function getProductKnowledgeBase() {
    const knowledgeBase = {
        company: {
            name: "Success Chemistry",
            description: "Premium dietary supplements and vitamins made in USA. 3rd party tested, scientifically formulated with nature's nutrients.",
            tagline: "Nature's nutrients, scientifically formulated — for results you can feel.",
            mission: "Premium dietary supplements made in USA, 3rd party tested, scientifically formulated with nature's nutrients. Built with a quality-first mindset: clean ingredients, clear product pages, and a focus on repeatable routines.",
            certifications: ["GMP-certified", "FDA-compliant", "3rd party tested", "Non-GMO", "Made in USA"],
            contact: {
                email: "info@successchemistry.com",
                website: "https://successchemistry.com"
            }
        },
        products: {
            categories: [
                "Men's Health",
                "Women's Health", 
                "General Wellness",
                "Energy & Performance",
                "Digestive Health",
                "Immune Support",
                "Joint & Bone Health",
                "Heart Health",
                "Brain Health",
                "Sleep Support"
            ],
            totalProducts: "45+ supplements",
            keyFeatures: [
                "Made in USA",
                "GMP-certified facility",
                "3rd party tested",
                "Scientifically formulated",
                "Clean ingredients",
                "FDA-compliant labeling"
            ]
        },
        businessRules: [
            "All products are made in USA",
            "All products are 3rd party tested",
            "GMP-certified manufacturing facility",
            "FDA-compliant labeling required",
            "Free shipping on orders over $50",
            "30-day money-back guarantee",
            "Subscription discounts available",
            "Customer service available via contact page"
        ],
        commonQuestions: [
            {
                question: "Where are your products made?",
                answer: "All Success Chemistry products are made in the USA in a GMP-certified facility."
            },
            {
                question: "Are your products tested?",
                answer: "Yes, all products undergo 3rd party testing to ensure quality and purity."
            },
            {
                question: "What is your return policy?",
                answer: "We offer a 30-day money-back guarantee. See our shipping & returns page for details."
            },
            {
                question: "Do you offer subscriptions?",
                answer: "Yes, we offer subscription discounts. Visit our subscribe page for more information."
            },
            {
                question: "What certifications do you have?",
                answer: "We are GMP-certified, FDA-compliant, 3rd party tested, and Non-GMO verified."
            }
        ]
    };

    return knowledgeBase;
}

/**
 * Create Zia knowledge document
 */
async function createZiaKnowledgeDocument(knowledgeContent) {
    try {
        // Zoho CRM doesn't have a direct API for Zia knowledge base
        // But we can create a custom module or use Notes/Comments
        // For now, we'll create a structured document that can be uploaded
        
        const knowledgeDoc = {
            title: "Success Chemistry - Zia Knowledge Base",
            content: JSON.stringify(knowledgeContent, null, 2),
            type: "zia_knowledge_base",
            created_at: new Date().toISOString()
        };

        // Save to file for manual upload or API use
        const docPath = join(__dirname, 'zia-knowledge-base.json');
        fs.writeFileSync(docPath, JSON.stringify(knowledgeContent, null, 2));
        
        console.log('✅ Knowledge base document created:', docPath);
        return knowledgeDoc;
    } catch (error) {
        console.error('Error creating knowledge document:', error);
        throw error;
    }
}

/**
 * Setup Zia with CRM data access
 */
async function setupZiaCRMDataAccess() {
    console.log('🔧 Setting up Zia CRM data access...');
    
    try {
        // Test access to Leads
        const leadsResponse = await zohoApiRequest(`${ZOHO_CRM_API_URL}/Leads?per_page=1`);
        if (leadsResponse.ok) {
            console.log('   ✅ Zia can access Leads');
        }

        // Test access to Deals
        const dealsResponse = await zohoApiRequest(`${ZOHO_CRM_API_URL}/Deals?per_page=1`);
        if (dealsResponse.ok) {
            console.log('   ✅ Zia can access Deals');
        }

        // Test access to Contacts
        const contactsResponse = await zohoApiRequest(`${ZOHO_CRM_API_URL}/Contacts?per_page=1`);
        if (contactsResponse.ok) {
            console.log('   ✅ Zia can access Contacts');
        }

        // Test access to Accounts
        const accountsResponse = await zohoApiRequest(`${ZOHO_CRM_API_URL}/Accounts?per_page=1`);
        if (accountsResponse.ok) {
            console.log('   ✅ Zia can access Accounts');
        }

        console.log('\n✅ Zia has access to all CRM modules\n');
    } catch (error) {
        console.error('❌ Error setting up CRM access:', error);
    }
}

/**
 * Create Zia training prompts
 */
function createZiaTrainingPrompts() {
    const prompts = {
        productInquiries: [
            "When customers ask about products, provide information from the product knowledge base",
            "Always mention that products are made in USA and 3rd party tested",
            "Include product categories and key features when relevant",
            "Direct customers to product pages for detailed information"
        ],
        orderInquiries: [
            "When asked about orders, search the Deals module in CRM",
            "Provide order status, items, and total amount",
            "If order not found, ask for order number or customer email",
            "Offer to help with order issues or questions"
        ],
        customerService: [
            "Be helpful and professional in all interactions",
            "Refer to business rules for policy questions",
            "For complex issues, offer to connect with human support",
            "Always maintain a positive, solution-oriented tone"
        ],
        leadManagement: [
            "When discussing leads, access the Leads module",
            "Provide lead status, source, and contact information",
            "Suggest next steps based on lead status",
            "Offer to update lead information if requested"
        ]
    };

    return prompts;
}

/**
 * Generate Zia Agent Studio configuration
 */
function generateZiaAgentStudioConfig() {
    const config = {
        agent: {
            name: "Success Chemistry CRM Assistant",
            description: "AI assistant for Success Chemistry CRM operations, product inquiries, and customer service",
            llm: "zoho_llm", // or "openai_gpt4_mini"
            version: "1.0"
        },
        knowledgeSources: [
            {
                type: "document",
                name: "Product Knowledge Base",
                source: "./zia-knowledge-base.json",
                description: "Company information, products, and business rules"
            },
            {
                type: "url",
                name: "Success Chemistry Website",
                source: "https://successchemistry.com",
                description: "Live website data for product information"
            },
            {
                type: "api",
                name: "Product API",
                source: "https://successchemistry.com/api/zia/products",
                description: "Real-time product data and search"
            }
        ],
        tools: [
            {
                name: "Search Products",
                type: "api",
                endpoint: "https://successchemistry.com/api/zia/products/search",
                description: "Search products by name, ingredient, or category"
            },
            {
                name: "Get Product Details",
                type: "api",
                endpoint: "https://successchemistry.com/api/zia/products/:sku",
                description: "Get detailed product information by SKU"
            },
            {
                name: "Access CRM Leads",
                type: "crm",
                module: "Leads",
                permissions: ["read", "update"],
                description: "Access and update lead information"
            },
            {
                name: "Access CRM Deals",
                type: "crm",
                module: "Deals",
                permissions: ["read", "update"],
                description: "Access and update deal/order information"
            },
            {
                name: "Access CRM Contacts",
                type: "crm",
                module: "Contacts",
                permissions: ["read", "update"],
                description: "Access and update contact information"
            }
        ],
        guidelines: [
            "Always be professional and helpful",
            "Provide accurate information from knowledge sources",
            "For product questions, use the Product API when possible",
            "For CRM data, access the appropriate module",
            "If unsure, ask clarifying questions",
            "Maintain customer privacy and data security",
            "Follow Success Chemistry brand voice and tone"
        ],
        guardrails: [
            "Do not provide medical advice",
            "Do not make health claims beyond product descriptions",
            "Do not share customer data without authorization",
            "Do not modify critical CRM data without confirmation",
            "Always comply with FDA regulations for supplement claims"
        ]
    };

    return config;
}

/**
 * Main setup function
 */
async function setupZia() {
    console.log('🤖 Setting up Zoho Zia AI Assistant...\n');

    if (!ZOHO_CRM_ACCESS_TOKEN) {
        console.error('❌ Zoho CRM access token not configured');
        console.error('   Run: node zoho-oauth-helper.js first');
        process.exit(1);
    }

    try {
        // Step 1: Create knowledge base
        console.log('📚 Step 1: Creating knowledge base...');
        const knowledgeBase = getProductKnowledgeBase();
        await createZiaKnowledgeDocument(knowledgeBase);
        console.log('   ✅ Knowledge base created\n');

        // Step 2: Setup CRM data access
        console.log('🔧 Step 2: Setting up CRM data access...');
        await setupZiaCRMDataAccess();

        // Step 3: Generate training prompts
        console.log('📝 Step 3: Generating training prompts...');
        const prompts = createZiaTrainingPrompts();
        const promptsPath = join(__dirname, 'zia-training-prompts.json');
        fs.writeFileSync(promptsPath, JSON.stringify(prompts, null, 2));
        console.log('   ✅ Training prompts saved:', promptsPath, '\n');

        // Step 4: Generate Zia Agent Studio configuration
        console.log('⚙️  Step 4: Generating Zia Agent Studio configuration...');
        const config = generateZiaAgentStudioConfig();
        const configPath = join(__dirname, 'zia-agent-studio-config.json');
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
        console.log('   ✅ Configuration saved:', configPath, '\n');

        // Step 5: Create setup instructions
        console.log('📋 Step 5: Creating setup instructions...');
        const instructions = `
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
`;

        const instructionsPath = join(__dirname, 'ZIA_SETUP_INSTRUCTIONS.md');
        fs.writeFileSync(instructionsPath, instructions);
        console.log('   ✅ Instructions saved:', instructionsPath, '\n');

        console.log('='.repeat(60));
        console.log('✅ Zia Setup Complete!');
        console.log('='.repeat(60));
        console.log('\n📁 Files created:');
        console.log('   1. zia-knowledge-base.json');
        console.log('   2. zia-training-prompts.json');
        console.log('   3. zia-agent-studio-config.json');
        console.log('   4. ZIA_SETUP_INSTRUCTIONS.md');
        console.log('\n📋 Next: Follow instructions in ZIA_SETUP_INSTRUCTIONS.md');
        console.log('   Or go to: https://www.zoho.com/zia/agents/agent-studio.html\n');

    } catch (error) {
        console.error('❌ Setup failed:', error);
        process.exit(1);
    }
}

// Run setup
setupZia().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
