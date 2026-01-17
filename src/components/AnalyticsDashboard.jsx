import { useState, useEffect } from 'react';

export default function AnalyticsDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/analytics/dashboard');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">No analytics data available. Sync your orders first.</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
        <button
          onClick={fetchDashboardData}
          className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"
        >
          Refresh Data
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Total Revenue</div>
          <div className="text-3xl font-bold text-gray-900">
            ${(data.overview.totalRevenue || 0).toFixed(2)}
          </div>
          <div className="text-sm text-green-600 mt-2">
            ${(data.overview.last30DaysRevenue || 0).toFixed(2)} last 30 days
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Total Orders</div>
          <div className="text-3xl font-bold text-gray-900">{data.overview.totalOrders}</div>
          <div className="text-sm text-green-600 mt-2">
            {data.overview.last30DaysOrders} last 30 days
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Total Customers</div>
          <div className="text-3xl font-bold text-gray-900">{data.overview.totalCustomers}</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Avg Order Value</div>
          <div className="text-3xl font-bold text-gray-900">
            ${(data.overview.avgOrderValue || 0).toFixed(2)}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {['overview', 'products', 'customers', 'orders'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-medium capitalize ${
                  activeTab === tab
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Last 7 Days Performance</h3>
                <div className="space-y-2">
                  {data.last7Days.map((day) => (
                    <div key={day.date} className="flex items-center justify-between py-2 border-b">
                      <span className="text-sm text-gray-600">{new Date(day.date).toLocaleDateString()}</span>
                      <div className="flex gap-4">
                        <span className="text-sm font-medium">{day.orders} orders</span>
                        <span className="text-sm font-bold text-green-600">${day.revenue.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Orders by Status</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {data.ordersByStatus.map((status) => (
                    <div key={status.status} className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm text-gray-600 capitalize">{status.status}</div>
                      <div className="text-2xl font-bold text-gray-900">{status.count}</div>
                      <div className="text-sm text-gray-600">${(status.revenue || 0).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Top Selling Products</h3>
              <div className="space-y-2">
                {data.topProducts.map((product, idx) => (
                  <div key={idx} className="flex items-center justify-between py-3 border-b">
                    <div>
                      <div className="font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-600">SKU: {product.sku}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">{product.order_count} orders</div>
                      <div className="text-sm text-green-600">${(product.revenue || 0).toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'customers' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Top Customers by Lifetime Value</h3>
              <div className="space-y-2">
                {data.topCustomers.map((customer, idx) => (
                  <div key={idx} className="flex items-center justify-between py-3 border-b">
                    <div>
                      <div className="font-medium text-gray-900">{customer.customer_email}</div>
                      <div className="text-sm text-gray-600">{customer.order_count} orders</div>
                    </div>
                    <div className="text-lg font-bold text-green-600">
                      ${customer.lifetime_value.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Recent Orders Summary</h3>
              <p className="text-gray-600">
                View detailed order management in the Orders section
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
