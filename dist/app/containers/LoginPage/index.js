"use strict";
/**
 *
 * LoginPage
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
const react_redux_1 = require("react-redux");
const reselect_1 = require("reselect");
const redux_1 = require("redux");
const semantic_ui_react_1 = require("semantic-ui-react");
const Sessions = __importStar(require("jsapi/sessions"));
function LoginPage({ sessions, login, logout }) {
    Sessions.inject();
    // useInjectReducer({ key: 'login', reducer });
    // useInjectSaga({ key: 'login', saga });
    const [username, setUsername] = react_1.default.useState("");
    const [password, setPassword] = react_1.default.useState("");
    const { isLoggedIn, isProcessing, loginError } = sessions;
    if (isLoggedIn) {
        return react_1.default.createElement(semantic_ui_react_1.Form, { onSubmit: info => logout() },
            react_1.default.createElement("p", null,
                "Logged in as ",
                sessions.username),
            react_1.default.createElement(semantic_ui_react_1.Button, { type: "submit" }, "Logout"));
    }
    if (!loginError) {
        //login("", "");
    }
    return (react_1.default.createElement(semantic_ui_react_1.Form, { error: !!loginError, loading: isProcessing, onSubmit: info => login(username, password) },
        react_1.default.createElement(semantic_ui_react_1.Form.Field, null,
            react_1.default.createElement("label", null, "Username or Email"),
            react_1.default.createElement("input", { placeholder: "Username", onChange: event => { setUsername(event.target.value); } })),
        react_1.default.createElement(semantic_ui_react_1.Form.Field, null,
            react_1.default.createElement("label", null, "Password"),
            react_1.default.createElement("input", { placeholder: "Password", type: "password", onChange: event => { setPassword(event.target.value); } })),
        react_1.default.createElement(semantic_ui_react_1.Form.Field, null),
        react_1.default.createElement(semantic_ui_react_1.Message, { error: true, header: 'Error!', content: loginError }),
        react_1.default.createElement(semantic_ui_react_1.Button, { type: 'submit' }, "Login")));
}
exports.LoginPage = LoginPage;
LoginPage.propTypes = {
// login: PropTypes.object.isRequired,
// dispatch: PropTypes.func.isRequired,
};
const mapStateToProps = reselect_1.createStructuredSelector({
    sessions: Sessions.makeSelector(),
});
function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        login: (username, password) => { dispatch(Sessions.login(username, password)); },
        logout: () => { dispatch(Sessions.logout()); }
    };
}
const withConnect = react_redux_1.connect(mapStateToProps, mapDispatchToProps);
exports.default = redux_1.compose(withConnect)(LoginPage);
