describe("3166 smoke test", () => {
    it("should not fail", () => {
// YAP YAP.. smoke tests

        const lib = require('../lib/iso3166.js');

        lib.getDataSet('ru')['AU'].regions[0].name;
        lib.findRegionByCode('AU-NSW').name;
        lib.findCountryByName('Россия');
        lib.getRegionsFor('AU')[0].name;
        lib.findCountryByName('Россия', 'en').regions[0].name;

        lib.reduce(lib.getDataSet(), 'ru', ['CA', 'AU']);

        lib.changeNameProvider('osm');
        lib.getDataSet()['RW'].names;
    });
});