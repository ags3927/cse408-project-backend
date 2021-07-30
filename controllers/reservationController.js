const Moment = require('moment');
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);

const reservationInterface = require('../db/interfaces/reservationInterface');
const userDetailInterface = require('../db/interfaces/userDetailInterface');
const propertyInterface = require('../db/interfaces/propertyInterface');

const payment = require('./../middlewares/payment');



const findUserDetail = async (req, res) => {
    try {
        let username = res.locals.middlewareResponse.user.username;
        let userDetailData = await userDetailInterface.findUserDetailByQuery({ username });

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

const buildReservationObject = (reservationObject,userDetailID) => {
    reservationObject.guestID = userDetailID;
    return reservationObject;
}

const checkOverlap = async (reservationObject) => {
    let newReservationDateRange = moment.range(new Date(reservationObject.checkIn), new Date(reservationObject.checkOut))
    let reservedDateRange;

    let reservationData = await reservationInterface.findReservationsByQuery({ propertyID: reservationObject.propertyID });
    let reservations = reservationData.data;

    for (const reservation of reservations) {
        reservedDateRange = moment.range(new Date(reservation.checkIn), new Date(reservation.checkOut))
        let overlaps = reservedDateRange.overlaps(newReservationDateRange);

        if (overlaps) {
            return true;
        }
    }
    return false;
}

const isPropertyBlocked = async (property) => {
    let ownerData = await userDetailInterface.findUserDetailByID(property.ownerID);
    let owner = ownerData.data;
    if (owner.blockServices) {
        return {
            status: owner.blockServices.status
        };
    }

    return {
        status: false
    }
}

const hasValidDuration = (property, reservationObject) => {
    let checkInDate = moment(reservationObject.checkIn);
    let checkOutDate = moment(reservationObject.checkOut);
    let stayDuration = moment.duration(checkOutDate.diff(checkInDate)).asDays();
    if (stayDuration < property.stayTimeInNights.min) {
        return {
            status: false,
            message: 'Minimum reservation for this property is ' + property.stayTimeInNights.min + ' days.'
        }
    } else if (stayDuration > property.stayTimeInNights.max) {
        return {
            status: false,
            message: 'Maximum reservation for this property is ' + property.stayTimeInNights.max + ' days.'
        }
    }

    return {
        status: true,
        message: 'Duration Valid'
    }
}

const handlePOSTReservation = async (req, res) => {
    try {
        let overlaps = await checkOverlap(req.body.reservationObject);

        if (overlaps) {
            return res.status(400).send({
                message: 'Reservation Overlaps'
            });
        }

        let propertyData = await propertyInterface.findPropertyByID(req.body.reservationObject.propertyID);
        let property = propertyData.data;
        let propertyBlocked = await isPropertyBlocked(property);

        if (propertyBlocked.status) {
            return res.status(400).send({
                message: 'Property is Out of Services'
            });
        }

        let isValid = hasValidDuration(property, req.body.reservationObject);

        if (!isValid.status) {
            return res.status(400).send({
                message: isValid.message
            });
        }

        let userDetail = await findUserDetail(req, res);

        if (userDetail._id.toString() === property.ownerID.toString()) {
            return res.status(400).send({
                message: 'You cannot reserve your own property'
            });
        }

        let reservationObject = buildReservationObject(req.body.reservationObject, userDetail._id);
        let reservationData = await reservationInterface.insertReservation(reservationObject);

        if (reservationData.status === 'OK') {
            return res.status(201).send({
                reservationObject: reservationData.data,
                message: reservationData.message
            });
        } else {
            return res.status(400).send({
                message: 'Could not Insert Reservation',
                error: reservationData.message
            });
        }
    } catch (e) {
        return res.status(500).send({
            message: 'ERROR in POST /api/reservation',
            error: e.message
        });
    }
}

const handleDELETEReservation = async (req, res) => {
    try {
        let reservationData = await reservationInterface.deleteReservation(req.body.reservationID);

        if (reservationData.status === 'OK') {
            return res.status(200).send({
                message: 'Reservation Removed Successfully'
            });
        } else {
            return res.status(400).send({
                message: 'Could not Remove Reservation',
                error: reservationData.message
            });
        }
    } catch (e) {
        return res.status(500).send({
            message: 'ERROR in POST /api/reservation/delete',
            error: e.message
        });
    }
}

const handlePATCHReservation = async (req, res) => {
    try {
        let reservationData = await reservationInterface.findReservationByQuery({ _id: req.body.reservationObject._id });

        if (reservationData.status === 'ERROR') {
            return res.status(404).send({
                message: 'Could not Find Reservation',
                error: reservationData.message
            });
        }

        let reservation = reservationData.data;
        if (req.body.reservationObject.status) {
            reservation.status = req.body.reservationObject.status;
        }
        let reservationResult = await reservation.save();

        if (!reservationResult) {
            return res.status(400).send({
                message: 'Could not Update Reservation'
            });
        }

        return res.status(200).send({
            message: 'Successfully Updated Reservation'
        });
    } catch (e) {
        return res.status(500).send({
            message: 'ERROR in POST /api/reservation/update',
            error: e.message
        });
    }
}

//// payment methods


const handlePayment = async (req, res) => {
    try{
        let userDetail = await findUserDetail(req, res);

        let reservationData = await reservationInterface.findReservationByQuery({ _id: req.body.reservationID });
        let reservation = reservationData.data;

        let price = Number(req.body.price);

        let paymentUnsuccessful = false;
        let paymentFailMessage = "";

        if(req.body.paymentMethod === "STRIPE"){
            let creditCard = req.body.creditCard;
            let stripePayment = await payment.payWithStripe(creditCard, price);
            
            if(stripePayment.status === 'OK'){
                reservation.status = 'APPROVED';
                reservation.paymentDetails.status = 'PAID';
                reservation.paymentDetails.pType = 'STRIPE';
                reservation.paymentDetails.amount = price;
                reservation.paymentDetails.transactionID = stripePayment.id;
                await reservation.save();

                let paymentHistory = {
                    paymentType: 'STRIPE',
                    paymentAmount:price,
                    details: 'test payment',
                    timestamp: new Date(),
                }

                userDetail.wallet.usageHistory.push(paymentHistory);
                await userDetail.save();

                return res.status(200).send({
                    message: "Payment Successful"
                });
            } else {
                paymentUnsuccessful = true;
                paymentFailMessage = stripePayment.message;
            }
        } else if (req.body.paymentMethod === 'BCREDIT'){
            if(userDetail.wallet.bluxCredit >= price){

                userDetail.wallet.bluxCredit -= price;

                reservation.status = 'APPROVED';
                reservation.paymentDetails.status = 'PAID';
                reservation.paymentDetails.pType = 'BCREDIT';
                reservation.paymentDetails.amount = price;

                await reservation.save();

                let paymentHistory = {
                    paymentType: 'BCREDIT',
                    paymentAmount:price,
                    details: 'test payment',
                    timestamp: new Date(),
                }

                userDetail.wallet.usageHistory.push(paymentHistory);
                await userDetail.save();

                return res.status(200).send({
                    message: "Payment Successful"
                });
            } else {
                paymentUnsuccessful = true;
                paymentFailMessage = "Not Enough Blux Credit";
            }

        } else if (req.body.paymentMethod === "MFS"){
            let sessionResult = await payment.createAndGetSession(price, req.body.successUrl);

            if(sessionResult.status === 'SUCCESS'){
                reservation.status = 'APPROVED';
                reservation.paymentDetails.status = 'PAID';
                reservation.paymentDetails.pType = 'MFS';
                reservation.paymentDetails.vendor = 'BKASH'
                reservation.paymentDetails.amount = price;
                await reservation.save();

                let paymentHistory = {
                    paymentType: 'BKASH',
                    paymentAmount:price,
                    details: 'test payment',
                    timestamp: new Date(),
                }

                userDetail.wallet.usageHistory.push(paymentHistory);
                await userDetail.save();

                return res.status(200).send({
                    message: "Payment Successful",
                    redirectUrl: sessionResult.GatewayPageURL
                });
            } else {
                paymentUnsuccessful = true;
                paymentFailMessage = sessionResult.message;
            }
        }

        if (paymentUnsuccessful === true) {

            let propertyData = await propertyInterface.findPropertyByID(reservation.propertyID);
            let property = propertyData.data;

            let ownerData = await userDetailInterface.findUserDetailByID(property.ownerID);
            let owner = ownerData.data;

            if(owner.wantsAdvancePayment === true) {
                await reservationInterface.deleteReservation(reservation._id);
            }
            return res.status(400).send({
                message: paymentFailMessage
            });
        }
    } catch (e) {
        return res.status(500).send({
            message: e.message
        });
    }
}

module.exports = {
    handlePOSTReservation,
    handleDELETEReservation,
    handlePATCHReservation,
    handlePayment
}