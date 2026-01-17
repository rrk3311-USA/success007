import { useState, useEffect } from 'react';

export default function SubscriptionDashboard() {
  const [email, setEmail] = useState('');
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/api/subscriptions/customer/${encodeURIComponent(email)}`);
      const data = await response.json();
      setSubscriptions(data);
      setIsLoggedIn(true);
      localStorage.setItem('customer_email', email);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async (id) => {
    if (!confirm('Are you sure you want to cancel this subscription?')) return;
    
    try {
      await fetch(`http://localhost:3001/api/subscriptions/${id}`, {
        method: 'DELETE'
      });
      setSubscriptions(subscriptions.filter(sub => sub.id !== id));
    } catch (error) {
      console.error('Error canceling subscription:', error);
    }
  };

  const handleUpdateFrequency = async (id, newFrequency) => {
    try {
      await fetch(`http://localhost:3001/api/subscriptions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ frequency: newFrequency })
      });
      
      setSubscriptions(subscriptions.map(sub => 
        sub.id === id ? { ...sub, frequency: newFrequency } : sub
      ));
    } catch (error) {
      console.error('Error updating subscription:', error);
    }
  };

  const handleLogout = () => {
    setEmail('');
    setSubscriptions([]);
    setIsLoggedIn(false);
    localStorage.removeItem('customer_email');
  };

  useEffect(() => {
    const savedEmail = localStorage.getItem('customer_email');
    if (savedEmail) {
      setEmail(savedEmail);
      handleLogin({ preventDefault: () => {} });
    }
  }, []);

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Manage Your Subscriptions</h2>
          <form onSubmit={handleLogin}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
            >
              {loading ? 'Loading...' : 'View My Subscriptions'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Subscriptions</h2>
          <p className="text-gray-600">{email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="text-gray-600 hover:text-gray-900"
        >
          Logout
        </button>
      </div>

      {subscriptions.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600 mb-4">You don't have any active subscriptions yet.</p>
          <button
            onClick={() => window.location.href = '/'}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Browse Products →
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {subscriptions.map((sub) => (
            <div key={sub.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start gap-4">
                <img
                  src={sub.image_url || 'https://via.placeholder.com/100'}
                  alt={sub.product_name}
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{sub.product_name}</h3>
                  <p className="text-sm text-gray-600 mb-2">SKU: {sub.sku}</p>
                  
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-lg font-bold text-blue-600">${sub.price}/bottle</span>
                    <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                      Save 15%
                    </span>
                  </div>

                  <div className="flex items-center gap-4 mb-3">
                    <label className="text-sm text-gray-600">Delivery:</label>
                    <select
                      value={sub.frequency}
                      onChange={(e) => handleUpdateFrequency(sub.id, e.target.value)}
                      className="text-sm border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="weekly">Every Week</option>
                      <option value="monthly">Every Month</option>
                      <option value="bimonthly">Every 2 Months</option>
                    </select>
                  </div>

                  <div className="text-sm text-gray-600 mb-3">
                    Next delivery: {new Date(sub.next_billing_date).toLocaleDateString()}
                  </div>

                  <button
                    onClick={() => handleCancelSubscription(sub.id)}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Cancel Subscription
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-2">Subscription Benefits</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>✓ Save 15% on every order</li>
          <li>✓ Free shipping on all subscription orders</li>
          <li>✓ Never run out of your essentials</li>
          <li>✓ Pause, skip, or cancel anytime</li>
          <li>✓ Flexible delivery schedule</li>
        </ul>
      </div>
    </div>
  );
}
