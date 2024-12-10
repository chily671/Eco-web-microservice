const mongoose = require('mongoose');

// Sechema for Creating Products
const RatingSchema = new mongoose.Schema({
    product_id: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    review: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Rating', RatingSchema);