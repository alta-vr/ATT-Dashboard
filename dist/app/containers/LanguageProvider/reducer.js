"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 *
 * LanguageProvider reducer
 *
 */
const immer_1 = __importDefault(require("immer"));
const constants_1 = require("./constants");
const i18n_1 = require("../../i18n");
exports.initialState = {
    locale: i18n_1.DEFAULT_LOCALE,
};
/* eslint-disable default-case, no-param-reassign */
const languageProviderReducer = (state = exports.initialState, action) => immer_1.default(state, draft => {
    switch (action.type) {
        case constants_1.CHANGE_LOCALE:
            draft.locale = action.locale;
            break;
    }
});
exports.default = languageProviderReducer;
