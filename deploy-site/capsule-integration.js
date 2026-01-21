/**
 * Capsule CRM Integration for Success Chemistry
 * Automatically syncs customers, orders, and opportunities to Capsule CRM
 */

const CAPSULE_API_URL = 'https://api.capsulecrm.com/api/v2';
const CAPSULE_API_TOKEN = 'FPH4ltmX3v307MaUMCYkECGl9a16eXPh37TpUbWjOM83kd3cyW4z2vk8Kk+GcxJA';

/**
 * Create a contact in Capsule CRM
 */
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
                    firstName: customerData.firstName || customerData.name?.split(' ')[0] || 'Customer',
                    lastName: customerData.lastName || customerData.name?.split(' ').slice(1).join(' ') || '',
                    emails: customerData.email ? [{ address: customerData.email }] : [],
                    phoneNumbers: customerData.phone ? [{ number: customerData.phone }] : [],
                    addresses: customerData.address ? [{
                        street: customerData.address.street || customerData.address,
                        city: customerData.address.city || '',
                        state: customerData.address.state || '',
                        zip: customerData.address.zip || customerData.address.postal_code || '',
                        country: customerData.address.country || 'USA'
                    }] : []
                }
            })
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('Capsule API error:', error);
            throw new Error(`Capsule API error: ${response.status} ${error}`);
        }

        const data = await response.json();
        console.log('✅ Contact created in Capsule:', data.party?.id);
        return data.party;
    } catch (error) {
        console.error('Error creating Capsule contact:', error);
        throw error;
    }
}

/**
 * Find contact by email in Capsule CRM
 */
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
        console.error('Error finding Capsule contact:', error);
        return null;
    }
}

/**
 * Create an opportunity (deal) in Capsule CRM
 */
async function createCapsuleOpportunity(opportunityData) {
    try {
        const response = await fetch(`${CAPSULE_API_URL}/opportunities`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${CAPSULE_API_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                opportunity: {
                    name: opportunityData.name,
                    description: opportunityData.description || '',
                    value: {
                        amount: opportunityData.amount,
                        currency: opportunityData.currency || 'USD'
                    },
                    party: {
                        id: opportunityData.contactId
                    },
                    milestone: {
                        name: opportunityData.stage || 'Order Placed'
                    }
                }
            })
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('Capsule API error:', error);
            throw new Error(`Capsule API error: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Opportunity created in Capsule:', data.opportunity?.id);
        return data.opportunity;
    } catch (error) {
        console.error('Error creating Capsule opportunity:', error);
        throw error;
    }
}

/**
 * Create a task in Capsule CRM
 */
async function createCapsuleTask(taskData) {
    try {
        const response = await fetch(`${CAPSULE_API_URL}/tasks`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${CAPSULE_API_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                task: {
                    name: taskData.name,
                    description: taskData.description || '',
                    dueOn: taskData.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    party: {
                        id: taskData.contactId
                    },
                    category: taskData.category || 'Follow-up'
                }
            })
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('Capsule API error:', error);
            throw new Error(`Capsule API error: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Task created in Capsule:', data.task?.id);
        return data.task;
    } catch (error) {
        console.error('Error creating Capsule task:', error);
        throw error;
    }
}

/**
 * Sync order to Capsule CRM
 * Creates contact, opportunity, and follow-up task
 */
async function syncOrderToCapsule(orderData, customerData) {
    try {
        console.log('🔄 Syncing order to Capsule CRM...', orderData);

        // 1. Find or create contact
        let contact = null;
        if (customerData.email) {
            contact = await findCapsuleContactByEmail(customerData.email);
        }

        if (!contact) {
            contact = await createCapsuleContact(customerData);
        }

        if (!contact || !contact.id) {
            throw new Error('Failed to create or find contact');
        }

        // 2. Create opportunity for the order
        const itemsDescription = orderData.items?.map(item => 
            `- ${item.name || item.productName} (${item.quantity || 1}x) - $${item.price || 0}`
        ).join('\n') || 'Order items';

        const opportunity = await createCapsuleOpportunity({
            name: `Order #${orderData.orderId || orderData.id} - ${orderData.items?.length || 0} item(s)`,
            description: `Order placed on ${orderData.date || new Date().toLocaleDateString()}\n\nItems:\n${itemsDescription}\n\nTotal: $${orderData.total || 0}`,
            amount: parseFloat(orderData.total || 0),
            currency: 'USD',
            contactId: contact.id,
            stage: 'Order Placed'
        });

        // 3. Create follow-up task (7 days from now)
        const followUpDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        await createCapsuleTask({
            name: `Follow up on Order #${orderData.orderId || orderData.id}`,
            description: `Follow up with customer about their order. Check if they're satisfied with their supplements.`,
            dueDate: followUpDate,
            contactId: contact.id,
            category: 'Customer Service'
        });

        console.log('✅ Order successfully synced to Capsule CRM!');
        return {
            success: true,
            contact: contact,
            opportunity: opportunity
        };
    } catch (error) {
        console.error('❌ Error syncing order to Capsule:', error);
        // Don't throw - we don't want to break the order flow if Capsule sync fails
        return {
            success: false,
            error: error.message
        };
    }
}

// Make functions available globally
if (typeof window !== 'undefined') {
    window.CapsuleCRM = {
        createContact: createCapsuleContact,
        findContactByEmail: findCapsuleContactByEmail,
        createOpportunity: createCapsuleOpportunity,
        createTask: createCapsuleTask,
        syncOrder: syncOrderToCapsule
    };
}
