"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import produce from 'immer';
const reducer_1 = __importDefault(require("../reducer"));
// import { someAction } from '../actions';
/* eslint-disable default-case, no-param-reassign */
describe('serversPageReducer', () => {
    let state;
    beforeEach(() => {
        state = {
        // default state params here
        };
    });
    it('returns the initial state', () => {
        const expectedResult = state;
        expect(reducer_1.default(undefined, {})).toEqual(expectedResult);
    });
    /**
     * Example state change comparison
     *
     * it('should handle the someAction action correctly', () => {
     *   const expectedResult = produce(state, draft => {
     *     draft.loading = true;
     *     draft.error = false;
     *     draft.userData.nested = false;
     *   });
     *
     *   expect(appReducer(state, someAction())).toEqual(expectedResult);
     * });
     */
});
