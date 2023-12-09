// require('../../../db/mongoose') // to connect mongose to the database
// const mongoose = require('mongoose');
const { isCitySupportedSilver, isCountrySupportedSilver } = require('../../available_locations/silver/is-available.js');
const IndianSilverCities = require('../../../models/metal_rates/silver/silver_cities.js'); // Import Mongoose model for Indian cities
const SilverCountries = require('../../../models/metal_rates/silver/silver_countries.js'); // Import Mongoose model for countries

async function silverCalculator(location, weight)
{
    location = location.toLowerCase();

    async function price(location)
    {
        if (isCitySupportedSilver(location))
        {
            let rate;
            let currency = 'inr';

            const city = await IndianSilverCities.findOne({ city: location });
            if (city.city === location)
            {
                rate = city.rate;
            }

            return { rate, currency };

        } else
        {
            let rate;
            let currency;

            const country = await SilverCountries.findOne({ country: location });
            if (country.country === location)
            {
                rate = country.rate;
                currency = country.currency.trim().toLowerCase();
            }

            return { rate, currency };
        }

    }

    // Check if location is supported
    if (!isCitySupportedSilver(location) && !isCountrySupportedSilver(location))
    {
        console.error('Cannot calculate the silver rate for this location');
        return { cost: 0, currency: 'usd' };
    }

    // Calculate the cost of gold
    const { rate, currency } = await price(location);
    const cost = weight * rate;
    return { cost, currency };
}
// Example usage:
// async function example()
// {
//     try
//     {
//         const result = await silverCalculator('chennai', 1000);
//         console.log(`The silver price is ${result.cost} ${result.currency}`);
//     } catch (error)
//     {
//         console.error('Error:', error);
//     } finally
//     {
//         // mongoose.connection.close();
//         // console.log('All functions executed, connection closed');
//     }
// }

// example();

module.exports = silverCalculator;