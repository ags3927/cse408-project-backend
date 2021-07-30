const express = require('express');
const reservationRouter = express.Router();

//middlewares
const authenticate = require('../middlewares/authenticate');
const payment = require('../middlewares/payment');

const reservationController = require('../controllers/reservationController');

reservationRouter.post('/insert',
    authenticate.handleAuthentication,
    reservationController.handlePOSTReservation
);

reservationRouter.post('/delete',
    authenticate.handleAuthentication,
    reservationController.handleDELETEReservation
);

reservationRouter.post('/update',
    authenticate.handleAuthentication,
    reservationController.handlePATCHReservation
);

reservationRouter.post('/pay',
    authenticate.handleAuthentication,
    reservationController.handlePayment
);

module.exports = reservationRouter;