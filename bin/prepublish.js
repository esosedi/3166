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

const listOfDisputes = {
  '': '',
  'UN': 'en',
  'TR': 'tr',
  'UA': 'ua',
  'RU': 'ru'
};

const pure_dataset = require('../data/iso3166-2.json');

fs.writeFileSync('./mapping/ISO3TO2.json', JSON.stringify(Object
  .keys(pure_dataset)
  .map(key => pure_dataset[key])
  .map(({iso3, iso}) => ([iso3, iso]))
  .reduce((acc, [iso3, iso2]) => (acc[iso3] = iso2 , acc), {})
));

fs.writeFileSync('./mapping/woff2iso.json', JSON.stringify(Object
  .keys(pure_dataset)
  .map(key => pure_dataset[key].regions)
  .reduce((acc, regions) => (
    regions.forEach( region => (acc[region.reference.wof] = region.iso) ), acc
  ), {})
));


Object.keys(listOfDisputes).forEach(disputeName => {

  let dataset = pure_dataset;
  let DPrefix = '';
  if (listOfDisputes[disputeName]) {
    dataset = lib.getDataSet(listOfDisputes[disputeName], pure_dataset);
    DPrefix = `dispute/${disputeName}/`;
  }

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
    mkdirSync('./i18n/dispute');
    mkdirSync('./i18n/' + DPrefix);
    mkdirSync('./countryList/dispute');
    mkdirSync('./countryList/' + DPrefix);
    fs.writeFileSync('./i18n/' + DPrefix + lang + '.json', JSON.stringify(i18n[lang]));
    fs.writeFileSync('./countryList/' + DPrefix + lang + '_ref.json', JSON.stringify(langs[lang]));
    fs.writeFileSync('./countryList/' + DPrefix + lang + '.json', JSON.stringify(
      mmap(langs[lang], x => Object.assign({}, x, {
        reference: {
          openstreetmap: x.reference.openstreetmap
        }
      }))
    ));
    const langRegions = regions[lang];
    Object.keys(langRegions).forEach(iso1 => {
      mkdirSync('./regions/' + iso1);
      mkdirSync('./regions/' + iso1 + '/dispute');
      mkdirSync('./regions/' + iso1 + '/' + DPrefix);
      fs.writeFileSync('./regions/' + iso1 + '/' + DPrefix + lang + '.json', JSON.stringify(
        langRegions[iso1].map(x => Object.assign({}, x, {reference: {}}))
      ));
      fs.writeFileSync('./regions/' + iso1 + '/' + DPrefix + lang + '_ref.json', JSON.stringify(langRegions[iso1]));
    });
  });
});

