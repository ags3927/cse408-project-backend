const express = require('express');
const apiRouter = express.Router();

const userController = require('../controllers/userController');

//middlewares
const authenticate = require('../middlewares/authenticate');

apiRouter.post('/login',
    authenticate.handlePOSTLogIn
);

apiRouter.post('/logout',
    authenticate.handleAuthentication,
    authenticate.handlePOSTLogOut
);

apiRouter.post('/admin/register',
    userController.handlePOSTAdminRegister
);

module.exports = apiRouter;