/**
 *
 * Navigation
 *
 */

import React, { Fragment } from 'react';
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

import Responsive from 'react-responsive';

import styled from 'styled-components';

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

const BodyGrid = styled(Grid)`

  min-height: 100%;

  @media (max-width: 1224px)
  {
		min-height: 100vh;
  }
`;

export function Navigation({ navigation, changeTab, remoteConsoles }) {
  useInjectReducer({ key: 'navigation', reducer });
  useInjectSaga({ key: 'navigation', saga });

  RemoteConsoles.inject();

  const handleClick = (e, args) => changeTab(args.id);

  const active =
    pages[navigation.tab] ||
    (consoles[navigation.tab] == undefined
      ? pages.servers :
      () => <ConsolePage id={navigation.tab} />);

  function ServerTab({ name, id, status }) {
    return (
      <Menu.Item
        id={id}
        name={name}
        content={`${id} - ${name} (${status})`}
        active={navigation.tab == id}
        onClick={handleClick}
      />
    );
  }

  function FullMenu(vertical)
  {
    return <Menu fluid vertical={vertical} secondary stackable style={{maxWidth:'100%'}}>
      <Menu.Item
        id="account"
        name="account"
        active={navigation.tab === 'account'}
        onClick={handleClick}
      />
      <Menu.Item
        id="servers"
        name="servers"
        active={navigation.tab === 'servers'}
        onClick={handleClick}
      />
      {Object.values(remoteConsoles.servers).map(ServerTab)}
    </Menu>
  }

  return (
    <Fragment>
      <Responsive maxDeviceWidth={1224}>
          {FullMenu(false)}
      </Responsive>
      <BodyGrid>
        <Responsive minDeviceWidth={1224}>
          <Grid.Column stretched width={2}>
            {FullMenu(true)}
          </Grid.Column>
        </Responsive>
        <Grid.Column stretched computer={14} mobile={16}>
          {active()}
        </Grid.Column>
      </BodyGrid>
    </Fragment>
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
