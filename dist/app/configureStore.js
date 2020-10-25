"use strict";
/**
 * Create the store with dynamic reducers
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redux_1 = require("redux");
const connected_react_router_1 = require("connected-react-router");
const redux_saga_1 = __importDefault(require("redux-saga"));
const reducers_1 = __importDefault(require("./reducers"));
function configureStore(initialState = {}, history) {
    let composeEnhancers = redux_1.compose;
    const reduxSagaMonitorOptions = {};
    // If Redux Dev Tools and Saga Dev Tools Extensions are installed, enable them
    /* istanbul ignore next */
    if (process.env.NODE_ENV !== 'production' && typeof window === 'object') {
        /* eslint-disable no-underscore-dangle */
        if (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__)
            composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({});
        // NOTE: Uncomment the code below to restore support for Redux Saga
        // Dev Tools once it supports redux-saga version 1.x.x
        // if (window.__SAGA_MONITOR_EXTENSION__)
        //   reduxSagaMonitorOptions = {
        //     sagaMonitor: window.__SAGA_MONITOR_EXTENSION__,
        //   };
        /* eslint-enable */
    }
    const sagaMiddleware = redux_saga_1.default(reduxSagaMonitorOptions);
    // Create the store with two middlewares
    // 1. sagaMiddleware: Makes redux-sagas work
    // 2. routerMiddleware: Syncs the location/URL path to the state
    const middlewares = [sagaMiddleware, connected_react_router_1.routerMiddleware(history)];
    const enhancers = [redux_1.applyMiddleware(...middlewares)];
    const store = redux_1.createStore(reducers_1.default(), initialState, composeEnhancers(...enhancers));
    // Extensions
    store.runSaga = sagaMiddleware.run;
    store.injectedReducers = {}; // Reducer registry
    store.injectedSagas = {}; // Saga registry
    // Make reducers hot reloadable, see http://mxs.is/googmo
    /* istanbul ignore next */
    if (module.hot) {
        module.hot.accept('./reducers', () => {
            store.replaceReducer(reducers_1.default(store.injectedReducers));
        });
    }
    return store;
}
exports.default = configureStore;
