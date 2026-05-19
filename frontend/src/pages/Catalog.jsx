import { useState, useEffect } from 'react';
import axios from 'axios';
import { Filter, Search, ChevronDown } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('newest');
  
  const categories = ['All', 'Ganesh', 'Krishna', 'Shiva', 'Brass Art', 'Marble Art'];

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let query = `?sort=${sort}`;
      if (category && category !== 'All') query += `&category=${category}`;
      if (searchTerm) query += `&search=${searchTerm}`;
      
      const { data } = await axios.get(`http://localhost:5000/api/products${query}`);
      setProducts(data.products || []);
    } catch (error) {
      toast.error('Failed to load products');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 500); // 500ms debounce for search

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, category, sort]);

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-6 justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Wholesale Catalog</h1>
            <p className="text-gray-500 mt-1">Browse our premium collection of religious murtis.</p>
          </div>
          
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
              <Search className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
            </div>
            
            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full sm:w-48 appearance-none pl-4 pr-10 py-2.5 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium text-gray-700 cursor-pointer"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
              <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Filter className="w-5 h-5 text-primary-600" /> Filters
                </h3>
                {category !== 'All' && (
                  <button onClick={() => setCategory('All')} className="text-xs text-primary-600 hover:text-primary-700 font-medium">Clear</button>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 uppercase tracking-wide text-sm">Categories</h4>
                  <ul className="space-y-2">
                    {categories.map((c) => (
                      <li key={c}>
                        <button
                          onClick={() => setCategory(c === 'All' ? '' : c)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                            (category === c || (!category && c === 'All'))
                              ? 'bg-primary-50 text-primary-700 font-semibold border-l-4 border-primary-600'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                        >
                          {c}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1 w-full">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                 {[...Array(6)].map((_, i) => (
                   <div key={i} className="bg-white rounded-xl h-[400px] animate-pulse border border-gray-100 p-4">
                     <div className="bg-gray-200 h-64 rounded-lg mb-4"></div>
                     <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                     <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                     <div className="flex justify-between">
                       <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                       <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                     </div>
                   </div>
                 ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-gray-100 text-center flex flex-col items-center justify-center h-64">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">No products found</h3>
                <p className="text-gray-500 mt-2">Try adjusting your filters or search term.</p>
                <button 
                  onClick={() => { setSearchTerm(''); setCategory(''); }}
                  className="mt-6 text-primary-600 hover:text-primary-700 font-semibold"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div>
                <div className="mb-4 text-sm text-gray-500">
                  Showing <span className="font-semibold text-gray-900">{products.length}</span> results
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Catalog;
