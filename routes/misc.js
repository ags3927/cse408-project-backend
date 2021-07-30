const express = require('express');
const miscRouter = express.Router();

//middlewares
const authenticate = require('../middlewares/authenticate');

const miscellaneousController = require('../controllers/miscController');

miscRouter.get('/amenities',
    miscellaneousController.handleGETAmenities
);

miscRouter.get('/details',
    miscellaneousController.handleGETDetails
);

miscRouter.get('/rules',
    miscellaneousController.handleGETRules
);

module.exports = miscRouter;
