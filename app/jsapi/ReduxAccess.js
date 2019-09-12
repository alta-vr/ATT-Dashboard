import produce from 'immer';
import { createSelector } from 'reselect';
import { useInjectReducer } from '../utils/injectReducer';

import { take, call, put, select, fork } from 'redux-saga/effects';

import { useInjectSaga } from '../utils/injectSaga';
  
export default class ReduxAccess
{
    tag;
    initialState;

    reduce;
    sagas;

    constructor(tag, initialState, reduce, sagas)
    {
        this.tag = tag;

        this.initialState = initialState;

        this.reduce = reduce;

        this.sagas = sagas;
    }


    /* eslint-disable default-case, no-param-reassign */
    reducer = (state = this.initialState, action) =>
    produce(state, (draft) => 
    {
        this.reduce(state, action, draft);
    });

    inject = () => 
    {
        useInjectReducer({key: this.tag, reducer: this.reducer });

        for (var i = 0; i < this.sagas.length; i++)
        {
            useInjectSaga({key: this.tag, saga: this.sagas[i], mode: undefined});
        }
    }

    makeSelector = () => createSelector((state) => state[this.tag] || this.initialState, (substate) => substate);
    
    makeSubSelector = (subSelect) => createSelector((state) => subSelect(state[this.tag]) || this.initialState, (substate) => substate);
}