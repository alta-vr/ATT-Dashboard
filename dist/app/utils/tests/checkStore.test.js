"use strict";
/**
 * Test injectors
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const checkStore_1 = __importDefault(require("../checkStore"));
describe('checkStore', () => {
    let store;
    beforeEach(() => {
        store = {
            dispatch: () => { },
            subscribe: () => { },
            getState: () => { },
            replaceReducer: () => { },
            runSaga: () => { },
            injectedReducers: {},
            injectedSagas: {},
        };
    });
    it('should not throw if passed valid store shape', () => {
        expect(() => checkStore_1.default(store)).not.toThrow();
    });
    it('should throw if passed invalid store shape', () => {
        expect(() => checkStore_1.default({})).toThrow();
        expect(() => checkStore_1.default(Object.assign(Object.assign({}, store), { injectedSagas: null }))).toThrow();
        expect(() => checkStore_1.default(Object.assign(Object.assign({}, store), { injectedReducers: null }))).toThrow();
        expect(() => checkStore_1.default(Object.assign(Object.assign({}, store), { runSaga: null }))).toThrow();
        expect(() => checkStore_1.default(Object.assign(Object.assign({}, store), { replaceReducer: null }))).toThrow();
    });
});
