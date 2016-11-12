import dataFile from '../data/iso3166-2.json'
import calculateDispute from './disputedBorders';

let DEFAULT_DISPUTE = 'en';

const changeDispute = (newValue) => (DEFAULT_DISPUTE = newValue);
let lastDisputedData = {};

const getDataSet = (dispute = DEFAULT_DISPUTE) => {
    if (lastDisputedData.dispute === dispute) {
        return lastDisputedData.data;
    }
    lastDisputedData = {
        dispute: dispute,
        data: calculateDispute(dataFile, dispute)
    };
    return lastDisputedData.data;
};

const getFlatData = (dispute = DEFAULT_DISPUTE) => {
    const list = getDataSet(dispute);
    const result = [];
    Object.keys(list).forEach(key=> {
        result.push(list[key]);
    });
    return result;
};

const getRegionsFor = (countryIsoCode, dataSet = 0) => {
    const country = (dataSet || getDataSet())[countryIsoCode];
    if (country) {
        return country.regions;
    }
    return [];
};

const findCountryByName = (name, dispute) => {
    const result = getFlatData(dispute).filter(country=> {
        const names = country.names;
        let found = false;
        Object.keys(names).forEach(lng=> {
            found |= (names[lng] == name);
        });
        return found;
    });
    if (result.length) {
        return result[0];
    }
    return null;
};

const findRegionByCode = (code, dispute) => {
    const [iso1, iso2] = code.split('-');
    const countries = getDataSet(dispute);
    const country = countries[iso1];

    if (!country) {
        return [];
    }
    return country.regions.filter(region=>region.iso === iso2);
};

export {
    getDataSet,
    getRegionsFor,
    changeDispute,
    findCountryByName,
    findRegionByCode
}

