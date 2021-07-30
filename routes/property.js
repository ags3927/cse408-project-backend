const express = require('express');
const propertyRouter = express.Router();

//middlewares
const authenticate = require('../middlewares/authenticate');

const propertyController = require('../controllers/propertyController');

propertyRouter.post('/insert',
    authenticate.handleAuthentication,
    propertyController.handlePOSTProperty
);

propertyRouter.post('/filtered',
    propertyController.handleGETPropertiesByFilter
);

propertyRouter.post('/viewbyid',
    propertyController.handleGETPropertyByID
);

propertyRouter.post('/reservations',
    propertyController.handleGETReservationDates
);

propertyRouter.post('/delete',
    authenticate.handleAuthentication,
    propertyController.handleDELETEProperty
);

propertyRouter.post('/update',
    authenticate.handleAuthentication,
    propertyController.handlePATCHProperty
);

propertyRouter.post('/featured',
    propertyController.handleGETFeaturedProperties
);

propertyRouter.post('/sample',
    propertyController.handleSampleProperties
);

propertyRouter.post('/reviews',
    authenticate.handleReviewAuthentication,
    propertyController.handleGETReviews
);

propertyRouter.post('/viewall',
    authenticate.handleAdminAuthentication,
    propertyController.handleGETAllProperties
);

module.exports = propertyRouter;