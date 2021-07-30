const express = require('express');
const userRouter = express.Router();

//middlewares
const authenticate = require('../middlewares/authenticate');

const userController = require('../controllers/userController');
const userDetailController = require('../controllers/userDetailController');
const propertyController = require('../controllers/propertyController');

userRouter.post('/register',
    userDetailController.handlePOSTRegister
);

userRouter.post('/update',
    authenticate.handleAuthentication,
    userDetailController.handlePATCHUserDetail
);

userRouter.post('/favorites',
    authenticate.handleAuthentication,
    userDetailController.handleGETFavorites
);

userRouter.post('/updatefavorites',
    authenticate.handleAuthentication,
    userDetailController.handleUpdateFavorites
);

userRouter.post('/reviews',
    authenticate.handleAuthentication,
    userDetailController.handleGETReviews
);

userRouter.post('/reservations/reserved',
    authenticate.handleAuthentication,
    userDetailController.handleGETReservationsOfPropertiesReserved
);

userRouter.post('/properties',
    authenticate.handleAuthentication,
    propertyController.handleGETPropertiesOfOwner
);

userRouter.post('/reservations/owned',
    authenticate.handleAuthentication,
    userDetailController.handleGETReservationsOfPropertiesOwned
);

userRouter.post('/viewbyid',
    authenticate.handleAdminAuthentication,
    userDetailController.handleGETUserDetailByID
);

userRouter.post('/details',
    authenticate.handleAuthentication,
    userController.handleGETUserDetails
);

userRouter.post('/profile',
    authenticate.handleAuthentication,
    userController.handleGETUserProfile
);

userRouter.post('/wallet',
    authenticate.handleAuthentication,
    userDetailController.handleGETWallet
);

userRouter.post('/wallet/recharge',
    authenticate.handleAuthentication,
    userDetailController.handleRechargeWallet
);

module.exports = userRouter;