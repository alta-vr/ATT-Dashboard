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
import makeSelectNavigation from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';

import { changeTab } from './actions';

import { Grid, Menu, Segment } from 'semantic-ui-react'

import LoginPage from '../LoginPage';
import ServersPage from '../ServersPage';

const emptyPage = () => <Segment>This is an empty tab!</Segment>;

const pages =
{
  'account': () => <LoginPage/>,
  'servers': () => <ServersPage/>
};

export function Navigation({ navigation, changeTab }) {
  useInjectReducer({ key: 'navigation', reducer });
  useInjectSaga({ key: 'navigation', saga });

  var handleClick = (e, { name }) => changeTab(name);

  var active = pages[navigation.tab] || emptyPage;

  return (
  <Grid style={{minHeight:'100%'}}>
    <Grid.Column stretched width={4}>
      <Menu fluid vertical tabular>
        <Menu.Item name='account'   active={navigation.tab === 'account'}    onClick={handleClick} />
        <Menu.Item name='servers'      active={navigation.tab === 'servers'}       onClick={handleClick} />
        <Menu.Item name='i actually dont' active={navigation.tab === 'i actually dont'}  onClick={handleClick}/>
        <Menu.Item name='know what im doing'     active={navigation.tab === 'know what im doing'}      onClick={handleClick} />
      </Menu>
    </Grid.Column>

    <Grid.Column stretched width={12}>
      {active()}
    </Grid.Column>
  </Grid>
  );
}

Navigation.propTypes = {
  navigation: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  changeTab : PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  navigation: makeSelectNavigation(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    changeTab : tab => dispatch(changeTab(tab))
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(Navigation);
