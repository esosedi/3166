import {expect} from 'chai';

import database_EN from '../i18n/dispute/UN/en';
import database_RU from '../i18n/dispute/UN/ru';
import database_DE from '../i18n/dispute/UN/de';
import database_FR from '../i18n/dispute/UN/fr';
import database_ES from '../i18n/dispute/UN/es';
import database_ZH from '../i18n/dispute/UN/zh';

describe('I18n test', () => {
    it('Australia names', () => {
        expect(database_EN.AU.name).to.equal("Australia");
        expect(database_RU.AU.name).to.equal("Австралия");
        expect(database_DE.AU.name).to.equal("Australien");
        expect(database_FR.AU.name).to.equal("Australie");
        expect(database_ES.AU.name).to.equal("Australia");
        expect(database_ZH.AU.name).to.equal("澳大利亚");
    });
});