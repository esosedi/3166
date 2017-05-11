describe("combine smoke test", () => {
    it("should not fail", () => {

        const countrySet = require('../countryList/en');
        const US = require('../regions/US/en_ref.json');

        const {combine} = require('../lib/combine');

        const subset = combine(countrySet, {
            US
        });

//smoke
        subset['US'].regions.find(region => region.iso === 'CA').name;
        subset['US'].regions.find(region => region.iso === 'CA').reference.openstreetmap.length;

    });
});