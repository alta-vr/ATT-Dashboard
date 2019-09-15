/**
 *
 * Navigation
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import { Grid, Menu, Segment } from 'semantic-ui-react';
import * as RemoteConsoles from 'jsapi/remoteConsoles';
import makeSelectNavigation from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';

import { changeTab } from './actions';

import LoginPage from '../LoginPage';
import ServersPage from '../ServersPage';
import ConsolePage from '../ConsolePage';

import { consoles } from '../../jsapi/remoteConsoles';

const emptyPage = () => <Segment>This is an empty tab!</Segment>;

const pages = {
  account: () => <LoginPage />,
  servers: () => <ServersPage />,
};

export function Navigation({ navigation, changeTab, remoteConsoles }) {
  useInjectReducer({ key: 'navigation', reducer });
  useInjectSaga({ key: 'navigation', saga });

  RemoteConsoles.inject();

  const handleClick = (e, { name }) => changeTab(name);

  const active =
    pages[navigation.tab] ||
    (//consoles[navigation.tab] == undefined
      //? emptyPage :
      () => <ConsolePage id={navigation.tab} />);

  function ServerTab({ id, status }) {
    return (
      <Menu.Item
        name={id}
        content={`${id} (${status})`}
        active={navigation.tab == id}
        onClick={handleClick}
      />
    );
  }

  return (
    <Grid style={{ minHeight: '100%' }}>
      <Grid.Column stretched width={2}>
        <Menu fluid vertical tabular>
          <Menu.Item
            name="account"
            active={navigation.tab === 'account'}
            onClick={handleClick}
          />
          <Menu.Item
            name="servers"
            active={navigation.tab === 'servers'}
            onClick={handleClick}
          />
          {Object.values(remoteConsoles.servers).map(ServerTab)}
        </Menu>
      </Grid.Column>

      <Grid.Column stretched width={14}>
        {active()}
      </Grid.Column>
    </Grid>
  );
}

Navigation.propTypes = {
  navigation: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  changeTab: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  navigation: makeSelectNavigation(),
  remoteConsoles: RemoteConsoles.makeSelector(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    changeTab: tab => dispatch(changeTab(tab)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(Navigation);
