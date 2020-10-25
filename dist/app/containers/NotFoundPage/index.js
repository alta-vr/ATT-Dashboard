"use strict";
/**
 * NotFoundPage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 *
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_intl_1 = require("react-intl");
const messages_1 = __importDefault(require("./messages"));
function NotFound() {
    return (react_1.default.createElement("h1", null,
        react_1.default.createElement(react_intl_1.FormattedMessage, Object.assign({}, messages_1.default.header))));
}
exports.default = NotFound;
