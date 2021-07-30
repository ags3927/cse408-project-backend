const fs = require('fs');
const _ = require('lodash');
const path = require('path');

const amenitiesPath = path.resolve(__dirname, '../databank/amenities.json')
const detailsPath = path.resolve(__dirname, '../databank/details.json')
const rulesPath = path.resolve(__dirname, '../databank/rules.json')

const sourceJSONAmenities = JSON.parse(fs.readFileSync(amenitiesPath, 'utf8'));
const sourceJSONDetails = JSON.parse(fs.readFileSync(detailsPath, 'utf8'));
const sourceJSONRules = JSON.parse(fs.readFileSync(rulesPath, 'utf8'));

const handleGETAmenities = async (req, res) => {
    try {
        return res.status(200).send({
            amenities: _.map(sourceJSONAmenities, 'name')
        });
    } catch (e) {
        return res.status(500).send({
            message: 'ERROR in GET /api/misc/amenities'
        });
    }
}

const handleGETDetails = async (req, res) => {
    try {
        return res.status(200).send({
            details: _.map(sourceJSONDetails, 'name')
        });
    } catch (e) {
        return res.status(500).send({
            message: 'ERROR in GET /api/misc/details'
        });
    }
}

const handleGETRules = async (req, res) => {
    try {
        return res.status(200).send({
            rules: _.map(sourceJSONRules, 'name')
        })
    } catch (e) {
        return res.status(500).send({
            message: 'ERROR in GET /api/misc/rules'
        })
    }
}

module.exports = {
    handleGETAmenities,
    handleGETDetails,
    handleGETRules
}