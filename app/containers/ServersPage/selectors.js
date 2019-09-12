import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the serversPage state domain
 */

const selectServersPageDomain = state => state.serversPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by ServersPage
 */

const makeSelectServersPage = () =>
  createSelector(
    selectServersPageDomain,
    substate => substate,
  );

export default makeSelectServersPage;
export { selectServersPageDomain };
