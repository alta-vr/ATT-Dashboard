"use strict";
/**
 * Combine all reducers in this file and export the combined reducers.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redux_1 = require("redux");
const connected_react_router_1 = require("connected-react-router");
const history_1 = __importDefault(require("utils/history"));
const reducer_1 = __importDefault(require("containers/LanguageProvider/reducer"));
/**
 * Merges the main reducer with the router state and dynamically injected reducers
 */
function createReducer(injectedReducers = {}) {
    const rootReducer = redux_1.combineReducers(Object.assign({ language: reducer_1.default, router: connected_react_router_1.connectRouter(history_1.default) }, injectedReducers));
    return rootReducer;
}
exports.default = createReducer;
