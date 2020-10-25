"use strict";
/**
 *
 * Tests for Navigation
 *
 * @see https://github.com/react-boilerplate/react-boilerplate/tree/master/docs/testing
 *
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_testing_library_1 = require("react-testing-library");
const react_intl_1 = require("react-intl");
// import 'jest-dom/extend-expect'; // add some helpful assertions
const index_1 = require("../index");
const i18n_1 = require("../../../i18n");
describe('<Navigation />', () => {
    it('Expect to not log errors in console', () => {
        const spy = jest.spyOn(global.console, 'error');
        const dispatch = jest.fn();
        react_testing_library_1.render(react_1.default.createElement(react_intl_1.IntlProvider, { locale: i18n_1.DEFAULT_LOCALE },
            react_1.default.createElement(index_1.Navigation, { dispatch: dispatch })));
        expect(spy).not.toHaveBeenCalled();
    });
    it('Expect to have additional unit tests specified', () => {
        expect(true).toEqual(false);
    });
    /**
     * Unskip this test to use it
     *
     * @see {@link https://jestjs.io/docs/en/api#testskipname-fn}
     */
    it.skip('Should render and match the snapshot', () => {
        const { container: { firstChild }, } = react_testing_library_1.render(react_1.default.createElement(react_intl_1.IntlProvider, { locale: i18n_1.DEFAULT_LOCALE },
            react_1.default.createElement(index_1.Navigation, null)));
        expect(firstChild).toMatchSnapshot();
    });
});
