import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Edit2, Trash2, Plus, Search, TrendingUp, Package } from 'lucide-react';
import toast from 'react-hot-toast';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`http://localhost:5000/api/products?search=${searchTerm}`);
            setProducts(data.products || []);
        } catch (error) {
            toast.error('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delay = setTimeout(() => fetchProducts(), 500);
        return () => clearTimeout(delay);
    }, [searchTerm]);

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const token = localStorage.getItem('adminToken');
                await axios.delete(`http://localhost:5000/api/products/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Product deleted successfully');
                fetchProducts();
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to delete product');
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="relative w-full sm:w-96">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                </div>
                <Link to="/admin/products/new" className="btn-primary flex items-center gap-2 whitespace-nowrap">
                    <Plus className="w-5 h-5" /> Add New Product
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-10 flex justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div></div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                                    <th className="px-6 py-4 font-medium text-gray-700">Idol Details & Image</th>
                                    <th className="px-6 py-4 font-medium text-gray-700">Specs / Category</th>
                                    <th className="px-6 py-4 font-medium text-gray-700">Pricing & Views</th>
                                    <th className="px-6 py-4 font-medium text-gray-700">Inventory Status</th>
                                    <th className="px-6 py-4 font-medium text-right text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {products.length === 0 ? (
                                    <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-500">No products found.</td></tr>
                                ) : (
                                    products.map((product) => (
                                        <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-start gap-4">
                                                    <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden shadow-sm flex-shrink-0 border border-gray-200">
                                                        {product.images?.[0] ? (
                                                            <img src={`http://localhost:5000${product.images[0]}`} alt={product.name} className="w-full h-full object-cover"/>
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                                <Package className="w-6 h-6" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-900 text-base">{product.name}</div>
                                                        <div className="text-xs text-primary-700 font-mono mt-0.5 bg-primary-50 inline-block px-1.5 py-0.5 rounded" title="Custom Product ID">ID: {product.productId}</div>
                                                        <div className="text-[10px] text-gray-400 font-mono mt-1" title="MongoDB ID">DB Ref: {product._id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-bold text-gray-800 bg-gray-100 w-max px-2 py-0.5 rounded">{product.category}</div>
                                                {product.material && <div className="text-xs text-gray-500 mt-2 font-medium">Mat: {product.material}</div>}
                                                {product.size && <div className="text-xs text-gray-500 font-medium">Size: {product.size}</div>}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-base font-black text-green-700">₹{product.price.toLocaleString('en-IN')}</div>
                                                <div className="text-xs text-gray-500 mt-2 flex items-center gap-1 font-medium bg-amber-50 text-amber-700 w-max px-2 py-0.5 rounded-full">
                                                    <TrendingUp className="w-3 h-3" /> {product.views || 0} views
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1.5 text-xs font-bold rounded-md border inline-flex items-center gap-1.5 ${
                                                    product.stockQuantity === 0 ? 'bg-red-50 text-red-700 border-red-200 shadow-sm' :
                                                    product.stockQuantity < 10 ? 'bg-orange-50 text-orange-700 border-orange-200 shadow-sm' : 'bg-green-50 text-green-700 border-green-200 shadow-sm'
                                                }`}>
                                                    <span className={`w-2 h-2 rounded-full ${
                                                        product.stockQuantity === 0 ? 'bg-red-500 animate-pulse' :
                                                        product.stockQuantity < 10 ? 'bg-orange-500' : 'bg-green-500'
                                                    }`}></span>
                                                    {product.stockQuantity} In Stock
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end gap-3">
                                                    <Link to={`/admin/products/edit/${product._id}`} className="text-primary-600 hover:text-primary-900 bg-primary-50 p-2 rounded-md">
                                                        <Edit2 className="w-4 h-4" />
                                                    </Link>
                                                    <button onClick={() => deleteHandler(product._id)} className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-md">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductList;
