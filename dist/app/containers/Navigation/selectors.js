"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reselect_1 = require("reselect");
const reducer_1 = require("./reducer");
/**
 * Direct selector to the navigation state domain
 */
const selectNavigationDomain = state => state.navigation || reducer_1.initialState;
exports.selectNavigationDomain = selectNavigationDomain;
/**
 * Other specific selectors
 */
/**
 * Default selector used by Navigation
 */
const makeSelectNavigation = () => reselect_1.createSelector(selectNavigationDomain, substate => substate);
exports.default = makeSelectNavigation;
