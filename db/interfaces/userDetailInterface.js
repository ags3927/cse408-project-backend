const {UserDetail} = require('../models/userDetail');

const insertUserDetail = async (userDetailObject) => {
    try {
        let userDetail = new UserDetail(userDetailObject);
        let data = await userDetail.save();

        if (data.nInserted === 0) {
            return {
                message: 'UserDetail Insertion Failed',
                status: 'ERROR'
            }
        } else {
            return {
                message: 'UserDetail Insertion Successful',
                status: 'OK'
            }
        }
    } catch (e) {
        return {
            message: e.message,
            status: 'ERROR'
        }
    }
};

const deleteUserDetail = async (userDetailID) => {
    try {
        let data = await UserDetail.findOneAndDelete({_id: userDetailID});

        if (data) {
            return {
                message: 'UserDetail Removed Successfully',
                status: 'OK'
            }
        } else {
            return {
                message: 'Could not Remove UserDetail',
                status: 'ERROR'
            }
        }
    } catch (e) {
        return {
            message: e.message,
            status: 'ERROR'
        }
    }
};

const findUserDetailByQuery = async (query, option) => {
    try {
        let data = await UserDetail.findOne(query, option);

        if (data) {
            return {
                data,
                message: 'UserDetail Found',
                status: 'OK'
            }
        } else {
            return {
                data: null,
                message: 'UserDetail Not Found',
                status: 'ERROR'
            }
        }

    } catch (e) {
        return {
            data: null,
            message: e.message,
            status: 'ERROR'
        }
    }
}

const findUserDetailsByQuery = async (query, option) => {
    try {
        let data = await UserDetail.find(query, option);
        let message = data.length > 0 ? 'UserDetail(s) Found' : 'UserDetail Not Found';
        return {
            data,
            message,
            status: 'OK'
        }
    } catch (e) {
        return {
            data: null,
            message: e.message,
            status: 'ERROR'
        }
    }
}

const addProperty = async (username, propertyID) => {
    try {
        let userDetailData = await findUserDetailByQuery({username}, {});

        if (userDetailData.status === 'OK') {
            let userDetail = userDetailData.data;
            userDetail.properties.push({propertyID});
            let data = await userDetail.save();

            if (data) {
                return {
                    message: 'Add Property Successful',
                    status: 'OK'
                }
            } else {
                return {
                    message: 'Add Property Failed',
                    status: 'ERROR'
                }
            }
        } else {
            return {
                message: userDetailData.message,
                status: 'ERROR'
            }
        }
    } catch (e) {
        return {
            message: e.message,
            status: 'ERROR'
        };
    }
}

const findUserDetailAndUpdate = async (username, userDetailUpdate) => {
    try {
        let userDetailData = await findUserDetailByQuery({username});

        if (userDetailData.status === 'ERROR') {
            return {
                message: userDetailData.message,
                status: userDetailData.status
            }
        }

        let userDetail = userDetailData.data;

        if (typeof userDetailUpdate.verified === 'boolean') userDetail.verified = userDetailUpdate.verified;

        if (userDetailUpdate.userLanguage) userDetail.userLanguage = userDetailUpdate.userLanguage;

        if (userDetailUpdate.image) userDetail.image = userDetailUpdate.image;
        if (userDetailUpdate.name) {
            if (userDetailUpdate.name.firstName) userDetail.name.firstName = userDetailUpdate.name.firstName;
            if (userDetailUpdate.name.lastName) userDetail.name.lastName = userDetailUpdate.name.lastName;
        }
        if (userDetailUpdate.gender) userDetail.gender = userDetailUpdate.gender;
        if (userDetailUpdate.birthDate) userDetail.birthDate = userDetailUpdate.birthDate;
        if (userDetailUpdate.contacts) {
            if (userDetailUpdate.contacts.email) userDetail.contacts.email = userDetailUpdate.contacts.email;
            if (userDetailUpdate.contacts.phone) userDetail.contacts.phone = userDetailUpdate.contacts.phone;
            if (userDetailUpdate.contacts.address) {
                if (userDetailUpdate.contacts.address.country) userDetail.contacts.address.country = userDetailUpdate.contacts.address.country;
                if (userDetailUpdate.contacts.address.area) userDetail.contacts.address.area = userDetailUpdate.contacts.address.area;
                if (userDetailUpdate.contacts.address.city) userDetail.contacts.address.city = userDetailUpdate.contacts.address.city;
                if (userDetailUpdate.contacts.address.zipCode) userDetail.contacts.address.zipCode = userDetailUpdate.contacts.address.zipCode;
                if (userDetailUpdate.contacts.address.streetAddress) userDetail.contacts.address.streetAddress = userDetailUpdate.contacts.address.streetAddress;
            }
            if (userDetailUpdate.contacts.emergencyContact) {
                if (userDetailUpdate.contacts.emergencyContact.name) userDetail.contacts.emergencyContact.name = userDetailUpdate.contacts.emergencyContact.name;
                if (userDetailUpdate.contacts.emergencyContact.email) userDetail.contacts.emergencyContact.email = userDetailUpdate.contacts.emergencyContact.email;
                if (userDetailUpdate.contacts.emergencyContact.relationship) userDetail.contacts.emergencyContact.relationship = userDetailUpdate.contacts.emergencyContact.relationship;
                if (userDetailUpdate.contacts.emergencyContact.phone) userDetail.contacts.emergencyContact.phone = userDetailUpdate.contacts.emergencyContact.phone;
            }
        }
        if (userDetailUpdate.govtID) {
            userDetail.govtID = userDetailUpdate.govtID;
            userDetail.verified = false;
        }

        if (userDetailUpdate.blockServices) {
            if (typeof userDetailUpdate.blockServices.status === 'boolean') userDetail.blockServices.status = userDetailUpdate.blockServices.status;
            if (userDetailUpdate.blockServices.until) userDetail.blockServices.until = userDetailUpdate.blockServices.until;
        }

        if (userDetail.paymentOptions) {
            if (userDetail.paymentOptions.directDeposit) {
                if (userDetail.paymentOptions.directDeposit.accountNumber) userDetail.paymentOptions.directDeposit.accountNumber = userDetailUpdate.paymentOptions.directDeposit.accountNumber;
            }
            if (userDetail.paymentOptions.creditCard) {
                if (userDetail.paymentOptions.creditCard.cardHolderName) userDetail.paymentOptions.creditCard.cardHolderName = userDetailUpdate.paymentOptions.creditCard.cardHolderName;
                if (userDetail.paymentOptions.creditCard.cardNumber) userDetail.paymentOptions.creditCard.cardNumber = userDetailUpdate.paymentOptions.creditCard.cardNumber;
            }
        }

        let data = await userDetail.save();

        return {
            data,
            message: 'UserDetail Updated Successfully',
            status: 'OK'
        }

    } catch (e) {
        return {
            message: e.message,
            status: 'ERROR'
        }
    }
}

const findUserDetailByID = async (userDetailID) => {
    try {
        return await findUserDetailByQuery({_id: userDetailID}, {});
    } catch (e) {
        return {
            data: null,
            message: e.message,
            status: 'ERROR'
        };
    }
};

module.exports = {
    insertUserDetail,
    deleteUserDetail,
    findUserDetailByQuery,
    findUserDetailsByQuery,
    addProperty,
    findUserDetailAndUpdate,
    findUserDetailByID
}