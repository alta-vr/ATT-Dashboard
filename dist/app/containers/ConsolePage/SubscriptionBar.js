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
exports.allLogs = [
    'TraceLog',
    'DebugLog',
    'InfoLog',
    'WarnLog',
    'ErrorLog',
    'FatalLog',
];
const hiddenEvents = ['OffLog', 'None'];
const hiddenAndLogEvents = [...exports.allLogs, ...hiddenEvents];
function SubscriptionBar({ id, subscribe, unsubscribe, subscriptions, events }) {
    const [newSubscribe, setSubscribe] = React.useState('None');
    const [eventSearch, setEventSearch] = React.useState('');
    const logToggle = (label, events) => {
        const isEnabled = events.every(event => subscriptions.includes(event));
        return (React.createElement(semantic_ui_react_1.Menu.Item, null,
            React.createElement(semantic_ui_react_1.Checkbox, { toggle: true, label: label, checked: isEnabled, onChange: () => events.forEach(event => isEnabled ? unsubscribe(id, event) : subscribe(id, event)) })));
    };
    const logToggleDropdown = (label, events) => {
        const isEnabled = events.every(event => subscriptions.includes(event));
        return (React.createElement(semantic_ui_react_1.Dropdown.Item, null,
            React.createElement(semantic_ui_react_1.Checkbox, { toggle: true, label: label, checked: isEnabled, onChange: () => events.forEach(event => isEnabled ? unsubscribe(id, event) : subscribe(id, event)) })));
    };
    const logOptions = () => {
        return React.createElement(React.Fragment, null,
            logToggle('Trace', ['TraceLog']),
            logToggle('Debug', ['DebugLog']),
            logToggle('Info', ['InfoLog']),
            logToggle('Warn', ['WarnLog']),
            logToggle('Error', ['ErrorLog']),
            logToggle('Fatal', ['FatalLog']),
            logToggle('All Logs', exports.allLogs));
    };
    const isSubscribeMatch = subscriptions.includes(newSubscribe);
    const eventSearchRegex = new RegExp(eventSearch, "i");
    return React.createElement(semantic_ui_react_1.Menu, { fluid: true, stackable: true },
        React.createElement(react_responsive_1.default, { minDeviceWidth: 1224 },
            logOptions(),
            React.createElement(semantic_ui_react_1.Dropdown, { item: true, text: 'Other', closeOnChange: false, multiple: true, simple: true },
                React.createElement(semantic_ui_react_1.Dropdown.Menu, null,
                    React.createElement(semantic_ui_react_1.Input, { icon: 'search', iconPosition: 'left', name: 'search', value: eventSearch, onChange: (event, args) => setEventSearch(args.value) }),
                    !events ? null : events.filter((event) => event.name.match(eventSearchRegex)).map((item) => hiddenAndLogEvents.includes(item.name) ? null : logToggleDropdown(item.name, [item.name]))))),
        React.createElement(react_responsive_1.default, { maxDeviceWidth: 1224 },
            React.createElement(semantic_ui_react_1.Input, { icon: 'search', iconPosition: 'left', name: 'search', value: eventSearch, onChange: (event, args) => setEventSearch(args.value) }),
            events.filter((event) => event.name.match(eventSearchRegex)).map((event) => hiddenEvents.includes(event.name) ? null : logToggle(event.name, [event.name]))));
}
const mapStateToProps = (state, ownProps) => {
    return {
        subscriptions: RemoteConsoles.makeSubscriptionsSelector(ownProps.id)(state),
        events: RemoteConsoles.makeEventsSelector(ownProps.id)(state),
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
exports.default = redux_1.compose(withConnect)(SubscriptionBar);
