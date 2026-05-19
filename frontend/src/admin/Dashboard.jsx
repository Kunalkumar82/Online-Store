import { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, AlertCircle, ShoppingBag, TrendingUp, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalProducts: 0,
        lowStockCount: 0,
        outOfStockCount: 0,
        totalValue: 0,
        totalStock: 0
    });
    const [recentProducts, setRecentProducts] = useState([]);
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                };

                const [statsRes, recentRes, lowStockRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/inventory/stats', config),
                    axios.get('http://localhost:5000/api/products?sort=newest&limit=5'),
                    axios.get('http://localhost:5000/api/inventory/low-stock', config)
                ]);

                setStats(statsRes.data);
                setRecentProducts(recentRes.data.products || []);
                setLowStockProducts(lowStockRes.data || []);
            } catch (error) {
                toast.error('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return <div className="animate-pulse bg-white p-6 rounded-lg shadow-sm h-64"></div>;
    }

    return (
        <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-14 h-14 bg-indigo-50 rounded-full flex items-center justify-center flex-shrink-0">
                        <Package className="w-7 h-7 text-indigo-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 text-transform uppercase tracking-wider">Total Products</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                        <Package className="w-7 h-7 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 text-transform uppercase tracking-wider">Total Stock</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.totalStock}</p>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100 flex items-center gap-4">
                    <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center flex-shrink-0">
                        <AlertCircle className="w-7 h-7 text-orange-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 text-transform uppercase tracking-wider">Low Stock</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.lowStockCount}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-red-100 flex items-center gap-4">
                    <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center flex-shrink-0">
                        <ShoppingBag className="w-7 h-7 text-red-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 text-transform uppercase tracking-wider">Out of Stock</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.outOfStockCount}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-green-100 flex items-center gap-4">
                    <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="w-7 h-7 text-green-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 text-transform uppercase tracking-wider">Inventory Value</p>
                        <p className="text-2xl font-bold text-gray-900">₹{stats.totalValue.toLocaleString('en-IN')}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                {/* LOW STOCK TABLE WIDGET */}
                <div className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden">
                    <div className="px-6 py-5 border-b border-orange-100 bg-orange-50 flex items-center gap-2">
                        <AlertTriangle className="text-orange-600 w-5 h-5"/>
                        <h3 className="text-lg font-bold text-orange-900">Low Stock Alerts</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-orange-50/50 text-orange-800 text-xs uppercase tracking-wider">
                                    <th className="px-6 py-4 font-medium">Product</th>
                                    <th className="px-6 py-4 font-medium">Stock Left</th>
                                    <th className="px-6 py-4 font-medium text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-orange-100">
                                {lowStockProducts.length === 0 ? (
                                    <tr><td colSpan="3" className="px-6 py-8 text-center text-gray-500">Inventory levels are healthy.</td></tr>
                                ) : (
                                    lowStockProducts.map((product) => (
                                        <tr key={product._id} className="hover:bg-orange-50/30 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${product.stockQuantity === 0 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                                                    {product.stockQuantity}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link to={`/admin/products/edit/${product._id}`} className="text-primary-600 hover:text-primary-800 text-sm font-medium hover:underline">Restock</Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Recent Products Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900">Recently Added Products</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                                    <th className="px-6 py-4 font-medium">Product</th>
                                    <th className="px-6 py-4 font-medium">Price</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {recentProducts.map((product) => (
                                    <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100">
                                                    {product.images?.[0] ? (
                                                        <img src={`http://localhost:5000${product.images[0]}`} alt="" className="w-full h-full object-cover"/>
                                                    ) : (
                                                        <div className="w-full h-full bg-gray-200"></div>
                                                    )}
                                                </div>
                                                <span className="font-semibold text-gray-900">{product.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            ₹{product.price.toLocaleString('en-IN')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
