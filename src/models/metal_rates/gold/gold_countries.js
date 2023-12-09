const mongoose = require('mongoose');

const goldCountrySchema = new mongoose.Schema
    (
        {
            country:
            {
                type: String,
                required: true,
            },
            currency:
            {
                type: String,
                required: true,
            },
            rate18K:
            {
                type: Number,
                required: true,
            },
            rate22K:
            {
                type: Number,
                required: true,
            },
            rate24K:
            {
                type: Number,
                required: true,
            },
        },
        {
            timestamps: true
        }
    );

const GoldCountry = mongoose.model('GoldCountry', goldCountrySchema);

module.exports = GoldCountry;
