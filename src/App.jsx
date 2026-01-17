import { useState, useEffect } from 'react';
import ProductQuiz from './components/ProductQuiz';
import RecommendationResults from './components/RecommendationResults';
import SubscriptionDashboard from './components/SubscriptionDashboard';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import OrderManagement from './components/OrderManagement';
import CustomerManagement from './components/CustomerManagement';
import ImageImporter from './components/ImageImporter';

function ImageGallery({ sku, productName }) {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch(`http://localhost:3001/api/products/${sku}/images`)
      .then(res => res.json())
      .then(data => setImages(data))
      .catch(err => console.error('Error fetching images:', err));
  }, [sku]);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (images.length === 0) {
    return (
      <div className="w-full h-80 bg-gray-200 flex items-center justify-center">
        <span className="text-gray-400">No images</span>
      </div>
    );
  }

  return (
    <div className="relative">
      <img 
        src={`http://localhost:3001${images[currentIndex]}`}
        alt={`${productName} - Image ${currentIndex + 1}`}
        className="w-full h-80 object-contain bg-white"
      />
      
      {images.length > 1 && (
        <>
          <button 
            onClick={prevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white w-8 h-8 rounded-full hover:bg-black/70"
          >
            ‹
          </button>
          <button 
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white w-8 h-8 rounded-full hover:bg-black/70"
          >
            ›
          </button>
          
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full ${idx === currentIndex ? 'bg-white' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </>
      )}
      
      {images.length > 1 && (
        <div className="flex gap-1 mt-2 overflow-x-auto p-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`flex-shrink-0 w-16 h-16 rounded border-2 ${idx === currentIndex ? 'border-blue-500' : 'border-transparent'}`}
            >
              <img 
                src={`http://localhost:3001${img}`}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover rounded"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('products');
  const [quizData, setQuizData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setLoading(false);
      });
  }, []);

  const handleQuizComplete = (data) => {
    setQuizData(data);
    setView('recommendations');
  };

  const handleQuizRestart = () => {
    setQuizData(null);
    setView('quiz');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/logo.svg" alt="Success Chemistry" className="h-12" />
            </div>
            <nav className="flex gap-2 flex-wrap">
              <button
                onClick={() => setView('products')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  view === 'products' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Shop
              </button>
              <button
                onClick={() => setView('quiz')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  view === 'quiz' || view === 'recommendations' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Quiz
              </button>
              <button
                onClick={() => setView('subscriptions')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  view === 'subscriptions' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Subscriptions
              </button>
              <div className="border-l border-gray-300 mx-2"></div>
              <button
                onClick={() => setView('analytics')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  view === 'analytics' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Analytics
              </button>
              <button
                onClick={() => setView('orders')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  view === 'orders' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Orders
              </button>
              <button
                onClick={() => setView('customers')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  view === 'customers' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Customers
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {view === 'quiz' && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Find Your Perfect Supplement Stack</h2>
              <p className="text-gray-600">Answer a few questions to get personalized recommendations</p>
            </div>
            <ProductQuiz onComplete={handleQuizComplete} />
          </div>
        )}

        {view === 'recommendations' && quizData && (
          <RecommendationResults quizData={quizData} onRestart={handleQuizRestart} />
        )}

        {view === 'subscriptions' && (
          <SubscriptionDashboard />
        )}

        {view === 'analytics' && (
          <AnalyticsDashboard />
        )}

        {view === 'orders' && (
          <OrderManagement />
        )}

        {view === 'customers' && (
          <CustomerManagement />
        )}

        {view === 'products' && (
          <>
            <div className="mb-6">
              <ImageImporter />
            </div>

            <div className="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold mb-2">Not sure where to start?</h2>
              <p className="mb-4">Take our quick quiz to find supplements tailored to your health goals</p>
              <button
                onClick={() => setView('quiz')}
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Take the Quiz →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <ImageGallery sku={product.sku} productName={product.name} />
                  <div className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 line-clamp-2">{product.name}</h2>
                    <p className="text-2xl font-bold text-blue-600 mt-2">${product.price}</p>
                    <p className="text-gray-600 mt-2 text-sm line-clamp-3">{product.short_description}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-gray-500">SKU: {product.sku}</span>
                      <span className="text-sm font-medium text-green-600">
                        {product.stock === -1 ? 'In Stock' : `${product.stock} in stock`}
                      </span>
                    </div>
                    <button className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {products.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products available yet.</p>
              </div>
            )}
          </>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <img src="/logo.svg" alt="Success Chemistry" className="h-10 mb-4" />
              <p className="text-gray-600 text-sm">
                We prioritize Purity by using a COLD-PRESS LLE extraction process, designed to maintain the highest quality of our ingredients.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Shop Categories</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-blue-600">Best Sellers</a></li>
                <li><a href="#" className="hover:text-blue-600">New Arrivals</a></li>
                <li><a href="#" className="hover:text-blue-600">Men's Health</a></li>
                <li><a href="#" className="hover:text-blue-600">Women's Health</a></li>
                <li><a href="#" className="hover:text-blue-600">Immune Support</a></li>
                <li><a href="#" className="hover:text-blue-600">Weight Management</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-blue-600">About Us</a></li>
                <li><a href="#" className="hover:text-blue-600">Our Approach</a></li>
                <li><a href="#" className="hover:text-blue-600">Quality Testing</a></li>
                <li><a href="#" className="hover:text-blue-600">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Why People Trust Us</h3>
              <p className="text-sm text-gray-600 mb-4">
                3rd party safety testing with both Eurofins and NSF ensuring the reliability of dietary supplements.
              </p>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-8">
            <div className="flex justify-center items-center gap-6 mb-6">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-xs font-semibold text-gray-700 text-center">GMO<br/>FREE</span>
              </div>
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-xs font-semibold text-gray-700 text-center">ISO<br/>9001</span>
              </div>
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-500 via-white to-blue-500">
                  <span className="text-xs font-semibold text-gray-700">USA</span>
                </div>
              </div>
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-xs font-semibold text-gray-700 text-center">GMP<br/>Certified</span>
              </div>
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-xs font-semibold text-gray-700 text-center">FDA<br/>Registered</span>
              </div>
            </div>
            
            <div className="text-center text-sm text-gray-600">
              <p>🧪 Copyright {new Date().getFullYear()} - Success Chemistry® | Powered by Astra</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
