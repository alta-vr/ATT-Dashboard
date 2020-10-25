"use strict";
/**
 * app.js
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// Needed for redux-saga es6 generator support
require("@babel/polyfill");
// Import all the third party stuff
const react_1 = __importDefault(require("react"));
const react_dom_1 = __importDefault(require("react-dom"));
const react_redux_1 = require("react-redux");
const connected_react_router_1 = require("connected-react-router");
const history_1 = __importDefault(require("utils/history"));
require("sanitize.css/sanitize.css");
// Import root app
const App_1 = __importDefault(require("containers/App"));
// Import Language Provider
const LanguageProvider_1 = __importDefault(require("containers/LanguageProvider"));
// Load the favicon and the .htaccess file
/* eslint-disable import/no-unresolved, import/extensions */
require("!file-loader?name=[name].[ext]!./images/favicon.ico");
require("file-loader?name=.htaccess!./.htaccess");
/* eslint-enable import/no-unresolved, import/extensions */
const configureStore_1 = __importDefault(require("./configureStore"));
// Import i18n messages
const i18n_1 = require("./i18n");
// Create redux store with history
const initialState = {};
const store = configureStore_1.default(initialState, history_1.default);
const MOUNT_NODE = document.getElementById('app');
const render = messages => {
    react_dom_1.default.render(react_1.default.createElement(react_redux_1.Provider, { store: store },
        react_1.default.createElement(LanguageProvider_1.default, { messages: messages },
            react_1.default.createElement(connected_react_router_1.ConnectedRouter, { history: history_1.default },
                react_1.default.createElement(App_1.default, null)))), MOUNT_NODE);
};
if (module.hot) {
    // Hot reloadable React components and translation json files
    // modules.hot.accept does not accept dynamic dependencies,
    // have to be constants at compile-time
    module.hot.accept(['./i18n', 'containers/App'], () => {
        react_dom_1.default.unmountComponentAtNode(MOUNT_NODE);
        render(i18n_1.translationMessages);
    });
}
// Chunked polyfill for browsers without Intl support
if (!window.Intl) {
    new Promise(resolve => {
        resolve(Promise.resolve().then(() => __importStar(require('intl'))));
    })
        .then(() => Promise.all([Promise.resolve().then(() => __importStar(require('intl/locale-data/jsonp/en.js')))]))
        .then(() => render(i18n_1.translationMessages))
        .catch(err => {
        throw err;
    });
}
else {
    render(i18n_1.translationMessages);
}
// Install ServiceWorker and AppCache in the end since
// it's not most important operation and if main code fails,
// we do not want it installed
if (process.env.NODE_ENV === 'production') {
    require('offline-plugin/runtime').install(); // eslint-disable-line global-require
}
