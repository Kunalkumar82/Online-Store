import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, ArrowLeft, Check, Package, Ruler, Info, Sparkles, TrendingUp, Clock, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import ProductCard from '../components/ProductCard';
import OrderForm from '../components/OrderForm';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  
  // Recommendation States
  const [similarProducts, setSimilarProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);

  // Modal State
  const [showOrderModal, setShowOrderModal] = useState(false);

  useEffect(() => {
    const fetchProductAndRecommendations = async () => {
      try {
        setLoading(true);
        // 1. Fetch main product
        const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(data);
        if (data.images && data.images.length > 0) {
          setActiveImage(data.images[0]);
        }
        
        // 2. Fetch recommendations in parallel
        const [similarRes, trendingRes, recentRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/products/recommendations/${data.category}?exclude=${data._id}`),
          axios.get(`http://localhost:5000/api/products/trending`),
          axios.get(`http://localhost:5000/api/products/recent`)
        ]);

        setSimilarProducts(similarRes.data);
        setTrendingProducts(trendingRes.data);
        setRecentProducts(recentRes.data);

      } catch (error) {
        toast.error('Product not found or error loading recommendations');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    fetchProductAndRecommendations();
  }, [id, navigate]);

  const handleInquiry = () => {
    toast.success('Added to your wholesale inquiry list!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 animate-pulse">
         <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="h-96 bg-gray-200 rounded-xl"></div>
            <div className="space-y-6">
              <div className="h-10 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="h-32 bg-gray-200 rounded w-full"></div>
              <div className="h-12 bg-gray-200 rounded w-full mt-6"></div>
            </div>
         </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="mb-6 flex flex-wrap items-center text-sm text-gray-500 gap-2">
          <Link to="/" className="hover:text-primary-600">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-primary-600">Catalog</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{product.name}</span>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Image Gallery */}
            <div className="p-8 lg:border-r border-gray-100 bg-white flex flex-col items-center">
              <div className="w-full aspect-square bg-gray-50 rounded-2xl overflow-hidden mb-4 border border-gray-100 p-2 shadow-inner">
                 <img 
                   src={activeImage ? `http://localhost:5000${activeImage}` : 'https://images.unsplash.com/photo-1600188769045-bc6026bfc8ce?auto=format&fit=crop&q=80&w=800&h=800'} 
                   alt={product.name} 
                   className="w-full h-full object-contain rounded-xl hover:scale-110 transition-transform duration-700 cursor-zoom-in"
                 />
              </div>
              
              {product.images && product.images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto w-full pb-2">
                  {product.images.map((img, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={`w-20 h-20 rounded-lg flex-shrink-0 border-2 overflow-hidden ${activeImage === img ? 'border-primary-600' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    >
                      <img src={`http://localhost:5000${img}`} className="w-full h-full object-cover" alt={`view ${idx}`} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <div className="mb-2 flex items-center gap-3">
                <span className="bg-primary-50 text-primary-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  {product.category}
                </span>
                <span className="text-gray-400 text-sm flex items-center">
                  <Package className="w-4 h-4 mr-1"/> ID: {product.productId}
                </span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">{product.name}</h1>
              
              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-4xl font-black text-gray-900">₹{product.price.toLocaleString('en-IN')}</span>
                <span className="text-gray-500 font-medium">per unit (wholesale)</span>
              </div>

              <div className="space-y-4 mb-8">
                {product.stockQuantity > 0 ? (
                  <div className="flex items-center text-green-700 bg-green-50 w-max px-3 py-1.5 rounded text-sm font-semibold">
                    <Check className="w-4 h-4 mr-2" /> In Stock ({product.stockQuantity} available)
                  </div>
                ) : (
                  <div className="text-red-600 font-semibold bg-red-50 w-max px-3 py-1.5 rounded text-sm">Out of Stock</div>
                )}
              </div>

              <div className="prose prose-sm text-gray-600 mb-8 border-t border-b border-gray-100 py-6">
                <h3 className="text-gray-900 font-semibold mb-2 flex items-center"><Info className="w-4 h-4 mr-2"/> Description</h3>
                <p>{product.description}</p>
              </div>

              {/* Specifications */}
              <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-8">
                {product.material && (
                  <div>
                    <span className="block text-sm text-gray-500">Material</span>
                    <span className="font-semibold text-gray-900">{product.material}</span>
                  </div>
                )}
                {product.size && (
                  <div>
                    <span className="block text-sm text-gray-500">Dimensions/Size</span>
                    <span className="font-semibold text-gray-900 flex items-center">
                       <Ruler className="w-4 h-4 mr-1 text-gray-400"/> {product.size}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-auto pt-6 flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => setShowOrderModal(true)}
                  disabled={product.stockQuantity === 0}
                  className="btn-primary flex-1 py-4 text-lg font-bold flex justify-center items-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <FileText className="w-5 h-5" /> Request Wholesale Order
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --- SMART RECOMMENDATION SECTIONS --- */}
        <div className="mt-20 space-y-20">
            
            {/* Similar Idols */}
            {similarProducts.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-200">
                   <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600">
                      <Sparkles className="w-5 h-5" />
                   </div>
                   <h2 className="text-3xl font-extrabold text-gray-900">Similar {product.category} Idols</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {similarProducts.map(p => (
                       <ProductCard key={p._id} product={p} />
                    ))}
                </div>
              </section>
            )}

            {/* Trending Idols */}
            {trendingProducts.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-200">
                   <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600">
                      <TrendingUp className="w-5 h-5" />
                   </div>
                   <h2 className="text-3xl font-extrabold text-gray-900">Trending Now</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {trendingProducts.map(p => (
                       <ProductCard key={p._id} product={p} />
                    ))}
                </div>
              </section>
            )}

            {/* Recently Added */}
            {recentProducts.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-200">
                   <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                      <Clock className="w-5 h-5" />
                   </div>
                   <h2 className="text-3xl font-extrabold text-gray-900">Recently Added</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {recentProducts.map(p => (
                       <ProductCard key={p._id} product={p} />
                    ))}
                </div>
              </section>
            )}

        </div>

      </div>

      {/* Render Wholesale Order Modal */}
      {showOrderModal && (
        <OrderForm product={product} onClose={() => setShowOrderModal(false)} />
      )}

    </div>
  );
};

export default ProductDetail;
