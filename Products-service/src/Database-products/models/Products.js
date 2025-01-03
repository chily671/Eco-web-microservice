const mongoose = require('mongoose');

// Sechema for Creating Products
const ProductSchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    model: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    sex: {
        type: String,
        required: true,
    },
    size: {
        type: String,
        required: true,
    },
    year: {
        type: String,
        required: true,
    },
    rating: { 
        type: Number,
        default: 0 
    },
    revwes: {
        type: Object,
        default: {Text:"No Reviews"}
    },
    poppuarity: {
        type: Number,
        default: 0,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    available: {
        type: Boolean,
        default: true,
    },
}, {timestamps: true});

module.exports = mongoose.model('product', ProductSchema, "watches");