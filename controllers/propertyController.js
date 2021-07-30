const fs = require('fs');
const _ = require('lodash');
const Moment = require('moment');
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);
const path = require('path');

const propertyInterface = require('../db/interfaces/propertyInterface');
const userDetailInterface = require('../db/interfaces/userDetailInterface');
const reservationInterface = require('../db/interfaces/reservationInterface');
const reviewInterface = require('../db/interfaces/reviewInterface');

const amenitiesPath = path.resolve(__dirname, '../databank/amenities.json')
const detailsPath = path.resolve(__dirname, '../databank/details.json')
const rulesPath = path.resolve(__dirname, '../databank/rules.json')

const sourceJSONAmenities = JSON.parse(fs.readFileSync(amenitiesPath, 'utf8'));
const sourceJSONDetails = JSON.parse(fs.readFileSync(detailsPath, 'utf8'));
const sourceJSONRules = JSON.parse(fs.readFileSync(rulesPath, 'utf8'));

//helper function
const stringArrayToJSONArray = (stringArray, sourceJSON) => {
    let JSONArray = [];
    let JSONObject
    for (const str of stringArray) {
        JSONObject = _.find(sourceJSON, (sourceJSONObject) => {
            if (sourceJSONObject.name === str) return true;
        });
        JSONArray.push(JSON.stringify(JSONObject));
    }
    return JSONArray;
}

//helper function
const setAttributesOfProperty = (property) => {
    property.accommodationServices.amenities = stringArrayToJSONArray(property.accommodationServices.amenities, sourceJSONAmenities);
    property.rulesForGuests = stringArrayToJSONArray(property.rulesForGuests, sourceJSONRules);
    property.detailsForGuests = stringArrayToJSONArray(property.detailsForGuests, sourceJSONDetails);
    return property;
}

//helper function
const setAttributesOfProperties = (properties) => {
    let propertyList = [];
    for (const property of properties) {
        propertyList.push(setAttributesOfProperty(property));
    }
    return propertyList;
}

//helper function
const findOwner = async (req, res) => {
    try {
        let username = res.locals.middlewareResponse.user.username;
        // console.log(username);
        let ownerData = await userDetailInterface.findUserDetailByQuery({username});
        // console.log(ownerData);
        if (ownerData.status === 'OK') {
            return ownerData.data;
        } else {
            return res.status(404).send({
                message: 'Could Not Find Owner',
                error: ownerData.message
            });
        }

    } catch (e) {
        return res.status(500).send({
            message: 'Could Not Find Owner',
            error: e.message
        });
    }
}

//helper function
const buildPropertyObject = (propertyObject, owner) => {
    propertyObject.ownerID = owner._id;
    propertyObject.ownerLanguage = owner.language;
    return propertyObject;
}

//helper function
const buildFilterQuery = (filterObject) => {

    let areaQuery = (filterObject.location.area === null) ? {} : {"location.area": filterObject.location.area};
    let cityQuery = (filterObject.location.city === null) ? {} : {"location.city": filterObject.location.city};
    let typeQuery = (filterObject.typeOfProperty.length === 0) ? {} : {"typeOfProperty": {$in: filterObject.typeOfProperty}};
    let adultsQuery = (filterObject.accommodationCapacity.adults === null) ? {} : {"accommodationCapacity.adults": {$gte: filterObject.accommodationCapacity.adults}};
    let childrenQuery = (filterObject.accommodationCapacity.children === null) ? {} : {"accommodationCapacity.children": {$gte: filterObject.accommodationCapacity.children}};
    let infantsQuery = (filterObject.accommodationCapacity.infants === null) ? {} : {"accommodationCapacity.infants": {$gte: filterObject.accommodationCapacity.infants}};
    let bedCountQuery = (filterObject.accommodationServices.bedroom.bedCount === null) ? {} : {"accommodationServices.bedroom.bedCount": {$gte: filterObject.accommodationServices.bedroom.bedCount}};
    let bedroomsQuery = (filterObject.accommodationServices.bedroom.count === null) ? {} : {"accommodationServices.bedroom.count": {$gte: filterObject.accommodationServices.bedroom.count}};
    let bathroomsQuery = (filterObject.accommodationServices.bathroom.count === null) ? {} : {"accommodationServices.bathroom.count": {$gte: filterObject.accommodationServices.bathroom.count}};
    let amenitiesQuery = (filterObject.accommodationServices.amenities.length === 0) ? {} : {"accommodationServices.amenities": {$all: filterObject.accommodationServices.amenities}};
    let featureQuery = (filterObject.isFeatured === null) ? {} : {isFeatured: filterObject.isFeatured};
    let languageQuery = (filterObject.ownerLanguage.length === 0) ? {} : {ownerLanguage: {$all: filterObject.ownerLanguage}};
    let approveQuery = {isApproved: true}


    return {
        $and: [
            areaQuery,
            cityQuery,
            typeQuery,
            adultsQuery,
            childrenQuery,
            infantsQuery,
            bedCountQuery,
            bedroomsQuery,
            bathroomsQuery,
            amenitiesQuery,
            featureQuery,
            languageQuery,
            approveQuery
        ]
    }

}

//helper function
const checkOverlap = async (properties, filterDate) => {
    try {
        let filteredProperties = [];
        let propertyIDs = _.map(properties, '_id');
        let reservations = [];

        for (const propertyID of propertyIDs) {
            let reservationData = await reservationInterface.findReservationsByQuery({propertyID});
            if(reservationData.data.length === 0) filteredProperties.push(await PropertyInterface.findPropertyByID(propertyID).data);
            reservations.push(reservationData.data);
        }

        reservations = await _.flatten(reservations);

        let filterDateRange = moment.range(new Date(filterDate.start), new Date(filterDate.end))
        let reservationDateRange;

        for (const reservation of reservations) {
            reservationDateRange = moment.range(new Date(reservation.checkIn), new Date(reservation.checkOut))
            let overlaps = reservationDateRange.overlaps(filterDateRange);

            if (overlaps) {
                reservations = await _.filter(reservations, (overlappingReservation) => {
                    return overlappingReservation.propertyID !== reservation.propertyID;
                })
            }
        }

        let filteredPropertyIDs = await _.map(reservations, 'propertyID');
        filteredPropertyIDs = [...new Set(filteredPropertyIDs)];
        

        for (const propertyID of filteredPropertyIDs) {
            let propertyData = await propertyInterface.findPropertyByID(propertyID);
            filteredProperties.push(propertyData.data);
        }

        let message = (filteredProperties.length > 0) ? 'Property Found' : 'Property Not Found';
        return {
            data: filteredProperties,
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

const handlePOSTProperty = async (req, res) => {
    try {
        let owner = await findOwner(req, res);
        let propertyObject = buildPropertyObject(req.body.propertyObject, owner);
        let propertyData = await propertyInterface.insertProperty(propertyObject);

        if (propertyData.status === 'OK') {

            let userDetailData = await userDetailInterface.addProperty(owner.username, propertyData.data._id);

            if (userDetailData.status === 'OK') {
                return res.status(201).send({
                    message: propertyData.message + ' and ' + userDetailData.message
                });
            } else {
                await propertyInterface.deleteProperty(propertyData.data._id);
                return res.status(400).send({
                    message: 'Could not Add Property to User',
                    error: userDetailData.message
                });
            }
        } else {
            console.log('propertyData.message = ' + propertyData.message);
            return res.status(400).send({
                message: 'Could not Insert Property',
                error: propertyData.message
            });
        }

    } catch (e) {
        console.log('exception = ' + e.message);
        return res.status(500).send({
            message: 'ERROR in POST /api/property/insert',
            error: e.message
        });
    }
}

const handleGETPropertiesByFilter = async (req, res) => {
    try {
        let filterQuery = buildFilterQuery(req.body.filterObject);
        console.log(filterQuery);
        let propertyData = await propertyInterface.findPropertiesByFilter(filterQuery);
        console.log(propertyData.data);

        if (propertyData.status === 'OK') {
            if (propertyData.data.length === 0) {
                return res.status(200).send({
                    message: 'Success',
                    properties: propertyData.data
                });
            } else {
                let uncheckedResult = propertyData;
                let checkedResult = (req.body.filterObject.date.start === null && req.body.filterObject.date.end === null) ? uncheckedResult : await checkOverlap(uncheckedResult.data, req.body.filterObject.date);
                let properties = setAttributesOfProperties(checkedResult.data);

                return res.status(200).send({
                    message: 'Success',
                    properties
                });
            }
        } else {
            return res.status(400).send({
                message: 'ERROR in GET /api/property/filtered',
                error: propertyData.message
            });
        }
    } catch (e) {
        return res.status(500).send({
            message: 'ERROR in GET /api/property/filtered',
            error: e.message
        });
    }
}

const handleGETPropertiesOfOwner = async (req, res) => {
    try {
        let owner = await findOwner(req, res);
        let propertyData = await propertyInterface.findPropertiesByOwnerID(owner._id);
        let properties = setAttributesOfProperties(propertyData.data);

        if (propertyData.status === 'OK') {
            return res.status(200).send({
                message: 'Success',
                properties
            });
        } else {
            return res.status(500).send({
                message: 'Could not Find Properties',
                error: propertyData.message
            });
        }

    } catch (e) {
        return res.status(500).send({
            message: 'ERROR in POST /api/property/viewbyowner',
            error: e.message
        });
    }
}

const handleGETPropertyByID = async (req, res) => {
    try {
        let propertyData = await propertyInterface.findPropertyByID(req.body.propertyID);
        let property = setAttributesOfProperty(propertyData.data);

        if (propertyData.status === 'OK') {
            return res.status(200).send({
                message: 'Success',
                property
            });
        } else {
            return res.status(404).send({
                message: 'Could not Find Property',
                error: propertyData.message
            });
        }

    } catch (e) {
        return res.status(500).send({
            message: 'ERROR in GET /api/property/viewbyid',
            error: e.message
        });
    }
}

const handleGETReservationDates = async (req, res) => {
    try {
        let reservationData = await reservationInterface.findReservationsByQuery({propertyID: req.body.propertyID});

        if (reservationData.status === 'OK') {
            let reservations = reservationData.data;
            let reservationDates = await _.map(reservations, (reservation) => {
                return {
                    start: reservation.checkIn,
                    end: reservation.checkOut
                }
            });

            return res.status(200).send({
                reservationDates,
                message: reservationData.message
            });
        } else {
            return res.status(500).send({
                message: 'ERROR in POST /api/property/reservations',
                error: reservationData.message
            });
        }

    } catch (e) {
        return res.status(500).send({
            message: "ERROR in GET /api/property/reservations",
            error: e.message
        });
    }
}

const handleDELETEProperty = async (req, res) => {
    try {
        let propertyData = await propertyInterface.deleteProperty(req.body.propertyID);

        if (propertyData.status === 'OK') {
            await reservationInterface.findReservationsByQueryAndDelete({propertyID: req.body.propertyID});
            await reviewInterface.findReviewsByQueryAndDelete({propertyID: req.body.propertyID});
            return res.status(200).send({
                message: 'Property Removed Successfully'
            });
        } else {
            return res.status(400).send({
                message: 'Could not Remove Property',
                error: propertyData.message
            });
        }
    } catch (e) {
        return res.status(500).send({
            message: "ERROR in POST /api/property/delete",
            error: e.message
        });
    }
}

const handlePATCHProperty = async (req, res) => {
    try {
        let propertyData = await propertyInterface.findPropertyByIDAndUpdate(req.body.propertyID, req.body.propertyObject);

        if (propertyData.status === 'ERROR') {
            return res.status(400).send({
                message: 'Could not Update Property',
                error: propertyData.message
            });
        }

        return res.status(200).send({
            message: 'Property Updated Successfully'
        });
    } catch (e) {
        return res.status(500).send({
            message: 'ERROR in POST /api/property/update',
            error: e.message
        });
    }
}

const handleGETFeaturedProperties = async (req, res) => {
    try {
        let propertyData = await propertyInterface.findPropertiesByQuery({isFeatured: true});
        let featuredProperties = setAttributesOfProperties(propertyData.data);

        if (propertyData.status === 'ERROR') {
            return res.status(400).send({
                message: 'Could not get featured properties',
                error: propertyData.message
            });
        }

        return res.status(200).send({
            message: 'Success',
            featuredProperties
        });
    } catch (e) {
        return res.status(500).send({
            message: 'ERROR in POST /api/property/featured',
            error: e.message
        });
    }
}

const handleGETAllProperties = async (req, res) => {
    try {
        let propertyData = await propertyInterface.findAllProperties();
        let properties = setAttributesOfProperties(propertyData.data);

        if (propertyData.status === 'ERROR') {
            return res.status(400).send({
                message: 'Could not get properties',
                error: propertyData.message
            });
        }

        return res.status(200).send({
            message: 'Success',
            properties
        });
    } catch (e) {
        return res.status(500).send({
            message: 'ERROR in POST /api/property/viewall',
            error: e.message
        });
    }
}

const handleSampleProperties = async (req, res) => {
    try {
        let propertyData = await propertyInterface.sampleProperties(req.body.typeOfProperty);
        let properties = setAttributesOfProperties(propertyData.data);

        if (propertyData.status === 'ERROR') {
            return res.status(400).send({
                message: 'Could not get properties',
                error: propertyData.message
            });
        }

        return res.status(200).send({
            message: 'Success',
            properties
        });
    } catch (e) {
        return res.status(500).send({
            message: 'ERROR in POST /api/property/sample',
            error: e.message
        });
    }
}

const handleGETReviews = async (req, res) => {
    try {
        let reviewData = await reviewInterface.findReviewsOfProperty(req.body.propertyID);
       
        if (reviewData.status === 'OK') {

            let reviews = reviewData.data;
            let formattedReviews = [];
            for (const review of reviews) {
                let userDetailData = await userDetailInterface.findUserDetailByID(review.userID);
            
                if (userDetailData.status === 'OK') {
                    let userDetail = userDetailData.data;
                    let formattedReview = {
                        reviewObject: review,
                        username: userDetail.username,
                        name: userDetail.name,
                        userImage: userDetail.image
                    }
                    formattedReviews.push(formattedReview);
                }
            }

            if(res.locals.middlewareResponse) {
                let currentUserDetail = await findOwner(req, res);

                for (let i = 0; i < formattedReviews.length; i++) {
                    if (formattedReviews[i].username.toString() === currentUserDetail.username.toString()) {
                        [formattedReviews[0], formattedReviews[i]] = [formattedReviews[i], formattedReviews[0]];
                        break;
                    }
                }
            }

            return res.status(200).send({
                message: 'Success',
                reviewList: formattedReviews
            });
        } else {
            return res.status(500).send({
                message: 'ERROR in POST /api/property/reviews',
                error: reviewData.message
            });
        }
    } catch (e) {
        return res.status(500).send({
            message: 'ERROR in POST /api/property/reviews',
            error: e.message
        });
    }
}

module.exports = {
    handlePOSTProperty,
    handleGETPropertiesByFilter,
    handleGETPropertiesOfOwner,
    handleGETPropertyByID,
    handleGETReservationDates,
    handleDELETEProperty,
    handlePATCHProperty,
    handleGETFeaturedProperties,
    handleGETAllProperties,
    handleSampleProperties,
    handleGETReviews
}