const reviewInterface = require('../db/interfaces/reviewInterface');
const userDetailInterface = require('../db/interfaces/userDetailInterface');
const propertyInterface = require('../db/interfaces/propertyInterface');

//helper function
const findUserDetail = async (req, res) => {
    try {
        let username = res.locals.middlewareResponse.user.username;
        let userDetailData = await userDetailInterface.findUserDetailByQuery({ username }, {});

        if (userDetailData.status === 'OK') {
            return userDetailData.data;
        } else {
            return res.status(404).send({
                message: 'Could Not Find User',
                error: userDetailData.message
            });
        }

    } catch (e) {
        return res.status(500).send({
            message: 'Could Not Find User',
            error: e.message
        });
    }
}

//helper function
const buildReviewObject = (reviewObject, userDetailID) => {
    reviewObject.userID = userDetailID;
    reviewObject.date = new Date();
    return reviewObject;
}

//helper function
const addRating = async (res, userRating, property) => {
    try {
        let rating = property.rating.value;
        let rateCount = property.rating.timesRated;
        property.rating.value = Number((((rating * rateCount) + userRating) / (rateCount + 1)).toPrecision(2))
        property.rating.timesRated = rateCount + 1;
        await property.save();
    } catch (e) {
        return res.status(500).send({
            message: 'Could not Add Rating',
            error: e.message
        });
    }
}

//helper function
const removeRating = async (res, userRating, property) => {
    try {
        let rating = property.rating.value;
        let rateCount = property.rating.timesRated;
        property.rating.value = rateCount === 1 ? 0 : Number((((rating * rateCount) - userRating) / (rateCount - 1)).toPrecision(2))
        property.rating.timesRated = rateCount - 1;
        await property.save();
    } catch (e) {
        return res.status(500).send({
            message: 'Could not Remove Rating',
            error: e.message
        });
    }
}

//helper function
const checkAlreadyReviewed = async (userID, propertyID) => {
    try {
        let reviewData = await reviewInterface.findReviewByUserIDAndPropertyID(userID,propertyID);
        if (reviewData.status === 'ERROR') return false;
        else return true;
    } catch (e) {
        return res.status(500).send({
            message: 'Could not check if already reviewed',
            error: e.message
        });
    }
}

const handlePOSTReview = async (req, res) => {
    try {
        let userDetail = await findUserDetail(req, res);

        let alreadyReviewed = await checkAlreadyReviewed(userDetail._id,req.body.reviewObject.propertyID);

        if (alreadyReviewed){
            return res.status(400).send({
                message: 'You have already reviewed this property'
            });
        }

        let propertyData = await propertyInterface.findPropertyByID(req.body.reviewObject.propertyID);

        if (propertyData.status === 'ERROR'){
            return res.status(400).send({
                message: propertyData.message
            });
        }

        let property = propertyData.data;

        if (userDetail._id.toString() === property.ownerID.toString()) {
            return res.status(400).send({
                message: 'You cannot review your own property'
            });
        }

        let reviewObject = buildReviewObject(req.body.reviewObject, userDetail._id);

        let reviewData = await reviewInterface.insertReview(reviewObject);

        await addRating(res, reviewObject.rating, property);

        if (reviewData.status === 'OK') {
            return res.status(201).send({
                message: reviewData.message
            });
        } else {
            return res.status(400).send({
                message: 'Could not Insert Review',
                error: reviewData.message
            });
        }
    } catch (e) {
        return res.status(500).send({
            message: "ERROR in POST /api/review",
            error: e.message
        });
    }
}

const handleDELETEReview = async (req, res) => {
    try {
        let reviewData = await reviewInterface.deleteReview(req.body.reviewID);

        if (reviewData.status === 'OK') {
            let review = reviewData.data;
            let propertyData = await propertyInterface.findPropertyByID(review.propertyID);
            if (propertyData.status === 'ERROR'){
                return res.status(400).send({
                    message: 'Could not remove rating',
                    error: propertyData.message
                });
            }
            let property = propertyData.data;
            await removeRating(res, review.rating, property);
            return res.status(200).send({
                message: 'Review Removed Successfully'
            });
        } else {
            return res.status(400).send({
                message: 'Could not Remove Review',
                error: reviewData.message
            });
        }
    } catch (e) {
        return res.status(500).send({
            message: "ERROR in POST /api/review/delete",
            error: e.message
        });
    }
}

const handlePATCHReview = async (req, res) => {
    try {
        let oldReview;
        let property;

        let reviewData = await reviewInterface.findReviewByID(req.body.reviewUpdate._id);

        if (reviewData.status === 'ERROR') {
            return res.status(400).send({
                message: 'Could not Find Review',
                error: reviewData.message
            });
        }
        oldReview = reviewData.data;

        let reviewUpdateData = await reviewInterface.updateReview(req.body.reviewUpdate._id, req.body.reviewUpdate);

        if (reviewUpdateData.status === 'ERROR'){
            return res.status(400).send({
                message: 'Could not Update Review',
                error: reviewUpdateData.message
            });
        }

        if (oldReview.rating !== reviewData.rating) {
            let propertyData = await propertyInterface.findPropertyByID(oldReview.propertyID);
            if (propertyData.status === 'ERROR') {
                return res.status(400).send({
                    message: 'Could not Find Property',
                    error: propertyData.message
                });
            }
            property = propertyData.data;

            await removeRating(res, oldReview.rating, property);
            await addRating(res, req.body.reviewUpdate.rating, property);
        }

        return res.status(200).send({
            message: reviewUpdateData.message
        });
    } catch (e) {
        return res.status(500).send({
            message: "ERROR in POST /api/review/update",
            error: e.message
        });
    }
}

const handleGETReviewByID = async (req, res) => {
    try {
        let reviewData = await reviewInterface.findReviewByID(req.body.reviewID);
        if (reviewData.status === 'ERROR'){
            return res.status(400).send({
                message: 'Could not Find Review',
                error: reviewData.message
            });
        }
        let review = reviewData.data;
        let userDetailData = await userDetailInterface.findUserDetailByID(review.userID);
        if (userDetailData.status === 'ERROR'){
            return res.status(400).send({
                message: 'Could not Find UserDetail',
                error: userDetailData.message
            });
        }
        let userDetail = userDetailData.data;
        let formattedReview = {
            reviewObject: review,
            username: userDetail.name,
            userImage: userDetail.image
        }
        return res.status(200).send({
            review: formattedReview,
            message: 'Success'
        });

    } catch (e) {
        return res.status(500).send({
            message: "ERROR in POST /api/review/findbyid",
            error: e.message
        });
    }
}

module.exports = {
    handlePOSTReview,
    handleDELETEReview,
    handlePATCHReview,
    handleGETReviewByID
}