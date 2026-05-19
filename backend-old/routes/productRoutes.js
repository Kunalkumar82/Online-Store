const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getRecommendations,
    getTrendingProducts,
    getRecentProducts
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.route('/trending').get(getTrendingProducts);
router.route('/recent').get(getRecentProducts);
router.route('/recommendations/:category').get(getRecommendations);
router.route('/').get(getProducts);
router.route('/:id').get(getProductById);

// Protected Admin routes
router.route('/').post(protect, upload.array('images', 5), createProduct);
router.route('/:id').put(protect, upload.array('images', 5), updateProduct);
router.route('/:id').delete(protect, deleteProduct);

module.exports = router;
