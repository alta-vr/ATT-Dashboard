"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reselect_1 = require("reselect");
const reducer_1 = require("./reducer");
/**
 * Direct selector to the languageToggle state domain
 */
const selectLanguage = state => state.language || reducer_1.initialState;
exports.selectLanguage = selectLanguage;
/**
 * Select the language locale
 */
const makeSelectLocale = () => reselect_1.createSelector(selectLanguage, languageState => languageState.locale);
exports.makeSelectLocale = makeSelectLocale;
