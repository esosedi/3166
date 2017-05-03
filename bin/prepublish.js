const fs = require('fs');
const lib = require('../lib/iso3166');


const mkdirSync = (a) => {
    try {
        fs.mkdirSync(a);
    } catch (e) {

    }
};

mkdirSync('./countryList');
mkdirSync('./regions');
mkdirSync('./i18n');

// get list of languages

const dataset = require('../data/iso3166-2.json');

const i18n = {};
const langs = {};
const regions = {};

Object.keys(dataset).forEach(iso1 => {
    Object.keys(dataset[iso1].names).forEach(lang => {
        if (lang && !langs[lang]) {
            const subset = lib.reduce(dataset, lang);
            const countrySet = {};
            const regionSet = {};
            Object.keys(subset).forEach(iso1 => {
                countrySet[iso1] = Object.assign({}, subset[iso1], {regions: []});
                regionSet[iso1] = subset[iso1].regions.map(region => Object.assign({}, region))
            });
            i18n[lang] = subset;
            langs[lang] = countrySet;
            regions[lang] = regionSet;
        }
    });
});

const mmap = (x, f) => {
    const result = {};
    Object.keys(x).forEach(key => {
        result[key] = f(x[key]);
    });
    return result;
};

Object.keys(langs).forEach(lang => {
    fs.writeFileSync('./i18n/' + lang + '.json', JSON.stringify(i18n[lang]));
    fs.writeFileSync('./countryList/' + lang + '_ref.json', JSON.stringify(langs[lang]));
    fs.writeFileSync('./countryList/' + lang + '.json', JSON.stringify(
        mmap(langs[lang], x => Object.assign({}, x, {
            reference: {
                openstreetmap: x.reference.openstreetmap
            }
        }))
    ));
    const langRegions = regions[lang];
    Object.keys(langRegions).forEach(iso1 => {
        mkdirSync('./regions/' + iso1);
        fs.writeFileSync('./regions/' + iso1 + '/' + lang + '.json', JSON.stringify(
            langRegions[iso1].map(x => Object.assign({}, x, {reference: {}}))
        ));
        fs.writeFileSync('./regions/' + iso1 + '/' + lang + '_ref.json', JSON.stringify(langRegions[iso1]));
    });
});
