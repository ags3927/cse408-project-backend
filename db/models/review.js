const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    userID: {
        type: String,
        required: true
    },
    propertyID: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    comment: {
        type: String,
        trim: true,
        minlength: 1
    },
    rating: {
        type: Number,
        min: 0,
        max: 5
    }
});

const Review = new mongoose.model('Review', reviewSchema);

module.exports = { Review };