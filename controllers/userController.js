const userInterface = require('../db/interfaces/userInterface');
const userDetailInterface = require('../db/interfaces/userDetailInterface');
//helper function

const findUserDetails = async (req, res) => {
    try {
        console.log("Finding user details");
        let username = res.locals.middlewareResponse.user.username;
        let userType = res.locals.middlewareResponse.user.userType;

        let userData = await userDetailInterface.findUserDetailByQuery({username}, {name: 1, image: 1});

        if (userData.status === 'OK') {
            let user = userData.data;
            return {
                username,
                name: user.name,
                image: user.image,
                _id: user._id,
                userType
            }
        } else {
            if (userType === 'ADMIN') {
                return {
                    username,
                    name: {
                        firstName: 'Admin',
                        lastName: 'User'
                    },
                    image: '',
                    _id: 0,
                    userType
                }
            }
            else {
                // console.log('user not found');
                return res.status(404).send({
                    message: 'Could Not Find User',
                    error: userData.message
                });
            }
        }

    } catch (e) {
        // console.log('exception');
        // console.log(e.message);
        return res.status(500).send({
            message: 'Could Not Find User',
            error: e.message
        });
    }
}

const findUserProfile = async (req, res) => {
    try {
        let username = res.locals.middlewareResponse.user.username;

        let userData = await userDetailInterface.findUserDetailByQuery({username});

        if (userData.status === 'OK') {
            return userData.data;
        } else {
            return res.status(404).send({
                message: 'Could Not Find User',
                error: userData.message
            });
        }
    } catch (e) {
        return res.status(500).send({
            message: 'Could Not Find User',
            error: e.message
        });
    }
}

const handlePOSTAdminRegister = async (req, res) => {
    try {
        let userData = await userInterface.insertUser(req.body.userObject);

        if (userData.status === 'OK') {
            return res.status(201).send({
                message: userData.message
            });
        } else {
            return res.status(400).send({
                message: 'Could not Insert User',
                error: userData.message
            });
        }
    } catch (e) {
        return res.status(500).send({
            message: 'ERROR in POST /api/admin/register',
            error: e.message
        });
    }
}

const handleGETUserDetails = async (req, res) => {
    try {
        let userData = await findUserDetails(req, res);
        return res.status(200).send({
            message: 'Success',
            sessionDetails: userData
        })
    } catch (e) {
        return res.status(500).send({
            message: 'Could Not Get User Details',
            error: e.message
        });
    }
}

const handleGETUserProfile = async (req, res) => {
    try {
        let userProfile = await findUserProfile(req, res);
        return res.status(200).send({
            message: 'Success',
            userProfile
        })
    } catch (e) {
        return res.status(500).send({
            message: 'Could Not Get User Profile',
            error: e.message
        });
    }
}

module.exports = {
    handlePOSTAdminRegister,
    handleGETUserDetails,
    handleGETUserProfile
}