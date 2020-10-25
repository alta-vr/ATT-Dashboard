"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_testing_library_1 = require("react-testing-library");
const react_intl_1 = require("react-intl");
const index_1 = __importDefault(require("../index"));
describe('<HomePage />', () => {
    it('should render and match the snapshot', () => {
        const { container: { firstChild }, } = react_testing_library_1.render(react_1.default.createElement(react_intl_1.IntlProvider, { locale: "en" },
            react_1.default.createElement(index_1.default, null)));
        expect(firstChild).toMatchSnapshot();
    });
});
