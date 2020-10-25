"use strict";
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
const semantic_ui_react_1 = require("semantic-ui-react");
const react_redux_1 = require("react-redux");
const redux_1 = require("redux");
const RemoteConsoles = __importStar(require("../../jsapi/remoteConsoles"));
const react_responsive_1 = __importDefault(require("react-responsive"));
function ModulesSidebar({ id, modules }) {
    if (modules.length == 0) {
        return null;
    }
    return React.createElement(React.Fragment, null,
        React.createElement(react_responsive_1.default, { maxDeviceWidth: 1224 },
            React.createElement(semantic_ui_react_1.Grid.Column, null,
                React.createElement(semantic_ui_react_1.Accordion, { styled: true, vertical: true, panels: modules.sort(sortByName).map(renderModule) }))),
        React.createElement(react_responsive_1.default, { minDeviceWidth: 1224 },
            React.createElement(semantic_ui_react_1.Grid.Column, { width: 3, style: { maxHeight: 'calc(100vh - 50px)', overflowY: 'auto' } },
                React.createElement(semantic_ui_react_1.Accordion, { styled: true, vertical: true, panels: modules.sort(sortByName).map(renderModule) }))));
}
function sortByName(a, b) {
    if (!!a.Name)
        return 1;
    if (!!b.Name)
        return -1;
    return a.Name > b.Name ? 1 : -1;
}
function renderModule(item) {
    return {
        title: item.Name,
        content: {
            content: [
                item.Submodules.length > 0 ? React.createElement(semantic_ui_react_1.Header, { as: 'h5' }, "Submodules") : null,
                item.Submodules.length > 0 ? React.createElement(semantic_ui_react_1.Accordion.Accordion, { panels: item.Submodules.sort(sortByName).map(renderModule) }) : null,
                item.Commands.length > 0 ? React.createElement(semantic_ui_react_1.Header, { as: 'h5' }, "Commands") : null,
                item.Commands.length > 0 ? React.createElement(semantic_ui_react_1.Accordion.Accordion, { exclusive: false, panels: item.Commands.sort(sortByName).map(renderCommand) }) : null
            ]
        }
    };
}
function renderCommand(item) {
    return {
        title: item.Name || "(Default)",
        content: {
            content: [...item.Parameters.map(param => React.createElement("p", null,
                    React.createElement("b", null, param.Name),
                    " ",
                    React.createElement("i", null,
                        "(",
                        param.Type,
                        ")"))),
                React.createElement("p", null, item.Description)]
        }
    };
}
const mapStateToProps = (state, ownProps) => {
    return {
        modules: RemoteConsoles.makeModulesSelector(ownProps.id)(state),
    };
};
function mapDispatchToProps(dispatch) { return {}; }
;
const withConnect = react_redux_1.connect(mapStateToProps, mapDispatchToProps);
exports.default = redux_1.compose(withConnect)(ModulesSidebar);
