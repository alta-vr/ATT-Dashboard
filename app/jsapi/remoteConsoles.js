import {
  take,
  call,
  put,
  select,
  fork,
  spawn,
  cancel,
} from 'redux-saga/effects';

import sha512 from 'crypto-js/sha512';

import { Servers } from 'alta-jsapi';

import JsapiRedux from './ReduxAccess';

import RemoteConsole from './RemoteConsole';

const STATUS_CONNECTING = 'CONNECTING';
const STATUS_CONNECTED = 'CONNECTED';
const STATUS_DISCONNECTED = 'DISCONNECTED';

const REMOTE_CONNECT_SUCCESS = 'app/jsapi/REMOTE_CONNECT_SUCCESS';
const REMOTE_CONNECT_FAILURE = 'app/jsapi/REMOTE_CONNECT_FAILURE';
const REMOTE_DATA = 'app/jsapi/REMOTE_DATA';

const REMOTE_CONNECT = 'app/jsapi/REMOTE_CONNECT';
const REMOTE_DISCONNECT = 'app/jsapi/REMOTE_DISCONNECT';
const REMOTE_SEND = 'app/jsapi/REMOTE_SEND'
const REMOTE_REQUEST = 'app/jsapi/REMOTE_REQUEST'
const REMOTE_CLEAR = 'app/jsapi/REMOTE_CLEAR';
const REMOTE_SUBSCRIBE = 'app/jsapi/REMOTE_SUBSCRIBE';
const REMOTE_UNSUBSCRIBE = 'app/jsapi/REMOTE_UNSUBSCRIBE';

export var consoles = {};

const initialState = {
  servers: {},
};

const reducer = (state, action, draft) => {
  switch (action.type)
  {
    case REMOTE_CONNECT:
      if (!state.servers[action.id] || state.servers[action.id].status == STATUS_DISCONNECTED)
      {
        draft.servers[action.id] = { id: action.id, status: STATUS_CONNECTING, messages: [], subscriptions: [], sent:[], info: 
        {
          Events: [],
          Modules: []
        }}; 
        consoles[action.id] = undefined;
      }
      else
      {
        console.warn("Already connected");
      }
      break;

    case REMOTE_DISCONNECT:
        console.log("Disconnecting");
      if (state.servers[action.id].status == STATUS_CONNECTED ||
        state.servers[action.id].status == STATUS_CONNECTING)
      {
        consoles[action.id].terminate();
        consoles[action.id] = undefined;
      }

      draft.servers[action.id].status = STATUS_DISCONNECTED;

      if (action.close)
      {
        delete draft.servers[action.id];
      }
      break;

    case REMOTE_CONNECT_SUCCESS:
      if (state.servers[action.id].status == STATUS_CONNECTING)
      {
        draft.servers[action.id].status = STATUS_CONNECTED;
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

    case REMOTE_DATA:
      if (state.servers[action.id].status == STATUS_CONNECTED)
      {
        var data = action.data;

        if (data.type == 'SystemInfo')
        {
          draft.servers[action.id].info[data.data.type] = data.data.info;

          data.data = JSON.stringify(data.data);
        }
        
        draft.servers[action.id].messages.push(data);
      }
    break;

    case REMOTE_REQUEST:
        if (state.servers[action.id].status == STATUS_CONNECTED)
        {  
          consoles[action.id].send(JSON.stringify({ type:'Info', infoType:action.info }));
        }
    break;

    case REMOTE_SEND:
        if (state.servers[action.id].status == STATUS_CONNECTED)
        {  
          draft.servers[action.id].sent.push(action.command);

          consoles[action.id].send(JSON.stringify({ type:'Command', content:action.command }));
        }
    break;

    case REMOTE_CLEAR:
        draft.servers[action.id].sent = [];
        draft.servers[action.id].messages = [];
      break;

    case REMOTE_SUBSCRIBE:
      if (state.servers[action.id].status == STATUS_CONNECTED)
      {
        consoles[action.id].send(JSON.stringify({type:'SUBSCRIBE', eventType:action.eventType}));

        var index = state.servers[action.id].subscriptions.findIndex(item => item == action.eventType);
        
        if (index < 0)
        {
          draft.servers[action.id].subscriptions.push(action.eventType);
        }
      }
      break;

    case REMOTE_UNSUBSCRIBE:
      if (state.servers[action.id].status == STATUS_CONNECTED)
      {
        consoles[action.id].send(JSON.stringify({type:'SUBSCRIBE', eventType:action.eventType}));

        var index = state.servers[action.id].subscriptions.findIndex(item => item == action.eventType);

        if (index >= 0)
        {
          draft.servers[action.id].subscriptions.splice(index, 1);
        }
      }
      break;
  }
};

const sagas = [connectSaga];

function* connectSaga() {
  while (true)
  {
    var action = yield take(REMOTE_CONNECT);

    if (consoles[action.id])
    {
      continue;
    }

    console.log("Connect Saga");

    let remoteConsole = new RemoteConsole(action.name);

    consoles[action.id] = remoteConsole;

    try
    {                    
      yield call(remoteConsole.connect.bind(remoteConsole), action.ip, action.commandPort, action.loggingPort);

      yield put(success(action.id));

      yield spawn(consoleSaga, action.id);
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
}

function* consoleSaga(id) {
  let messageReceival = yield fork(receiveMessageSaga, id);

  //yield put(subscribe(id, 'TraceLog'));
  yield put(subscribe(id, 'DebugLog'));
  yield put(subscribe(id, 'InfoLog'));
  yield put(subscribe(id, 'WarnLog'));
  yield put(subscribe(id, 'ErrorLog'));
  yield put(subscribe(id, 'FatalLog'));
  
  yield put(request(id, 'Players'));
  yield put(request(id, 'Modules'));
  yield put(request(id, 'Events'));

  yield call(waitForClose, id);

  yield cancel(messageReceival);

  yield put(closed(id));

  function closed(id) { return { type: REMOTE_DISCONNECT, id } }
}

function* receiveMessageSaga(id) {
  while (true)
  {        
    let result = yield call(getNextMessage, id);

    try
    {
      var data = JSON.parse(result.data);

      yield put(receivedData(id, data))
    }
    catch (error)
    {
      console.log(result.data);
      console.error(error);
    }
  }

  function receivedData(id, data) { return { type: REMOTE_DATA, id, data } }
}

function waitForClose(id) {
  try
  {
    return new Promise(resolve =>
    {
      consoles[id].onClose = resolve;
    });
  }
  catch (e)
  {
    console.error(e);
  }
}

function getNextMessage(id) {
  try
  {
    return new Promise(resolve =>
    {
      consoles[id].onMessage = data =>
      {
        resolve(data);
      };
    });
  }
  catch (e)
  {
    console.error(e);
  }
}

let jsapiRedux = new JsapiRedux('remoteConsole', initialState, reducer, sagas);

export const inject = () => jsapiRedux.inject();
export const makeSelector = () => jsapiRedux.makeSelector();

export const makeSelectorSingle = id =>
  jsapiRedux.makeSubSelector(state => state.servers[id]);

export const connect = (id, ip, commandPort, loggingPort) => ({
  type: REMOTE_CONNECT,
  id,
  ip,
  commandPort,
  loggingPort,
});

export const send = (id, command) => ({ type: REMOTE_SEND, id, command })

export const request = (id, info) => ({ type: REMOTE_REQUEST, id, info })

export const clear = id => ({ type: REMOTE_CLEAR, id });

export const disconnect = id => ({ type: REMOTE_DISCONNECT, id, close:true });

export const subscribe = (id, eventType) => ({
  type: REMOTE_SUBSCRIBE,
  id,
  eventType,
});
export const unsubscribe = (id, eventType) => ({
  type: REMOTE_UNSUBSCRIBE,
  id,
  eventType,
});
