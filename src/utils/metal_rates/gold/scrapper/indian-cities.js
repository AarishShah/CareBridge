// https://www.creditmantri.com/gold-rate/ (for indian cities)
// 3630 give nothing, 3629 is the last td
// 726 cities

const GoldCity = require('../../../../models/metal_rates/gold/gold_cities');
const axios = require('axios');
const cheerio = require('cheerio');

const url = `https://www.creditmantri.com/gold-rate/`;

async function fetchData(url)
{
    const result = await axios.get(url);
    return cheerio.load(result.data);
}

async function extractData(url)
{
    const $ = await fetchData(url);
    const dataRow = $('tr');

    // for (let index = 0; index < 30; index += 5) // test for small data
    for (let index = 0; index < 3630; index += 5) // 3630
    {
        const city = dataRow.find('td').eq(index).text().toLowerCase();
        const rate22K = dataRow.find('td').eq(index + 1).text();
        const rate24K = dataRow.find('td').eq(index + 3).text();

        const goldCost22K = parseFloat(rate22K.replace(/[^0-9.]+/g, ''));
        const goldCost24K = parseFloat(rate24K.replace(/[^0-9.]+/g, ''));

        try
        {
            await GoldCity.findOneAndUpdate({ city }, { rate22K: goldCost22K, rate24K: goldCost24K }, { upsert: true, new: true });
        } catch (error)
        {
            console.error(`Error saving data for city ${city}:`, error);
        }
    }
    
    return 'Completed data extraction and saving for gold cities.';
}

module.exports = extractData;