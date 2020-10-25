"use strict";
/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_router_dom_1 = require("react-router-dom");
const Loadable_1 = __importDefault(require("containers/HomePage/Loadable"));
const Loadable_2 = __importDefault(require("containers/NotFoundPage/Loadable"));
const global_styles_1 = __importDefault(require("../../global-styles"));
function App() {
    return ([
        react_1.default.createElement(react_router_dom_1.Switch, null,
            react_1.default.createElement(react_router_dom_1.Route, { exact: true, path: "/", component: Loadable_1.default }),
            react_1.default.createElement(react_router_dom_1.Route, { component: Loadable_2.default })),
        react_1.default.createElement(global_styles_1.default, null)
    ]);
}
exports.default = App;
