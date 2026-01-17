import { useState, useEffect } from 'react';

export default function RecommendationResults({ quizData, onRestart }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quizData)
      });
      const data = await response.json();
      setRecommendations(data.recommendations || []);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Analyzing your responses...</p>
      </div>
    );
  }

  const totalPrice = recommendations.reduce((sum, rec) => sum + parseFloat(rec.price), 0);
  const bundleDiscount = totalPrice * 0.1;
  const finalPrice = totalPrice - bundleDiscount;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8 mb-8">
        <h2 className="text-3xl font-bold mb-2">Your Personalized Supplement Stack</h2>
        <p className="text-blue-100">Based on your health goals and lifestyle</p>
      </div>

      {recommendations.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No specific recommendations found. Browse our full catalog!</p>
          <button
            onClick={onRestart}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retake Quiz
          </button>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {recommendations.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="flex">
                  <img 
                    src={product.image_url || 'https://via.placeholder.com/150'} 
                    alt={product.name}
                    className="w-32 h-32 object-cover"
                  />
                  <div className="p-4 flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.short_description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-blue-600">${product.price}</span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        {product.match_score}% Match
                      </span>
                    </div>
                  </div>
                </div>
                <div className="px-4 pb-4">
                  <div className="text-xs text-gray-500 mb-2">Why we recommend this:</div>
                  <div className="flex flex-wrap gap-1">
                    {product.matched_tags?.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-xl font-bold mb-4">Bundle & Save</h3>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({recommendations.length} products)</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-green-600 font-medium">
                <span>Bundle Discount (10%)</span>
                <span>-${bundleDiscount.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between text-xl font-bold">
                <span>Total</span>
                <span className="text-blue-600">${finalPrice.toFixed(2)}</span>
              </div>
            </div>
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium mb-3">
              Add Bundle to Cart
            </button>
            <button className="w-full border-2 border-blue-600 text-blue-600 py-3 rounded-lg hover:bg-blue-50 font-medium">
              Subscribe & Save 15%
            </button>
          </div>

          <div className="text-center">
            <button
              onClick={onRestart}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Retake Quiz
            </button>
          </div>
        </>
      )}
    </div>
  );
}
