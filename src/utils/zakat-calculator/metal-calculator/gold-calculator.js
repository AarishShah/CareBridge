// require('../../../db/mongoose') // to connect mongose to the database
// const mongoose = require('mongoose');
const { isCitySupportedGold, isCountrySupportedGold } = require('../../available_locations/gold/is-available.js');
const IndianGoldCities = require('../../../models/metal_rates/gold/gold_cities.js'); // Import Mongoose model for Indian cities
const GoldCountries = require('../../../models/metal_rates/gold/gold_countries.js'); // Import Mongoose model for countries

async function goldCalculator(location, purity, weight)
{
    location = location.toLowerCase();

    // Define the price function for gold based on location and purity
    async function price(location, purity)
    {
        // Define a sample price map for gold based on location and purity

        if (isCitySupportedGold(location))
        {
            let rate22K;
            let rate24K;
            let currency = 'inr';

            const city = await IndianGoldCities.findOne({ city: location });
            if (city.city === location)
            {
                rate22K = city.rate22K;
                rate24K = city.rate24K;
            }
            const rate = purity === 22 ? rate22K : rate24K;
            return { rate, currency };


        } else
        {
            let rate18K;
            let rate22K;
            let rate24K;
            let currency;

            const country = await GoldCountries.findOne({ country: location });
            if (country.country === location)
            {
                rate18K = country.rate18K;
                rate22K = country.rate22K;
                rate24K = country.rate24K;
                currency = country.currency.trim().toLowerCase();
            }

            const rate = purity === 18 ? rate18K : (purity === 22 ? rate22K : rate24K);
            return { rate, currency };
        }

    }

    // Check if location is supported
    if (!isCitySupportedGold(location) && !isCountrySupportedGold(location))
    {
        console.error('Cannot calculate the gold rate for this location');
        return { cost: 0, currency: 'usd' };
    }

    // Check if purity is supported based on location
    if (isCitySupportedGold(location) && (purity !== 22 && purity !== 24))
    {
        console.error('Unsupported purity for city. Supported values are 22 and 24.');
        return { cost: 0, currency: 'usd' };
    } else if (isCitySupportedGold(location) && (purity !== 18 && purity !== 22 && purity !== 24))
    {
        console.error('Unsupported purity for country. Supported values are 18, 22, and 24.');
        return { cost: 0, currency: 'usd' };
    }

    // Calculate the cost of gold
    const { rate, currency } = await price(location, purity);
    const cost = weight * rate;
    return { cost, currency };

}

// Example usage:
// async function example()
// {
//     try
//     {
//         const result = await Calculator('Chennai', 24, 1000);
//         console.log(`The gold price is ${result.cost} ${result.currency}`);
//     } catch (error)
//     {
//         console.error('Error:', error);
//     } finally
//     {
//         // mongoose.connection.close();
//         // console.log('All functions executed, connection closed');
//     }
// }

// // example();

module.exports = goldCalculator;