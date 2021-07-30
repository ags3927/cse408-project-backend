const mongoose = require('mongoose');
const validate = require('../validate');

const Schema = mongoose.Schema;

const userDetailSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 1
    },
    verified: {
        type: Boolean,
        default: false,
        required: true
    },

    wallet: {
        bluxCredit:{
            type: Number,
            default: 0
        },
        usageHistory:[{
            paymentType:{
                type: String,
                enum: ['STRIPE', 'BCREDIT', 'BKASH', 'ROCKET', 'NAGAD']
            },
            paymentAmount:{
                type: Number,
            },
            details: {
                type: String,
                trim: true,
                minlength: 1
            },
            timestamp:{
                type: Date,
                required: true
            }
        }]
    },
    image: {
        type: String,
        validate: {
            validator: validate.validateURL
        }
    },
    name: {
        firstName: {
            type: String,
            required: true,
            trim: true,
            minlength: 1
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
            minlength: 1
        }
    },
    gender: {
        type: String,
        enum: ['MALE', 'FEMALE', 'OTHER'],
        required: true
    },
    birthDate: {
        type: Date,
        required: true,
        validate: {
            validator: validate.validateAge
        }
    },
    contacts: {
        email: {
            type: String,
            unique: true,
            required: true,
            trim: true,
            validate: {
                validator: validate.validateEmail
            }
        },
        phone: {
            type: String,
            required: true,
            trim: true,
            validate: {
                validator: validate.validatePhone
            }
        },
        address: {
            country: {
                type: String,
                required: true
            },
            city: {
                type: String,
                required: true
            },
            area: {
                type: String,
                required: true
            },
            zipCode: {
                type: String,
                required: true
            },
            streetAddress: {
                type: String,
                required: true
            }
        },
        emergencyContact: {
            name: {
                type: String,
                required: true,
                trim: true,
                minlength: 1
            },
            email: {
                type: String,
                required: true,
                trim: true,
                validate: {
                    validator: validate.validateEmail
                }
            },
            relationship: {
                type: String,
                required: true
            },
            phone: {
                type: String,
                required: true,
                trim: true,
                validate: {
                    validator: validate.validatePhone
                }
            }
        }
    },
    notification: [{
        _id: false,
        message: {
            type: String,
            required: true,
            minlength: 1
        },
        time: {
            type: Date,
            required: true
        },
        unread: {
            type: Boolean,
            required: true,
            default: true
        }
    }],
    govtID: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true
    },
    properties: [{
        _id: false,
        propertyID: {
            type: String,
            required: true
        }
    }],
    wantsAdvancePayment:{
        type: Boolean,
        default: false,
    },
    favorites: [{
        type: String,
        required: true,
        trim: true,
        minlength: 1
    }],
    blockServices: {
        status: {
            type: Boolean,
            required: true,
            default: false
        },
        until: {
            type: Date,
            default: null
        }
    },
    userLanguage: [{
        type: String,
        enum: [
            'English',
            'French',
            'German',
            'Japanese',
            'Italian',
            'Russian',
            'Spanish',
            'Chinese (Simplified)',
            'Arabic',
            'Hindi',
            'Portuguese',
            'Turkish',
            'Indonesian',
            'Dutch',
            'Korean',
            'Bengali',
            'Punjabi',
            'Sign',
            'Hebrew',
            'Polish',
            'Malay',
            'Tagalog',
            'Danish',
            'Swedish'
        ]
    }],
    paymentOptions: {
        directDeposit: {
            accountNumber: {
                type: String
            }
        },
        creditCard: {
            cardHolderName: {
                type: String
            },
            cardNumber: {
                type: String
            }
        }
    }
});

const UserDetail = new mongoose.model('UserDetail', userDetailSchema);

module.exports = {UserDetail};
