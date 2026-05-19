const express = require('express');
const router = express.Router();
const { authAdmin, registerAdmin } = require('../controllers/adminController');
const { protect } = require('../middleware/auth');

router.post('/login', authAdmin);
router.post('/register', registerAdmin); // Can be commented out in production

// Example of a protected admin profile route
router.get('/profile', protect, async (req, res) => {
    res.json(req.admin);
});

module.exports = router;
