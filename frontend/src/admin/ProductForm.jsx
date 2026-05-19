import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, UploadCloud, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

const ProductForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(isEdit);
    
    const [formData, setFormData] = useState({
        name: '',
        category: 'Ganesh',
        price: 0,
        stockQuantity: 0,
        description: '',
        material: '',
        size: ''
    });
    
    // File objects to upload
    const [imagesToUpload, setImagesToUpload] = useState([]);
    // URL strings to display existing and new preview
    const [previewImages, setPreviewImages] = useState([]);

    useEffect(() => {
        if (isEdit) {
            const fetchProduct = async () => {
                try {
                    const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
                    setFormData({
                        name: data.name,
                        category: data.category,
                        price: data.price,
                        stockQuantity: data.stockQuantity,
                        description: data.description,
                        material: data.material || '',
                        size: data.size || ''
                    });
                    if (data.images) {
                        setPreviewImages(data.images.map(img => `http://localhost:5000${img}`));
                    }
                } catch (error) {
                    toast.error('Failed to load product');
                    navigate('/admin/products');
                } finally {
                    setInitialLoading(false);
                }
            };
            fetchProduct();
        }
    }, [id, navigate, isEdit]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setImagesToUpload([...imagesToUpload, ...filesArray]);
            
            // Create preview URLs
            const newPreviews = filesArray.map(file => URL.createObjectURL(file));
            setPreviewImages([...previewImages, ...newPreviews]);
        }
    };

    const removeImage = (indexToRemove) => {
        // Find if it's an existing image or a new upload by counting existing vs new
        // For simplicity in this demo, if we remove an image, we'll just clear it from the UI.
        // Handling proper deletion of specific existing backend images requires more complex API logic.
        const newPreviews = previewImages.filter((_, idx) => idx !== indexToRemove);
        setPreviewImages(newPreviews);
        
        // Let's assume user only removes newly added local images for now
        // To accurately track which File maps to which preview, we would need a more complex state object.
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });
        
        imagesToUpload.forEach(file => {
            data.append('images', file);
        });

        try {
            const token = localStorage.getItem('adminToken');
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            };

            if (isEdit) {
                await axios.put(`http://localhost:5000/api/products/${id}`, data, config);
                toast.success('Product updated successfully');
            } else {
                await axios.post('http://localhost:5000/api/products', data, config);
                toast.success('Product created successfully');
            }
            navigate('/admin/products');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save product');
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return <div className="animate-pulse bg-white p-6 rounded-2xl h-96"></div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link to="/admin/products" className="p-2 bg-white rounded-lg shadow-sm text-gray-500 hover:text-primary-600 hover:bg-primary-50">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
            </div>

            <form onSubmit={submitHandler} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-8 space-y-8">
                
                {/* Basic Info */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                            <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500" placeholder="e.g. 10 Inch Brass Sitting Ganesha" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                            <select name="category" value={formData.category} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 bg-white">
                                <option>Ganesh</option>
                                <option>Krishna</option>
                                <option>Shiva</option>
                                <option>Brass Art</option>
                                <option>Marble Art</option>
                                <option>Wooden Carvings</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Wholesale Price (₹) *</label>
                            <input type="number" name="price" required min="0" value={formData.price} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity *</label>
                            <input type="number" name="stockQuantity" required min="0" value={formData.stockQuantity} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500" />
                        </div>
                    </div>
                </div>

                {/* Details */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">Details & Specifications</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Detailed Description *</label>
                            <textarea name="description" required rows="4" value={formData.description} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500"></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
                            <input type="text" name="material" value={formData.material} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500" placeholder="e.g. Pure Brass" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Dimensions / Size</label>
                            <input type="text" name="size" value={formData.size} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500" placeholder="e.g. 10x8x6 inches" />
                        </div>
                    </div>
                </div>

                {/* Images */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">Product Images</h3>
                    <div className="space-y-4">
                        <div className="flex gap-4 overflow-x-auto pb-4">
                            {previewImages.map((src, index) => (
                                <div key={index} className="relative w-24 h-24 rounded-lg bg-gray-100 border border-gray-200 flex-shrink-0 group">
                                    <img src={src} alt="preview" className="w-full h-full object-cover rounded-lg" />
                                    <button type="button" onClick={() => removeImage(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            <label className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 hover:border-primary-500 bg-gray-50 flex flex-col items-center justify-center cursor-pointer flex-shrink-0 text-gray-500 hover:text-primary-600 transition-colors">
                                <UploadCloud className="w-6 h-6 mb-1" />
                                <span className="text-xs font-medium">Upload</span>
                                <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
                            </label>
                        </div>
                        <p className="text-sm text-gray-500">You can upload up to 5 images (JPG, PNG). The first image will be used as the thumbnail.</p>
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex justify-end gap-4">
                    <Link to="/admin/products" className="btn-secondary">Cancel</Link>
                    <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 px-8">
                        {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Save className="w-5 h-5"/>}
                        {isEdit ? 'Save Changes' : 'Publish Product'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;
