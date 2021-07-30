const { Review } = require('../models/review');

const insertReview = async (reviewObject) => {
    try {
        let review = new Review(reviewObject);
        let data = await review.save();

        if (data.nInserted === 0){
            return {
                message: 'Review Insertion Failed',
                status: 'ERROR'
            }
        } else {
            return {
                message: 'Review Insertion Successful',
                status: 'OK'
            };
        }
    } catch (e) {
        return {
            message: e.message,
            status: 'ERROR'
        }
    }
};

const deleteReview = async (reviewID) => {
    try {
        let data = await Review.findOneAndDelete({ _id: reviewID });

        if (data){
            return {
                data,
                message: 'Review Removed Successfully',
                status: 'OK'
            }
        } else {
            return {
                message: 'Could not Find Review',
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

const updateReview = async (reviewID, reviewUpdate) => {
    try {
        let data = await Review.findOne({ _id: reviewID });
        if (reviewUpdate.rating) data.rating = reviewUpdate.rating;
        if (reviewUpdate.comment) data.comment = reviewUpdate.comment;

        await data.save();

        return {
            data,
            message: 'Review Updated Successfully',
            status: 'OK'
        }
    } catch (e) {
        return {
            message: e.message,
            status: 'ERROR'
        }
    }
};

const findReviewByQuery = async (query, option) => {
    try {
        let data = await Review.findOne(query, option);

        if (data) {
            return {
                data,
                message: 'Review Found',
                status: 'OK'
            }
        } else {
            return {
                data: null,
                message: 'Review Not Found',
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

const findReviewsByQuery = async (query,option) => {
    try {
        let data = await Review.find(query, option);
        let message = data.length > 0 ? 'Review(s) Found' : 'Review(s) Not Found';
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

const findReviewByID = async (reviewID) => {
    try {
        return await findReviewByQuery({_id: reviewID});
    } catch (e) {
        return {
            data: null,
            message: e.message,
            status: 'ERROR'
        };
    }
};

const findReviewByUserIDAndPropertyID = async (userID, propertyID) => {
    try {
        return await findReviewByQuery({ userID, propertyID });
    } catch (e) {
        return {
            data: null,
            message: e.message,
            status: 'ERROR'
        };
    }
};

const findReviewsOfProperty = async (propertyID) => {
    try {
        return await findReviewsByQuery({ propertyID }, {});
    } catch (e) {
        return {
            data: null,
            message: e.message,
            status: 'ERROR'
        };
    }
};

const findReviewsOfUser = async (userID) => {
    try {
        return await findReviewsByQuery({ userID }, {});
    } catch (e) {
        return {
            data: null,
            message: e.message,
            status: 'ERROR'
        };
    }
};

const findReviewsByQueryAndDelete = async (query) => {
    try {
        let data = await Review.deleteMany(query);
        let message = data.deletedCount > 0 ? 'Review(s) Removed Successfully' : 'No Review(s) Found';
        return {
            message,
            status: 'OK'
        }
    } catch (e) {
        return {
            message: e.message,
            status: 'ERROR'
        };
    }
};

module.exports = {
    insertReview,
    deleteReview,
    updateReview,
    findReviewByID,
    findReviewByUserIDAndPropertyID,
    findReviewsOfProperty,
    findReviewsOfUser,
    findReviewsByQueryAndDelete
}