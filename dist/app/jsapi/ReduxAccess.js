"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const immer_1 = __importDefault(require("immer"));
const reselect_1 = require("reselect");
const injectReducer_1 = require("../utils/injectReducer");
const injectSaga_1 = require("../utils/injectSaga");
class ReduxAccess {
    constructor(tag, initialState, reduce, sagas) {
        /* eslint-disable default-case, no-param-reassign */
        this.reducer = (state = this.initialState, action) => immer_1.default(state, (draft) => {
            this.reduce(state, action, draft);
        });
        this.inject = () => {
            injectReducer_1.useInjectReducer({ key: this.tag, reducer: this.reducer });
            for (var i = 0; i < this.sagas.length; i++) {
                injectSaga_1.useInjectSaga({ key: this.tag, saga: this.sagas[i], mode: undefined });
            }
        };
        this.makeSelector = () => reselect_1.createSelector((state) => state[this.tag] || this.initialState, (substate) => substate);
        this.makeSubSelector = (subSelect) => reselect_1.createSelector((state) => subSelect(state[this.tag]) || this.initialState, (substate) => substate);
        this.tag = tag;
        this.initialState = initialState;
        this.reduce = reduce;
        this.sagas = sagas;
    }
}
exports.default = ReduxAccess;
