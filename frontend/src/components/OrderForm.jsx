import { useState } from 'react';
import axios from 'axios';
import { Package, Send, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const OrderForm = ({ product, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        quantity: 1,
        buyerName: '',
        phone: '',
        city: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const orderData = {
                ...formData,
                productId: product._id,
                productName: product.name
            };

            const response = await axios.post('http://localhost:5000/api/orders', orderData);
            toast.success(`Request Submitted! Your Order ID is: ${response.data.orderId}`, { duration: 6000 });
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit request');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="px-6 py-4 bg-primary-900 text-white flex items-center justify-between">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <Package className="w-5 h-5" /> Request Wholesale Order
                    </h3>
                    <button onClick={onClose} className="p-1 hover:bg-primary-800 rounded-md transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="bg-primary-50 p-4 rounded-lg flex gap-4 text-primary-900 mb-6 border border-primary-100">
                        <div className="w-16 h-16 rounded overflow-hidden bg-white flex-shrink-0">
                           {product.images?.[0] ? (
                               <img src={`http://localhost:5000${product.images[0]}`} className="w-full h-full object-cover" alt="" />
                           ) : (
                               <div className="w-full h-full bg-gray-200"></div>
                           )}
                        </div>
                        <div>
                            <p className="font-semibold">{product.name}</p>
                            <p className="text-xs text-primary-700 font-mono mb-1">Product ID: {product.productId}</p>
                            <p className="text-sm opacity-80">Wholesale Price: ₹{product.price.toLocaleString('en-IN')} / unit</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity Needed *</label>
                            <input type="number" name="quantity" min="1" required value={formData.quantity} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500" />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Company / Your Name *</label>
                            <input type="text" name="buyerName" required value={formData.buyerName} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500" />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                            <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500" />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">City / Location *</label>
                            <input type="text" name="city" required value={formData.city} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500" />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Additional Message</label>
                            <textarea name="message" rows="3" value={formData.message} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500" placeholder="e.g. Need quick delivery, specific packaging..."></textarea>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button type="button" onClick={onClose} className="btn-secondary flex-1 py-3">Cancel</button>
                        <button type="submit" disabled={loading} className="btn-primary flex-1 py-3 flex justify-center items-center gap-2">
                             {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Send className="w-5 h-5" />}
                             Submit Request
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OrderForm;
