import {expect} from 'chai';

import database from '../i18n/dispute/UN/en';

describe('Country test', () => {

    it('should contain 234 country', () =>
        expect(Object.keys(database)).to.have.length(234)
    );

    it('AU states', ()=> {
        expect(
            database.AU.regions.map(({iso}) => iso).sort((a, b) => a.localeCompare(b))
        ).to.be.deep.equal(
          ['WA', 'VIC', 'TAS', 'SA', 'QLD', 'NT', 'NSW', 'ACT'].sort((a, b) => a.localeCompare(b))
        );
    });

    it('AU', ()=> {
        expect(database.AU.name).to.equal("Australia");
        expect(database.AU.iso).to.equal("AU");
        expect(database.AU.iso3).to.equal("AUS");
        expect(database.AU.fips).to.equal("AS");
    });
});