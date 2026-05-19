const Product = require('../models/Product');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        const query = {};
        
        // Search functionality
        if (req.query.search) {
            query.$or = [
                { name: { $regex: req.query.search, $options: 'i' } },
                { productId: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        // Filter by category
        if (req.query.category) {
            query.category = req.query.category;
        }

        // Sorting
        let sortObj = { createdAt: -1 }; // default: newest first
        if (req.query.sort === 'price_asc') {
            sortObj = { price: 1 };
        } else if (req.query.sort === 'price_desc') {
            sortObj = { price: -1 };
        }

        const products = await Product.find(query).sort(sortObj);
        
        res.json({
            count: products.length,
            products
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Fetch single product by ID or custom productId
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    try {
        let product;
        if (req.params.id.startsWith('PRD-')) {
            product = await Product.findOne({ productId: req.params.id });
        } else {
            product = await Product.findById(req.params.id);
        }

        if (product) {
            // Increment views for trending feature
            product.views = (product.views || 0) + 1;
            await product.save();
            
            res.json(product);
        } else {
            res.status(404);
            throw new Error('Product not found');
        }
    } catch (error) {
        res.status(404).json({ message: 'Product not found' });
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
    try {
        const { name, category, price, stockQuantity, description, material, size } = req.body;
        
        // Handle images if uploaded
        let images = [];
        if (req.files && req.files.length > 0) {
            images = req.files.map(file => `/uploads/${file.filename}`);
        }

        // Generate Custom Product ID
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
        const generatedId = `PRD-${dateStr}-${randomStr}`;

        const product = new Product({
            productId: generatedId,
            name,
            category,
            price,
            stockQuantity,
            description,
            material,
            size,
            images
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
    try {
        const { name, category, price, stockQuantity, description, material, size } = req.body;

        const product = await Product.findById(req.params.id);

        if (product) {
            product.name = name || product.name;
            product.category = category || product.category;
            product.price = price !== undefined ? price : product.price;
            product.stockQuantity = stockQuantity !== undefined ? stockQuantity : product.stockQuantity;
            product.description = description || product.description;
            product.material = material || product.material;
            product.size = size || product.size;

            // Handle new images upload (append or replace depending on logic)
            // For now, let's append new images to existing ones.
            if (req.files && req.files.length > 0) {
                const newImages = req.files.map(file => `/uploads/${file.filename}`);
                product.images = [...product.images, ...newImages];
            }

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404);
            throw new Error('Product not found');
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            await Product.deleteOne({ _id: product._id });
            res.json({ message: 'Product removed' });
        } else {
            res.status(404);
            throw new Error('Product not found');
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// --- FEATURE 1: RECOMMENDATIONS ---

// @desc    Get similar products based on category
// @route   GET /api/products/recommendations/:category
// @access  Public
const getRecommendations = async (req, res) => {
    try {
        const { category } = req.params;
        // Optionally exclude current product by passing ?exclude=id
        const excludeId = req.query.exclude;
        
        const query = { category: category };
        if (excludeId) {
            query._id = { $ne: excludeId };
        }

        // Limit to 4 for the UI
        const products = await Product.find(query).limit(4);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get trending products based on views or stock movement
// @route   GET /api/products/trending
// @access  Public
const getTrendingProducts = async (req, res) => {
    try {
        // Sort by views descending, limit to 4
        const products = await Product.find({}).sort({ views: -1 }).limit(4);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get recently added products
// @route   GET /api/products/recent
// @access  Public
const getRecentProducts = async (req, res) => {
    try {
        // Sort by createdAt descending, limit to 4
        const products = await Product.find({}).sort({ createdAt: -1 }).limit(4);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getRecommendations,
    getTrendingProducts,
    getRecentProducts
};
