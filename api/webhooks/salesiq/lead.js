/**
 * Vercel Serverless Function: SalesIQ Lead Capture Webhook
 * POST /api/webhooks/salesiq/lead
 */

import { syncLeadToZoho } from '../../../zoho-crm-integration.js';

// Capsule CRM configuration
const CAPSULE_API_URL = 'https://api.capsulecrm.com/api/v2';
const CAPSULE_API_TOKEN = 'FPH4ltmX3v307MaUMCYkECGl9a16eXPh37TpUbWjOM83kd3cyW4z2vk8Kk+GcxJA';

// Helper: Create contact in Capsule CRM
async function createCapsuleContact(customerData) {
    try {
        const response = await fetch(`${CAPSULE_API_URL}/parties`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${CAPSULE_API_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                party: {
                    type: 'person',
                    firstName: customerData.firstName || customerData.name?.split(' ')[0] || 'Lead',
                    lastName: customerData.lastName || customerData.name?.split(' ').slice(1).join(' ') || '',
                    emails: customerData.email ? [{ address: customerData.email }] : [],
                    phoneNumbers: customerData.phone ? [{ number: customerData.phone }] : []
                }
            })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Capsule API error: ${response.status} ${error}`);
        }

        const data = await response.json();
        return data.party;
    } catch (error) {
        console.error('Error creating Capsule contact:', error);
        throw error;
    }
}

// Helper: Find contact by email in Capsule CRM
async function findCapsuleContactByEmail(email) {
    try {
        const response = await fetch(`${CAPSULE_API_URL}/parties?q=${encodeURIComponent(email)}`, {
            headers: {
                'Authorization': `Bearer ${CAPSULE_API_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        return data.parties?.find(p => p.emails?.some(e => e.address === email));
    } catch (error) {
        return null;
    }
}

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            error: 'Method not allowed'
        });
    }

    try {
        console.log('📥 Received SalesIQ lead:', req.body);

        const leadData = req.body;
        
        // Extract lead information (SalesIQ format may vary)
        const customerData = {
            firstName: leadData.firstName || leadData.first_name || leadData.name?.split(' ')[0] || 'Lead',
            lastName: leadData.lastName || leadData.last_name || leadData.name?.split(' ').slice(1).join(' ') || '',
            email: leadData.email || leadData.Email || '',
            phone: leadData.phone || leadData.Phone || leadData.phoneNumber || '',
            name: leadData.name || `${leadData.firstName || ''} ${leadData.lastName || ''}`.trim(),
            message: leadData.message || leadData.Message || leadData.description || '',
            source: 'SalesIQ Chat',
            company: leadData.company || 'Success Chemistry Customer',
            customFields: {
                ...(leadData.customFields || {}),
                Lead_Source: 'SalesIQ Chat',
                Description: leadData.message || leadData.description || ''
            }
        };

        // Validate required fields
        if (!customerData.email) {
            return res.status(400).json({
                success: false,
                error: 'Email is required'
            });
        }

        const results = {
            capsule: null,
            zoho: null
        };

        // Sync to Capsule CRM
        try {
            let capsuleContact = await findCapsuleContactByEmail(customerData.email);
            
            if (!capsuleContact) {
                capsuleContact = await createCapsuleContact(customerData);
                console.log('✅ Lead created in Capsule CRM:', capsuleContact?.id);
            } else {
                console.log('✅ Lead already exists in Capsule CRM:', capsuleContact?.id);
            }
            
            results.capsule = {
                success: true,
                contactId: capsuleContact?.id
            };
        } catch (error) {
            console.error('❌ Capsule CRM sync failed:', error);
            results.capsule = {
                success: false,
                error: error.message
            };
        }

        // Sync to Zoho CRM
        try {
            const zohoResult = await syncLeadToZoho(customerData);
            results.zoho = zohoResult;
        } catch (error) {
            console.error('❌ Zoho CRM sync failed:', error);
            results.zoho = {
                success: false,
                error: error.message
            };
        }

        // Return success even if one CRM fails
        res.json({
            success: true,
            message: 'Lead captured and synced',
            results: results
        });

    } catch (error) {
        console.error('Lead capture webhook error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
}
