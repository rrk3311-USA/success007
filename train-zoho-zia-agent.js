/**
 * Train and Query Zoho ZiaAgents Custom Agent
 * 
 * This script trains your custom Zoho ZiaAgents agent with knowledge base
 * and training prompts, then provides a way to query the agent.
 * 
 * Usage:
 *   node train-zoho-zia-agent.js train          # Train the agent
 *   node train-zoho-zia-agent.js query "message"  # Query the agent
 *   node train-zoho-zia-agent.js interactive   # Interactive mode
 */

import dotenv from 'dotenv';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import readline from 'readline';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ZiaAgents API Configuration
const ZIAAGENTS_ORG_ID = process.env.ZIAAGENTS_ORG_ID || '912788863';
const ZIAAGENTS_AGENT_ID = process.env.ZIAAGENTS_AGENT_ID || '3497000000002049';
const ZIAAGENTS_SESSION_ID = process.env.ZIAAGENTS_SESSION_ID || '';  // Optional: from Zia Agent Studio if required
const ZIAAGENTS_API_URL = 'https://ziaagents.zoho.com/ziaagents/api/v1/agents/query';
const ZOHO_ACCESS_TOKEN = process.env.ZOHO_CRM_ACCESS_TOKEN || '';
const ZOHO_REFRESH_TOKEN = process.env.ZOHO_REFRESH_TOKEN || '';
const ZOHO_CLIENT_ID = process.env.ZOHO_CLIENT_ID || '';
const ZOHO_CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET || '';

// Session management
let agentSessionId = null;

/**
 * Refresh Zoho access token if needed
 */
async function refreshAccessToken() {
    if (!ZOHO_REFRESH_TOKEN || !ZOHO_CLIENT_ID || !ZOHO_CLIENT_SECRET) {
        throw new Error('Missing OAuth credentials. Please configure ZOHO_REFRESH_TOKEN, ZOHO_CLIENT_ID, and ZOHO_CLIENT_SECRET in .env');
    }

    try {
        const response = await fetch('https://accounts.zoho.com/oauth/v2/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                client_id: ZOHO_CLIENT_ID,
                client_secret: ZOHO_CLIENT_SECRET,
                refresh_token: ZOHO_REFRESH_TOKEN
            })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Token refresh failed: ${response.status} ${error}`);
        }

        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error('Error refreshing token:', error);
        throw error;
    }
}

/**
 * Get or refresh access token
 */
async function getAccessToken() {
    let token = ZOHO_ACCESS_TOKEN;
    
    // Try to refresh if token is missing or might be expired
    if (!token || token.length < 50) {
        console.log('🔄 Refreshing access token...');
        token = await refreshAccessToken();
    }
    
    return token;
}

/**
 * Generate session ID for ZiaAgents API.
 * Try numeric format (like agent ID) - Zia Agent Studio may expect this.
 * If INVALID_SESSION_ID persists, set ZIAAGENTS_SESSION_ID in .env from Zia Agent Studio.
 */
function generateSessionId() {
    // Try numeric format similar to ZIAAGENTS_AGENT_ID (3497000000002049)
    const numericId = `${Date.now()}${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    return numericId;
}

/**
 * Initialize agent session
 * If ZIAAGENTS_SESSION_ID is set in .env, use that (from Zia Agent Studio).
 * Otherwise generate a UUID. Some ZiaAgents setups may require a session from their UI.
 */
async function initializeSession() {
    if (agentSessionId) {
        return agentSessionId;
    }

    if (ZIAAGENTS_SESSION_ID) {
        agentSessionId = ZIAAGENTS_SESSION_ID;
        console.log(`📝 Using session ID from env: ${agentSessionId.substring(0, 20)}...`);
    } else {
        agentSessionId = generateSessionId();
        console.log(`📝 Agent session initialized: ${agentSessionId}`);
    }
    return agentSessionId;
}

/**
 * Load knowledge base from file
 */
function loadKnowledgeBase() {
    try {
        const kbPath = join(__dirname, 'zia-knowledge-base.json');
        if (fs.existsSync(kbPath)) {
            const stats = fs.statSync(kbPath);
            const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
            console.log(`📦 Loading knowledge base (${fileSizeInMB} MB)...`);
            
            const content = fs.readFileSync(kbPath, 'utf8');
            const knowledgeBase = JSON.parse(content);
            
            // Verify structure
            if (knowledgeBase.company) {
                console.log(`   ✅ Company info loaded: ${knowledgeBase.company.name}`);
            }
            if (Array.isArray(knowledgeBase.products)) {
                console.log(`   ✅ Products loaded: ${knowledgeBase.products.length} products`);
            } else if (knowledgeBase.products) {
                console.log(`   ✅ Products structure loaded`);
            }
            if (knowledgeBase.businessRules) {
                console.log(`   ✅ Business rules loaded: ${knowledgeBase.businessRules.length} rules`);
            }
            if (knowledgeBase.commonQuestions) {
                console.log(`   ✅ Common questions loaded: ${knowledgeBase.commonQuestions.length} Q&As`);
            }
            
            return knowledgeBase;
        }
        console.warn('⚠️  Knowledge base file not found, using default');
        return {
            company: {
                name: "Success Chemistry",
                description: "Premium dietary supplements made in USA"
            }
        };
    } catch (error) {
        console.error('Error loading knowledge base:', error);
        return null;
    }
}

/**
 * Load training prompts from file
 */
function loadTrainingPrompts() {
    try {
        const promptsPath = join(__dirname, 'zia-training-prompts.json');
        if (fs.existsSync(promptsPath)) {
            const content = fs.readFileSync(promptsPath, 'utf8');
            return JSON.parse(content);
        }
        console.warn('⚠️  Training prompts file not found, using default');
        return {
            productInquiries: ["Provide accurate product information"],
            customerService: ["Be helpful and professional"]
        };
    } catch (error) {
        console.error('Error loading training prompts:', error);
        return null;
    }
}

/**
 * Load tools configuration from file
 */
function loadTools() {
    try {
        const toolsPath = join(__dirname, 'zia-agent-studio-config.json');
        if (fs.existsSync(toolsPath)) {
            const content = fs.readFileSync(toolsPath, 'utf8');
            const config = JSON.parse(content);
            return config.tools || [];
        }
        console.warn('⚠️  Tools config file not found, using default');
        return [];
    } catch (error) {
        console.error('Error loading tools:', error);
        return [];
    }
}

/**
 * Load knowledge sources from config
 */
function loadKnowledgeSources() {
    try {
        const configPath = join(__dirname, 'zia-agent-studio-config.json');
        if (fs.existsSync(configPath)) {
            const content = fs.readFileSync(configPath, 'utf8');
            const config = JSON.parse(content);
            return config.knowledgeSources || [];
        }
        return [];
    } catch (error) {
        console.error('Error loading knowledge sources:', error);
        return [];
    }
}

/**
 * Create a summary of the knowledge base (to avoid exceeding API limits)
 */
function createKnowledgeBaseSummary(knowledgeBase) {
    const summary = {
        company: knowledgeBase.company || {},
        productCount: Array.isArray(knowledgeBase.products) ? knowledgeBase.products.length : 0,
        productCategories: knowledgeBase.products?.categories || [],
        sampleProducts: Array.isArray(knowledgeBase.products) 
            ? knowledgeBase.products.slice(0, 5).map(p => ({
                sku: p.sku,
                name: p.name,
                category: p.category,
                price: p.price
            }))
            : [],
        businessRules: knowledgeBase.businessRules || [],
        commonQuestions: knowledgeBase.commonQuestions || [],
        note: "Full knowledge base with all 56 products is available in the knowledge sources. Use the Product API tools to access real-time product data."
    };
    return summary;
}

/**
 * Build system arguments for training
 */
function buildSystemArgs(knowledgeBase, trainingPrompts, tools = null, knowledgeSources = null) {
    // Load tools and knowledge sources if not provided
    if (!tools) {
        tools = loadTools();
    }
    if (!knowledgeSources) {
        knowledgeSources = loadKnowledgeSources();
    }

    // Create a compact summary instead of full knowledge base
    const knowledgeBaseSummary = createKnowledgeBaseSummary(knowledgeBase);

    const systemArgs = {
        knowledgeBase: knowledgeBaseSummary,
        trainingPrompts: trainingPrompts,
        tools: tools,
        knowledgeSources: knowledgeSources,
        guidelines: [
            "Always be professional and helpful",
            "Provide accurate information from knowledge sources",
            "For product questions, use the Search Products tool or Get Product Details tool when available",
            "For CRM data, use the appropriate CRM access tool (Access CRM Leads, Access CRM Deals, Access CRM Contacts)",
            "When searching for products, use the Product API endpoints: /api/zia/products/search and /api/zia/products/:sku",
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
        ],
        companyInfo: {
            name: "Success Chemistry",
            tagline: "Nature's nutrients, scientifically formulated — for results you can feel.",
            certifications: ["GMP-certified", "FDA-compliant", "3rd party tested", "Non-GMO", "Made in USA"],
            contact: {
                email: "info@successchemistry.com",
                website: "https://successchemistry.com"
            }
        },
        apiEndpoints: {
            productSearch: "https://successchemistry.com/api/zia/products/search?q={query}",
            productDetails: "https://successchemistry.com/api/zia/products/{sku}",
            allProducts: "https://successchemistry.com/api/zia/products"
        },
        toolUsage: {
            "Search Products": "Use this tool to search for products by name, ingredient, or category. Example: Search for 'L-Arginine' or 'Women's Health'",
            "Get Product Details": "Use this tool to get detailed information about a specific product by SKU. Example: Get details for SKU '52274-401'",
            "Access CRM Leads": "Use this tool to search, read, or update lead information in Zoho CRM",
            "Access CRM Deals": "Use this tool to search, read, or update deal/order information in Zoho CRM",
            "Access CRM Contacts": "Use this tool to search, read, or update contact information in Zoho CRM"
        }
    };

    return JSON.stringify(systemArgs);
}

/**
 * Query the ZiaAgents API
 */
async function queryAgent(message, systemArgs = null) {
    try {
        const accessToken = await getAccessToken();
        const sessionId = await initializeSession();

        // Load knowledge base and prompts if systemArgs not provided
        if (!systemArgs) {
            const knowledgeBase = loadKnowledgeBase();
            const trainingPrompts = loadTrainingPrompts();
            const tools = loadTools();
            const knowledgeSources = loadKnowledgeSources();
            systemArgs = buildSystemArgs(knowledgeBase, trainingPrompts, tools, knowledgeSources);
        }

        const headers = {
            'X-ZIAAGENTS-ORG': ZIAAGENTS_ORG_ID,
            'X-ZIAAGENTS-AGENT-ID': ZIAAGENTS_AGENT_ID,
            'X-ZIAAGENTS-AGENT-SESSION-ID': sessionId || '',
            'Authorization': `Zoho-oauthtoken ${accessToken}`,
            'Content-Type': 'application/json'
        };

        // API spec: { 'query': '<message>', 'systemArgs': '<system-args>' }
        // systemArgs should be a JSON string
        const body = {
            query: message,
            systemArgs: systemArgs  // Already a JSON string from buildSystemArgs
        };

        console.log(`\n📤 Querying agent...`);
        console.log(`   Endpoint: ${ZIAAGENTS_API_URL}`);
        console.log(`   Message: ${message.substring(0, 100)}${message.length > 100 ? '...' : ''}`);
        console.log(`   SystemArgs length: ${systemArgs.length} characters`);

        const response = await fetch(ZIAAGENTS_API_URL, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ API Error: ${response.status} ${response.statusText}`);
            console.error(`   Response: ${errorText}`);
            
            // Try to refresh token if 401
            if (response.status === 401) {
                console.log('🔄 Attempting to refresh token and retry...');
                const newToken = await refreshAccessToken();
                headers['Authorization'] = `Zoho-oauthtoken ${newToken}`;
                
                const retryResponse = await fetch(ZIAAGENTS_API_URL, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(body)
                });
                
                if (!retryResponse.ok) {
                    const retryError = await retryResponse.text();
                    throw new Error(`Retry failed: ${retryResponse.status} ${retryError}`);
                }
                
                const retryData = await retryResponse.json();
                if (retryData?.data?.sessionId) {
                    agentSessionId = retryData.data.sessionId;
                }
                return retryData;
            }
            
            throw new Error(`API request failed: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        // Use session ID from API response for subsequent requests (maintains conversation context)
        if (data?.data?.sessionId) {
            agentSessionId = data.data.sessionId;
        }
        return data;

    } catch (error) {
        console.error('❌ Error querying agent:', error);
        throw error;
    }
}

/**
 * Train the agent with knowledge base and prompts
 */
async function trainAgent() {
    console.log('🎓 Training Zoho ZiaAgents Agent...\n');

    try {
        const knowledgeBase = loadKnowledgeBase();
        const trainingPrompts = loadTrainingPrompts();

        if (!knowledgeBase || !trainingPrompts) {
            console.error('❌ Failed to load knowledge base or training prompts');
            return;
        }

        console.log('📚 Knowledge Base:');
        console.log(`   - Company: ${knowledgeBase.company?.name || 'N/A'}`);
        if (Array.isArray(knowledgeBase.products)) {
            console.log(`   - Products: ${knowledgeBase.products.length} products loaded`);
        } else {
            console.log(`   - Products: Knowledge base structure loaded`);
        }
        if (knowledgeBase.products?.categories) {
            console.log(`   - Categories: ${knowledgeBase.products.categories.length} categories`);
        }

        console.log('\n📝 Training Prompts:');
        console.log(`   - Product Inquiries: ${trainingPrompts.productInquiries?.length || 0} prompts`);
        console.log(`   - Order Inquiries: ${trainingPrompts.orderInquiries?.length || 0} prompts`);
        console.log(`   - Customer Service: ${trainingPrompts.customerService?.length || 0} prompts`);
        console.log(`   - Lead Management: ${trainingPrompts.leadManagement?.length || 0} prompts`);

        const tools = loadTools();
        const knowledgeSources = loadKnowledgeSources();

        console.log('\n🔧 Tools Available:');
        if (tools && tools.length > 0) {
            tools.forEach((tool, index) => {
                console.log(`   ${index + 1}. ${tool.name} (${tool.type})`);
                if (tool.endpoint) console.log(`      Endpoint: ${tool.endpoint}`);
                if (tool.module) console.log(`      Module: ${tool.module}`);
            });
        } else {
            console.log('   No tools configured');
        }

        console.log('\n📖 Knowledge Sources:');
        if (knowledgeSources && knowledgeSources.length > 0) {
            knowledgeSources.forEach((source, index) => {
                console.log(`   ${index + 1}. ${source.name} (${source.type})`);
                if (source.source) console.log(`      Source: ${source.source}`);
            });
        } else {
            console.log('   No knowledge sources configured');
        }

        // Build system args with training data (including tools and knowledge sources)
        const systemArgs = buildSystemArgs(knowledgeBase, trainingPrompts, tools, knowledgeSources);
        
        // Create summary for training message
        const knowledgeBaseSummary = createKnowledgeBaseSummary(knowledgeBase);

        // Send training query to agent
        console.log('\n🚀 Sending training data to agent...');
        const trainingMessage = `You are the Success Chemistry AI assistant. You have been trained with:

- Knowledge base: ${knowledgeBaseSummary.productCount} products, company info, business rules, and common Q&As
- Tools: ${tools.length} tools available (Product APIs and CRM access)
- Knowledge sources: ${knowledgeSources.length} sources (document, website, API)

Use the tools to access real-time product data. Follow the training prompts for product inquiries, orders, customer service, and lead management. Always be professional, accurate, and comply with FDA regulations.`;
        
        const response = await queryAgent(trainingMessage, systemArgs);

        console.log('\n✅ Training complete!');
        console.log('📊 Response:', JSON.stringify(response, null, 2).substring(0, 500));

        // Test the agent with a sample query
        console.log('\n🧪 Testing agent with sample query...');
        const testResponse = await queryAgent('What products does Success Chemistry offer?');
        console.log('📤 Test Response:', JSON.stringify(testResponse, null, 2).substring(0, 500));

    } catch (error) {
        console.error('❌ Training failed:', error);
        process.exit(1);
    }
}

/**
 * Query the agent with a message
 */
async function queryAgentWithMessage(message) {
    try {
        const response = await queryAgent(message);
        console.log('\n📥 Agent Response:');
        console.log(JSON.stringify(response, null, 2));
        return response;
    } catch (error) {
        console.error('❌ Query failed:', error);
        process.exit(1);
    }
}

/**
 * Interactive mode
 */
async function interactiveMode() {
    console.log('💬 Interactive ZiaAgents Query Mode');
    console.log('   Type your questions (or "exit" to quit)\n');

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const askQuestion = () => {
        rl.question('You: ', async (message) => {
            if (message.toLowerCase() === 'exit' || message.toLowerCase() === 'quit') {
                console.log('👋 Goodbye!');
                rl.close();
                process.exit(0);
            }

            try {
                const response = await queryAgent(message);
                console.log('\n🤖 Agent:', JSON.stringify(response, null, 2));
                console.log('');
                askQuestion();
            } catch (error) {
                console.error('❌ Error:', error.message);
                askQuestion();
            }
        });
    };

    askQuestion();
}

/**
 * Main function
 */
async function main() {
    const args = process.argv.slice(2);
    const command = args[0];

    if (!ZOHO_ACCESS_TOKEN && !ZOHO_REFRESH_TOKEN) {
        console.error('❌ Missing Zoho OAuth credentials');
        console.error('   Please set ZOHO_CRM_ACCESS_TOKEN or ZOHO_REFRESH_TOKEN in .env');
        console.error('   Or run: node zoho-oauth-helper.js');
        process.exit(1);
    }

    if (!ZIAAGENTS_ORG_ID || !ZIAAGENTS_AGENT_ID) {
        console.error('❌ Missing ZiaAgents configuration');
        console.error('   Please set ZIAAGENTS_ORG_ID and ZIAAGENTS_AGENT_ID in .env');
        process.exit(1);
    }

    switch (command) {
        case 'train':
            await trainAgent();
            break;
        case 'query':
            const message = args[1];
            if (!message) {
                console.error('❌ Please provide a message: node train-zoho-zia-agent.js query "your message"');
                process.exit(1);
            }
            await queryAgentWithMessage(message);
            break;
        case 'interactive':
        case 'i':
            await interactiveMode();
            break;
        default:
            console.log('Usage:');
            console.log('  node train-zoho-zia-agent.js train                    # Train the agent');
            console.log('  node train-zoho-zia-agent.js query "your message"     # Query the agent');
            console.log('  node train-zoho-zia-agent.js interactive              # Interactive mode');
            process.exit(1);
    }
}

// Run main function
main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
