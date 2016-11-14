import dataFile from '../data/iso3166-2.json'
import calculateDispute from './disputedBorders';
import patchNameProvider from './nameProvider'

let DEFAULT_DISPUTE = 'en';
let NAMES_SET = 'wikipedia'

const changeDispute = (newValue) => (DEFAULT_DISPUTE = newValue);
const changeNameProvider = (newValue) => (NAMES_SET = newValue);

let lastDisputedData = {};
let lastDataSet = {};

const getDisputedData = (dispute = DEFAULT_DISPUTE) => {
    if (lastDisputedData.dispute === dispute) {
        return lastDisputedData.data;
    }
    lastDisputedData = {
        dispute: dispute,
        data: calculateDispute(dataFile, dispute)
    };
    return lastDisputedData.data;
};

const getDataSet = (dispute = DEFAULT_DISPUTE) => {
    if (lastDataSet.dispute === dispute && lastDataSet.names == NAMES_SET) {
        return lastDataSet.data;
    }
    lastDisputedData = {
        dispute: dispute,
        names: NAMES_SET,
        data: patchNameProvider(getDisputedData(dataFile, dispute), NAMES_SET)
    };
    return lastDisputedData.data;
}

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

const reduce = (dataset, lang, countryList, reduceElement = a=>a) => {
    let result = {};
    Object.keys(dataset).forEach(iso1=> {
        if (countryList && countryList.indexOf(iso1) < 0) {
            return;
        }

        let country = {
            ...dataset[iso1]
        };
        country.name = country.names[lang] || country.name;
        delete country.names;
        const regions = country.regions;
        country = reduceElement(country);
        country.regions = [];
        regions.forEach(oldRegion=> {
            let region = {
                ...oldRegion
            };
            region.name = region.names[lang] || region.name;
            delete region.names;
            country.regions.push(reduceElement(region));
        });

        result[iso1] = country;
    });
    return result;
};


export {
    getDataSet,
    getRegionsFor,

    changeDispute,
    changeNameProvider,

    findCountryByName,
    findRegionByCode,

    reduce
}

