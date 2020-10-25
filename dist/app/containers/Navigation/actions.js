"use strict";
/*
 *
 * Navigation actions
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
function changeTab(tab) {
    return {
        type: constants_1.CHANGE_TAB,
        tab,
    };
}
exports.changeTab = changeTab;
