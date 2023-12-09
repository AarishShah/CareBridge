const mongoose = require('mongoose');

const goldCitySchema = new mongoose.Schema
    (
        {
            city:
            {
                type: String,
                required: true,
                unique: true,
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

const GoldCity = mongoose.model('GoldCity', goldCitySchema);

module.exports = GoldCity;
