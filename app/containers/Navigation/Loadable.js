/**
 *
 * Asynchronously loads the component for Navigation
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
