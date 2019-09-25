import {
  take,
  call,
  put,
  select,
  fork,
  spawn,
  cancel,
} from 'redux-saga/effects';

import JsapiRedux from './ReduxAccess';

import { Servers, Sessions } from 'alta-jsapi';

import { Connection, EventType, Message, MessageType } from 'att-websockets';

const REMOTE_CONNECT_SUCCESS = 'app/jsapi/REMOTE_CONNECT_SUCCESS';
const REMOTE_CONNECT_FAILURE = 'app/jsapi/REMOTE_CONNECT_FAILURE';
const REMOTE_MESSAGE = 'app/jsapi/REMOTE_DATA';

const REMOTE_CONNECT = 'app/jsapi/REMOTE_CONNECT';
const REMOTE_DISCONNECT = 'app/jsapi/REMOTE_DISCONNECT';
const REMOTE_SEND = 'app/jsapi/REMOTE_SEND';
const REMOTE_CLEAR = 'app/jsapi/REMOTE_CLEAR';
const REMOTE_SUBSCRIBE = 'app/jsapi/REMOTE_SUBSCRIBE';
const REMOTE_UNSUBSCRIBE = 'app/jsapi/REMOTE_UNSUBSCRIBE';

export var consoles:{[id:number]:Connection} = {};

enum Status
{
  Connecting,
  Connected,
  Disconnected
}

export type State =
{
  servers:{[id:number]:Server};
}

export type Server =
{
  name:string;
  id:number;
  status: Status,
  messages: any[],
  subscriptions: EventType[],
  sent: {[id:number]:{command:string, variable:string|undefined, response?:any}},
  info: {[variable:string]:any},
  error?: any
}

const initialState:State = {
  servers: {},
};

const reducer = (state:State, action:any, draft:State) => {
    
  switch (action.type)
  {
    case REMOTE_CONNECT:
      console.log(action);
      if (!state.servers[action.id] || state.servers[action.id].status == Status.Disconnected)
      {
        draft.servers[action.id] = { name: action.name, id: action.id, status: Status.Connecting, messages: [], subscriptions: [], sent:{}, info:{}}; 
        consoles[action.id] = undefined;
      }
      else
      {
        console.warn("Already connected");
      }
      break;

    case REMOTE_DISCONNECT:
        console.log("Disconnecting");
      if (state.servers[action.id].status == Status.Connected ||
        state.servers[action.id].status == Status.Connecting)
      {
        consoles[action.id].terminate();
        consoles[action.id] = undefined;
      }

      draft.servers[action.id].status = Status.Disconnected;

      if (action.close)
      {
        delete draft.servers[action.id];
      }
      break;

    case REMOTE_CONNECT_SUCCESS:
      if (state.servers[action.id].status == Status.Connecting)
      {
        draft.servers[action.id].status = Status.Connected;
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
      if (state.servers[action.id].status == Status.Connecting)
      {
        draft.servers[action.id].status == Status.Disconnected;
        draft.servers[action.id].error = action.error;
      }
      break;

    case REMOTE_MESSAGE:
      if (state.servers[action.id].status == Status.Connected)
      {
        var message:Message = action.message;

        if (message.type == MessageType.CommandResult)
        {
          var sent = draft.servers[action.id].sent[message.commandId];

          if (!!sent)
          {
            if (!!sent.variable)
            {
              draft.servers[action.id].info[sent.variable] = message.data.Result;
            }

            draft.servers[action.id].sent[message.commandId].response = message;
          }
        }
        
        draft.servers[action.id].messages.push(message);
      }
    break;

    case REMOTE_SEND:
        if (state.servers[action.id].status == Status.Connected)
        {  
          var id = consoles[action.id].send(action.command);
          
          draft.servers[action.id].sent[id] = {command:action.command, variable:action.variable};
        }
    break;

    case REMOTE_CLEAR:
        draft.servers[action.id].sent = [];
        draft.servers[action.id].messages = [];
      break;

    case REMOTE_SUBSCRIBE:
      if (state.servers[action.id].status == Status.Connected)
      {
        consoles[action.id].send('websocket subscribe ' + action.eventType);

        var index = state.servers[action.id].subscriptions.findIndex(item => item == action.eventType);
        
        if (index < 0)
        {
          draft.servers[action.id].subscriptions.push(action.eventType);
        }
      }
      break;

    case REMOTE_UNSUBSCRIBE:
      if (state.servers[action.id].status == Status.Connected)
      {
        consoles[action.id].send('websocket unsubscribe ' + action.eventType);

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
    console.log(action);

    var ip = action.ip;
    var port = action.port;
    var token = Sessions.getLocalTokens().identity_token;

    if (!action.ip)
    {
      console.log("Getting connection details");
      
      try
      {
        var details = yield call(Servers.joinConsole, action.id, false);

        if (details.allowed)
        {
          ip = '127.0.0.1';// details.connection.address;
          port = details.connection.websocket_port || 1760;
          token = details.token;
        }
        else
        {
          throw new Error("Connection rejected");
        }
      }
      catch (e)
      {
        console.error("Couldn't connect. Is it offline?");
        console.error(e);

        yield put(failure(action.id, "Couldn't connect. Is it offline?"));
        continue;
      }
    }

    let remoteConsole = new Connection(action.name);

    consoles[action.id] = remoteConsole;

    console.log(`Calling connect to ${ip}:${port} with token ${token}`);

    try
    {                    
      yield call(remoteConsole.connect.bind(remoteConsole), ip, port, token);

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

  function success(id:number) { return { type: REMOTE_CONNECT_SUCCESS, id } }
  function failure(id:number, error:any) { return { type: REMOTE_CONNECT_FAILURE, id, error } }
}

function* consoleSaga(id:number) 
{
  let messageReceival = yield fork(receiveMessageSaga, id);

  // yield put(subscribe(id, EventType.TraceLog));
  // yield put(subscribe(id, EventType.DebugLog));
  // yield put(subscribe(id, EventType.InfoLog));
  // yield put(subscribe(id, EventType.WarnLog));
  // yield put(subscribe(id, EventType.ErrorLog));
  // yield put(subscribe(id, EventType.FatalLog));
  
  yield put(send(id, 'player list', 'Players'));
  yield put(send(id, 'help modules', 'Modules'));
  yield put(send(id, 'websocket subscriptions', 'Events'));

  yield call(waitForClose, id);

  yield cancel(messageReceival);

  yield put(closed(id));

  function closed(id:number) { return { type: REMOTE_DISCONNECT, id } }
}

function* receiveMessageSaga(id:number)
{
  while (true)
  {        
    let message:Message = yield call(getNextMessage, id);

    yield put(receivedMessage(id, message));
  }

  function receivedMessage(id:number, message:Message) { return { type: REMOTE_MESSAGE, id, message } }
}

function waitForClose(id:number) 
{
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

function getNextMessage(id:number) : Promise<Message>
{
  try
  {
    return new Promise(resolve =>
    {
      consoles[id].onMessage = message =>
      {
        resolve(message);
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
export const makeSelectorSingle = (id:number) => jsapiRedux.makeSubSelector((state:State) => state.servers[id]);
export const makeSubscriptionsSelector = (id:number) => jsapiRedux.makeSubSelector((state:State) => state.servers[id].subscriptions);
export const makeEventsSelector = (id:number) => jsapiRedux.makeSubSelector((state:State) => state.servers[id].info.Events || []);
export const makeSentSelector = (id:number) => jsapiRedux.makeSubSelector((state:State) => state.servers[id].sent);
export const makeMessagesSelector = (id:number) => jsapiRedux.makeSubSelector((state:State) => state.servers[id].messages);
export const makeMessageSelector = (id:number, messageId:number) => jsapiRedux.makeSubSelector((state:State) => state.servers[id].messages.find(item => item.id == messageId));
export const makeModulesSelector = (id:number) => jsapiRedux.makeSubSelector((state:State) => state.servers[id].info.Modules || []);

export const connect = (name:string, id:number, ip:string, port:string|number, token:string) => ({
  type: REMOTE_CONNECT,
  name,
  id,
  ip,
  port,
  token
});

export const send = (id:number, command:string, variable:string|undefined = undefined) => ({ type: REMOTE_SEND, id, command, variable })

export const clear = (id:number) => ({ type: REMOTE_CLEAR, id });

export const disconnect = (id:number) => ({ type: REMOTE_DISCONNECT, id, close:true });

export const subscribe = (id:number, eventType:string) => ({
  type: REMOTE_SUBSCRIBE,
  id,
  eventType,
});
export const unsubscribe = (id:number, eventType:string) => ({
  type: REMOTE_UNSUBSCRIBE,
  id,
  eventType,
});
