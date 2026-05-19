const Order = require('../models/Order');

// @desc    Submit a new wholesale order request
// @route   POST /api/orders
// @access  Public
const createOrder = async (req, res) => {
    try {
        const { productId, productName, quantity, buyerName, phone, city, message } = req.body;

        const order = new Order({
            productId,
            productName,
            quantity,
            buyerName,
            phone,
            city,
            message
        });

        const savedOrder = await order.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all wholesale orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
    try {
        // Sort by newest requests first
        const orders = await Order.find({})
            .sort({ createdAt: -1 })
            .populate('productId', 'images category material size price');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        
        // Validate enum
        if (!['Pending', 'Approved', 'Rejected', 'Completed'].includes(status)) {
             return res.status(400).json({ message: 'Invalid status value' });
        }

        const order = await Order.findById(req.params.id);

        if (order) {
            order.status = status;
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createOrder,
    getOrders,
    updateOrderStatus
};
