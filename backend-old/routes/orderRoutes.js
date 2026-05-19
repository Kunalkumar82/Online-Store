const express = require('express');
const router = express.Router();
const { createOrder, getOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

// Public route to submit wholesale orders
router.route('/').post(createOrder);

// Protected routes to manage orders
router.route('/').get(protect, getOrders);
router.route('/:id/status').put(protect, updateOrderStatus);

module.exports = router;
