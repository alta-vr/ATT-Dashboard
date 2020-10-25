"use strict";
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
const react_1 = __importDefault(require("react"));
const react_testing_library_1 = require("react-testing-library");
const react_intl_1 = require("react-intl");
const react_redux_1 = require("react-redux");
const react_router_dom_1 = require("react-router-dom");
const index_1 = __importStar(require("../index"));
const configureStore_1 = __importDefault(require("../../../configureStore"));
const i18n_1 = require("../../../i18n");
const messages = react_intl_1.defineMessages({
    someMessage: {
        id: 'some.id',
        defaultMessage: 'This is some default message',
        en: 'This is some en message',
    },
});
describe('<LanguageProvider />', () => {
    it('should render its children', () => {
        const children = react_1.default.createElement("h1", null, "Test");
        const { container } = react_testing_library_1.render(react_1.default.createElement(index_1.LanguageProvider, { messages: messages, locale: "en" }, children));
        expect(container.firstChild).not.toBeNull();
    });
});
describe('<ConnectedLanguageProvider />', () => {
    let store;
    beforeAll(() => {
        store = configureStore_1.default({}, react_router_dom_1.browserHistory);
    });
    it('should render the default language messages', () => {
        const { queryByText } = react_testing_library_1.render(react_1.default.createElement(react_redux_1.Provider, { store: store },
            react_1.default.createElement(index_1.default, { messages: i18n_1.translationMessages },
                react_1.default.createElement(react_intl_1.FormattedMessage, Object.assign({}, messages.someMessage)))));
        expect(queryByText(messages.someMessage.defaultMessage)).not.toBeNull();
    });
});
