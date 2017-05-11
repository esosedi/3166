import {expect} from 'chai';

import database_pure from '../i18n/en';
import database_UN from '../i18n/dispute/UN/en';
import database_RU from '../i18n/dispute/RU/en';

describe('Terrotorial dispute test', () => {
    it('show have difference between disputes', () => {
        expect(database_pure).not.to.be.deep.equal(database_UN);
        expect(database_pure).not.to.be.deep.equal(database_RU);
        expect(database_UN).not.to.be.deep.equal(database_RU);
    });

    it('should be equal in equal states', () => {
        expect(database_pure.US).to.be.deep.equal(database_UN.US);
        expect(database_pure.US).to.be.deep.equal(database_RU.US);
    });

    it('should not be equal in unequal states', () => {
        expect(database_pure.RU).to.be.deep.equal(database_UN.RU);
        expect(database_pure.RU).not.to.be.deep.equal(database_RU.RU);
    });

    describe('Crimea case', ()=> {
        it('should be found in UN / UA as 43, Autonomous Republic of Crimea', () =>
            expect(database_UN.UA.regions.find(({iso}) => iso === '43').name).to.be.equal('Autonomous Republic of Crimea')
        );
        it('should not be found in UN / RU as 43', () =>
            expect(database_UN.RU.regions.find(({iso}) => iso === '43')).to.be.undefined
        );
        it('should not be found in UN / RU as CR ', () =>
            expect(database_UN.RU.regions.find(({iso}) => iso === 'CR')).to.be.undefined
        );

        it('should not be found in RU / RU as 43 (keeping iso code)', () =>
            expect(database_RU.RU.regions.find(({iso}) => iso === '43')).to.be.undefined
        );
        it('should be found in RU / RU as CR (fixture)', () =>
            expect(database_RU.RU.regions.find(({iso}) => iso === 'CR').name).to.be.equal('Crimea')
        );
    });

    it('Taiwan case', ()=> {
        expect(database_UN.TW).not.to.be.undefined;
        expect(database_RU.TW).to.be.undefined;
    });
});