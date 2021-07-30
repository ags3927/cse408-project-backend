const trendDestInterface = require('../db/interfaces/trendDestInterface');

const handlePOSTTrendDest = async (req, res) => {
    try {
        let trendDestData = await trendDestInterface.insertTrendDest(req.body.trendDestObject);

        if (trendDestData.status === 'OK') {
            return res.status(201).send({
                message: trendDestData.message
            });
        } else {
            return res.status(400).send({
                message: 'Could not Insert Trending Destination',
                error: trendDestData.message
            });
        }
    } catch (e) {
        return res.status(500).send({
            message: 'ERROR in POST /api/trenddest/insert',
            error: e.message
        });
    }
}

const handleDELETETrendDest = async (req, res) => {
    try {
        let trendDestData = await trendDestInterface.deleteTrendDest(req.body.trendDestID);

        if (trendDestData.status === 'OK') {
            return res.status(200).send({
                message: 'Trending Destination Removed Successfully'
            })
        } else {
            return res.status(400).send({
                message: 'Could not Remove Trending Destination',
                error: trendDestData.message
            })
        }
    } catch (e) {
        return res.status(500).send({
            message: 'ERROR in POST /api/trenddest/delete',
            error: e.message
        });
    }
}

const handleGETAllTrendDests = async(req, res) => {
    try {
        let trendDestData = await trendDestInterface.findAllTrendDests();

        if (trendDestData.status === 'ERROR') {
            return res.status(400).send({
                message: 'Could not get Trending Destinations',
                error: trendDestData.message
            });
        }

        return res.status(200).send({
            message: 'Success',
            trendingDestinations: trendDestData.data
        });
    } catch (e) {
        return res.status(500).send({
            message: 'ERROR in GET /api/trenddest/viewall',
            error: e.message
        });
    }
}

module.exports = {
    handlePOSTTrendDest,
    handleDELETETrendDest,
    handleGETAllTrendDests
}