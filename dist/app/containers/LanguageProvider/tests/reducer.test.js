"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const reducer_1 = __importDefault(require("../reducer"));
const constants_1 = require("../constants");
/* eslint-disable default-case, no-param-reassign */
describe('languageProviderReducer', () => {
    it('returns the initial state', () => {
        expect(reducer_1.default(undefined, {})).toEqual({
            locale: 'en',
        });
    });
    it('changes the locale', () => {
        expect(reducer_1.default(undefined, {
            type: constants_1.CHANGE_LOCALE,
            locale: 'de',
        })).toEqual({
            locale: 'de',
        });
    });
});
