const Product = require('../models/Product');

// @desc    Get overall inventory statistics
// @route   GET /api/inventory/stats
// @access  Private/Admin
const getInventoryStats = async (req, res) => {
    try {
        const products = await Product.find({});
        
        const totalProducts = products.length;
        const totalStock = products.reduce((acc, p) => acc + p.stockQuantity, 0);
        const totalValue = products.reduce((acc, p) => acc + (p.price * p.stockQuantity), 0);
        const lowStockCount = products.filter(p => p.stockQuantity > 0 && p.stockQuantity < 5).length;
        const outOfStockCount = products.filter(p => p.stockQuantity === 0).length;

        res.json({
            totalProducts,
            totalStock,
            totalValue,
            lowStockCount,
            outOfStockCount
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get products with low stock (< 5)
// @route   GET /api/inventory/low-stock
// @access  Private/Admin
const getLowStockProducts = async (req, res) => {
    try {
        // Find products where stock is less than 5
        const lowStockProducts = await Product.find({ stockQuantity: { $lt: 5 } }).sort({ stockQuantity: 1 });
        res.json(lowStockProducts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getInventoryStats,
    getLowStockProducts
};
