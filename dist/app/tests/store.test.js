"use strict";
/**
 * Test store addons
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_router_dom_1 = require("react-router-dom");
const configureStore_1 = __importDefault(require("../configureStore"));
describe('configureStore', () => {
    let store;
    beforeAll(() => {
        store = configureStore_1.default({}, react_router_dom_1.browserHistory);
    });
    describe('injectedReducers', () => {
        it('should contain an object for reducers', () => {
            expect(typeof store.injectedReducers).toBe('object');
        });
    });
    describe('injectedSagas', () => {
        it('should contain an object for sagas', () => {
            expect(typeof store.injectedSagas).toBe('object');
        });
    });
    describe('runSaga', () => {
        it('should contain a hook for `sagaMiddleware.run`', () => {
            expect(typeof store.runSaga).toBe('function');
        });
    });
});
describe('configureStore params', () => {
    it('should call window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__', () => {
        /* eslint-disable no-underscore-dangle */
        const compose = jest.fn();
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ = () => compose;
        configureStore_1.default(undefined, react_router_dom_1.browserHistory);
        expect(compose).toHaveBeenCalled();
        /* eslint-enable */
    });
});
