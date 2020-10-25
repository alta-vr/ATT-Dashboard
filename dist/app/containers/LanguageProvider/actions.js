"use strict";
/*
 *
 * LanguageProvider actions
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
function changeLocale(languageLocale) {
    return {
        type: constants_1.CHANGE_LOCALE,
        locale: languageLocale,
    };
}
exports.changeLocale = changeLocale;
