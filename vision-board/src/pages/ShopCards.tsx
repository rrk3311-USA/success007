import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Star, Heart } from 'lucide-react'

export default function ShopCards() {
  const products = [
    {
      id: 1,
      name: 'Premium Wellness Bundle',
      price: '$149.99',
      originalPrice: '$199.99',
      rating: 4.8,
      reviews: 124,
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
      badge: 'Best Seller'
    },
    {
      id: 2,
      name: 'Luxury Skincare Set',
      price: '$89.99',
      originalPrice: '$129.99',
      rating: 4.9,
      reviews: 89,
      image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=300&fit=crop',
      badge: 'New'
    },
    {
      id: 3,
      name: 'Essential Oil Collection',
      price: '$64.99',
      originalPrice: '$89.99',
      rating: 4.7,
      reviews: 203,
      image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=300&fit=crop',
      badge: 'Sale'
    },
    {
      id: 4,
      name: 'Organic Tea Selection',
      price: '$39.99',
      originalPrice: '$49.99',
      rating: 4.6,
      reviews: 156,
      image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop',
      badge: 'Limited'
    },
    {
      id: 5,
      name: 'Aromatherapy Diffuser',
      price: '$79.99',
      originalPrice: '$99.99',
      rating: 4.8,
      reviews: 312,
      image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=300&fit=crop',
      badge: 'Popular'
    },
    {
      id: 6,
      name: 'Herbal Supplement Pack',
      price: '$54.99',
      originalPrice: '$69.99',
      rating: 4.9,
      reviews: 278,
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
      badge: 'Featured'
    }
  ]

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Mesh Gradient Background */}
      <div className="fixed inset-0 -z-10">
        {/* Base gradient layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20" />
        
        {/* Animated mesh gradient orbs */}
        <div className="absolute inset-0">
          <div className="mesh-gradient-orb orb-1" />
          <div className="mesh-gradient-orb orb-2" />
          <div className="mesh-gradient-orb orb-3" />
          <div className="mesh-gradient-orb orb-4" />
        </div>
        
        {/* Overlay gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Premium Collection
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover our curated selection of premium wellness products
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Card
              key={product.id}
              className="group relative overflow-hidden border-0 bg-white/10 backdrop-blur-xl shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 hover:scale-105"
            >
              {/* Card gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Badge */}
              <div className="absolute top-4 right-4 z-20">
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg">
                  {product.badge}
                </span>
              </div>

              {/* Wishlist button */}
              <button className="absolute top-4 left-4 z-20 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300 hover:scale-110">
                <Heart className="w-5 h-5 text-white" />
              </button>

              <CardHeader className="p-0 relative">
                <div className="relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-4 relative z-10">
                <div>
                  <CardTitle className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                    {product.name}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'fill-gray-600 text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-300">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>
                </div>

                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-bold text-white">{product.price}</span>
                  <span className="text-lg text-gray-400 line-through">{product.originalPrice}</span>
                </div>
              </CardContent>

              <CardFooter className="p-6 pt-0 relative z-10">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-6 shadow-lg hover:shadow-purple-500/50 transition-all duration-300 group/btn">
                  <ShoppingCart className="w-5 h-5 mr-2 group-hover/btn:scale-110 transition-transform" />
                  Add to Cart
                </Button>
              </CardFooter>

              {/* Shimmer effect */}
              <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
