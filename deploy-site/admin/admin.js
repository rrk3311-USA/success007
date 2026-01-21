// Admin Dashboard API Integration
const API_BASE = 'http://localhost:3001/api';
let authToken = null;
let currentUser = null;

// #region agent log
fetch('http://127.0.0.1:7242/ingest/59f8293b-dd31-42b2-b22c-f816ef9edeed',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'admin/admin.js:2',message:'Admin script loaded',data:{apiBase:API_BASE,pageUrl:window.location.href},timestamp:Date.now(),sessionId:'debug-session',runId:'runtime',hypothesisId:'E'})}).catch(()=>{});
// #endregion agent log

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
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/59f8293b-dd31-42b2-b22c-f816ef9edeed',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'admin/admin.js:16',message:'Login attempt',data:{apiBase:API_BASE,loginUrl:`${API_BASE}/auth/login`,email},timestamp:Date.now(),sessionId:'debug-session',runId:'runtime',hypothesisId:'E'})}).catch(()=>{});
    // #endregion agent log
    
    try {
        // #region agent log
        const loginUrl = `${API_BASE}/auth/login`;
        console.log('Attempting login to:', loginUrl);
        fetch('http://127.0.0.1:7242/ingest/59f8293b-dd31-42b2-b22c-f816ef9edeed',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'admin/admin.js:22',message:'Login fetch starting',data:{apiBase:API_BASE,loginUrl,email},timestamp:Date.now(),sessionId:'debug-session',runId:'runtime',hypothesisId:'E'})}).catch(()=>{});
        // #endregion agent log
        
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/59f8293b-dd31-42b2-b22c-f816ef9edeed',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'admin/admin.js:30',message:'Login response received',data:{status:response.status,statusText:response.statusText,ok:response.ok,url:response.url},timestamp:Date.now(),sessionId:'debug-session',runId:'runtime',hypothesisId:'E'})}).catch(()=>{});
        // #endregion agent log
        
        const data = await response.json();
        
        if (!response.ok) {
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/59f8293b-dd31-42b2-b22c-f816ef9edeed',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'admin/admin.js:30',message:'Login failed',data:{status:response.status,error:data.error},timestamp:Date.now(),sessionId:'debug-session',runId:'runtime',hypothesisId:'E'})}).catch(()=>{});
            // #endregion agent log
            throw new Error(data.error || 'Login failed');
        }
        
        authToken = data.token;
        currentUser = data.user;
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        showDashboard();
    } catch (error) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/59f8293b-dd31-42b2-b22c-f816ef9edeed',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'admin/admin.js:40',message:'Login error caught',data:{error:error.message,errorType:error.name,apiBase:API_BASE},timestamp:Date.now(),sessionId:'debug-session',runId:'runtime',hypothesisId:'E'})}).catch(()=>{});
        // #endregion agent log
        
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
function switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(tabName).classList.add('active');
    
    // Reload data for active tab
    if (tabName === 'orders') loadOrders();
    if (tabName === 'products') loadProducts();
    if (tabName === 'customers') loadUsers();
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
