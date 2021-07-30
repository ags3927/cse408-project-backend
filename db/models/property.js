const mongoose = require('mongoose');
const validate = require('../validate');

const Schema = mongoose.Schema;

const setDiscountExpiration = (priceObject) => {
    if (priceObject.discountDuration) {
        let today = new Date();
        priceObject.discountExpiration = new Date(today.setDate(today.getDate() + priceObject.discountDuration));
    }
}

const propertySchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    description: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    isFeatured: {
        type: Boolean,
        required: true,
        default: false
    },
    isApproved: {
        type: Boolean,
        required: true,
        default: false
    },
    location: {
        coordinates: {
            lng: {
                type: Number,
                required: true
            },
            lat: {
                type: Number,
                required: true
            }
        },
        country: {
            type: String,
            required: true,
            trim: true,
            minlength: 1
        },
        city: {
            type: String,
            required: true,
            trim: true,
            minlength: 1
        },
        area: {
            type: String,
            required: true,
            trim: true,
            minlength: 1
        },
        zipCode: {
            type: String,
            required: true,
            trim: true,
            minlength: 1
        },
        aptSuite: {
            type: String,
            required: true,
            trim: true,
            minlength: 1
        },
        streetAddress: {
            type: String,
            required: true,
            trim: true,
            minlength: 1
        }
    },
    ownerID: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    ownerLanguage: [{
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
    typeOfProperty: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    timesRented: {
        type: Number,
        default: 0,
        required: true
    },
    guestAccess: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    accommodationCapacity: {
        adults: {
            type: Number,
            required: true
        },
        children: {
            type: Number,
            required: true
        },
        infants: {
            type: Number,
            required: true
        }
    },
    accommodationServices: {
        bedroom: {
            count: {
                type: Number,
                required: true
            },
            bedCount: {
                type: Number,
                required: true
            }
        },
        bathroom: {
            count: {
                type: Number,
                required: true
            },
            isPrivate: {
                type: Boolean,
                required: true
            }
        },
        amenities: [{
            type: String,
            trim: true,
            minlength: 1
        }],
        guestAccessibleSpaces: [{
            type: String,
            trim: true,
            minlength: 1
        }]
    },
    rating: {
        value: {
            type: Number,
            default: 0,
            required: true
        },
        timesRated: {
            type: Number,
            default: 0,
            required: true
        }
    },
    price: {
        basePrice: {
            type: Number,
            required: true
        },
        discountPercentage: {
            type: Number,
            default: 0
        },
        discountDuration: {
            type: Number,
            default: 0
        },
        discountExpiration: {
            type: Date,
            default: null
        }
    },
    stayTimeInNights: {
        min: {
            type: Number,
            required: true
        },
        max: {
            type: Number,
            required: true
        }
    },
    arrivalNoticeInDays: {
        type: Number,
        required: true
    },
    checkInTime: {
        from: {
            type: String,
            required: true,
            trim: true,
            minlength: 1
        },
        to: {
            type: String,
            required: true,
            trim: true,
            minlength: 1
        }
    },
    rulesForGuests: [{
        type: String,
        trim: true,
        minlength: 1
    }],
    detailsForGuests: [{
        type: String,
        trim: true,
        minlength: 1
    }],
    guestRequirements: {
        mandatory: [{
            type: String,
            trim: true,
            minlength: 1
        }],
        beforeBooking: [{
            type: String,
            trim: true,
            minlength: 1
        }],
        additional: [{
            type: String,
            trim: true,
            minlength: 1
        }]
    },
    imagesOfProperty: [{
        type: String,
        validate: {
            validator: validate.validateURL
        }
    }]
});

propertySchema.pre('save', function (next) {
    validate.validateMinMax(this.stayTimeInNights);
    validate.validateCoords(this.location.coordinates);
    setDiscountExpiration(this.price);
    next();
});

const Property = new mongoose.model('Property', propertySchema);

module.exports = { Property };