"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const selectors_1 = require("../selectors");
describe('selectLanguage', () => {
    it('should select the global state', () => {
        const globalState = {};
        const mockedState = {
            language: globalState,
        };
        expect(selectors_1.selectLanguage(mockedState)).toEqual(globalState);
    });
});
