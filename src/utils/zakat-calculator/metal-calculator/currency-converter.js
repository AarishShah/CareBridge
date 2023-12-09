// https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/inr/usd.json

const request = require('postman-request');

function currencyConverter(amount, fromCurrency, toCurrency)
{
    return new Promise((resolve, reject) =>
    {
        const url = `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${fromCurrency}/${toCurrency}.json`;

        request({ url, json: true }, function (error, response, body)
        {
            if (error)
            {
                reject('Unable to connect to service!');
                return;
            }

            const conversionRate = body[toCurrency];
            if (!conversionRate)
            {
                reject('Unable to fetch conversion rate!');
                return;
            }

            const convertedAmount = conversionRate * amount;
            resolve(convertedAmount);
        });
    });
}

module.exports = currencyConverter;

// Example:
// currencyConverter(10000, 'inr', 'usd').then(rate => { console.log(rate); }).catch(error => { console.error(error); });