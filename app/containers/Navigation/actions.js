/*
 *
 * Navigation actions
 *
 */

import { CHANGE_TAB } from './constants';

export function changeTab(tab) {
  return {
    type: CHANGE_TAB,
    tab,
  };
}
