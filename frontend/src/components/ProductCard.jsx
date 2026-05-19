import { Link } from 'react-router-dom';
import { ShoppingCart, Eye } from 'lucide-react';

const ProductCard = ({ product }) => {
  // Placeholder image if product doesn't have one
  const imageUrl = product.images && product.images.length > 0 
    ? `http://localhost:5000${product.images[0]}` 
    : 'https://images.unsplash.com/photo-1600188769045-bc6026bfc8ce?auto=format&fit=crop&q=80&w=400&h=400';

  return (
    <div className="card group flex flex-col h-full bg-white relative">
      {/* Stock badge */}
      {product.stockQuantity < 10 && product.stockQuantity > 0 && (
        <div className="absolute top-2 left-2 z-10 bg-orange-100 text-orange-800 text-xs font-bold px-2 py-1 rounded">
          Low Stock
        </div>
      )}
      {product.stockQuantity === 0 && (
        <div className="absolute top-2 left-2 z-10 bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded">
          Out of Stock
        </div>
      )}

      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img 
          src={imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
          <Link to={`/products/${product._id}`} className="bg-white text-gray-900 p-3 rounded-full hover:bg-primary-600 hover:text-white transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300">
            <Eye className="w-5 h-5" />
          </Link>
          <button className="bg-white text-gray-900 p-3 rounded-full hover:bg-primary-600 hover:text-white transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75">
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="text-xs text-primary-600 font-semibold mb-1 uppercase tracking-wider">{product.category}</div>
        <Link to={`/products/${product._id}`}>
          <h3 className="text-lg font-bold text-gray-900 hover:text-primary-600 line-clamp-1 transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-gray-500 mt-1 mb-4">ID: {product.productId}</p>
        
        <div className="mt-auto flex justify-between items-center">
          <span className="text-xl font-extrabold text-gray-900">₹{product.price.toLocaleString('en-IN')}</span>
          <span className="text-sm font-medium text-gray-500">
            {product.material && <span className="mr-2 px-2 py-1 bg-gray-100 rounded text-xs">{product.material}</span>}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
