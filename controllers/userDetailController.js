const _ = require('lodash');

const userDetailInterface = require('../db/interfaces/userDetailInterface');
const userInterface = require('../db/interfaces/userInterface');
const propertyInterface = require('../db/interfaces/propertyInterface');
const reservationInterface = require('../db/interfaces/reservationInterface');

const payment = require('./../middlewares/payment');


//helper function
const findUserDetail = async (req, res) => {
    try {
        let username = res.locals.middlewareResponse.user.username;
        let userDetailData = await userDetailInterface.findUserDetailByQuery({ username });

        if (userDetailData.status === 'OK') {
            return userDetailData.data;
        } else {
            return res.status(404).send({
                message: 'Could Not Find UserDetail',
                error: userDetailData.message
            });
        }

    } catch (e) {
        return res.status(500).send({
            message: 'Could Not Find UserDetail',
            error: e.message
        });
    }
}

const handlePOSTRegister = async (req, res) => {
    try {
        let userData = await userInterface.insertUser(req.body.userObject);

        if (userData.status === 'OK') {
            let userDetailData = await userDetailInterface.insertUserDetail(req.body.userDetailObject);

            if (userDetailData.status === 'OK') {
                return res.status(201).send({
                    message: userData.message + ' and ' + userDetailData.message
                });
            } else {
                await userInterface.deleteUser(req.body.userObject.username);
                return res.status(400).send({
                    message: 'Could not Register',
                    error: userDetailData.message
                });
            }
        } else {
            return res.status(400).send({
                message: 'Could not Insert User',
                error: userData.message
            });
        }
    } catch (e) {
        return res.status(500).send({
            message: 'ERROR in POST /api/user/register',
            error: e.message
        });
    }
}

const handleDELETEUserDetail = async (req, res) => {
    try {
        let userDetail = await findUserDetail(req, res);
        let userDetailData = await userDetailInterface.deleteUserDetail(userDetail._id);

        if (userDetailData.status === 'OK') {

            for (const property of userDetail.properties) {
                await propertyInterface.deleteProperty(property.propertyID);
                await reviewInterface.findReviewsByQueryAndDelete({ propertyID: property.propertyID });
                await reservationInterface.findReservationsByQueryAndDelete({ propertyID: property.propertyID });
            }

            await userInterface.deleteUser(userDetail.username);
            return res.status(200).send({
                message: 'Account Removed Successfully'
            })
        } else {
            return res.status(400).send({
                message: 'Could not Remove Account',
                error: userDetailData.message
            })
        }
    } catch (e) {
        return res.status(500).send({
            message: 'ERROR in POST /api/user/delete',
            error: e.message
        });
    }
}

const handlePATCHUserDetail = async (req, res) => {
    try {
        let username = res.locals.middlewareResponse.user.username;
        let currentUserEmail;
        let user;

        if (req.body.userDetailObject.contacts) {
            if (req.body.userDetailObject.contacts.email) {
                let userData = await userInterface.findUserByQuery({ username });

                if (userData.status === 'ERROR') {
                    return res.status(400).send({
                        message: 'Could not Find User',
                        error: userData.message
                    });
                }

                user = userData.data;
                currentUserEmail = user.userEmail;
                user.userEmail = req.body.userDetailObject.contacts.email;
                await user.save();
            }
        }

        let userDetailData = await userDetailInterface.findUserDetailAndUpdate(username, req.body.userDetailObject);

        if (userDetailData.status === 'ERROR') {

            user.userEmail = currentUserEmail;
            await user.save();

            return res.status(400).send({
                message: 'Could not Update User',
                error: userDetailData.message
            });
        }

        let userDetail = userDetailData.data;

        if (req.body.userDetailObject.userLanguage) {
            for (const property of userDetail.properties) {
                await propertyInterface.findPropertyByIDAndUpdate(property.propertyID, {
                    ownerLanguage: req.body.userDetailObject.language
                });
            }
        }

        return res.status(200).send({
            message: 'User Updated Successfully'
        });
    } catch (e) {
        return res.status(500).send({
            message: 'ERROR in POST /api/user/update',
            error: e.message
        });
    }
}

const handleGETReservationsOfPropertiesOwned = async (req, res) => {
    try {
        let reservationList = [];
        let reservations;
        let reservationData;
        let reservationObject;
        let reservationObjects = [];
        let guest;
        let guestData;
        let property;
        let propertyData;

        let userDetail = await findUserDetail(req, res);

        for (const propertyObject of userDetail.properties) {

            reservationData = await reservationInterface.findReservationsByQuery({ propertyID: propertyObject.propertyID });

            if (reservationData.status === 'ERROR') {
                return res.status(404).send({
                    message: 'ERROR in POST /api/user/reservations/owned',
                    error: reservationData.message
                });
            }

            reservations = reservationData.data;
            reservationList.push(reservations);
        }

        if (reservationList.length === 0) {
            return res.status(200).send({
                message: 'Success',
                reservationList: []
            });
        }

        reservationList = await _.flatten(reservationList);

        for (const reservation of reservationList) {
            guestData = await userDetailInterface.findUserDetailByID(reservation.guestID);
            propertyData = await propertyInterface.findPropertyByID(reservation.propertyID);

            if (guestData.status === 'ERROR') {
                return res.status(404).send({
                    message: 'ERROR in POST /api/user/reservations/owned',
                    error: guestData.message
                });
            }

            if (propertyData.status === 'ERROR') {
                return res.status(404).send({
                    message: 'ERROR in POST /api/user/reservations/owned',
                    error: propertyData.message
                });
            }

            guest = guestData.data;
            property = propertyData.data;

            reservationObject = {
                reservationID: reservation._id,
                guestName: guest.name,
                guestImage: guest.image,
                guestContacts: {
                    email: guest.contacts.email,
                    phone: guest.contacts.phone
                },
                reservationDate: reservation.reservationDate,
                propertyID: property._id,
                propertyTitle: property.title,
                propertyAddress: {
                    streetAddress: property.location.streetAddress,
                    city: property.location.city,
                    area: property.location.area
                },
                checkIn: reservation.checkIn,
                checkOut: reservation.checkOut,
                price: {
                    basePrice: property.price.basePrice,
                    discountPercentage: property.price.discountPercentage
                },
                status: reservation.status
            }

            reservationObjects.push(reservationObject);
        }

        return res.status(200).send({
            message: 'Success',
            reservationList: reservationObjects
        });


    } catch (e) {
        return res.status(500).send({
            message: 'ERROR in POST /api/user/reservations/owned',
            error: e.message
        });
    }
}

const handleGETUserDetailByID = async (req, res) => {
    try {

        let userDetailData = await userDetailInterface.findUserDetailByID(req.body.userDetailID);

        if (userDetailData.status === 'OK') {
            return res.status(200).send({
                message: 'Success',
                userProfile: userDetailData.data
            });
        } else {
            return res.status(404).send({
                message: 'Could not Find UserDetail',
                error: userDetailData.message
            });
        }

    } catch (e) {
        return res.status(500).send({
            message: 'ERROR in POST /api/user/viewbyid'
        })
    }
}

const handleGETFavorites = async (req, res) => {
    try {
        let favorites = [];
        let userDetail = await findUserDetail(req, res);

        for (const propertyID of userDetail.favorites) {
            let propertyData = await propertyInterface.findPropertyByID(propertyID);

            if (propertyData.status === 'OK') {
                favorites.push(propertyData.data);
            }
        }

        return res.status(200).send({
            favorites,
            message: 'Success'
        });

    } catch (e) {
        return res.status(500).send({
            message: 'ERROR in POST /api/user/favorites',
            error: e.message
        });
    }
}

const handleUpdateFavorites = async (req, res) => {
    try {
        let userDetail = await findUserDetail(req, res);

        if (req.body.action === 'INSERT') {
            userDetail.favorites.push(req.body.propertyID);
            await userDetail.save();

            return res.status(201).send({
                message: 'Added to Favorites'
            });
        } else {
            userDetail.favorites = await _.filter(userDetail.favorites, favorite => {
                return favorite !== req.body.propertyID
            });
            await userDetail.save();

            return res.status(200).send({
                message: 'Removed from Favorites'
            });
        }


    } catch (e) {
        return res.status(500).send({
            message: 'ERROR in POST /api/user/updatefavorites',
            error: e.message
        });
    }
}

const handleGETReservationsOfPropertiesReserved = async (req, res) => {
    try {
        let reservationList;
        let reservationData;
        let reservationObject;
        let reservationObjects = [];
        let property;
        let propertyData;

        let userDetail = await findUserDetail(req, res);


        reservationData = await reservationInterface.findReservationsByQuery({ guestID: userDetail._id });

        reservationList = reservationData.data;

        if (reservationList.length === 0) {
            return res.status(200).send({
                message: 'Success',
                reservationList: []
            });
        }

        for (const reservation of reservationList) {

            propertyData = await propertyInterface.findPropertyByID(reservation.propertyID);

            if (propertyData.status === 'ERROR') {
                return res.status(404).send({
                    message: 'ERROR in POST /api/user/reservations/reserved',
                    error: propertyData.message
                });
            }

            property = propertyData.data;

            reservationObject = {
                reservationID: reservation._id,
                reservationDate: reservation.reservationDate,
                propertyID: property._id,
                propertyTitle: property.title,
                propertyAddress: {
                    streetAddress: property.location.streetAddress,
                    city: property.location.city,
                    area: property.location.area
                },
                checkIn: reservation.checkIn,
                checkOut: reservation.checkOut,
                price: {
                    basePrice: property.price.basePrice,
                    discountPercentage: property.price.discountPercentage
                },
                status: reservation.status
            }

            reservationObjects.push(reservationObject);
        }

        return res.status(200).send({
            message: 'Success',
            reservationList: reservationObjects
        });


    } catch (e) {
        return res.status(500).send({
            message: 'ERROR in POST /api/user/reservations/reserved',
            error: e.message
        });
    }
}

const handleGETReviews = async (req, res) => {
    try {
        let userDetail = await findUserDetail(req, res);
        let reviewData = await reviewInterface.findReviewsOfGuest(userDetail._id);

        if (reviewData.status === 'OK') {
            return res.status(200).send({
                message: 'Success',
                data: reviewData.data
            });
        } else {
            return res.status(500).send({
                message: 'ERROR in POST /api/user/reviews',
                error: reviewData.message
            });
        }
    } catch (e) {
        return res.status(400).send({
            message: 'ERROR in POST /api/user/reviews',
            error: e.message
        });
    }
}

const handleRechargeWallet = async (req, res) => {
    try {
        let userDetail = await findUserDetail(req, res);

        let amount = Number(req.body.amount);

        let stripePayment = null;

        if (req.body.paymentMethod === "STRIPE") {
            let creditCard = req.body.creditCard;
            stripePayment = await payment.payWithStripe(creditCard, amount);

            if (stripePayment.status === 'OK') {

                userDetail.wallet.bluxCredit += amount;

                let paymentHistory = {
                    paymentType: 'STRIPE',
                    paymentAmount: amount,
                    details: 'test recharge',
                    timestamp: new Date(),
                }

                userDetail.wallet.usageHistory.push(paymentHistory);
                await userDetail.save();

                return res.status(200).send({
                    message: "Recharge Successful"
                });
            } else {
                return res.status(400).send({
                    message: stripePayment.message
                });
            }
        } else if (req.body.paymentMethod === "MFS") {
            let sessionResult = await payment.createAndGetSession(amount, req.body.successUrl);

            if (sessionResult.status === 'SUCCESS') {

                userDetail.wallet.bluxCredit += amount;

                let paymentHistory = {
                    paymentType: 'BKASH',
                    paymentAmount: amount,
                    details: 'test recharge',
                    timestamp: new Date(),
                }

                userDetail.wallet.usageHistory.push(paymentHistory);
                await userDetail.save();

                return res.status(200).send({
                    message: "Recharge Successful",
                    redirectUrl: sessionResult.GatewayPageURL
                });
            } else {
                return res.status(400).send({
                    message: sessionResult.message
                });
            }
        }
    } catch (e) {
        return res.status(500).send({
            message: e.message
        });
    }
}

const handleGETWallet = async (req, res) => {
    try {
        let userDetail = await findUserDetail(req, res);

        return res.status(200).send({
            message: 'Success',
            wallet: userDetail.wallet
        });
    } catch (e) {
        return res.status(400).send({
            message: 'ERROR in POST /api/user/wallet',
            error: e.message
        });
    }
}

module.exports = {
    handlePOSTRegister,
    handleDELETEUserDetail,
    handlePATCHUserDetail,
    handleGETFavorites,
    handleUpdateFavorites,
    handleGETReservationsOfPropertiesOwned,
    handleGETReservationsOfPropertiesReserved,
    handleGETReviews,
    handleGETUserDetailByID,
    handleRechargeWallet,
    handleGETWallet
}