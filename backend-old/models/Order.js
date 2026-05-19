const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        orderId: {
            type: String,
            required: true,
            unique: true
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Product'
        },
        productName: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: [1, 'Quantity must be at least 1']
        },
        buyerName: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        message: {
            type: String
        },
        status: {
            type: String,
            required: true,
            enum: ['Pending', 'Approved', 'Rejected', 'Completed'],
            default: 'Pending'
        }
    },
    {
        timestamps: true
    }
);

// Generate unique order ID before saving
orderSchema.pre('validate', function(next) {
    if (this.isNew && !this.orderId) {
        const timestamp = Date.now().toString().slice(-6);
        const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
        this.orderId = `ORD-${timestamp}-${randomStr}`;
    }
    next();
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
