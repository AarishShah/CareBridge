const goldCalculator = require('./metal-calculator/gold-calculator');
const silverCalculator = require('./metal-calculator/silver-calculator');
const currencyConverter = require('./metal-calculator/currency-converter');

// Constants
const NISAB_GOLD = 87.48;
const NISAB_SILVER = 612.36;
const ZAKAT_RATE = 0.025;

// Main function
async function calculateZakat
    (
        savingsLocation = 'defaultLocation',
        locationForGold = 'defaultLocation',
        locationForSilver = 'defaultLocation',
        purity = 24,
        weightOfGold = 0,
        weightOfSilver = 0,
        savings = 0
    )
{

    // local currency

    // Nisab for savings
    const one = await goldCalculator(savingsLocation, 24, NISAB_GOLD);
    const two = await silverCalculator(savingsLocation, NISAB_SILVER);

    // Nisab for metals
    const three = await goldCalculator(locationForGold, 24, NISAB_GOLD);
    const four = await silverCalculator(locationForSilver, NISAB_SILVER);

    // Price of metals - calculated
    const five = await goldCalculator(locationForGold, purity, weightOfGold);
    const six = await silverCalculator(locationForSilver, weightOfSilver);

    // to collect local currency (for frontend)
    const seven = one.cost;
    const eight = one.currency;
    const nine = two.cost;
    const ten = two.currency;
    const eleven = three.cost;
    const twelve = three.currency;
    const thirteen = four.cost;
    const fourteen = four.currency;
    const fifteen = five.cost;
    const sixteen = five.currency;
    const seventeen = six.cost;
    const eighteen = six.currency;

    // USD currency
    let goldPrice, silverPrice;

    const priceOfNisabSavingsGold = await currencyConverter(one.cost, one.currency, 'usd');
    const priceOfNisabSavingsSilver = await currencyConverter(two.cost, two.currency, 'usd');

    const priceOfNisabGold = await currencyConverter(three.cost, three.currency, 'usd');
    const priceOfNisabSilver = await currencyConverter(four.cost, four.currency, 'usd');

    const Nisab = Math.min(priceOfNisabSavingsGold, priceOfNisabSavingsSilver, priceOfNisabGold, priceOfNisabSilver);

    if (five.cost === 0) { goldPrice = 0; } else { goldPrice = await currencyConverter(five.cost, five.currency, 'usd'); }
    if (six.cost === 0) { silverPrice = 0; } else { silverPrice = await currencyConverter(six.cost, six.currency, 'usd'); }

    // Zakat calculation
    const zakatAmount = zakat(goldPrice, silverPrice, Nisab, savings);
    // console.log(zakatAmount);
    return {
        goldPrice,
        silverPrice,
        savings,
        Nisab,
        zakatAmount
    };
}

// Zakat calculation function remains unchanged
function zakat(goldPrice, silverPrice, Nisab, savings)
{
    const totalWealth = goldPrice + silverPrice + savings;
    return totalWealth > Nisab ? totalWealth * ZAKAT_RATE : 0;
}

// calculateZakat();
module.exports = { calculateZakat };
