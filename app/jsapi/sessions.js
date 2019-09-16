import { take, call, put, select, fork } from 'redux-saga/effects';

import sha512 from 'crypto-js/sha512';

import { Sessions } from 'alta-jsapi';

import JsapiRedux from './ReduxAccess';

const LOGIN_REQUEST = 'app/jsapi/sessions/LOGIN_REQUEST';
const LOGOUT_REQUEST = 'app/jsapi/sessions/LOGOUT_REQUEST';
const LOGIN_SUCCESS = 'app/jsapi/sessions/LOGIN_SUCCESS';
const LOGIN_FAILURE = 'app/jsapi/sessions/LOGIN_FAILURE';

const initialState =
{ 
    isProcessing: false,
    isLoggedIn: false,
    username: undefined,
    loginError: undefined,
};

const reducer = (state, action, draft) =>
{
    switch (action.type)
    {
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

function * loginSaga()
{
    while (true)
    {
        const { username, password } = yield take(LOGIN_REQUEST);

        try
        {
            let hash = sha512(password).toString();
    
            if (username.includes('@'))
            {
                yield call(Sessions.loginWithEmail, username, hash);
            }
            else
            {
                yield call(Sessions.loginWithUsername, username, hash);
            }

            yield put(success());
        }
        catch (error)
        {
            var message = JSON.parse(error.error).message;

            console.log(message);
                
            yield put(failure(message));
        }
    }

    function success() { return { type: LOGIN_SUCCESS } }
    function failure(error) { return { type: LOGIN_FAILURE, error } }
};

var jsapiRedux = new JsapiRedux('sessions', initialState, reducer, sagas);

export const inject = () => jsapiRedux.inject();
export const makeSelector = () => jsapiRedux.makeSelector();

export const login = (username, password) => ({ type: LOGIN_REQUEST, username, password });

export const logout = () => ({ type: LOGOUT_REQUEST });