const { Reservation } = require('../models/reservation');

const insertReservation = async (reservationObject) => {
    try {
        let reservation = new Reservation(reservationObject);
        let data = await reservation.save();

        if (data.nInserted === 0) {
            return {
                message: 'Reservation Insertion Failed',
                status: 'ERROR'
            };
        } else {
            return {
                message: 'Reservation Insertion Successful',
                status: 'OK',
                data
            };
        }
    } catch (e) {
        return {
            message: e.message,
            status: 'ERROR'
        }
    }
};

const deleteReservation = async (reservationID) => {
    try {
        let data = await Reservation.findOneAndDelete({ _id: reservationID });

        if (data) {
            return {
                message: 'Reservation Removed Successfully',
                status: 'OK'
            };
        } else {
            return {
                message: 'Could not find Reservation',
                status: 'ERROR'
            };
        }
    } catch (e) {
        return {
            message: e.message,
            status: 'ERROR'
        }
    }
};

const findReservationsByQuery = async (query, option) => {
    try {
        let data = await Reservation.find(query, option);
        let message = data.length > 0 ? 'Reservation(s) Found' : 'Reservation Not Found';
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
};

const findReservationByQuery = async (query, option) => {
    try {
        let data = await Reservation.findOne(query,option);

        if (data){
            return {
                data,
                message: 'Reservation Found',
                status: 'OK'
            }
        } else {
            return {
                data: null,
                message: 'Reservation Not Found',
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
};

const findReservationsByQueryAndDelete = async (query) => {
    try {
        let data = await Reservation.deleteMany(query);
        let message = data.deletedCount > 0 ? 'Reservation(s) Removed Successfully' : 'Reservation(s) Not Found';
        return {
            message,
            status: 'OK'
        }
    } catch (e) {
        return {
            message: e.message,
            status: 'ERROR'
        };
    }
};

module.exports = {
    insertReservation,
    deleteReservation,
    findReservationByQuery,
    findReservationsByQuery,
    findReservationsByQueryAndDelete
}