const express = require('express');
const trendDestRouter = express.Router();

//middlewares
const authenticate = require('../middlewares/authenticate');

const trendDestController = require('../controllers/trendDestController');

trendDestRouter.post('/insert',
    authenticate.handleAdminAuthentication,
    trendDestController.handlePOSTTrendDest
);

trendDestRouter.post('/delete',
    authenticate.handleAdminAuthentication,
    trendDestController.handleDELETETrendDest
);

trendDestRouter.post('/viewall',
    trendDestController.handleGETAllTrendDests
);

module.exports = trendDestRouter;
