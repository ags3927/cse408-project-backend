const mongoose = require('mongoose');
const validate = require('../validate');

const Schema = mongoose.Schema;

const reservationSchema = new Schema({
    guestID: {
        type: String,
        required: true
    },
    propertyID: {
        type: String,
        required: true
    },
    checkIn: {
        type: Date,
        required: true
    },
    checkOut: {
        type: Date,
        required: true
    },
    reservationDate: {
        type: Date,
        required: true,
        default: new Date()
    },
    status: {
        type: String,
        enum: ['APPROVED','PENDING','CANCELED'],
        default: 'PENDING',
        required: true
    },
    paymentDetails: {
        status: {
            type: String,
            enum: ['PAID', 'UNPAID']
        },
        pType: {
            type: String,
            enum: ['STRIPE', 'MFS', 'BCREDIT']
        },
        vendor: {
            type: String,
            enum: ['NA', 'BKASH', 'NAGAD', 'ROCKET']
        },
        amount:{
            type: Number,
            default: 0
        },
        transactionID:{
            type: String
        },
        timestamp: {
            type: Date
        }
    },
    conversation: [{
        message: {
            type: String,
            required: true,
            trim: true,
            minlength: 1
        },
        time: {
            type: Date,
            required: true
        },
    }]
});

reservationSchema.pre('save', function (next) {
    validate.validateBooking(this.checkIn, this.checkOut);
    next();
});

const Reservation = new mongoose.model('Reservation', reservationSchema);

module.exports = { Reservation };