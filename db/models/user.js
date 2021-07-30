const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const validate = require('../validate');


const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        minlength: 1
    },
    userEmail: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        validate: {
            validator: validate.validateEmail
        }
    },
    password: {
        type: String,
        required: true
    },
    lastUpdated: {
        type: Date,
        required: true,
        default: new Date()
    },
    userType: {
        type: String,
        enum: ['GENERAL', 'ADMIN'],
        required: true,
        default: 'GENERAL'
    },
    tokens: [{
        _id: false,
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }],
    resetToken: {
        type: String,
        default: null
    }
});

userSchema.pre('save', function (next) {
    let user = this;
    if (user.isModified('password')){
        bcrypt.genSalt(10, (err,salt) => {
            bcrypt.hash(user.password, salt,(err, hash) => {
                user.password = hash;
                user.lastUpdated = new Date();
                user.tokens = [];
                next();
            })
        })
    } else {
        next();
    }
});


const User = new mongoose.model('User', userSchema);

module.exports = { User };
