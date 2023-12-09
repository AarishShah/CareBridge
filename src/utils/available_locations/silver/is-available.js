const silverCityList= require('./city-list');
const silverCityListObj = JSON.parse(silverCityList());

const silverCountryList= require('./country-list');
const silverCountryListObj = JSON.parse(silverCountryList());


function isCitySupportedSilver(location) {
    for (let i = 0; i < silverCityListObj.length; i++) {
        if (silverCityListObj[i].toLowerCase() === location.toLowerCase()) {
            // console.log(silverCityListObj[i].toLowerCase()); // for debugging
            return true;
        }
    }
    return false; // Explicitly return false if city is not found
}


function isCountrySupportedSilver(location) {
    for (let i = 0; i < silverCountryListObj.length; i++) {
        if (silverCountryListObj[i].toLowerCase() === location.toLowerCase()) {
            // console.log(silverCountryListObj[i].toLowerCase()); // for debugging (corrected the reference)
            return true;
        }
    }
    return false; // Explicitly return false if country is not found
}

  module.exports = {
    isCitySupportedSilver,
    isCountrySupportedSilver
};