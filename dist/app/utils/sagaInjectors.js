"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const invariant_1 = __importDefault(require("invariant"));
const lodash_1 = require("lodash");
const checkStore_1 = __importDefault(require("./checkStore"));
const constants_1 = require("./constants");
const allowedModes = [constants_1.RESTART_ON_REMOUNT, constants_1.DAEMON, constants_1.ONCE_TILL_UNMOUNT];
const checkKey = key => invariant_1.default(lodash_1.isString(key) && !lodash_1.isEmpty(key), '(app/utils...) injectSaga: Expected `key` to be a non empty string');
const checkDescriptor = descriptor => {
    const shape = {
        saga: lodash_1.isFunction,
        mode: mode => lodash_1.isString(mode) && allowedModes.includes(mode),
    };
    invariant_1.default(lodash_1.conformsTo(descriptor, shape), '(app/utils...) injectSaga: Expected a valid saga descriptor');
};
function injectSagaFactory(store, isValid) {
    return function injectSaga(key, descriptor = {}, args) {
        if (!isValid)
            checkStore_1.default(store);
        const newDescriptor = Object.assign(Object.assign({}, descriptor), { mode: descriptor.mode || constants_1.DAEMON });
        const { saga, mode } = newDescriptor;
        checkKey(key);
        checkDescriptor(newDescriptor);
        let hasSaga = Reflect.has(store.injectedSagas, key);
        if (process.env.NODE_ENV !== 'production') {
            const oldDescriptor = store.injectedSagas[key];
            // enable hot reloading of daemon and once-till-unmount sagas
            if (hasSaga && oldDescriptor.saga !== saga) {
                oldDescriptor.task.cancel();
                hasSaga = false;
            }
        }
        if (!hasSaga ||
            (hasSaga && mode !== constants_1.DAEMON && mode !== constants_1.ONCE_TILL_UNMOUNT)) {
            /* eslint-disable no-param-reassign */
            store.injectedSagas[key] = Object.assign(Object.assign({}, newDescriptor), { task: store.runSaga(saga, args) });
            /* eslint-enable no-param-reassign */
        }
    };
}
exports.injectSagaFactory = injectSagaFactory;
function ejectSagaFactory(store, isValid) {
    return function ejectSaga(key) {
        if (!isValid)
            checkStore_1.default(store);
        checkKey(key);
        if (Reflect.has(store.injectedSagas, key)) {
            const descriptor = store.injectedSagas[key];
            if (descriptor.mode && descriptor.mode !== constants_1.DAEMON) {
                descriptor.task.cancel();
                // Clean up in production; in development we need `descriptor.saga` for hot reloading
                if (process.env.NODE_ENV === 'production') {
                    // Need some value to be able to detect `ONCE_TILL_UNMOUNT` sagas in `injectSaga`
                    store.injectedSagas[key] = 'done'; // eslint-disable-line no-param-reassign
                }
            }
        }
    };
}
exports.ejectSagaFactory = ejectSagaFactory;
function getInjectors(store) {
    checkStore_1.default(store);
    return {
        injectSaga: injectSagaFactory(store, true),
        ejectSaga: ejectSagaFactory(store, true),
    };
}
exports.default = getInjectors;
