"use strict";
/**
 *
 * ServersPage
 *
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const prop_types_1 = __importDefault(require("prop-types"));
const react_redux_1 = require("react-redux");
const reselect_1 = require("reselect");
const redux_1 = require("redux");
const styled_components_1 = __importDefault(require("styled-components"));
const injectSaga_1 = require("utils/injectSaga");
const injectReducer_1 = require("utils/injectReducer");
const selectors_1 = __importDefault(require("./selectors"));
const reducer_1 = __importDefault(require("./reducer"));
const saga_1 = __importDefault(require("./saga"));
const Servers = __importStar(require("jsapi/servers"));
const RemoteConsoles = __importStar(require("jsapi/remoteConsoles"));
const actions_1 = require("../Navigation/actions");
const react_responsive_1 = require("react-responsive");
const semantic_ui_react_1 = require("semantic-ui-react");
const ResponsiveCard = styled_components_1.default(semantic_ui_react_1.Card) `

  width: ${props => props.desktop ? '290px' : '100% !important'};
`;
function ServersPage({ servers, getServers, connect, disconnect }) {
    injectReducer_1.useInjectReducer({ key: 'serversPage', reducer: reducer_1.default });
    injectSaga_1.useInjectSaga({ key: 'serversPage', saga: saga_1.default });
    const [filter, setFilter] = react_1.default.useState('');
    Servers.inject();
    RemoteConsoles.inject();
    if (!servers.servers && !servers.isRequesting && !servers.error) {
        getServers();
    }
    const isDesktop = react_responsive_1.useMediaQuery({ query: '(min-device-width: 1224px)' });
    const filterRegex = new RegExp(filter, "i");
    return (react_1.default.createElement("div", null,
        !!servers.error && (react_1.default.createElement(semantic_ui_react_1.Message, { error: true, header: "Error!", content: servers.error })),
        react_1.default.createElement(semantic_ui_react_1.Menu, null,
            react_1.default.createElement(semantic_ui_react_1.Menu.Item, null,
                react_1.default.createElement(semantic_ui_react_1.Button, { primary: true, onClick: () => getServers() }, "Refresh"),
                react_1.default.createElement(semantic_ui_react_1.Button, { onClick: () => connect("Local", -1, '127.0.0.1', 1760) }, "Test"))),
        react_1.default.createElement(semantic_ui_react_1.Input, { fluid: true, icon: 'search', onChange: (event, args) => setFilter(args.value) }),
        react_1.default.createElement(semantic_ui_react_1.Divider, null),
        react_1.default.createElement(semantic_ui_react_1.Card.Group, null, servers.servers &&
            servers.servers
                .filter(item => item.name.match(filterRegex))
                .sort((a, b) => b.online_players.length - a.online_players.length)
                .map(item => (react_1.default.createElement(ResponsiveCard, { key: item.id, desktop: isDesktop },
                react_1.default.createElement(semantic_ui_react_1.Card.Content, null,
                    react_1.default.createElement(semantic_ui_react_1.Card.Header, null, item.name),
                    react_1.default.createElement(semantic_ui_react_1.Card.Meta, null, item.region),
                    react_1.default.createElement(semantic_ui_react_1.Divider, null),
                    react_1.default.createElement(semantic_ui_react_1.Grid, { columns: 2 },
                        react_1.default.createElement(semantic_ui_react_1.Grid.Row, { verticalAlign: 'middle' },
                            react_1.default.createElement(semantic_ui_react_1.Grid.Column, null,
                                react_1.default.createElement(semantic_ui_react_1.Icon, { name: 'user' }),
                                item.online_players.length,
                                " Online"),
                            react_1.default.createElement(semantic_ui_react_1.Grid.Column, null,
                                react_1.default.createElement(semantic_ui_react_1.Button, { basic: true, color: 'green', onClick: () => connect(item.name, item.id) }, "Connect")))),
                    react_1.default.createElement(semantic_ui_react_1.Divider, null),
                    react_1.default.createElement(semantic_ui_react_1.List, null, item.online_players.map(player => react_1.default.createElement(semantic_ui_react_1.List.Item, null,
                        react_1.default.createElement(semantic_ui_react_1.Image, { avatar: true, src: 'https://townshiptale.com/static/media/skull.ece1749d.svg' }),
                        react_1.default.createElement(semantic_ui_react_1.List.Content, null,
                            react_1.default.createElement(semantic_ui_react_1.List.Header, null, player.username),
                            react_1.default.createElement(semantic_ui_react_1.List.Description, null, player.id))))))))))));
}
exports.ServersPage = ServersPage;
ServersPage.propTypes = {
    dispatch: prop_types_1.default.func.isRequired,
};
const mapStateToProps = reselect_1.createStructuredSelector({
    serversPage: selectors_1.default(),
    servers: Servers.makeSelector(),
    remoteConsoles: RemoteConsoles.makeSelector(),
});
function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        getServers: () => {
            dispatch(Servers.getServers());
        },
        connect: (name, id, ip, port, token) => {
            dispatch(RemoteConsoles.connect(name, id, ip, port, token));
            dispatch(actions_1.changeTab(id));
        },
        disconnect: id => {
            dispatch(RemoteConsoles.disconnect(id));
        },
    };
}
const withConnect = react_redux_1.connect(mapStateToProps, mapDispatchToProps);
exports.default = redux_1.compose(withConnect)(ServersPage);
