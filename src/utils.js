import calculateDispute from './disputedBorders';
import {getDataFile, getNameProvider} from './IoT';

let DEFAULT_DISPUTE = 'en';
let NAMES_SET = 'wikipedia';

const changeDispute = (newValue) => (DEFAULT_DISPUTE = newValue);
const changeNameProvider = (newValue) => (NAMES_SET = newValue);

const patchNameProvider = (data, set) => {
    const provider = getNameProvider();
    return provider ? provider(data, set) : data;
};

let lastDisputedData = {};
let lastDataSet = {};

const getDisputedData = (dispute = DEFAULT_DISPUTE) => {
    if (lastDisputedData.dispute === dispute) {
        return lastDisputedData.data;
    }
    lastDisputedData = {
        dispute: dispute,
        data: calculateDispute(getDataFile(), dispute)
    };
    return lastDisputedData.data;
};

/**
 * Generates subset for a disputed borders
 * @param {String} [dispute] = ['ru','ea','en','tr']. Default is en
 * @param dataSet prepopulated dataset
 * @returns {*}
 */
const getDataSet = (dispute = DEFAULT_DISPUTE, dataSet) => {
    if (lastDataSet.dispute === dispute && lastDataSet.names == NAMES_SET) {
        return lastDataSet.data;
    }
    lastDisputedData = {
        dispute: dispute,
        names: NAMES_SET,
        data: patchNameProvider(getDisputedData(dataSet || getDataFile(), dispute), NAMES_SET)
    };
    return lastDisputedData.data;
};

/**
 * Generates array of countries
 * @param {String} [dispute] = ['ru','ea','en','tr']. Default is en
 * @returns {*}
 */
const getFlatData = (dispute = DEFAULT_DISPUTE) => {
    const list = getDataSet(dispute);
    const result = [];
    Object.keys(list).forEach(key=> {
        result.push(list[key]);
    });
    return result;
};

/**
 * @param {String} countryIsoCode iso3166-1 code of country
 * @param [dataSet] prepopulated dataset
 * @returns {*} Regions of country
 */
const getRegionsFor = (countryIsoCode, dataSet = 0) => {
    const country = (dataSet || getDataSet())[countryIsoCode];
    if (country) {
        return country.regions;
    }
    return [];
};

/**
 * @param {String} name to search.
 * @returns Country information
 */
const findCountryByName = (name, dispute) => {
    const result = getFlatData(dispute).filter(country=> {
        const names = country.names;
        let found = false;
        Object.keys(names).forEach(lng => {
            found |= (names[lng] == name);
        });
        return found;
    });
    if (result.length) {
        return result[0];
    }
    return null;
};

/**
 * @param {String} code iso3166-2 code (ie US-CA) to be found
 * @param [dispute] disputed borders mode
 * @returns {*}
 */
const findRegionByCode = (code, dispute) => {
    const [iso1, iso2] = code.split('-');
    const countries = getDataSet(dispute);
    const country = countries[iso1];

    if (!country) {
        return [];
    }
    return country.regions.filter(region=>region.iso === iso2);
};

/**
 * Reduces data into smaller subset
 * @param dataset - prepopuluated dataset
 * @param {String} lang language to be keept
 * @param {Array} [countryList] iso codes of contries to be keept
 * @param {Function} reduceElement function to be called upon each region
 * @returns {{}}
 */
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
