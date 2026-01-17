import { useState, useEffect } from 'react';

export default function CustomerManagement() {
  const [customers, setCustomers] = useState([]);
  const [clvData, setClvData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list');

  useEffect(() => {
    if (view === 'list') {
      fetchCustomers();
    } else {
      fetchCLV();
    }
  }, [view]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/woocommerce/customers');
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCLV = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/analytics/customer-lifetime-value');
      const data = await response.json();
      setClvData(data);
    } catch (error) {
      console.error('Error fetching CLV:', error);
    } finally {
      setLoading(false);
    }
  };

  const syncCustomers = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/woocommerce/sync-customers', {
        method: 'POST'
      });
      const result = await response.json();
      alert(`Synced ${result.synced} customers from WooCommerce`);
      fetchCustomers();
    } catch (error) {
      console.error('Error syncing customers:', error);
      alert('Failed to sync customers');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Customer Management</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setView(view === 'list' ? 'clv' : 'list')}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium"
          >
            {view === 'list' ? 'View Lifetime Value' : 'View Customer List'}
          </button>
          {view === 'list' && (
            <button
              onClick={syncCustomers}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              Sync from WooCommerce
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : view === 'list' ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {customers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No customers found. Sync from WooCommerce to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orders</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Spent</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {customers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {customer.avatar_url && (
                            <img src={customer.avatar_url} alt="" className="w-8 h-8 rounded-full mr-3" />
                          )}
                          <div>
                            <div className="font-medium text-gray-900">
                              {customer.first_name} {customer.last_name}
                            </div>
                            <div className="text-sm text-gray-600">@{customer.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {customer.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {customer.orders_count}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                        ${parseFloat(customer.total_spent).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(customer.date_created).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Customer Lifetime Value Analysis</h3>
            <p className="text-sm text-gray-600 mt-1">Top 100 customers by total revenue</p>
          </div>
          {clvData.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No customer data available. Sync orders first.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Orders</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lifetime Value</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Order</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">First Order</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Order</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {clvData.map((customer, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{idx + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {customer.customer_email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {customer.total_orders}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                        ${customer.lifetime_value.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        ${customer.avg_order_value.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(customer.first_order).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(customer.last_order).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
