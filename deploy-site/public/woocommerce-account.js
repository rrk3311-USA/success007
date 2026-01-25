/**
 * WooCommerce Customer Account Integration
 * Fetches customer data, orders, and account information from WooCommerce API
 */

// WooCommerce API Configuration
const WOOCOMMERCE_CONFIG = {
    url: 'https://blueviolet-snake-802946.hostingersite.com',
    apiEndpoint: '/wp-json/wc/v3',
    // Credentials will be set from localStorage or config
    consumerKey: null,
    consumerSecret: null
};

// Initialize WooCommerce API
function initWooCommerceAPI() {
    // Try to get credentials from localStorage (set by admin)
    const wooKey = localStorage.getItem('wooCommerceConsumerKey');
    const wooSecret = localStorage.getItem('wooCommerceConsumerSecret');
    
    if (wooKey && wooSecret) {
        WOOCOMMERCE_CONFIG.consumerKey = wooKey;
        WOOCOMMERCE_CONFIG.consumerSecret = wooSecret;
        return true;
    }
    
    // Fallback to config.js if available
    if (typeof window.CONFIG !== 'undefined' && window.CONFIG.woocommerce) {
        WOOCOMMERCE_CONFIG.consumerKey = window.CONFIG.woocommerce.consumerKey;
        WOOCOMMERCE_CONFIG.consumerSecret = window.CONFIG.woocommerce.consumerSecret;
        return true;
    }
    
    console.warn('⚠️ WooCommerce API credentials not found');
    return false;
}

// Get authentication header
function getAuthHeader() {
    if (!WOOCOMMERCE_CONFIG.consumerKey || !WOOCOMMERCE_CONFIG.consumerSecret) {
        throw new Error('WooCommerce API credentials not configured');
    }
    const credentials = `${WOOCOMMERCE_CONFIG.consumerKey}:${WOOCOMMERCE_CONFIG.consumerSecret}`;
    return `Basic ${btoa(credentials)}`;
}

/**
 * Get customer by email
 * @param {string} email - Customer email
 * @returns {Promise<Object>} Customer data
 */
async function getCustomerByEmail(email) {
    if (!initWooCommerceAPI()) {
        throw new Error('WooCommerce API not configured');
    }
    
    try {
        const response = await fetch(
            `${WOOCOMMERCE_CONFIG.url}${WOOCOMMERCE_CONFIG.apiEndpoint}/customers?email=${encodeURIComponent(email)}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': getAuthHeader()
                }
            }
        );
        
        if (!response.ok) {
            throw new Error(`WooCommerce API Error ${response.status}: ${await response.text()}`);
        }
        
        const customers = await response.json();
        return customers.length > 0 ? customers[0] : null;
    } catch (error) {
        console.error('❌ Failed to fetch customer:', error);
        throw error;
    }
}

/**
 * Get customer by ID
 * @param {number} customerId - Customer ID
 * @returns {Promise<Object>} Customer data
 */
async function getCustomerById(customerId) {
    if (!initWooCommerceAPI()) {
        throw new Error('WooCommerce API not configured');
    }
    
    try {
        const response = await fetch(
            `${WOOCOMMERCE_CONFIG.url}${WOOCOMMERCE_CONFIG.apiEndpoint}/customers/${customerId}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': getAuthHeader()
                }
            }
        );
        
        if (!response.ok) {
            throw new Error(`WooCommerce API Error ${response.status}: ${await response.text()}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('❌ Failed to fetch customer:', error);
        throw error;
    }
}

/**
 * Update customer
 * @param {number} customerId - Customer ID
 * @param {Object} customerData - Customer data to update
 * @returns {Promise<Object>} Updated customer data
 */
async function updateCustomer(customerId, customerData) {
    if (!initWooCommerceAPI()) {
        throw new Error('WooCommerce API not configured');
    }
    
    try {
        const response = await fetch(
            `${WOOCOMMERCE_CONFIG.url}${WOOCOMMERCE_CONFIG.apiEndpoint}/customers/${customerId}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': getAuthHeader()
                },
                body: JSON.stringify(customerData)
            }
        );
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`WooCommerce API Error ${response.status}: ${errorText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('❌ Failed to update customer:', error);
        throw error;
    }
}

/**
 * Get customer orders
 * @param {number} customerId - Customer ID
 * @param {Object} params - Query parameters (per_page, status, etc.)
 * @returns {Promise<Array>} Array of orders
 */
async function getCustomerOrders(customerId, params = {}) {
    if (!initWooCommerceAPI()) {
        throw new Error('WooCommerce API not configured');
    }
    
    const queryParams = new URLSearchParams({
        customer: customerId,
        per_page: params.per_page || 50,
        orderby: params.orderby || 'date',
        order: params.order || 'desc',
        ...params
    });
    
    try {
        const response = await fetch(
            `${WOOCOMMERCE_CONFIG.url}${WOOCOMMERCE_CONFIG.apiEndpoint}/orders?${queryParams}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': getAuthHeader()
                }
            }
        );
        
        if (!response.ok) {
            throw new Error(`WooCommerce API Error ${response.status}: ${await response.text()}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('❌ Failed to fetch orders:', error);
        throw error;
    }
}

/**
 * Get order by ID
 * @param {number} orderId - Order ID
 * @returns {Promise<Object>} Order data
 */
async function getOrderById(orderId) {
    if (!initWooCommerceAPI()) {
        throw new Error('WooCommerce API not configured');
    }
    
    try {
        const response = await fetch(
            `${WOOCOMMERCE_CONFIG.url}${WOOCOMMERCE_CONFIG.apiEndpoint}/orders/${orderId}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': getAuthHeader()
                }
            }
        );
        
        if (!response.ok) {
            throw new Error(`WooCommerce API Error ${response.status}: ${await response.text()}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('❌ Failed to fetch order:', error);
        throw error;
    }
}

/**
 * Get current customer from localStorage or session
 * @returns {Object|null} Customer data or null
 */
function getCurrentCustomer() {
    try {
        const customerData = localStorage.getItem('wooCommerceCustomer');
        return customerData ? JSON.parse(customerData) : null;
    } catch (e) {
        return null;
    }
}

/**
 * Set current customer in localStorage
 * @param {Object} customer - Customer data
 */
function setCurrentCustomer(customer) {
    localStorage.setItem('wooCommerceCustomer', JSON.stringify(customer));
}

/**
 * Get customer email from localStorage (from order form or settings)
 * @returns {string|null} Customer email
 */
function getCustomerEmail() {
    // Try multiple sources
    const settings = localStorage.getItem('successChemistrySettings');
    if (settings) {
        try {
            const parsed = JSON.parse(settings);
            if (parsed.email) return parsed.email;
        } catch (e) {}
    }
    
    // Check recent orders
    const orders = localStorage.getItem('successChemistryOrders');
    if (orders) {
        try {
            const parsed = JSON.parse(orders);
            if (parsed.length > 0 && parsed[0].email) {
                return parsed[0].email;
            }
        } catch (e) {}
    }
    
    return null;
}

/**
 * Load customer account data (customer info + orders)
 * @param {string} email - Customer email (optional, will try to get from localStorage)
 * @returns {Promise<Object>} Account data with customer and orders
 */
async function loadCustomerAccount(email = null) {
    try {
        // Get email if not provided
        if (!email) {
            email = getCustomerEmail();
        }
        
        if (!email) {
            throw new Error('Customer email not found. Please provide email or complete an order first.');
        }
        
        // Get customer by email
        let customer = await getCustomerByEmail(email);
        
        // If customer doesn't exist in WooCommerce, return null
        if (!customer) {
            console.warn('⚠️ Customer not found in WooCommerce');
            return null;
        }
        
        // Save customer to localStorage
        setCurrentCustomer(customer);
        
        // Get customer orders
        const orders = await getCustomerOrders(customer.id);
        
        return {
            customer,
            orders
        };
    } catch (error) {
        console.error('❌ Failed to load customer account:', error);
        throw error;
    }
}

// Export functions
window.WooCommerceAccount = {
    init: initWooCommerceAPI,
    getCustomerByEmail,
    getCustomerById,
    updateCustomer,
    getCustomerOrders,
    getOrderById,
    getCurrentCustomer,
    setCurrentCustomer,
    getCustomerEmail,
    loadCustomerAccount
};
