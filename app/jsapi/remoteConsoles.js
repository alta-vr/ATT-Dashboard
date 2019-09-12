import { take, call, put, select, fork } from 'redux-saga/effects';

import sha512 from 'crypto-js/sha512';

import { Servers } from 'alta-installer/dist/webApiClient';

import JsapiRedux from './ReduxAccess';

import RemoteConsole from './RemoteConsole';

const REMOTE_CONNECT = 'app/jsapi/REMOTE_CONNECT';
const REMOTE_DISCONNECT = 'app/jsapi/REMOTE_DISCONNECT';
const REMOTE_CONNECT_SUCCESS = 'app/jsapi/REMOTE_CONNECT_SUCCESS';
const REMOTE_CONNECT_FAILURE = 'app/jsapi/REMOTE_CONNECT_FAILURE';

const STATUS_CONNECTING = 'CONNECTING';
const STATUS_CONNECTED = 'CONNECTED';
const STATUS_DISCONNECTED = 'DISCONNECTED';

export var consoles = {};

const initialState =
{ 
    servers: {}
};

const reducer = (state, action, draft) =>
{
    console.log(action.type);

    switch (action.type)
    {
        case REMOTE_CONNECT:
            if (!state.servers[action.id] || state.servers[action.id].status == STATUS_DISCONNECTED)
            {
                draft.servers[action.id] = { id: action.id, status: STATUS_CONNECTING }; 
                consoles[action.id] = undefined;
            }
        break;

        case REMOTE_DISCONNECT:
            if (state.servers[action.id].status == STATUS_CONNECTED)
            {
                consoles[action.id].console.terminate();
                consoles[action.id] = undefined;
            }

            draft.servers[action.id].status == STATUS_DISCONNECTED;
        break;

        case REMOTE_CONNECT_SUCCESS:
            if (state.servers[action.id].status == STATUS_CONNECTING)
            {
                draft.servers[action.id].status == STATUS_CONNECTED;
            }
            else
            {
                console.log("Not supposed to be connecting. Now terminating");
                action.console.terminate();
            }
        break;
        
        case REMOTE_CONNECT_FAILURE:
            console.error("ERROR CONNECTING: " );
            console.error(action.error);
            if (state.servers[action.id].status == STATUS_CONNECTING)
            {
                draft.servers[action.id].status == STATUS_DISCONNECTED;
                draft.servers[action.id].error = action.error;
            }
        break;
    }
};

const sagas = [connectSaga];

function * connectSaga()
{
    while (true)
    {
        var action = yield take(REMOTE_CONNECT);

        if (!!consoles[action.id])
        {
            continue;
        }

        console.log("Connect Saga");

        var remoteConsole = new RemoteConsole(action.name);
        consoles[action.id] = remoteConsole;

        try
        {                    
            yield call(remoteConsole.connect.bind(remoteConsole), action.ip, action.commandPort, action.loggingPort);
        
            yield put(success(action.id));
        }
        catch (error)
        {
            remoteConsole.terminate();
            consoles[action.id] = undefined;

            yield put(failure(action.id, error));
        }
    }

    function success(id, console) { return { type: REMOTE_CONNECT_SUCCESS, id, console } }
    function failure(id, error) { return { type: REMOTE_CONNECT_FAILURE, id, error } }
};

var jsapiRedux = new JsapiRedux('remoteConsole', initialState, reducer, sagas);

export const inject = () => jsapiRedux.inject();
export const makeSelector = () => jsapiRedux.makeSelector();

export const makeSelectorSingle = (id) => jsapiRedux.makeSubSelector(servers => servers[id]);

export const connect = (id, ip, commandPort, loggingPort) => ({ type: REMOTE_CONNECT, id, ip, commandPort, loggingPort });
export const disconnect = (id) => ({ type: REMOTE_DISCONNECT, id });