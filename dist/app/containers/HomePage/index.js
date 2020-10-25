"use strict";
/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const semantic_ui_react_1 = require("semantic-ui-react");
const Navigation_1 = __importDefault(require("../Navigation"));
function HomePage() {
    return (react_1.default.createElement(semantic_ui_react_1.Container, null,
        react_1.default.createElement(semantic_ui_react_1.Header, null, "ATT Console"),
        react_1.default.createElement(semantic_ui_react_1.Divider, null),
        react_1.default.createElement(Navigation_1.default, null)));
}
exports.default = HomePage;
