"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const effects_1 = require("redux-saga/effects");
const ReduxAccess_1 = __importDefault(require("./ReduxAccess"));
const alta_jsapi_1 = require("alta-jsapi");
const att_websockets_1 = require("att-websockets");
const REMOTE_CONNECT_SUCCESS = 'app/jsapi/REMOTE_CONNECT_SUCCESS';
const REMOTE_CONNECT_FAILURE = 'app/jsapi/REMOTE_CONNECT_FAILURE';
const REMOTE_MESSAGE = 'app/jsapi/REMOTE_DATA';
const REMOTE_CONNECT = 'app/jsapi/REMOTE_CONNECT';
const REMOTE_DISCONNECT = 'app/jsapi/REMOTE_DISCONNECT';
const REMOTE_SEND = 'app/jsapi/REMOTE_SEND';
const REMOTE_CLEAR = 'app/jsapi/REMOTE_CLEAR';
const REMOTE_SUBSCRIBE = 'app/jsapi/REMOTE_SUBSCRIBE';
const REMOTE_UNSUBSCRIBE = 'app/jsapi/REMOTE_UNSUBSCRIBE';
exports.consoles = {};
var Status;
(function (Status) {
    Status[Status["Connecting"] = 0] = "Connecting";
    Status[Status["Connected"] = 1] = "Connected";
    Status[Status["Disconnected"] = 2] = "Disconnected";
})(Status || (Status = {}));
const initialState = {
    servers: {},
};
const reducer = (state, action, draft) => {
    switch (action.type) {
        case REMOTE_CONNECT:
            console.log(action);
            if (!state.servers[action.id] || state.servers[action.id].status == Status.Disconnected) {
                draft.servers[action.id] = { name: action.name, id: action.id, status: Status.Connecting, messages: [], subscriptions: [], sent: {}, info: {} };
                exports.consoles[action.id] = undefined;
            }
            else {
                console.warn("Already connected");
            }
            break;
        case REMOTE_DISCONNECT:
            console.log("Disconnecting");
            if (state.servers[action.id].status == Status.Connected ||
                state.servers[action.id].status == Status.Connecting) {
                exports.consoles[action.id].terminate();
                exports.consoles[action.id] = undefined;
            }
            draft.servers[action.id].status = Status.Disconnected;
            if (action.close) {
                delete draft.servers[action.id];
            }
            break;
        case REMOTE_CONNECT_SUCCESS:
            if (state.servers[action.id].status == Status.Connecting) {
                draft.servers[action.id].status = Status.Connected;
            }
            else {
                console.log("Not supposed to be connecting. Now terminating");
                action.console.terminate();
            }
            break;
        case REMOTE_CONNECT_FAILURE:
            console.error("ERROR CONNECTING: ");
            console.error(action.error);
            if (state.servers[action.id].status == Status.Connecting) {
                draft.servers[action.id].status == Status.Disconnected;
                draft.servers[action.id].error = action.error;
            }
            break;
        case REMOTE_MESSAGE:
            if (state.servers[action.id].status == Status.Connected) {
                var message = action.message;
                if (message.type == att_websockets_1.MessageType.CommandResult) {
                    var sent = draft.servers[action.id].sent[message.commandId];
                    if (!!sent) {
                        if (!!sent.variable) {
                            draft.servers[action.id].info[sent.variable] = message.data.Result;
                        }
                        draft.servers[action.id].sent[message.commandId].response = message;
                    }
                }
                draft.servers[action.id].messages.push(message);
            }
            break;
        case REMOTE_SEND:
            if (state.servers[action.id].status == Status.Connected) {
                var id = exports.consoles[action.id].send(action.command);
                draft.servers[action.id].sent[id] = { command: action.command, variable: action.variable };
            }
            break;
        case REMOTE_CLEAR:
            draft.servers[action.id].sent = [];
            draft.servers[action.id].messages = [];
            break;
        case REMOTE_SUBSCRIBE:
            if (state.servers[action.id].status == Status.Connected) {
                exports.consoles[action.id].send('websocket subscribe ' + action.eventType);
                var index = state.servers[action.id].subscriptions.findIndex(item => item == action.eventType);
                if (index < 0) {
                    draft.servers[action.id].subscriptions.push(action.eventType);
                }
            }
            break;
        case REMOTE_UNSUBSCRIBE:
            if (state.servers[action.id].status == Status.Connected) {
                exports.consoles[action.id].send('websocket unsubscribe ' + action.eventType);
                var index = state.servers[action.id].subscriptions.findIndex(item => item == action.eventType);
                if (index >= 0) {
                    draft.servers[action.id].subscriptions.splice(index, 1);
                }
            }
            break;
    }
};
const sagas = [connectSaga];
function* connectSaga() {
    while (true) {
        var action = yield effects_1.take(REMOTE_CONNECT);
        if (exports.consoles[action.id]) {
            continue;
        }
        console.log("Connect Saga");
        console.log(action);
        var ip = action.ip;
        var port = action.port;
        var token = alta_jsapi_1.Sessions.getLocalTokens().identity_token;
        if (!action.ip) {
            console.log("Getting connection details");
            try {
                var details = yield effects_1.call(alta_jsapi_1.Servers.joinConsole, action.id, false);
                if (details.allowed) {
                    ip = details.connection.address;
                    port = details.connection.websocket_port || 1760;
                    token = details.token;
                }
                else {
                    throw new Error("Connection rejected");
                }
            }
            catch (e) {
                console.error("Couldn't connect. Is it offline?");
                console.error(e);
                yield effects_1.put(failure(action.id, "Couldn't connect. Is it offline?"));
                continue;
            }
        }
        let remoteConsole = new att_websockets_1.Connection(action.name);
        exports.consoles[action.id] = remoteConsole;
        console.log(`Calling connect to ${ip}:${port} with token ${token}`);
        try {
            yield effects_1.call(remoteConsole.connect.bind(remoteConsole), ip, port, token);
            yield effects_1.put(success(action.id));
            yield effects_1.spawn(consoleSaga, action.id);
        }
        catch (error) {
            remoteConsole.terminate();
            exports.consoles[action.id] = undefined;
            yield effects_1.put(failure(action.id, error));
        }
    }
    function success(id) { return { type: REMOTE_CONNECT_SUCCESS, id }; }
    function failure(id, error) { return { type: REMOTE_CONNECT_FAILURE, id, error }; }
}
function* consoleSaga(id) {
    let messageReceival = yield effects_1.fork(receiveMessageSaga, id);
    // yield put(subscribe(id, EventType.TraceLog));
    // yield put(subscribe(id, EventType.DebugLog));
    // yield put(subscribe(id, EventType.InfoLog));
    // yield put(subscribe(id, EventType.WarnLog));
    // yield put(subscribe(id, EventType.ErrorLog));
    // yield put(subscribe(id, EventType.FatalLog));
    yield effects_1.put(exports.send(id, 'player list', 'Players'));
    yield effects_1.put(exports.send(id, 'help modules', 'Modules'));
    yield effects_1.put(exports.send(id, 'websocket subscriptions', 'Events'));
    yield effects_1.call(waitForClose, id);
    yield effects_1.cancel(messageReceival);
    yield effects_1.put(closed(id));
    function closed(id) { return { type: REMOTE_DISCONNECT, id }; }
}
function* receiveMessageSaga(id) {
    while (true) {
        let message = yield effects_1.call(getNextMessage, id);
        yield effects_1.put(receivedMessage(id, message));
    }
    function receivedMessage(id, message) { return { type: REMOTE_MESSAGE, id, message }; }
}
function waitForClose(id) {
    try {
        return new Promise(resolve => {
            exports.consoles[id].onClose = resolve;
        });
    }
    catch (e) {
        console.error(e);
    }
}
function getNextMessage(id) {
    try {
        return new Promise(resolve => {
            exports.consoles[id].onMessage = message => {
                resolve(message);
            };
        });
    }
    catch (e) {
        console.error(e);
    }
}
let jsapiRedux = new ReduxAccess_1.default('remoteConsole', initialState, reducer, sagas);
exports.inject = () => jsapiRedux.inject();
exports.makeSelector = () => jsapiRedux.makeSelector();
exports.makeSelectorSingle = (id) => jsapiRedux.makeSubSelector((state) => state.servers[id]);
exports.makeSubscriptionsSelector = (id) => jsapiRedux.makeSubSelector((state) => state.servers[id].subscriptions);
exports.makeEventsSelector = (id) => jsapiRedux.makeSubSelector((state) => state.servers[id].info.Events || []);
exports.makeSentSelector = (id) => jsapiRedux.makeSubSelector((state) => state.servers[id].sent);
exports.makeMessagesSelector = (id) => jsapiRedux.makeSubSelector((state) => state.servers[id].messages);
exports.makeMessageSelector = (id, messageId) => jsapiRedux.makeSubSelector((state) => state.servers[id].messages.find(item => item.id == messageId));
exports.makeModulesSelector = (id) => jsapiRedux.makeSubSelector((state) => state.servers[id].info.Modules || []);
exports.connect = (name, id, ip, port, token) => ({
    type: REMOTE_CONNECT,
    name,
    id,
    ip,
    port,
    token
});
exports.send = (id, command, variable = undefined) => ({ type: REMOTE_SEND, id, command, variable });
exports.clear = (id) => ({ type: REMOTE_CLEAR, id });
exports.disconnect = (id) => ({ type: REMOTE_DISCONNECT, id, close: true });
exports.subscribe = (id, eventType) => ({
    type: REMOTE_SUBSCRIBE,
    id,
    eventType,
});
exports.unsubscribe = (id, eventType) => ({
    type: REMOTE_UNSUBSCRIBE,
    id,
    eventType,
});
