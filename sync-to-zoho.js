/**
 * Sync Contacts and Orders to Zoho CRM
 * Pulls data from WooCommerce and syncs to Zoho CRM
 */

import dotenv from 'dotenv';
import { syncLeadToZoho, findZohoLeadByEmail } from './zoho-crm-integration.js';

dotenv.config();

const WOOCOMMERCE_URL = process.env.WOOCOMMERCE_URL;
const WOOCOMMERCE_CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY;
const WOOCOMMERCE_CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET;
const ZOHO_CRM_API_URL = process.env.ZOHO_CRM_API_URL || 'https://www.zohoapis.com/crm/v2';

// Stats tracking
const stats = {
    contacts: { total: 0, synced: 0, skipped: 0, errors: 0 },
    orders: { total: 0, synced: 0, skipped: 0, errors: 0 }
};

/**
 * Fetch all customers from WooCommerce
 */
async function fetchWooCommerceCustomers() {
    console.log('📥 Fetching customers from WooCommerce...');
    
    const customers = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
        try {
            const url = `${WOOCOMMERCE_URL}/wp-json/wc/v3/customers?page=${page}&per_page=100`;
            const auth = Buffer.from(`${WOOCOMMERCE_CONSUMER_KEY}:${WOOCOMMERCE_CONSUMER_SECRET}`).toString('base64');
            
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Basic ${auth}`
                }
            });

            if (!response.ok) {
                throw new Error(`WooCommerce API error: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.length === 0) {
                hasMore = false;
            } else {
                customers.push(...data);
                console.log(`   Fetched page ${page}: ${data.length} customers`);
                page++;
                
                // Check if there are more pages
                const totalPages = parseInt(response.headers.get('x-wp-totalpages') || '1');
                if (page > totalPages) {
                    hasMore = false;
                }
            }
        } catch (error) {
            console.error(`❌ Error fetching customers page ${page}:`, error.message);
            hasMore = false;
        }
    }

    console.log(`✅ Fetched ${customers.length} total customers from WooCommerce\n`);
    return customers;
}

/**
 * Fetch all orders from WooCommerce
 */
async function fetchWooCommerceOrders() {
    console.log('📥 Fetching orders from WooCommerce...');
    
    const orders = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
        try {
            const url = `${WOOCOMMERCE_URL}/wp-json/wc/v3/orders?page=${page}&per_page=100&status=any`;
            const auth = Buffer.from(`${WOOCOMMERCE_CONSUMER_KEY}:${WOOCOMMERCE_CONSUMER_SECRET}`).toString('base64');
            
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Basic ${auth}`
                }
            });

            if (!response.ok) {
                throw new Error(`WooCommerce API error: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.length === 0) {
                hasMore = false;
            } else {
                orders.push(...data);
                console.log(`   Fetched page ${page}: ${data.length} orders`);
                page++;
                
                // Check if there are more pages
                const totalPages = parseInt(response.headers.get('x-wp-totalpages') || '1');
                if (page > totalPages) {
                    hasMore = false;
                }
            }
        } catch (error) {
            console.error(`❌ Error fetching orders page ${page}:`, error.message);
            hasMore = false;
        }
    }

    console.log(`✅ Fetched ${orders.length} total orders from WooCommerce\n`);
    return orders;
}

/**
 * Convert WooCommerce customer to Zoho Lead format
 */
function customerToZohoLead(customer) {
    return {
        firstName: customer.first_name || '',
        lastName: customer.last_name || '',
        email: customer.email || '',
        phone: customer.billing?.phone || customer.shipping?.phone || '',
        company: customer.billing?.company || customer.shipping?.company || 'Success Chemistry Customer',
        source: 'WooCommerce Sync',
        description: `Customer since: ${customer.date_created || 'Unknown'}\nTotal orders: ${customer.orders_count || 0}\nTotal spent: $${customer.total_spent || 0}`,
        customFields: {
            Website: customer.username || '',
            City: customer.billing?.city || customer.shipping?.city || '',
            State: customer.billing?.state || customer.shipping?.state || '',
            Country: customer.billing?.country || customer.shipping?.country || '',
            Postal_Code: customer.billing?.postcode || customer.shipping?.postcode || ''
        }
    };
}

/**
 * Convert WooCommerce order to Zoho Deal format
 */
function orderToZohoDeal(order) {
    const customer = order.billing || {};
    const items = order.line_items || [];
    const itemNames = items.map(item => `${item.name} (x${item.quantity})`).join(', ');
    
    return {
        Deal_Name: `Order #${order.number || order.id}`,
        Account_Name: customer.company || `${customer.first_name} ${customer.last_name}`.trim() || 'Success Chemistry Customer',
        Contact_Name: `${customer.first_name} ${customer.last_name}`.trim() || '',
        Stage: mapOrderStatusToDealStage(order.status),
        Amount: parseFloat(order.total || 0),
        Closing_Date: order.date_created || new Date().toISOString().split('T')[0],
        Description: `Order from WooCommerce\n\nItems: ${itemNames}\n\nShipping: ${order.shipping_total || 0}\nTax: ${order.total_tax || 0}\nPayment Method: ${order.payment_method_title || order.payment_method || 'Unknown'}`,
        Lead_Source: 'WooCommerce',
        customFields: {
            Order_ID: order.number || order.id.toString(),
            Order_Status: order.status || '',
            Shipping_Address: formatAddress(order.shipping),
            Billing_Address: formatAddress(order.billing)
        }
    };
}

/**
 * Map WooCommerce order status to Zoho Deal stage
 */
function mapOrderStatusToDealStage(status) {
    const statusMap = {
        'completed': 'Closed Won',
        'processing': 'Qualification',
        'on-hold': 'Needs Analysis',
        'pending': 'Prospecting',
        'cancelled': 'Closed Lost',
        'refunded': 'Closed Lost',
        'failed': 'Closed Lost'
    };
    return statusMap[status] || 'Prospecting';
}

/**
 * Format address for Zoho
 */
function formatAddress(address) {
    if (!address) return '';
    const parts = [
        address.address_1,
        address.address_2,
        address.city,
        address.state,
        address.postcode,
        address.country
    ].filter(Boolean);
    return parts.join(', ');
}

/**
 * Sync customer to Zoho CRM as Lead
 */
async function syncCustomerToZoho(customer) {
    try {
        const leadData = customerToZohoLead(customer);
        const result = await syncLeadToZoho(leadData);
        
        if (result.success) {
            stats.contacts.synced++;
            return { success: true, lead: result.lead };
        } else {
            stats.contacts.errors++;
            return { success: false, error: result.error };
        }
    } catch (error) {
        stats.contacts.errors++;
        console.error(`❌ Error syncing customer ${customer.email}:`, error.message);
        return { success: false, error: error.message };
    }
}

/**
 * Create Deal in Zoho CRM
 */
async function createZohoDeal(dealData) {
    try {
        const ZOHO_CRM_ACCESS_TOKEN = process.env.ZOHO_CRM_ACCESS_TOKEN;
        const ZOHO_REFRESH_TOKEN = process.env.ZOHO_REFRESH_TOKEN || '';
        const ZOHO_CLIENT_ID = process.env.ZOHO_CLIENT_ID || '';
        const ZOHO_CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET || '';
        const ZOHO_TOKEN_URL = 'https://accounts.zoho.com/oauth/v2/token';
        
        if (!ZOHO_CRM_ACCESS_TOKEN) {
            throw new Error('Zoho CRM access token not configured');
        }

        // Helper function to make API request with token refresh
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
                try {
                    const refreshResponse = await fetch(ZOHO_TOKEN_URL, {
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

                    if (refreshResponse.ok) {
                        const tokenData = await refreshResponse.json();
                        // Retry with new token
                        response = await fetch(url, {
                            ...options,
                            headers: {
                                'Authorization': `Zoho-oauthtoken ${tokenData.access_token}`,
                                'Content-Type': 'application/json',
                                ...options.headers
                            }
                        });
                    }
                } catch (refreshError) {
                    console.error('Error refreshing token:', refreshError);
                }
            }

            return response;
        }

        const response = await zohoApiRequest(`${ZOHO_CRM_API_URL}/Deals`, {
            method: 'POST',
            body: JSON.stringify({
                data: [dealData]
            })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Zoho CRM API error: ${response.status} ${error}`);
        }

        const data = await response.json();
        return { success: true, deal: data.data?.[0] };
    } catch (error) {
        console.error('Error creating Zoho deal:', error);
        throw error;
    }
}

/**
 * Sync order to Zoho CRM as Deal
 */
async function syncOrderToZoho(order) {
    try {
        // First, ensure the customer exists as a Lead/Contact
        if (order.billing?.email) {
            const customerData = {
                firstName: order.billing.first_name || '',
                lastName: order.billing.last_name || '',
                email: order.billing.email,
                phone: order.billing.phone || '',
                company: order.billing.company || 'Success Chemistry Customer',
                source: 'WooCommerce Order Sync'
            };
            
            // Sync customer first (will create or update)
            await syncLeadToZoho(customerData);
        }

        // Create Deal for the order
        const dealData = orderToZohoDeal(order);
        const result = await createZohoDeal(dealData);
        
        if (result.success) {
            stats.orders.synced++;
            return { success: true, deal: result.deal };
        } else {
            stats.orders.errors++;
            return { success: false, error: result.error };
        }
    } catch (error) {
        stats.orders.errors++;
        console.error(`❌ Error syncing order ${order.number || order.id}:`, error.message);
        return { success: false, error: error.message };
    }
}

/**
 * Main sync function
 */
async function syncToZoho(options = {}) {
    const {
        syncContacts = true,
        syncOrders = true,
        limit = null // Limit number of records to sync (for testing)
    } = options;

    console.log('🚀 Starting Zoho CRM Sync...\n');
    console.log('Options:');
    console.log(`   Sync Contacts: ${syncContacts ? '✅' : '❌'}`);
    console.log(`   Sync Orders: ${syncOrders ? '✅' : '❌'}`);
    if (limit) console.log(`   Limit: ${limit} records per type\n`);
    console.log('');

    // Validate credentials
    if (!WOOCOMMERCE_URL || !WOOCOMMERCE_CONSUMER_KEY || !WOOCOMMERCE_CONSUMER_SECRET) {
        console.error('❌ WooCommerce credentials not configured in .env file');
        process.exit(1);
    }

    if (!process.env.ZOHO_CRM_ACCESS_TOKEN) {
        console.error('❌ Zoho CRM access token not configured in .env file');
        process.exit(1);
    }

    try {
        // Sync Contacts
        if (syncContacts) {
            console.log('='.repeat(60));
            console.log('📇 SYNCING CONTACTS');
            console.log('='.repeat(60));
            
            const customers = await fetchWooCommerceCustomers();
            stats.contacts.total = customers.length;
            
            const customersToSync = limit ? customers.slice(0, limit) : customers;
            
            for (let i = 0; i < customersToSync.length; i++) {
                const customer = customersToSync[i];
                
                // Skip if no email
                if (!customer.email) {
                    stats.contacts.skipped++;
                    console.log(`⏭️  Skipping customer ${i + 1}/${customersToSync.length} (no email)`);
                    continue;
                }
                
                console.log(`📧 Syncing customer ${i + 1}/${customersToSync.length}: ${customer.email}`);
                await syncCustomerToZoho(customer);
                
                // Rate limiting - wait 200ms between requests
                await new Promise(resolve => setTimeout(resolve, 200));
            }
            
            console.log(`\n✅ Contacts sync complete!\n`);
        }

        // Sync Orders
        if (syncOrders) {
            console.log('='.repeat(60));
            console.log('🛒 SYNCING ORDERS');
            console.log('='.repeat(60));
            
            const orders = await fetchWooCommerceOrders();
            stats.orders.total = orders.length;
            
            const ordersToSync = limit ? orders.slice(0, limit) : orders;
            
            for (let i = 0; i < ordersToSync.length; i++) {
                const order = ordersToSync[i];
                
                console.log(`📦 Syncing order ${i + 1}/${ordersToSync.length}: #${order.number || order.id}`);
                await syncOrderToZoho(order);
                
                // Rate limiting - wait 300ms between requests (Deals take longer)
                await new Promise(resolve => setTimeout(resolve, 300));
            }
            
            console.log(`\n✅ Orders sync complete!\n`);
        }

        // Print summary
        console.log('='.repeat(60));
        console.log('📊 SYNC SUMMARY');
        console.log('='.repeat(60));
        
        if (syncContacts) {
            console.log('\n📇 Contacts:');
            console.log(`   Total: ${stats.contacts.total}`);
            console.log(`   ✅ Synced: ${stats.contacts.synced}`);
            console.log(`   ⏭️  Skipped: ${stats.contacts.skipped}`);
            console.log(`   ❌ Errors: ${stats.contacts.errors}`);
        }
        
        if (syncOrders) {
            console.log('\n🛒 Orders:');
            console.log(`   Total: ${stats.orders.total}`);
            console.log(`   ✅ Synced: ${stats.orders.synced}`);
            console.log(`   ⏭️  Skipped: ${stats.orders.skipped}`);
            console.log(`   ❌ Errors: ${stats.orders.errors}`);
        }
        
        console.log('\n✅ Sync complete!\n');

    } catch (error) {
        console.error('❌ Sync failed:', error);
        process.exit(1);
    }
}

// Run sync if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    // Parse command line arguments
    const args = process.argv.slice(2);
    const options = {
        syncContacts: !args.includes('--no-contacts'),
        syncOrders: !args.includes('--no-orders'),
        limit: args.includes('--limit') ? parseInt(args[args.indexOf('--limit') + 1]) : null
    };
    
    syncToZoho(options).catch(error => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
}

export { syncToZoho, fetchWooCommerceCustomers, fetchWooCommerceOrders };
