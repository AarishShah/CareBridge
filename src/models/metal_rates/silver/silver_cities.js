const mongoose = require('mongoose');

// Define the schema for silver cities
const silverCitySchema = new mongoose.Schema(
    {
        city:
        {
            type: String,
            required: true
        },
        rate:
        {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
);

// Create the model using the schema
const SilverCity = mongoose.model('SilverCity', silverCitySchema);

module.exports = SilverCity;
