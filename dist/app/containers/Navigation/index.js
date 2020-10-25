"use strict";
/**
 *
 * Navigation
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
const react_1 = __importStar(require("react"));
const prop_types_1 = __importDefault(require("prop-types"));
const react_redux_1 = require("react-redux");
const reselect_1 = require("reselect");
const redux_1 = require("redux");
const injectSaga_1 = require("utils/injectSaga");
const injectReducer_1 = require("utils/injectReducer");
const semantic_ui_react_1 = require("semantic-ui-react");
const RemoteConsoles = __importStar(require("jsapi/remoteConsoles"));
const selectors_1 = __importDefault(require("./selectors"));
const reducer_1 = __importDefault(require("./reducer"));
const saga_1 = __importDefault(require("./saga"));
const react_responsive_1 = __importDefault(require("react-responsive"));
const styled_components_1 = __importDefault(require("styled-components"));
const actions_1 = require("./actions");
const LoginPage_1 = __importDefault(require("../LoginPage"));
const ServersPage_1 = __importDefault(require("../ServersPage"));
const ConsolePage_1 = __importDefault(require("../ConsolePage"));
const remoteConsoles_1 = require("../../jsapi/remoteConsoles");
const emptyPage = () => react_1.default.createElement(semantic_ui_react_1.Segment, null, "This is an empty tab!");
const pages = {
    account: () => react_1.default.createElement(LoginPage_1.default, null),
    servers: () => react_1.default.createElement(ServersPage_1.default, null),
};
const BodyGrid = styled_components_1.default(semantic_ui_react_1.Grid) `

  min-height: 100%;

  @media (max-width: 1224px)
  {
		min-height: 100vh;
  }
`;
function Navigation({ navigation, changeTab, remoteConsoles }) {
    injectReducer_1.useInjectReducer({ key: 'navigation', reducer: reducer_1.default });
    injectSaga_1.useInjectSaga({ key: 'navigation', saga: saga_1.default });
    RemoteConsoles.inject();
    const handleClick = (e, args) => changeTab(args.id);
    const active = pages[navigation.tab] ||
        (remoteConsoles_1.consoles[navigation.tab] == undefined
            ? pages.servers :
            () => react_1.default.createElement(ConsolePage_1.default, { id: navigation.tab }));
    function ServerTab({ name, id, status }) {
        return (react_1.default.createElement(semantic_ui_react_1.Menu.Item, { id: id, name: name, content: `${id} - ${name} (${status})`, active: navigation.tab == id, onClick: handleClick }));
    }
    function FullMenu(vertical) {
        return react_1.default.createElement(semantic_ui_react_1.Menu, { fluid: true, vertical: vertical, secondary: true, stackable: true, style: { maxWidth: '100%' } },
            react_1.default.createElement(semantic_ui_react_1.Menu.Item, { id: "account", name: "account", active: navigation.tab === 'account', onClick: handleClick }),
            react_1.default.createElement(semantic_ui_react_1.Menu.Item, { id: "servers", name: "servers", active: navigation.tab === 'servers', onClick: handleClick }),
            Object.values(remoteConsoles.servers).map(ServerTab));
    }
    return (react_1.default.createElement(react_1.Fragment, null,
        react_1.default.createElement(react_responsive_1.default, { maxDeviceWidth: 1224 }, FullMenu(false)),
        react_1.default.createElement(BodyGrid, null,
            react_1.default.createElement(react_responsive_1.default, { minDeviceWidth: 1224 },
                react_1.default.createElement(semantic_ui_react_1.Grid.Column, { stretched: true, width: 2 }, FullMenu(true))),
            react_1.default.createElement(semantic_ui_react_1.Grid.Column, { stretched: true, computer: 14, mobile: 16 }, active()))));
}
exports.Navigation = Navigation;
Navigation.propTypes = {
    navigation: prop_types_1.default.object,
    dispatch: prop_types_1.default.func.isRequired,
    changeTab: prop_types_1.default.func.isRequired,
};
const mapStateToProps = reselect_1.createStructuredSelector({
    navigation: selectors_1.default(),
    remoteConsoles: RemoteConsoles.makeSelector(),
});
function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        changeTab: tab => dispatch(actions_1.changeTab(tab)),
    };
}
const withConnect = react_redux_1.connect(mapStateToProps, mapDispatchToProps);
exports.default = redux_1.compose(withConnect)(Navigation);
