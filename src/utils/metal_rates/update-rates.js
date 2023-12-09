require('../../db/mongoose') // to connect mongose to the database
const mongoose = require('mongoose');
const fetchGoldRatesForIndianCities = require('./gold/scrapper/indian-cities.js');
const fetchGoldRatesForCountries = require('./gold/scrapper/countries.js');
const fetchSilverRatesForIndianCities = require('./silver/scrapper/indian-cities.js');
const fetchSilverRatesForCountries = require('./silver/scrapper/countries.js');

async function getGoldRatesInIndianCities()
{
    const url = `https://www.creditmantri.com/gold-rate/`;
    const data = await fetchGoldRatesForIndianCities(url);
    console.log(data);
}

async function getGoldRatesWorldwide()
{
    const data = await fetchGoldRatesForCountries();
    console.log(data);
}

async function getSilverRatesInIndianCities()
{
    const url = `https://www.creditmantri.com/silver-rate/`;
    const data = await fetchSilverRatesForIndianCities(url);
    console.log(data);
}

async function getSilverRatesWorldwide()
{
    const data = await fetchSilverRatesForCountries();
    console.log(data);
}

async function executeAll()
{
    await getGoldRatesInIndianCities(); // for Indian cities
    await getGoldRatesWorldwide(); // for countries
    await getSilverRatesInIndianCities(); // for Indian cities
    await getSilverRatesWorldwide(); // for countries
    mongoose.connection.close();
    console.log('All functions executed, connection closed');
}

executeAll();
