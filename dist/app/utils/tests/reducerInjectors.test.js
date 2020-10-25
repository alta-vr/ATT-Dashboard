"use strict";
/**
 * Test injectors
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const immer_1 = __importDefault(require("immer"));
const react_router_dom_1 = require("react-router-dom");
const identity_1 = __importDefault(require("lodash/identity"));
const configureStore_1 = __importDefault(require("../../configureStore"));
const reducerInjectors_1 = __importStar(require("../reducerInjectors"));
// Fixtures
const initialState = { reduced: 'soon' };
/* eslint-disable default-case, no-param-reassign */
const reducer = (state = initialState, action) => immer_1.default(state, draft => {
    switch (action.type) {
        case 'TEST':
            draft.reduced = action.payload;
            break;
    }
});
describe('reducer injectors', () => {
    let store;
    let injectReducer;
    describe('getInjectors', () => {
        beforeEach(() => {
            store = configureStore_1.default({}, react_router_dom_1.memoryHistory);
        });
        it('should return injectors', () => {
            expect(reducerInjectors_1.default(store)).toEqual(expect.objectContaining({
                injectReducer: expect.any(Function),
            }));
        });
        it('should throw if passed invalid store shape', () => {
            Reflect.deleteProperty(store, 'dispatch');
            expect(() => reducerInjectors_1.default(store)).toThrow();
        });
    });
    describe('injectReducer helper', () => {
        beforeEach(() => {
            store = configureStore_1.default({}, react_router_dom_1.memoryHistory);
            injectReducer = reducerInjectors_1.injectReducerFactory(store, true);
        });
        it('should check a store if the second argument is falsy', () => {
            const inject = reducerInjectors_1.injectReducerFactory({});
            expect(() => inject('test', reducer)).toThrow();
        });
        it('it should not check a store if the second argument is true', () => {
            Reflect.deleteProperty(store, 'dispatch');
            expect(() => injectReducer('test', reducer)).not.toThrow();
        });
        it("should validate a reducer and reducer's key", () => {
            expect(() => injectReducer('', reducer)).toThrow();
            expect(() => injectReducer(1, reducer)).toThrow();
            expect(() => injectReducer(1, 1)).toThrow();
        });
        it('given a store, it should provide a function to inject a reducer', () => {
            injectReducer('test', reducer);
            const actual = store.getState().test;
            const expected = initialState;
            expect(actual).toEqual(expected);
        });
        it('should not assign reducer if already existing', () => {
            store.replaceReducer = jest.fn();
            injectReducer('test', reducer);
            injectReducer('test', reducer);
            expect(store.replaceReducer).toHaveBeenCalledTimes(1);
        });
        it('should assign reducer if different implementation for hot reloading', () => {
            store.replaceReducer = jest.fn();
            injectReducer('test', reducer);
            injectReducer('test', identity_1.default);
            expect(store.replaceReducer).toHaveBeenCalledTimes(2);
        });
    });
});
