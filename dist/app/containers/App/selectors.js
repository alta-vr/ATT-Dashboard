"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reselect_1 = require("reselect");
const selectRouter = state => state.router;
const makeSelectLocation = () => reselect_1.createSelector(selectRouter, routerState => routerState.location);
exports.makeSelectLocation = makeSelectLocation;
