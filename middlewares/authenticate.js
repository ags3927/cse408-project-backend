const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userInterface = require('../db/interfaces/userInterface');


let handlePOSTLogIn = async (req, res) => {
    try {

        let body = req.body;
        let userIdentification = body.username;
        let password = body.password;
        let userDataByUserName = await userInterface.findUserByQuery({username: userIdentification}, {});
        let userDataByUserEmail = await userInterface.findUserByQuery({userEmail: userIdentification}, {})

        let user = userDataByUserEmail.status === 'OK' ? userDataByUserEmail.data : userDataByUserName.data;

        if (!user) {
            return res.status(401).send({
                message: "User does not exist"
            });
        }

        let matched = await bcrypt.compare(password, user.password);

        if (matched) {
            let access = 'auth';
            let token = await jwt.sign({
                _id: user._id.toString(),
                access
            }, 'qUEbJ8Sy8AQguzGc9cjL9RPjT42').toString();
            user.tokens.push({access, token});
            await user.save();
            return res.status(201).send({token});
        } else {
            return res.status(401).send({
                message: "Incorrect password"
            });
        }
    } catch (e) {
        return res.status(500).send({
            message: "ERROR in POST /api/login",
            error: e.message
        });
    }
};

let handleAuthentication = async (req, res, next) => {
    try {
        let token = req.header('x-auth');
        let decodedUser = await jwt.verify(token, 'qUEbJ8Sy8AQguzGc9cjL9RPjT42');
        let userData = await userInterface.findUserByQuery({_id: decodedUser._id}, {username: 1, userType: 1});
        let user = userData.data;

        if (user) {
            res.locals.middlewareResponse = {
                user,
                token
            };
            return next();
        } else {
            return res.status(401).send({
                message: 'Not Authorized'
            })
        }
    } catch (e) {
        return res.status(500).send({
            message: 'Could not Authorize',
            error: e.message
        })
    }
};

let handleAdminAuthentication = async (req, res, next) => {
    try {
        let token = req.header('x-auth');
        let decodedUser = await jwt.verify(token, 'qUEbJ8Sy8AQguzGc9cjL9RPjT42');
        let userData = await userInterface.findUserByQuery({_id: decodedUser._id}, {username: 1, userType: 1});
        let user = userData.data;

        if (user && user.userType === 'ADMIN') {
            res.locals.middlewareResponse = {
                user,
                token
            };
            return next();
        } else {
            return res.status(401).send({
                message: 'Not Authorized'
            })
        }
    } catch (e) {
        return res.status(500).send({
            message: 'Could not Authorize',
            error: e.message
        })
    }
}

let handlePOSTLogOut = async (req, res) => {
    try {
        let user = res.locals.middlewareResponse.user;
        let token = res.locals.middlewareResponse.token;

        await userInterface.findUserByIDAndUpdate(user._id, {
            $pull: {
                tokens: {token}
            }
        });

        return res.status(200).send({
            message: "Successfully Logged Out"
        });
    } catch (e) {
        return res.status(500).send({
            message: "ERROR in POST /api/logout",
            error: e.message
        });
    }
};

let handleReviewAuthentication = async (req, res, next) => {
    try {
        if (req.header('x-auth')) {
            return await handleAuthentication(req, res, next);
        } else {
            return next();
        }

    } catch (e) {
        return res.status(500).send({
            message: 'Could not Authorize',
            error: e.message
        })
    }
};

module.exports = {
    handlePOSTLogIn,
    handleAuthentication,
    handleAdminAuthentication,
    handlePOSTLogOut,
    handleReviewAuthentication
}