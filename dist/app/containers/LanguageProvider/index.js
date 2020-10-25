"use strict";
/*
 *
 * LanguageProvider
 *
 * this component connects the redux state language locale to the
 * IntlProvider component and i18n messages (loaded from `app/translations`)
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const prop_types_1 = __importDefault(require("prop-types"));
const react_redux_1 = require("react-redux");
const reselect_1 = require("reselect");
const react_intl_1 = require("react-intl");
const selectors_1 = require("./selectors");
function LanguageProvider(props) {
    return (react_1.default.createElement(react_intl_1.IntlProvider, { locale: props.locale, key: props.locale, messages: props.messages[props.locale] }, react_1.default.Children.only(props.children)));
}
exports.LanguageProvider = LanguageProvider;
LanguageProvider.propTypes = {
    locale: prop_types_1.default.string,
    messages: prop_types_1.default.object,
    children: prop_types_1.default.element.isRequired,
};
const mapStateToProps = reselect_1.createSelector(selectors_1.makeSelectLocale(), locale => ({
    locale,
}));
function mapDispatchToProps(dispatch) {
    return {
        dispatch,
    };
}
exports.default = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(LanguageProvider);
