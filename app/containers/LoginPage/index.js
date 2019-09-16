/**
 *
 * LoginPage
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

// import makeSelectLogin from './selectors';
// import reducer from './reducer';
// import saga from './saga';
// import messages from './messages';

import sha512 from 'crypto-js/sha512'

import { Grid, Menu, Segment, Input, Form, Button, Message } from 'semantic-ui-react'

// import { Sessions } from 'alta-jsapi';
import { setLoggedIn } from './actions';

import * as Sessions from 'jsapi/sessions';


export function LoginPage({sessions, login, logout }) 
{
  Sessions.inject();

  // useInjectReducer({ key: 'login', reducer });
  // useInjectSaga({ key: 'login', saga });

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
    
  const { isLoggedIn, isProcessing, loginError } = sessions;

  if (isLoggedIn)
  {
    return <Form onSubmit={info => logout()}>
      <p>Logged in as {sessions.username}</p>
      <Button type="submit">Logout</Button>
      </Form>;
  }

  if (!loginError)
  {
    //login("", "");
  }

  return (
    <Form error={!!loginError} loading={isProcessing} onSubmit={info => login(username, password)}>
      <Form.Field>
        <label>Username or Email</label>
        <input placeholder="Username" onChange={event => { setUsername(event.target.value); }}/>
      </Form.Field>
      <Form.Field>
        <label>Password</label>
        <input placeholder="Password" type="password" onChange={event => { setPassword(event.target.value); }}/>
      </Form.Field>
      <Form.Field>
        {/* <Checkbox label='Remember Me' /> */}
      </Form.Field>
      <Message
        error
        header='Error!'
        content={loginError}
      />
      <Button type='submit'>Login</Button>
      
    </Form>
  );
}

LoginPage.propTypes = {
  // login: PropTypes.object.isRequired,
  // dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  sessions: Sessions.makeSelector(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    login : (username, password) => { dispatch(Sessions.login(username, password)); },
    logout: () => { dispatch(Sessions.logout()); }
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(LoginPage);
