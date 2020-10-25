"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const effects_1 = require("redux-saga/effects");
const sha512_1 = __importDefault(require("crypto-js/sha512"));
const ReduxAccess_1 = __importDefault(require("./ReduxAccess"));
const GET_FRIENDS = 'app/jsapi/sessions/LOGIN_REQUEST';
const GET_FRIEND_REQUESTS = 'app/jsapi/sessions/LOGOUT_REQUEST';
const ADD_FRIEND = 'app/jsapi/sessions/LOGIN_SUCCESS';
const ACCEPT_FRIEND_REQUEST = 'app/jsapi/sessions/LOGIN_FAILURE';
const initialState = {
    isProcessing: false,
    isLoggedIn: false,
    username: undefined,
    loginError: undefined,
};
const reducer = (state, action, draft) => {
    switch (action.type) {
        case LOGIN_REQUEST:
            draft.isProcessing = true;
            draft.loginError = undefined;
            break;
        case LOGIN_SUCCESS:
            draft.isProcessing = false;
            draft.isLoggedIn = true;
            draft.username = Sessions.getUsername();
            break;
        case LOGIN_FAILURE:
            draft.isProcessing = false;
            draft.loginError = action.error;
            break;
        case LOGOUT_REQUEST:
            Sessions.logout();
            draft.isLoggedIn = false;
            draft.username = undefined;
            break;
    }
};
const sagas = [loginSaga];
function* loginSaga() {
    while (true) {
        const { username, password } = yield effects_1.take(LOGIN_REQUEST);
        try {
            let hash = sha512_1.default(password).toString();
            if (username.includes('@')) {
                yield effects_1.call(Sessions.loginWithEmail, username, hash);
            }
            else {
                yield effects_1.call(Sessions.loginWithUsername, username, hash);
            }
            yield effects_1.put(success());
        }
        catch (error) {
            var message = JSON.parse(error.error).message;
            console.log(message);
            yield effects_1.put(failure(message));
        }
    }
    function success() { return { type: LOGIN_SUCCESS }; }
    function failure(error) { return { type: LOGIN_FAILURE, error }; }
}
;
var jsapiRedux = new ReduxAccess_1.default('sessions', initialState, reducer, sagas);
exports.inject = () => jsapiRedux.inject();
exports.makeSelector = () => jsapiRedux.makeSelector();
exports.login = (username, password) => ({ type: LOGIN_REQUEST, username, password });
exports.logout = () => ({ type: LOGOUT_REQUEST });
