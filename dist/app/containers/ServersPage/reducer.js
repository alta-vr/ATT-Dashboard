"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 *
 * ServersPage reducer
 *
 */
const immer_1 = __importDefault(require("immer"));
const constants_1 = require("./constants");
exports.initialState = {};
/* eslint-disable default-case, no-param-reassign */
const serversPageReducer = (state = exports.initialState, action) => immer_1.default(state, ( /* draft */) => {
    switch (action.type) {
        case constants_1.DEFAULT_ACTION:
            break;
    }
});
exports.default = serversPageReducer;
