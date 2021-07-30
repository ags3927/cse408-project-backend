const mongoose = require('mongoose');

const validate = require('../validate');


const Schema = mongoose.Schema;

const trendDestSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    image: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: validate.validateURL
        }
    },
    type: {
        type: String,
        required: true,
        enum: ['COUNTRY', 'CITY', 'AREA']
    }
});


const TrendDest = new mongoose.model('TrendDest', trendDestSchema);

module.exports = { TrendDest };
