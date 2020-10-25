"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const invariant_1 = __importDefault(require("invariant"));
/**
 * Validate the shape of redux store
 */
function checkStore(store) {
    const shape = {
        dispatch: lodash_1.isFunction,
        subscribe: lodash_1.isFunction,
        getState: lodash_1.isFunction,
        replaceReducer: lodash_1.isFunction,
        runSaga: lodash_1.isFunction,
        injectedReducers: lodash_1.isObject,
        injectedSagas: lodash_1.isObject,
    };
    invariant_1.default(lodash_1.conformsTo(store, shape), '(app/utils...) injectors: Expected a valid redux store');
}
exports.default = checkStore;
