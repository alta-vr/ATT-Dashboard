import { take, call, put, select, fork } from 'redux-saga/effects';

import sha512 from 'crypto-js/sha512';

import { Servers } from 'alta-installer/dist/webApiClient';

import JsapiRedux from './ReduxAccess';

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
    yield take(SERVERS_REQUEST);

    try {
      const servers = yield call(Servers.getOnline);

      yield put(success(servers));
    } catch (error) {
      console.error(error);

      yield put(failure(error));
    }
  }

  function success(servers) {
    return { type: SERVERS_REQUEST_SUCCESS, servers };
  }
  function failure(error) {
    return { type: SERVERS_REQUEST_FAILURE, error };
  }
}

const jsapiRedux = new JsapiRedux('servers', initialState, reducer, sagas);

export const inject = () => jsapiRedux.inject();
export const makeSelector = () => jsapiRedux.makeSelector();

export const getServers = () => ({ type: SERVERS_REQUEST });
