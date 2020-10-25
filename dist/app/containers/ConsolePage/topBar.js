"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const semantic_ui_react_1 = require("semantic-ui-react");
const react_redux_1 = require("react-redux");
const redux_1 = require("redux");
const RemoteConsoles = __importStar(require("../../jsapi/remoteConsoles"));
function TopBar({ id, clear, disconnect }) {
    return React.createElement(semantic_ui_react_1.Menu, { secondary: true },
        React.createElement(semantic_ui_react_1.Menu.Item, null,
            React.createElement(semantic_ui_react_1.Button, { onClick: () => clear(id) }, "Clear")),
        React.createElement(semantic_ui_react_1.Menu.Menu, { position: 'right' },
            React.createElement(semantic_ui_react_1.Button, { color: "red", onClick: () => disconnect(id) }, "Disconnect")));
}
const mapStateToProps = (state, ownProps) => {
    return {
        remoteConsole: RemoteConsoles.makeSelectorSingle(ownProps.id)(state),
    };
};
function mapDispatchToProps(dispatch) {
    var result = {
        send: (id, command, variable) => {
            dispatch(RemoteConsoles.send(id, command, variable));
        },
        clear: id => {
            dispatch(RemoteConsoles.clear(id));
        },
        disconnect: id => {
            dispatch(RemoteConsoles.disconnect(id));
        },
        subscribe: (id, eventType) => {
            dispatch(RemoteConsoles.subscribe(id, eventType));
        },
        unsubscribe: (id, eventType) => {
            dispatch(RemoteConsoles.unsubscribe(id, eventType));
        },
    };
    return result;
}
const withConnect = react_redux_1.connect(mapStateToProps, mapDispatchToProps);
exports.default = redux_1.compose(withConnect)(TopBar);
