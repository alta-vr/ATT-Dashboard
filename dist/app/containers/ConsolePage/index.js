"use strict";
/**
 *
 * ServersPage
 *
 */
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const PropTypes = __importStar(require("prop-types"));
const react_redux_1 = require("react-redux");
const redux_1 = require("redux");
const RemoteConsoles = __importStar(require("../../jsapi/remoteConsoles"));
const react_responsive_1 = __importDefault(require("react-responsive"));
const semantic_ui_react_1 = require("semantic-ui-react");
const topBar_1 = __importDefault(require("./topBar"));
const SubscriptionBar_1 = __importDefault(require("./SubscriptionBar"));
const CommandInput_1 = __importDefault(require("./CommandInput"));
const MessageTable_1 = __importDefault(require("./MessageTable"));
const ModulesSidebar_1 = __importDefault(require("./ModulesSidebar"));
const NavigationBar_1 = __importDefault(require("./NavigationBar"));
function ConsolePage({ id }) {
    RemoteConsoles.inject();
    return (React.createElement(semantic_ui_react_1.Grid, { fluid: true, columns: 'equal' },
        React.createElement(semantic_ui_react_1.Grid.Column, null,
            React.createElement(topBar_1.default, { id: id }),
            React.createElement(react_responsive_1.default, { minDeviceWidth: 1224 },
                React.createElement(SubscriptionBar_1.default, { id: id }),
                React.createElement(MessageTable_1.default, { id: id }),
                React.createElement(CommandInput_1.default, { id: id })),
            React.createElement(react_responsive_1.default, { maxDeviceWidth: 1224 },
                React.createElement(NavigationBar_1.default, { options: [
                        {
                            name: "Console",
                            content: () => React.createElement(React.Fragment, null,
                                React.createElement(MessageTable_1.default, { id: id }),
                                React.createElement(CommandInput_1.default, { id: id }))
                        },
                        {
                            name: "Events",
                            content: () => React.createElement(SubscriptionBar_1.default, { id: id })
                        },
                        {
                            name: "Modules",
                            content: () => React.createElement(ModulesSidebar_1.default, { id: id })
                        }
                    ] }))),
        React.createElement(react_responsive_1.default, { minDeviceWidth: 1224 },
            React.createElement(ModulesSidebar_1.default, { id: id }))));
}
exports.ConsolePage = ConsolePage;
ConsolePage.propTypes = {
    id: PropTypes.number.isRequired
};
const mapStateToProps = (state, ownProps) => {
    return {};
};
function mapDispatchToProps(dispatch) { return {}; }
;
const withConnect = react_redux_1.connect(mapStateToProps, mapDispatchToProps);
exports.default = redux_1.compose(withConnect)(ConsolePage);
