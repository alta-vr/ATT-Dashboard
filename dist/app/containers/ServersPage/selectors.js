"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reselect_1 = require("reselect");
const reducer_1 = require("./reducer");
/**
 * Direct selector to the serversPage state domain
 */
const selectServersPageDomain = state => state.serversPage || reducer_1.initialState;
exports.selectServersPageDomain = selectServersPageDomain;
/**
 * Other specific selectors
 */
/**
 * Default selector used by ServersPage
 */
const makeSelectServersPage = () => reselect_1.createSelector(selectServersPageDomain, substate => substate);
exports.default = makeSelectServersPage;
