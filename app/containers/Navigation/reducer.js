/*
 *
 * Navigation reducer
 *
 */
import produce from 'immer';
import { CHANGE_TAB } from './constants';

export const initialState = { tab : "account" };

/* eslint-disable default-case, no-param-reassign */
const navigationReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case CHANGE_TAB:
          draft.tab = action.tab;
        break;
    }
  });

export default navigationReducer;
