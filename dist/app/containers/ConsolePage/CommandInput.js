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
function CommandInput({ id, send, sent }) {
    const [command, setCommand] = React.useState('');
    const [commandIndex, setCommandIndex] = React.useState(-1);
    const commandRef = React.useRef();
    function downHandler(e) {
        if (e.keyCode == 27) {
            setCommandIndex(-1);
            setCommand("");
        }
        else if (e.keyCode == 38) {
            var keys = Object.keys(sent);
            // up arrow
            if (commandIndex < 0) {
                var index = keys.length - 1;
                setCommandIndex(index);
                if (index >= 0) {
                    var key = parseInt(keys[index]);
                    setCommand(sent[key].command);
                }
                else {
                    setCommand("");
                }
            }
            else if (commandIndex >= 0) {
                var index = commandIndex - 1;
                setCommandIndex(index);
                if (index >= 0) {
                    var key = parseInt(keys[index]);
                    setCommand(sent[key].command);
                }
                else {
                    setCommand("");
                }
            }
        }
        else if (e.keyCode == 40 && commandIndex > -1) {
            // down arrow
            var index = commandIndex + 1;
            var keys = Object.keys(sent);
            if (index < keys.length) {
                setCommandIndex(index);
                var key = parseInt(keys[index]);
                setCommand(sent[key].command);
            }
            else {
                setCommandIndex(-1);
                setCommand("");
            }
        }
    }
    React.useEffect(() => {
        window.addEventListener('keydown', downHandler);
        return () => {
            window.removeEventListener('keydown', downHandler);
        };
    });
    return React.createElement(semantic_ui_react_1.Form, { style: { position: 'sticky', bottom: 0 }, onSubmit: () => { send(id, command); setCommand(''); setCommandIndex(-1); } },
        React.createElement(semantic_ui_react_1.Input, { fluid: true, action: {
                type: 'submit',
                content: 'Send',
            }, placeholder: "player kill Joel", value: command, onChange: (event, data) => setCommand(data.value), ref: commandRef }));
}
const mapStateToProps = (state, ownProps) => {
    return {
        sent: RemoteConsoles.makeSentSelector(ownProps.id)(state),
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
exports.default = redux_1.compose(withConnect)(CommandInput);
