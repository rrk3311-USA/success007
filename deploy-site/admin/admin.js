// Admin Dashboard API Integration
const API_BASE = 'http://localhost:3001/api';
let authToken = null;
let currentUser = null;

// Debug logging
console.log('Admin dashboard script loaded');

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, checking auth...');
    checkAuth();
});

// Authentication
async function login(event) {
    event.preventDefault();
    const email = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    try {
        const loginUrl = `${API_BASE}/auth/login`;
        console.log('Attempting login to:', loginUrl);
        
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Login failed');
        }
        
        authToken = data.token;
        currentUser = data.user;
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        showDashboard();
    } catch (error) {
        // Better error message for connection failures
        let errorMsg = error.message;
        if (error.message === 'Failed to fetch' || error.message.includes('fetch')) {
            errorMsg = 'Cannot connect to API server. Make sure the Admin API server is running on port 3001. Run: npm run admin';
        }
        
        alert('Login failed: ' + errorMsg);
        console.error('Login error:', error);
        console.error('API_BASE:', API_BASE);
        console.error('Full error:', error);
        console.error('💡 TIP: Start the Admin API server with: npm run admin');
    }
}

async function logout() {
    if (authToken) {
        try {
            await fetch(`${API_BASE}/auth/logout`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${authToken}` }
            });
        } catch (error) {
            console.error('Logout error:', error);
        }
    }
    
    authToken = null;
    currentUser = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('dashboard').classList.remove('active');
}

function checkAuth() {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('currentUser');
    
    if (token && user) {
        authToken = token;
        currentUser = JSON.parse(user);
        verifyToken();
    }
}

async function verifyToken() {
    try {
        const response = await fetch(`${API_BASE}/auth/verify`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        const data = await response.json();
        
        if (data.valid) {
            showDashboard();
        } else {
            logout();
        }
    } catch (error) {
        console.error('Token verification error:', error);
        logout();
    }
}

function showDashboard() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('dashboard').classList.add('active');
    loadDashboardData();
}

// API Helper
async function apiCall(endpoint, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    
    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers
    });
    
    if (response.status === 401) {
        logout();
        throw new Error('Unauthorized');
    }
    
    return response.json();
}

// Dashboard Data Loading
async function loadDashboardData() {
    await Promise.all([
        loadAnalytics(),
        loadOrders(),
        loadProducts(),
        loadUsers()
    ]);
    // Load sales channels if tab is active
    if (document.getElementById('sales-channels')?.classList.contains('active')) {
        loadSalesChannels();
    }
}

// Analytics
async function loadAnalytics() {
    try {
        const data = await apiCall('/analytics/overview');
        
        // Update stats
        document.getElementById('totalProducts').textContent = data.products.total || 0;
        document.getElementById('totalOrders').textContent = data.sales.all_time.orders || 0;
        document.getElementById('totalRevenue').textContent = '$' + (data.sales.all_time.revenue || 0).toFixed(2);
        document.getElementById('totalCustomers').textContent = data.recentOrders?.length || 0;
        
        // Update recent orders
        const recentOrdersHtml = data.recentOrders?.slice(0, 5).map(order => `
            <tr>
                <td>#${order.order_number}</td>
                <td>${order.customer_name}</td>
                <td>${new Date(order.created_at).toLocaleDateString()}</td>
                <td>$${parseFloat(order.total).toFixed(2)}</td>
                <td><span class="badge ${order.status}">${order.status}</span></td>
            </tr>
        `).join('') || '<tr><td colspan="5" class="empty-state">No recent orders</td></tr>';
        
        document.getElementById('recentOrdersTable').innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Order #</th>
                        <th>Customer</th>
                        <th>Date</th>
                        <th>Total</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>${recentOrdersHtml}</tbody>
            </table>
        `;
    } catch (error) {
        console.error('Load analytics error:', error);
    }
}

// Orders
async function loadOrders(page = 1) {
    try {
        const data = await apiCall(`/orders?page=${page}&limit=50`);
        
        const ordersHtml = data.orders.map(order => `
            <tr>
                <td>#${order.order_number}</td>
                <td>${order.customer_name}</td>
                <td>${order.customer_email}</td>
                <td>${new Date(order.created_at).toLocaleDateString()}</td>
                <td>$${parseFloat(order.total).toFixed(2)}</td>
                <td><span class="badge ${order.status}">${order.status}</span></td>
                <td><span class="badge ${order.payment_status}">${order.payment_status}</span></td>
                <td>
                    <button class="action-btn" onclick="viewOrder(${order.id})">View</button>
                    <button class="action-btn" onclick="updateOrderStatus(${order.id})">Update</button>
                </td>
            </tr>
        `).join('') || '<tr><td colspan="8" class="empty-state">No orders found</td></tr>';
        
        document.getElementById('ordersTable').innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Order #</th>
                        <th>Customer</th>
                        <th>Email</th>
                        <th>Date</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Payment</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>${ordersHtml}</tbody>
            </table>
        `;
    } catch (error) {
        console.error('Load orders error:', error);
        document.getElementById('ordersTable').innerHTML = '<div class="empty-state">Error loading orders</div>';
    }
}

// Products
async function loadProducts(page = 1) {
    try {
        const data = await apiCall(`/products?page=${page}&limit=50`);
        
        const productsHtml = data.products.map(product => `
            <tr>
                <td>${product.sku}</td>
                <td>${product.name.substring(0, 50)}${product.name.length > 50 ? '...' : ''}</td>
                <td>${product.category || 'Uncategorized'}</td>
                <td>$${parseFloat(product.price).toFixed(2)}</td>
                <td>${product.stock || 0}</td>
                <td><span class="badge ${product.status}">${product.status}</span></td>
                <td>
                    <button class="action-btn" onclick="editProduct('${product.sku}')">Edit</button>
                    <button class="action-btn danger" onclick="deleteProduct('${product.sku}')">Delete</button>
                </td>
            </tr>
        `).join('') || '<tr><td colspan="7" class="empty-state">No products found</td></tr>';
        
        document.getElementById('productsTable').innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>SKU</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>${productsHtml}</tbody>
            </table>
        `;
    } catch (error) {
        console.error('Load products error:', error);
        document.getElementById('productsTable').innerHTML = '<div class="empty-state">Error loading products</div>';
    }
}

// Users
async function loadUsers(page = 1) {
    try {
        const data = await apiCall(`/users?page=${page}&limit=50`);
        
        const usersHtml = data.users.map(user => `
            <tr>
                <td>${user.email}</td>
                <td>${user.name || 'N/A'}</td>
                <td><span class="badge ${user.role}">${user.role}</span></td>
                <td>${user.order_count || 0}</td>
                <td>$${(user.total_spent || 0).toFixed(2)}</td>
                <td>${new Date(user.created_at).toLocaleDateString()}</td>
                <td>
                    <button class="action-btn" onclick="viewUser(${user.id})">View</button>
                </td>
            </tr>
        `).join('') || '<tr><td colspan="7" class="empty-state">No users found</td></tr>';
        
        document.getElementById('customersTable').innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Orders</th>
                        <th>Total Spent</th>
                        <th>Joined</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>${usersHtml}</tbody>
            </table>
        `;
    } catch (error) {
        console.error('Load users error:', error);
        document.getElementById('customersTable').innerHTML = '<div class="empty-state">Error loading users</div>';
    }
}

// Tab switching
function switchTab(tabName, event) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Find and activate the clicked tab button
    const clickedBtn = event?.target || document.querySelector(`[data-tab="${tabName}"]`);
    if (clickedBtn) {
        clickedBtn.classList.add('active');
    }
    
    // Show the corresponding tab content
    const tabContent = document.getElementById(tabName);
    if (tabContent) {
        tabContent.classList.add('active');
    }
    
    // Reload data for active tab
    if (tabName === 'orders') loadOrders();
    if (tabName === 'products') loadProducts();
    if (tabName === 'customers') loadUsers();
    if (tabName === 'sales-channels') loadSalesChannels();
}

// Product actions
async function editProduct(sku) {
    try {
        const product = await apiCall(`/products/${sku}`);
        // Open edit modal or navigate to edit page
        alert(`Edit product: ${product.name}\n\nThis would open an edit form.`);
    } catch (error) {
        alert('Error loading product: ' + error.message);
    }
}

async function deleteProduct(sku) {
    if (!confirm(`Are you sure you want to delete product ${sku}?`)) return;
    
    try {
        await apiCall(`/products/${sku}`, { method: 'DELETE' });
        loadProducts();
        alert('Product deleted successfully');
    } catch (error) {
        alert('Error deleting product: ' + error.message);
    }
}

// Order actions
async function viewOrder(id) {
    try {
        const order = await apiCall(`/orders/${id}`);
        // Display order details
        const itemsHtml = order.items.map(item => `
            <tr>
                <td>${item.product_sku}</td>
                <td>${item.product_name}</td>
                <td>${item.quantity}</td>
                <td>$${parseFloat(item.price).toFixed(2)}</td>
                <td>$${parseFloat(item.subtotal).toFixed(2)}</td>
            </tr>
        `).join('');
        
        alert(`Order #${order.order_number}\n\nCustomer: ${order.customer_name}\nTotal: $${parseFloat(order.total).toFixed(2)}\nStatus: ${order.status}`);
    } catch (error) {
        alert('Error loading order: ' + error.message);
    }
}

async function updateOrderStatus(id) {
    const status = prompt('Enter new status (pending, processing, shipped, delivered, cancelled):');
    if (!status) return;
    
    try {
        await apiCall(`/orders/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ status })
        });
        loadOrders();
        alert('Order status updated');
    } catch (error) {
        alert('Error updating order: ' + error.message);
    }
}

// User actions
async function viewUser(id) {
    try {
        const user = await apiCall(`/users/${id}`);
        alert(`User: ${user.email}\nOrders: ${user.orders?.length || 0}`);
    } catch (error) {
        alert('Error loading user: ' + error.message);
    }
}

// Search functions
function searchOrders(query) {
    // Implement search
    console.log('Search orders:', query);
}

function searchProducts(query) {
    // Implement search
    console.log('Search products:', query);
}

function searchCustomers(query) {
    // Implement search
    console.log('Search customers:', query);
}

// Sales Channels Management
async function loadSalesChannels() {
    const channels = [
        {
            name: 'eBay',
            icon: '🛒',
            status: 'active',
            statusText: 'Active',
            statusColor: '#10B981',
            config: 'OAuth Token Configured',
            listings: '1 listing active',
            dashboardUrl: 'https://www.ebay.com/sh/landing',
            sellerHubUrl: 'https://www.ebay.com/sh/landing',
            apiStatus: 'Connected',
            lastSync: 'Just now',
            actions: [
                { label: 'Seller Hub', url: 'https://www.ebay.com/sh/landing', icon: '📊' },
                { label: 'List Product', action: 'listEbay', icon: '➕' },
                { label: 'View Listings', url: 'https://www.ebay.com/sh/landing', icon: '👁️' }
            ]
        },
        {
            name: 'Walmart',
            icon: '🏪',
            status: 'pending',
            statusText: 'Pending Setup',
            statusColor: '#F59E0B',
            config: 'API Credentials Needed',
            listings: '0 listings',
            dashboardUrl: 'https://seller.walmart.com',
            sellerHubUrl: 'https://seller.walmart.com',
            apiStatus: 'Not Connected',
            lastSync: 'Never',
            actions: [
                { label: 'Seller Center', url: 'https://seller.walmart.com', icon: '📊' },
                { label: 'Setup API', action: 'setupWalmart', icon: '⚙️' }
            ]
        },
        {
            name: 'Amazon',
            icon: '📦',
            status: 'pending',
            statusText: 'Pending Setup',
            statusColor: '#F59E0B',
            config: 'Seller Central Access Needed',
            listings: '0 listings',
            dashboardUrl: 'https://sellercentral.amazon.com',
            sellerHubUrl: 'https://sellercentral.amazon.com',
            apiStatus: 'Not Connected',
            lastSync: 'Never',
            actions: [
                { label: 'Seller Central', url: 'https://sellercentral.amazon.com', icon: '📊' },
                { label: 'Setup API', action: 'setupAmazon', icon: '⚙️' }
            ]
        },
        {
            name: 'Temu',
            icon: '🛍️',
            status: 'pending',
            statusText: 'Pending Setup',
            statusColor: '#F59E0B',
            config: 'Seller Account Needed',
            listings: '0 listings',
            dashboardUrl: 'https://seller.temu.com',
            sellerHubUrl: 'https://seller.temu.com',
            apiStatus: 'Not Connected',
            lastSync: 'Never',
            actions: [
                { label: 'Seller Portal', url: 'https://seller.temu.com', icon: '📊' },
                { label: 'Setup Account', action: 'setupTemu', icon: '⚙️' }
            ]
        },
        {
            name: 'WooCommerce',
            icon: '🛒',
            status: 'active',
            statusText: 'Active',
            statusColor: '#10B981',
            config: 'API Configured',
            listings: '56 products',
            dashboardUrl: 'https://blueviolet-snake-802946.hostingersite.com/wp-admin',
            sellerHubUrl: 'https://blueviolet-snake-802946.hostingersite.com/wp-admin',
            apiStatus: 'Connected',
            lastSync: 'Active',
            actions: [
                { label: 'Dashboard', url: 'https://blueviolet-snake-802946.hostingersite.com/wp-admin', icon: '📊' },
                { label: 'Products', url: 'https://blueviolet-snake-802946.hostingersite.com/wp-admin/edit.php?post_type=product', icon: '📦' },
                { label: 'Orders', url: 'https://blueviolet-snake-802946.hostingersite.com/wp-admin/edit.php?post_type=shop_order', icon: '📋' }
            ]
        },
        {
            name: 'Success Chemistry Website',
            icon: '🌐',
            status: 'active',
            statusText: 'Active',
            statusColor: '#10B981',
            config: 'Live & Operational',
            listings: '56 products',
            dashboardUrl: 'https://successchemistry.com',
            sellerHubUrl: 'https://successchemistry.com/admin',
            apiStatus: 'Live',
            lastSync: 'Real-time',
            actions: [
                { label: 'View Site', url: 'https://successchemistry.com', icon: '🌐' },
                { label: 'Shop Page', url: 'https://successchemistry.com/shop', icon: '🛍️' },
                { label: 'Admin', url: 'https://successchemistry.com/admin', icon: '⚙️' }
            ]
        }
    ];

    const tableBody = document.getElementById('salesChannelsTable');
    if (!tableBody) return;

    tableBody.innerHTML = channels.map(channel => `
        <tr style="border-bottom: 1px solid hsl(var(--border));">
            <td style="padding: 16px;">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <span style="font-size: 1.5rem;">${channel.icon}</span>
                    <div>
                        <div style="font-weight: 500; color: hsl(var(--foreground)); margin-bottom: 4px;">${channel.name}</div>
                        <div style="font-size: 12px; color: hsl(var(--muted-foreground));">${channel.dashboardUrl}</div>
                    </div>
                </div>
            </td>
            <td style="padding: 16px;">
                <span class="badge ${channel.status === 'active' ? 'completed' : 'processing'}">
                    ${channel.statusText}
                </span>
                <div style="font-size: 12px; color: hsl(var(--muted-foreground)); margin-top: 4px;">${channel.apiStatus}</div>
            </td>
            <td style="padding: 16px; color: hsl(var(--foreground));">
                <div style="margin-bottom: 4px;">${channel.config}</div>
                <div style="font-size: 12px; color: hsl(var(--muted-foreground));">Last sync: ${channel.lastSync}</div>
            </td>
            <td style="padding: 16px; color: hsl(var(--foreground));">
                ${channel.listings}
            </td>
            <td style="padding: 16px;">
                <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                    ${channel.actions.map(action => {
                        if (action.url) {
                            return `<a href="${action.url}" target="_blank" class="action-btn" style="padding: 0.5rem 1rem; height: 2.5rem; font-size: 0.875rem; font-weight: 500;">${action.icon} ${action.label}</a>`;
                        } else if (action.action) {
                            return `<button onclick="${action.action}()" class="action-btn" style="padding: 0.5rem 1rem; height: 2.5rem; font-size: 0.875rem; font-weight: 500;">${action.icon} ${action.label}</button>`;
                        }
                    }).join('')}
                </div>
            </td>
        </tr>
    `).join('');
}

function refreshSalesChannels() {
    loadSalesChannels();
    // Show notification
    const notification = document.createElement('div');
    notification.style.cssText = 'position: fixed; top: 20px; right: 20px; padding: 16px 24px; background: hsl(var(--success) / 0.1); border: 1px solid hsl(var(--success) / 0.2); color: hsl(var(--success)); border-radius: calc(var(--radius) + 4px); z-index: 10000; font-weight: 500; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);';
    notification.textContent = '✅ Sales channels refreshed';
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// Channel-specific actions
function listEbay() {
    alert('eBay Listing:\n\nRun: node create-ebay-listing.js <SKU>\n\nExample: node create-ebay-listing.js 10777-810');
}

function setupWalmart() {
    alert('Walmart Setup:\n\n1. Visit: https://developer.walmart.com\n2. Create API credentials\n3. Add to .env file:\n   WALMART_CLIENT_ID=your_id\n   WALMART_CLIENT_SECRET=your_secret');
}

function setupAmazon() {
    alert('Amazon Setup:\n\n1. Visit: https://sellercentral.amazon.com\n2. Set up Seller Central account\n3. Configure MWS/SP-API credentials\n4. Add credentials to .env file');
}

function setupTemu() {
    alert('Temu Setup:\n\n1. Visit: https://seller.temu.com\n2. Create seller account\n3. Complete verification\n4. Configure API access');
}

// Export functions for inline event handlers
window.login = login;
window.logout = logout;
window.switchTab = switchTab;
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.viewOrder = viewOrder;
window.updateOrderStatus = updateOrderStatus;
window.viewUser = viewUser;
window.searchOrders = searchOrders;
window.searchProducts = searchProducts;
window.searchCustomers = searchCustomers;
window.loadSalesChannels = loadSalesChannels;
window.refreshSalesChannels = refreshSalesChannels;
window.listEbay = listEbay;
window.setupWalmart = setupWalmart;
window.setupAmazon = setupAmazon;
window.setupTemu = setupTemu;
