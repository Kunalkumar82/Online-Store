const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
    {
        productId: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            default: 0,
        },
        stockQuantity: {
            type: Number,
            required: true,
            default: 0,
        },
        description: {
            type: String,
            required: true,
        },
        material: {
            type: String,
        },
        size: {
            type: String,
        },
        images: [
            {
                type: String, // Store image URLs or paths
            }
        ],
        views: {
            type: Number,
            default: 0,
        }
    },
    {
        timestamps: true,
    }
);

// Pre-save hook to generate unique productId if not provided
productSchema.pre('save', async function () {
    if (!this.productId) {
        // Simple generation logic: PRD-YYYYMMDD-Random
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
        this.productId = `PRD-${dateStr}-${randomStr}`;
    }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
