/**
 * ZiaAgents Chat Proxy - Server-side only
 * Proxies chat messages to Zoho ZiaAgents API (OAuth token stays on server).
 * Used by local-server.js POST /api/zia/chat and by the site widget.
 */

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ZIAAGENTS_ORG_ID = process.env.ZIAAGENTS_ORG_ID || '912788863';
const ZIAAGENTS_AGENT_ID = process.env.ZIAAGENTS_AGENT_ID || '3497000000002049';
const ZIAAGENTS_API_URL = 'https://ziaagents.zoho.com/ziaagents/api/v1/agents/query';
const ZOHO_ACCESS_TOKEN = process.env.ZOHO_CRM_ACCESS_TOKEN || '';
const ZOHO_REFRESH_TOKEN = process.env.ZOHO_REFRESH_TOKEN || '';
const ZOHO_CLIENT_ID = process.env.ZOHO_CLIENT_ID || '';
const ZOHO_CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET || '';

let cachedSystemArgs = null;
let currentSessionId = null;

function generateSessionId() {
    return `${Date.now()}${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
}

async function refreshAccessToken() {
    if (!ZOHO_REFRESH_TOKEN || !ZOHO_CLIENT_ID || !ZOHO_CLIENT_SECRET) {
        throw new Error('Missing OAuth credentials for ZiaAgents');
    }
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
    if (!response.ok) throw new Error(`Token refresh failed: ${response.status}`);
    const data = await response.json();
    return data.access_token;
}

async function getAccessToken() {
    let token = ZOHO_ACCESS_TOKEN;
    if (!token || token.length < 50) token = await refreshAccessToken();
    return token;
}

function loadJson(filePath, defaultVal = null) {
    try {
        const fullPath = path.join(__dirname, filePath);
        if (fs.existsSync(fullPath)) {
            return JSON.parse(fs.readFileSync(fullPath, 'utf8'));
        }
    } catch (e) {}
    return defaultVal;
}

function buildSystemArgs() {
    if (cachedSystemArgs) return cachedSystemArgs;
    const knowledgeBase = loadJson('zia-knowledge-base.json', { company: {}, products: [], businessRules: [], commonQuestions: [] });
    const trainingPrompts = loadJson('zia-training-prompts.json', { productInquiries: [], customerService: [] });
    const tools = loadJson('zia-agent-studio-config.json', {}).tools || [];
    const knowledgeSources = loadJson('zia-agent-studio-config.json', {}).knowledgeSources || [];

    const summary = {
        company: knowledgeBase.company || {},
        productCount: Array.isArray(knowledgeBase.products) ? knowledgeBase.products.length : 0,
        businessRules: knowledgeBase.businessRules || [],
        commonQuestions: knowledgeBase.commonQuestions || [],
        note: 'Use Product API tools for real-time product data.'
    };

    const systemArgs = {
        knowledgeBase: summary,
        trainingPrompts,
        tools,
        knowledgeSources,
        guidelines: ['Be professional and helpful.', 'Use Product API when relevant.', 'Follow Success Chemistry brand.'],
        guardrails: ['Do not give medical advice.', 'Comply with FDA regulations.'],
        companyInfo: { name: 'Success Chemistry', website: 'https://successchemistry.com' },
        apiEndpoints: {
            productSearch: 'https://successchemistry.com/api/zia/products/search?q={query}',
            productDetails: 'https://successchemistry.com/api/zia/products/{sku}'
        }
    };
    cachedSystemArgs = JSON.stringify(systemArgs);
    return cachedSystemArgs;
}

/**
 * Send a message to the trained ZiaAgents agent.
 * @param {string} message - User message
 * @param {string} [sessionId] - Optional session ID (reuse for conversation); if not provided, a new one is generated. Pass back the sessionId from the response for follow-up messages.
 * @returns {Promise<{ success: boolean, response?: string, sessionId?: string, error?: string }>}
 */
export async function chat(message, sessionId = null) {
    if (!message || typeof message !== 'string' || !message.trim()) {
        return { success: false, error: 'Message is required' };
    }

    try {
        const token = await getAccessToken();
        const sid = sessionId || currentSessionId || generateSessionId();
        const systemArgs = buildSystemArgs();

        const res = await fetch(ZIAAGENTS_API_URL, {
            method: 'POST',
            headers: {
                'X-ZIAAGENTS-ORG': ZIAAGENTS_ORG_ID,
                'X-ZIAAGENTS-AGENT-ID': ZIAAGENTS_AGENT_ID,
                'X-ZIAAGENTS-AGENT-SESSION-ID': sid,
                'Authorization': `Zoho-oauthtoken ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: message.trim(), systemArgs })
        });

        const data = await res.json();

        if (!res.ok) {
            if (res.status === 401) {
                const newToken = await refreshAccessToken();
                const retry = await fetch(ZIAAGENTS_API_URL, {
                    method: 'POST',
                    headers: {
                        'X-ZIAAGENTS-ORG': ZIAAGENTS_ORG_ID,
                        'X-ZIAAGENTS-AGENT-ID': ZIAAGENTS_AGENT_ID,
                        'X-ZIAAGENTS-AGENT-SESSION-ID': sid,
                        'Authorization': `Zoho-oauthtoken ${newToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ query: message.trim(), systemArgs })
                });
                const retryData = await retry.json();
                if (!retry.ok) {
                    return { success: false, error: retryData?.error?.reason || retry.statusText };
                }
                const outSessionId = retryData?.data?.sessionId || sid;
                currentSessionId = outSessionId;
                return { success: true, response: retryData?.data?.response || '', sessionId: outSessionId };
            }
            return { success: false, error: data?.error?.reason || res.statusText };
        }

        const outSessionId = data?.data?.sessionId || sid;
        currentSessionId = outSessionId;
        return {
            success: true,
            response: data?.data?.response || '',
            sessionId: outSessionId
        };
    } catch (err) {
        console.error('Zia chat proxy error:', err);
        return { success: false, error: err.message || 'Service unavailable' };
    }
}
