const Admin = require('../models/Admin');
const generateToken = require('../utils/generateToken');

// @desc    Auth admin & get token
// @route   POST /api/admin/login
// @access  Public
const authAdmin = async (req, res) => {
    try {
        const { username, password } = req.body;

        const admin = await Admin.findOne({ username });

        if (admin && (await admin.matchPassword(password))) {
            res.json({
                _id: admin._id,
                username: admin.username,
                token: generateToken(admin._id),
            });
        } else {
            res.status(401);
            throw new Error('Invalid username or password');
        }
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};

// @desc    Register a new admin (Used once manually or restricted)
// @route   POST /api/admin/register
// @access  Public (Can be restricted later)
const registerAdmin = async (req, res) => {
    try {
        const { username, password } = req.body;

        const adminExists = await Admin.findOne({ username });

        if (adminExists) {
            res.status(400);
            throw new Error('Admin already exists');
        }

        const admin = await Admin.create({
            username,
            password,
        });

        if (admin) {
            res.status(201).json({
                _id: admin._id,
                username: admin.username,
                token: generateToken(admin._id),
            });
        } else {
            res.status(400);
            throw new Error('Invalid admin data');
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { authAdmin, registerAdmin };
