"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const actions_1 = require("../actions");
const constants_1 = require("../constants");
describe('LanguageProvider actions', () => {
    describe('Change Local Action', () => {
        it('has a type of CHANGE_LOCALE', () => {
            const expected = {
                type: constants_1.CHANGE_LOCALE,
                locale: 'de',
            };
            expect(actions_1.changeLocale('de')).toEqual(expected);
        });
    });
});
