"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const effects_1 = require("redux-saga/effects");
const alta_jsapi_1 = require("alta-jsapi");
const ReduxAccess_1 = __importDefault(require("./ReduxAccess"));
const SERVERS_REQUEST = 'app/jsapi/servers/SERVERS_REQUEST';
const SERVERS_REQUEST_SUCCESS = 'app/jsapi/servers/SERVERS_REQUEST_SUCCESS';
const SERVERS_REQUEST_FAILURE = 'app/jsapi/servers/SERVERS_REQUEST_FAILURE';
const initialState = {
    servers: undefined,
    error: undefined,
    isRequesting: false,
};
const reducer = (state, action, draft) => {
    switch (action.type) {
        case SERVERS_REQUEST:
            draft.isRequesting = true;
            draft.error = undefined;
            break;
        case SERVERS_REQUEST_SUCCESS:
            draft.servers = action.servers;
            draft.isRequesting = false;
            break;
        case SERVERS_REQUEST_FAILURE:
            draft.error = JSON.stringify(action.error);
            draft.isRequesting = false;
            break;
    }
};
const sagas = [requestServersSaga];
function* requestServersSaga() {
    while (true) {
        yield effects_1.take(SERVERS_REQUEST);
        try {
            const servers = yield effects_1.call(alta_jsapi_1.Servers.getOnline);
            yield effects_1.put(success(servers));
        }
        catch (error) {
            console.error(error);
            yield effects_1.put(failure(error));
        }
    }
    function success(servers) {
        return { type: SERVERS_REQUEST_SUCCESS, servers };
    }
    function failure(error) {
        return { type: SERVERS_REQUEST_FAILURE, error };
    }
}
const jsapiRedux = new ReduxAccess_1.default('servers', initialState, reducer, sagas);
exports.inject = () => jsapiRedux.inject();
exports.makeSelector = () => jsapiRedux.makeSelector();
exports.getServers = () => ({ type: SERVERS_REQUEST });
