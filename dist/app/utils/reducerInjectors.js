"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const invariant_1 = __importDefault(require("invariant"));
const lodash_1 = require("lodash");
const checkStore_1 = __importDefault(require("./checkStore"));
const reducers_1 = __importDefault(require("../reducers"));
function injectReducerFactory(store, isValid) {
    return function injectReducer(key, reducer) {
        if (!isValid)
            checkStore_1.default(store);
        invariant_1.default(lodash_1.isString(key) && !lodash_1.isEmpty(key) && lodash_1.isFunction(reducer), '(app/utils...) injectReducer: Expected `reducer` to be a reducer function');
        // Check `store.injectedReducers[key] === reducer` for hot reloading when a key is the same but a reducer is different
        if (Reflect.has(store.injectedReducers, key) &&
            store.injectedReducers[key] === reducer)
            return;
        store.injectedReducers[key] = reducer; // eslint-disable-line no-param-reassign
        store.replaceReducer(reducers_1.default(store.injectedReducers));
    };
}
exports.injectReducerFactory = injectReducerFactory;
function getInjectors(store) {
    checkStore_1.default(store);
    return {
        injectReducer: injectReducerFactory(store, true),
    };
}
exports.default = getInjectors;
