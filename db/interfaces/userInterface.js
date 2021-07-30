const {User} = require('../models/user');

const insertUser = async (userObject) => {
    try {
        let userList = await User.find();

        for (const user of userList) {
            if (user.username === userObject.userEmail) {
                return {
                    message: 'User Email Already Exists',
                    status: "ERROR"
                }
            }

            if (user.userEmail === userObject.username) {
                return {
                    message: 'Username Already Exists',
                    status: "ERROR"
                }
            }
        }

        let userData = new User(userObject);
        let data = await userData.save();

        if (data.nInserted === 0){
            return {
                message: 'User Insertion Failed',
                status: "ERROR"
            }
        } else {
            return {
                message: 'User Insertion Successful',
                status: "OK"
            };
        }
    } catch (e) {
        return {
            message: e.message,
            status: "ERROR"
        };
    }
};

const deleteUser = async (username) => {
    try {
        let data = await User.findOneAndDelete({ username });

        if (data){
            return {
                message: 'User Deletion Successful',
                status: 'OK'
            }
        } else {
            return {
                message: 'User Deletion Failed',
                status: 'ERROR'
            };
        }
    } catch (e) {
        return {
            message: e.message,
            status: 'ERROR'
        };
    }
};


const findUserByQuery = async (query, option) => {
    try {
        let data = await User.findOne(query, option);

        if (data){
            return {
                data,
                message: 'User Found',
                status: 'OK'
            }
        } else {
            return {
                data: null,
                message: 'User Not Found',
                status: 'ERROR'
            };
        }

    } catch (e) {
        return {
            data: null,
            message: e.message,
            status: 'ERROR'
        };
    }
};

const findUserByIDAndUpdate = async (id, update) => {
    try {
        let data = await User.findByIdAndUpdate(id, update);

        if (data){
            return {
                data,
                message: 'User Update Successful',
                status: 'OK'
            }
        } else {
            return {
                data: null,
                message: 'User Update Failed',
                status: 'ERROR'
            };
        }

    } catch (e) {
        return {
            data: null,
            message: e.message,
            status: 'ERROR'
        };
    }
};

module.exports = {
    insertUser,
    deleteUser,
    findUserByQuery,
    findUserByIDAndUpdate
}