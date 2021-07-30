const { Property } = require('../models/property')

const insertProperty = async (propertyObject) => {
    try {
        let property = new Property(propertyObject);
        let data = await property.save();

        if (data.nInserted === 0) {
            return {
                message: 'Property Insertion Failed',
                status: 'ERROR'
            };
        } else {
            return {
                message: 'Property Insertion Successful',
                status: 'OK',
                data
            };
        }
    } catch (e) {
        return {
            message: e.message,
            status: 'ERROR'
        }
    }
};

const deleteProperty = async (propertyID) => {
    try {
        let data = await Property.findOneAndDelete({ _id: propertyID });

        if (data) {
            return {
                message: 'Property Removed Successfully',
                status: 'OK'
            }
        } else {
            return {
                message: 'Could not Find Property',
                status: 'ERROR'
            }
        }
    } catch (e) {
        return {
            message: e.message,
            status: 'ERROR'
        }
    }
};

//helper function

const findPropertyByQuery = async (query, option) => {
    try {
        let data = await Property.findOne(query, option);

        if (data) {
            return {
                data,
                message: 'Property Found',
                status: 'OK'
            }
        } else {
            return {
                data: null,
                message: 'Property Not Found',
                status: 'ERROR'
            }
        }

    } catch (e) {
        return {
            data: null,
            message: e.message,
            status: 'ERROR'
        }
    }
};

//helper function

const findPropertiesByQuery = async (query, option) => {
    try {
        let data = await Property.find(query, option);
        let message;

        if (data.length > 0) {
            message = 'Properties Found';
        } else {
            message = 'Properties Not Found';
        }

        return {
            data,
            message,
            status: 'OK'
        }

    } catch (e) {
        return {
            data: null,
            message: e.message,
            status: 'ERROR'
        }
    }
};

const findPropertyByID = async (propertyID) => {
    try {
        return await findPropertyByQuery({ _id: propertyID }, {});
    } catch (e) {
        return {
            data: null,
            message: e.message,
            status: 'ERROR'
        };
    }
};

const findPropertiesByFilter = async (filter) => {
    try {
        return await findPropertiesByQuery(filter, {});
    } catch (e) {
        return {
            data: null,
            message: e.message,
            status: 'ERROR'
        };
    }
}

const findAllProperties = async () => {
    try {
        let data = await Property.find().sort({ isApproved: -1 });
        let message;

        if (data.length > 0) {
            message = 'Properties Found';
        } else {
            message = 'Properties Not Found';
        }

        return {
            data,
            message,
            status: 'OK'
        }

    } catch (e) {
        return {
            data: null,
            message: e.message,
            status: 'ERROR'
        }
    }
};

const findPropertyByIDAndUpdate = async (propertyID, propertyUpdate) => {
    try {
        let propertyData = await findPropertyByID(propertyID);

        if (propertyData.status === 'ERROR') {
            return {
                message: propertyData.message,
                status: propertyData.status
            }
        }

        let property = propertyData.data;

        if (propertyUpdate.title) property.title = propertyUpdate.title;
        if (propertyUpdate.description) property.description = propertyUpdate.description;
        if (typeof propertyUpdate.isFeatured === 'boolean') property.isFeatured = propertyUpdate.isFeatured;
        if (typeof propertyUpdate.isApproved === 'boolean') property.isApproved = propertyUpdate.isApproved;
        if (propertyUpdate.location) {
            if (propertyUpdate.location.coordinates) {
                if (propertyUpdate.location.coordinates.lng) property.location.coordinates.lng = propertyUpdate.location.coordinates.lng;
                if (propertyUpdate.location.coordinates.lat) property.location.coordinates.lat = propertyUpdate.location.coordinates.lat;
            }
            if (propertyUpdate.location.country) property.location.country = propertyUpdate.location.country;
            if (propertyUpdate.location.area) property.location.area = propertyUpdate.location.area;
            if (propertyUpdate.location.city) property.location.city = propertyUpdate.location.city;
            if (propertyUpdate.location.zipCode) property.location.zipCode = propertyUpdate.location.zipCode;
            if (propertyUpdate.location.aptSuite) property.location.aptSuite = propertyUpdate.location.aptSuite;
            if (propertyUpdate.location.streetAddress) property.location.streetAddress = propertyUpdate.location.streetAddress;
        }

        if (propertyUpdate.ownerLanguage) property.ownerLanguage = propertyUpdate.ownerLanguage;
        if (propertyUpdate.typeOfProperty) property.typeOfProperty = propertyUpdate.typeOfProperty;

        if (propertyUpdate.guestAccess) property.guestAccess = propertyUpdate.guestAccess;

        if (propertyUpdate.accommodationCapacity) {
            if (propertyUpdate.accommodationCapacity.adults) property.accommodationCapacity.adults = propertyUpdate.accommodationCapacity.adults;
            if (propertyUpdate.accommodationCapacity.children) property.accommodationCapacity.children = propertyUpdate.accommodationCapacity.children;
            if (propertyUpdate.accommodationCapacity.infants) property.accommodationCapacity.infants = propertyUpdate.accommodationCapacity.infants;
        }

        if (propertyUpdate.accommodationServices) {
            if (propertyUpdate.accommodationServices.bedroom) {
                if (propertyUpdate.accommodationServices.bedroom.count) property.accommodationServices.bedroom.count = propertyUpdate.accommodationServices.bedroom.count;
                if (propertyUpdate.accommodationServices.bedroom.bedCount) property.accommodationServices.bedroom.bedCount = propertyUpdate.accommodationServices.bedroom.bedCount;
            }
            if (propertyUpdate.accommodationServices.bathroom) {
                if (propertyUpdate.accommodationServices.bathroom.count) property.accommodationServices.bathroom.count = propertyUpdate.accommodationServices.bathroom.count;
                if (propertyUpdate.accommodationServices.bathroom.isPrivate) property.accommodationServices.bathroom.isPrivate = propertyUpdate.accommodationServices.bathroom.isPrivate;
            }
            if (propertyUpdate.accommodationServices.amenities) property.accommodationServices.amenities = propertyUpdate.accommodationServices.amenities;
            if (propertyUpdate.accommodationServices.guestAccessibleSpaces) property.accommodationServices.guestAccessibleSpaces = propertyUpdate.accommodationServices.guestAccessibleSpaces;
        }

        if (propertyUpdate.price) {
            if (propertyUpdate.price.basePrice) property.price.basePrice = propertyUpdate.price.basePrice;
            if (propertyUpdate.price.discountPercentage) property.price.discountPercentage = propertyUpdate.price.discountPercentage;
            if (propertyUpdate.price.discountDuration) property.price.discountDuration = propertyUpdate.price.discountDuration;
        }

        if (propertyUpdate.stayTimeInNights) {
            if (propertyUpdate.stayTimeInNights.min) property.stayTimeInNights.min = propertyUpdate.stayTimeInNights.min;
            if (propertyUpdate.stayTimeInNights.max) property.stayTimeInNights.max = propertyUpdate.stayTimeInNights.max;
        }

        if (propertyUpdate.arrivalNoticeInDays) property.arrivalNoticeInDays = propertyUpdate.arrivalNoticeInDays;

        if (propertyUpdate.checkInTime) {
            if (propertyUpdate.checkInTime.from) property.checkInTime.from = propertyUpdate.checkInTime.from;
            if (propertyUpdate.checkInTime.to) property.checkInTime.to = propertyUpdate.checkInTime.to;
        }

        if (propertyUpdate.rulesForGuests) property.rulesForGuests = propertyUpdate.rulesForGuests;

        if (propertyUpdate.detailsForGuests) property.detailsForGuests = propertyUpdate.detailsForGuests;

        if (propertyUpdate.guestRequirements) {
            if (propertyUpdate.guestRequirements.mandatory) property.guestRequirements.mandatory = propertyUpdate.guestRequirements.mandatory;
            if (propertyUpdate.guestRequirements.beforeBooking) property.guestRequirements.beforeBooking = propertyUpdate.guestRequirements.beforeBooking;
            if (propertyUpdate.guestRequirements.additional) property.guestRequirements.additional = propertyUpdate.guestRequirements.additional;
        }

        if (propertyUpdate.imagesOfProperty) property.imagesOfProperty = propertyUpdate.imagesOfProperty;


        let data = await property.save();
        // console.log(data);

        return {
            message: 'Property Updated Successfully',
            status: 'OK'
        }

    } catch (e) {
        return {
            message: e.message,
            status: 'ERROR'
        }
    }
}

const sampleProperties = async (propertyType) => {
    try {
        let data = await Property.aggregate(
            [
                { $match: { typeOfProperty: propertyType } },
                { $sample: { size: 3 } }
            ]
        );
        let message;

        if (data.length > 0) {
            message = 'Properties Found';
        } else {
            message = 'Properties Not Found';
        }

        return {
            data,
            message,
            status: 'OK'
        }

    } catch (e) {
        return {
            data: null,
            message: e.message,
            status: 'ERROR'
        }
    }
}

const findPropertiesByOwnerID = async (ownerID) => {
    try {
        return await findPropertiesByQuery({ ownerID }, {});
    } catch (e) {
        return {
            data: null,
            message: e.message,
            status: 'ERROR'
        }
    }
}

module.exports = {
    insertProperty,
    deleteProperty,
    findPropertyByID,
    findPropertiesByFilter,
    findAllProperties,
    findPropertyByIDAndUpdate,
    findPropertiesByQuery,
    sampleProperties,
    findPropertiesByOwnerID
}