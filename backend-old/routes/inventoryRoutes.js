const express = require('express');
const router = express.Router();
const { getInventoryStats, getLowStockProducts } = require('../controllers/inventoryController');
const { protect } = require('../middleware/auth');

// Protected Admin Routes
router.route('/stats').get(protect, getInventoryStats);
router.route('/low-stock').get(protect, getLowStockProducts);

module.exports = router;
