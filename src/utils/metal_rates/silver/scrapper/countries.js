// Data source: https://rates.goldenchennai.com/world/silver-rate/nepal-silver-rate-today/ (we will use this for countries) // scrapping data from this site is allowed

const SilverCountry = require('../../../../models/metal_rates/silver/silver_countries');
const silverCountryList = require('../../../available_locations/silver/country-list');

const axios = require('axios');
const cheerio = require('cheerio');

const silverCountryListObj = JSON.parse(silverCountryList());

async function fetchData(url)
{
    try
    {
        const result = await axios.get(url);
        return cheerio.load(result.data);
    } catch (error)
    {
        console.error(`Error fetching data from ${url}:`, error);
        return null;
    }
}

async function extractData()
{
    let location = "";

    // for (let index = 0; index < 2; index++) // test for small data
    for (let index = 0; index < 57; index++)
    {
        location = silverCountryListObj[index].replace(/\s/g, '-')
        const url = `https://rates.goldenchennai.com/world/silver-rate/${location}-silver-rate-today/`

        const $ = await fetchData(url);
        if (!$) continue;
        const dataRow = $('tr');
        
        const rate = dataRow.find('td').eq(9).text();
        const country = location.replace(/-/g, ' ').toLowerCase();
        const silverCurrencySymbol = rate.replace(/[0-9.,]+/g, '');
        const silverCost = parseFloat(rate.replace(/[^0-9.]+/g, ''));

        try
        {
            await SilverCountry.findOneAndUpdate({ country: country }, { currency: silverCurrencySymbol, rate: silverCost }, { upsert: true, new: true });
        } catch (error)
        {
            console.error(`Error saving data for ${country}:`, error);
        }
    }

    return 'Completed data extraction and saving for silver countries.';
}
module.exports = extractData;