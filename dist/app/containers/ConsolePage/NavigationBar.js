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
function NavigationBar({ options }) {
    const [tab, setTab] = React.useState(options[0].name);
    const handleClick = (e, args) => setTab(args.id);
    return React.createElement(React.Fragment, null,
        React.createElement(semantic_ui_react_1.Menu, { fluid: true, widths: 3 }, options.map(item => React.createElement(semantic_ui_react_1.Menu.Item, { id: item.name, name: item.name, active: tab === item.name, onClick: handleClick }))),
        options.find(item => item.name == tab).content());
}
exports.default = NavigationBar;
