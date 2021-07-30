const express = require('express');
const reviewRouter = express.Router();

//middlewares
const authenticate = require('../middlewares/authenticate');

const reviewController = require('../controllers/reviewController');

reviewRouter.post('/insert',
    authenticate.handleAuthentication,
    reviewController.handlePOSTReview
);

reviewRouter.post('/delete',
    authenticate.handleAuthentication,
    reviewController.handleDELETEReview
);

reviewRouter.post('/update',
    authenticate.handleAuthentication,
    reviewController.handlePATCHReview
);


module.exports = reviewRouter;