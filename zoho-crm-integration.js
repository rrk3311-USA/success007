/**
 * Zoho CRM Integration for Success Chemistry
 * Syncs leads from SalesIQ to Zoho CRM
 */

// Load from .env if available
import dotenv from 'dotenv';
dotenv.config();

const ZOHO_CRM_API_URL = process.env.ZOHO_CRM_API_URL || 'https://www.zohoapis.com/crm/v2';
const ZOHO_CRM_ACCESS_TOKEN = process.env.ZOHO_CRM_ACCESS_TOKEN || '';

/**
 * Create a lead in Zoho CRM
 */
async function createZohoLead(leadData) {
    try {
        if (!ZOHO_CRM_ACCESS_TOKEN) {
            console.warn('⚠️ Zoho CRM access token not configured. Skipping Zoho sync.');
            return null;
        }

        const response = await fetch(`${ZOHO_CRM_API_URL}/Leads`, {
            method: 'POST',
            headers: {
                'Authorization': `Zoho-oauthtoken ${ZOHO_CRM_ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            },
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

        const response = await fetch(`${ZOHO_CRM_API_URL}/Leads/search?criteria=(Email:equals:${encodeURIComponent(email)})`, {
            headers: {
                'Authorization': `Zoho-oauthtoken ${ZOHO_CRM_ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        return data.data?.[0] || null;
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

        const response = await fetch(`${ZOHO_CRM_API_URL}/Leads/${leadId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Zoho-oauthtoken ${ZOHO_CRM_ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            },
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
