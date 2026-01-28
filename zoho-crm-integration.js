/**
 * Zoho CRM Integration for Success Chemistry
 * Syncs leads from SalesIQ to Zoho CRM
 */

// Load from .env if available
import dotenv from 'dotenv';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ZOHO_CRM_API_URL = process.env.ZOHO_CRM_API_URL || 'https://www.zohoapis.com/crm/v2';
let ZOHO_CRM_ACCESS_TOKEN = process.env.ZOHO_CRM_ACCESS_TOKEN || '';
const ZOHO_REFRESH_TOKEN = process.env.ZOHO_REFRESH_TOKEN || '';
const ZOHO_CLIENT_ID = process.env.ZOHO_CLIENT_ID || '';
const ZOHO_CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET || '';
const ZOHO_TOKEN_URL = 'https://accounts.zoho.com/oauth/v2/token';

/**
 * Refresh access token if expired
 */
async function refreshTokenIfNeeded() {
    if (!ZOHO_REFRESH_TOKEN || !ZOHO_CLIENT_ID || !ZOHO_CLIENT_SECRET) {
        return false;
    }

    try {
        const response = await fetch(ZOHO_TOKEN_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                client_id: ZOHO_CLIENT_ID,
                client_secret: ZOHO_CLIENT_SECRET,
                refresh_token: ZOHO_REFRESH_TOKEN
            })
        });

        if (response.ok) {
            const tokenData = await response.json();
            ZOHO_CRM_ACCESS_TOKEN = tokenData.access_token;
            
            // Update .env file
            const envPath = join(__dirname, '.env');
            let envContent = readFileSync(envPath, 'utf8');
            envContent = envContent.replace(
                /ZOHO_CRM_ACCESS_TOKEN=.*/,
                `ZOHO_CRM_ACCESS_TOKEN=${tokenData.access_token}`
            );
            writeFileSync(envPath, envContent);
            
            console.log('✅ Zoho access token refreshed');
            return true;
        }
    } catch (error) {
        console.error('Error refreshing Zoho token:', error);
    }
    
    return false;
}

/**
 * Make API request with automatic token refresh on 401
 */
async function zohoApiRequest(url, options = {}) {
    let response = await fetch(url, {
        ...options,
        headers: {
            'Authorization': `Zoho-oauthtoken ${ZOHO_CRM_ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
            ...options.headers
        }
    });

    // If unauthorized, try refreshing token
    if (response.status === 401 && ZOHO_REFRESH_TOKEN) {
        console.log('🔄 Access token expired, refreshing...');
        const refreshed = await refreshTokenIfNeeded();
        
        if (refreshed) {
            // Retry request with new token
            response = await fetch(url, {
                ...options,
                headers: {
                    'Authorization': `Zoho-oauthtoken ${ZOHO_CRM_ACCESS_TOKEN}`,
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });
        }
    }

    return response;
}

/**
 * Create a lead in Zoho CRM
 */
async function createZohoLead(leadData) {
    try {
        if (!ZOHO_CRM_ACCESS_TOKEN) {
            console.warn('⚠️ Zoho CRM access token not configured. Skipping Zoho sync.');
            return null;
        }

        const response = await zohoApiRequest(`${ZOHO_CRM_API_URL}/Leads`, {
            method: 'POST',
            body: JSON.stringify({
                data: [{
                    First_Name: leadData.firstName || leadData.name?.split(' ')[0] || 'Lead',
                    Last_Name: leadData.lastName || leadData.name?.split(' ').slice(1).join(' ') || '',
                    Email: leadData.email || '',
                    Phone: leadData.phone || '',
                    Company: leadData.company || 'Success Chemistry Customer',
                    Lead_Source: leadData.source || 'SalesIQ Chat',
                    Description: leadData.message || leadData.description || '',
                    Lead_Status: 'Not Contacted',
                    // Custom fields if needed
                    ...(leadData.customFields || {})
                }]
            })
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('Zoho CRM API error:', error);
            throw new Error(`Zoho CRM API error: ${response.status} ${error}`);
        }

        const data = await response.json();
        console.log('✅ Lead created in Zoho CRM:', data.data?.[0]?.id);
        return data.data?.[0];
    } catch (error) {
        console.error('Error creating Zoho lead:', error);
        throw error;
    }
}

/**
 * Find lead by email in Zoho CRM
 */
async function findZohoLeadByEmail(email) {
    try {
        if (!ZOHO_CRM_ACCESS_TOKEN) {
            return null;
        }

        const response = await zohoApiRequest(`${ZOHO_CRM_API_URL}/Leads/search?criteria=(Email:equals:${encodeURIComponent(email)})`);

        if (!response.ok) {
            return null;
        }

        const text = await response.text();
        if (!text) return null;
        
        try {
            const data = JSON.parse(text);
            return data.data?.[0] || null;
        } catch (e) {
            // Empty response or invalid JSON
            return null;
        }
    } catch (error) {
        console.error('Error finding Zoho lead:', error);
        return null;
    }
}

/**
 * Update lead in Zoho CRM
 */
async function updateZohoLead(leadId, updateData) {
    try {
        if (!ZOHO_CRM_ACCESS_TOKEN) {
            return null;
        }

        const response = await zohoApiRequest(`${ZOHO_CRM_API_URL}/Leads/${leadId}`, {
            method: 'PUT',
            body: JSON.stringify({
                data: [updateData]
            })
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('Zoho CRM update error:', error);
            throw new Error(`Zoho CRM update error: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Lead updated in Zoho CRM:', data.data?.[0]?.id);
        return data.data?.[0];
    } catch (error) {
        console.error('Error updating Zoho lead:', error);
        throw error;
    }
}

/**
 * Sync lead to Zoho CRM (create or update)
 */
async function syncLeadToZoho(leadData) {
    try {
        console.log('🔄 Syncing lead to Zoho CRM...', leadData);

        // Check if lead exists
        let lead = null;
        if (leadData.email) {
            lead = await findZohoLeadByEmail(leadData.email);
        }

        if (lead) {
            // Update existing lead
            lead = await updateZohoLead(lead.id, {
                Phone: leadData.phone || lead.Phone,
                Description: leadData.message || leadData.description || lead.Description,
                Lead_Status: 'Contacted'
            });
        } else {
            // Create new lead
            lead = await createZohoLead(leadData);
        }

        console.log('✅ Lead successfully synced to Zoho CRM!');
        return {
            success: true,
            lead: lead
        };
    } catch (error) {
        console.error('❌ Error syncing lead to Zoho:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

export { createZohoLead, findZohoLeadByEmail, updateZohoLead, syncLeadToZoho };
