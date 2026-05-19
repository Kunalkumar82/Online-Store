import { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, CheckCircle, XCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');
            const { data } = await axios.get('http://localhost:5000/api/orders', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(data || []);
        } catch (error) {
            toast.error('Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const token = localStorage.getItem('adminToken');
            await axios.put(`http://localhost:5000/api/orders/${id}/status`, 
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success(`Order marked as ${newStatus}`);
            fetchOrders();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update order status');
        }
    };

    const getStatusStyle = (status) => {
        switch(status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Approved': return 'bg-blue-100 text-blue-800';
            case 'Completed': return 'bg-green-100 text-green-800';
            case 'Rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        switch(status) {
            case 'Pending': return <Clock className="w-3 h-3 mr-1" />;
            case 'Approved': return <CheckCircle className="w-3 h-3 mr-1" />;
            case 'Completed': return <Package className="w-3 h-3 mr-1" />;
            case 'Rejected': return <XCircle className="w-3 h-3 mr-1" />;
            default: return null;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">Wholesale Order Requests</h2>
                <div className="bg-primary-50 px-4 py-2 rounded-lg border border-primary-100">
                    <span className="text-primary-700 font-semibold">{orders.length} Total Requests</span>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-10 flex justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div></div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                                    <th className="px-6 py-4 font-medium">Order details</th>
                                    <th className="px-6 py-4 font-medium">Customer Info</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {orders.length === 0 ? (
                                    <tr><td colSpan="4" className="px-6 py-10 text-center text-gray-500">No wholesale orders found.</td></tr>
                                ) : (
                                    orders.map((order) => (
                                        <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-start gap-4">
                                                    {/* Image */}
                                                    <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200 shadow-sm">
                                                        {order.productId?.images?.[0] ? (
                                                            <img src={`http://localhost:5000${order.productId.images[0]}`} className="w-full h-full object-cover" alt="" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                                <Package className="w-6 h-6" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    
                                                    {/* Details */}
                                                    <div>
                                                        <div className="font-semibold text-gray-900 text-base">{order.productName}</div>
                                                        <div className="text-sm text-gray-500 font-mono mt-0.5">Order ID: {order.orderId}</div>
                                                        
                                                        <div className="mt-2 flex flex-wrap gap-2 text-xs">
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded font-bold bg-primary-100 text-primary-800">
                                                                Qty: {order.quantity}
                                                            </span>
                                                            {order.productId && (
                                                                <>
                                                                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                                                                        {order.productId.category}
                                                                    </span>
                                                                    {order.productId.price && (
                                                                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-green-50 text-green-700 font-medium">
                                                                           ₹{order.productId.price.toLocaleString('en-IN')}
                                                                        </span>
                                                                    )}
                                                                </>
                                                            )}
                                                        </div>

                                                        {/* Optional Idol Specs */}
                                                        {order.productId && (order.productId.material || order.productId.size) && (
                                                            <div className="mt-1 text-xs text-gray-500">
                                                                {order.productId.material && <span className="mr-2">Material: {order.productId.material}</span>}
                                                                {order.productId.size && <span>Size: {order.productId.size}</span>}
                                                            </div>
                                                        )}

                                                        <div className="text-xs text-gray-400 font-mono mt-1" title="MongoDB Product ID">
                                                            Ref: {order.productId?._id || order.productId}
                                                        </div>
                                                        
                                                        {order.message && (
                                                            <p className="mt-2 text-xs text-gray-600 italic border-l-2 border-gray-300 pl-2">"{order.message}"</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <div className="font-medium text-gray-900">{order.buyerName}</div>
                                                <div className="text-gray-600">{order.phone}</div>
                                                <div className="text-gray-500">{order.city}</div>
                                                <div className="text-xs text-gray-400 mt-1">{new Date(order.createdAt).toLocaleDateString()}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusStyle(order.status)}`}>
                                                    {getStatusIcon(order.status)}
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <select 
                                                    value={order.status}
                                                    onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                                    className="pl-3 pr-8 py-1.5 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Approved">Approved</option>
                                                    <option value="Completed">Completed</option>
                                                    <option value="Rejected">Rejected</option>
                                                </select>
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

export default OrderList;
