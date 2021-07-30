const {TrendDest} = require('../models/trendDest');

const insertTrendDest = async (trendDestObject) => {
    try {

        let trendDest = new TrendDest(trendDestObject);
        let data = await trendDest.save();

        if (data.nInserted === 0){
            return {
                message: 'Trending Destination Insertion Failed',
                status: 'ERROR'
            }
        } else {
            return {
                message: 'Trending Destination Insertion Successful',
                status: 'OK'
            };
        }
    } catch (e) {
        return {
            message: e.message,
            status: 'ERROR'
        };
    }
};

const deleteTrendDest = async (trendDestID) => {
    try {
        let data = await TrendDest.findOneAndDelete({ _id: trendDestID });

        if (data){
            return {
                message: 'Trending Destination Deletion Successful',
                status: 'OK'
            }
        } else {
            return {
                message: 'Trending Destination Deletion Failed',
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

//helper function

const findTrendDestsByQuery = async (query, option) => {
    try {
        let data = await TrendDest.find(query, option);
        let message;

        if (data.length > 0) {
            message = 'Trending Destination(s) Found';
        } else {
            message = 'Trending Destination(s) Not Found';
        }

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

const findAllTrendDests = async () => {
    try {
        return await findTrendDestsByQuery({}, {});
    } catch (e) {
        return {
            data: null,
            message: e.message,
            status: 'ERROR'
        }
    }
};

module.exports = {
    insertTrendDest,
    deleteTrendDest,
    findAllTrendDests
}