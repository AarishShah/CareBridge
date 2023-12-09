// Data source: https://rates.goldenchennai.com/world/gold-rate/nepal-gold-rate-today/ (we will use this for countries) // scrapping data from this site is allowed

const GoldCountry = require('../../../../models/metal_rates/gold/gold_countries');
const goldCountryList = require('../../../available_locations/gold/country-list');

const axios = require('axios');
const cheerio = require('cheerio');

const goldCountryListObj = JSON.parse(goldCountryList());

async function fetchData(url)
{
    const result = await axios.get(url);
    return cheerio.load(result.data);
}

async function extractData()
{
    let location = "";

    // for (let index = 0; index < 2; index++) // test for small data
    for (let index = 0; index < 57; index++)
    {
        location = goldCountryListObj[index].replace(/\s/g, '-')
        const url = `https://rates.goldenchennai.com/world/gold-rate/${location}-gold-rate-today/`

        const $ = await fetchData(url);
        if (!$) continue;
        const dataRow = $('tr');

        // const weight = dataRow.find('td').eq(16).text();
        const rate18K = dataRow.find('td').eq(18).text();
        const rate22K = dataRow.find('td').eq(17).text();
        const rate24K = dataRow.find('td').eq(19).text();

        const country = location.replace(/-/g, ' ').toLowerCase();
        const goldCurrencySymbol = rate18K.replace(/[0-9.,]+/g, '');
        const goldCost18K = parseFloat(rate18K.replace(/[^0-9.]+/g, ''));
        const goldCost22K = parseFloat(rate22K.replace(/[^0-9.]+/g, ''));
        const goldCost24K = parseFloat(rate24K.replace(/[^0-9.]+/g, ''));

        try
        {
            await GoldCountry.findOneAndUpdate({ country }, { currency: goldCurrencySymbol, rate18K: goldCost18K, rate22K: goldCost22K, rate24K: goldCost24K }, { upsert: true, new: true });
        } catch (error)
        {
            console.error(`Error saving data for country ${country}:`, error);
        }
    }
    return 'Completed data extraction and saving for gold countries.';
}
module.exports = extractData;