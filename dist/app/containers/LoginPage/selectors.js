"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reselect_1 = require("reselect");
const reducer_1 = require("./reducer");
/**
 * Direct selector to the loginPage state domain
 */
const selectLoginDomain = state => state.login || reducer_1.initialState;
exports.selectLoginDomain = selectLoginDomain;
/**
 * Other specific selectors
 */
/**
 * Default selector used by LoginPage
 */
const makeSelectLogin = () => reselect_1.createSelector(selectLoginDomain, substate => substate);
exports.default = makeSelectLogin;
