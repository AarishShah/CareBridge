// https://www.creditmantri.com/silver-rate/ (for indian cities)
// 1926 give nothing, 1925 is the last td
// 642 cities

const SilverCity = require('../../../../models/metal_rates/silver/silver_cities');
const axios = require('axios');
const cheerio = require('cheerio');

const url = `https://www.creditmantri.com/silver-rate/`;

async function fetchData(url)
{
    const result = await axios.get(url);
    return cheerio.load(result.data);
}

async function extractData(url)
{
    const $ = await fetchData(url);
    const dataRow = $('tr');

    // for (let index = 0; index < 2; index += 3) // test for small data
    for (let index = 0; index < 1926; index += 3) // 1926
    {
        const city = dataRow.find('td').eq(index).text().toLowerCase();
        const rate = dataRow.find('td').eq(index + 1).text();
        const cost = parseFloat(rate.replace(/[^0-9.]/g, ''));

        try
        {
            await SilverCity.findOneAndUpdate({ city: city }, { rate: cost }, { upsert: true, new: true });
        } catch (error)
        {
            console.error(`Error saving data for ${city}:`, error);
        }
    }

    return 'Completed data extraction and saving for silver cities.';
}

module.exports = extractData;