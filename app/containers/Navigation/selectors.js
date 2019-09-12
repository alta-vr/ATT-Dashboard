import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the navigation state domain
 */

const selectNavigationDomain = state => state.navigation || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by Navigation
 */

const makeSelectNavigation = () =>
  createSelector(
    selectNavigationDomain,
    substate => substate
  );

export default makeSelectNavigation;
export { selectNavigationDomain };
