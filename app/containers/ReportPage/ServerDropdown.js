/**
 *
 * ServersPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import * as Servers from 'jsapi/servers';

import { Form } from 'semantic-ui-react';

function ServerDropdown({ servers, getServers, setValue, ...props }) 
{
  Servers.inject();

  var [serverOptions, setServerOptions] = React.useState([]);
  
  if (!servers.servers && !servers.isRequesting && !servers.error) 
  {
    getServers();
  }

  if (!!servers.servers && serverOptions.length == 0)
  {
    setServerOptions(servers.servers.map(item => ({ key: item.id, value:item.id, text:item.name })));
  }

  return (<Form.Dropdown label="Server" search button placeholder="Select the server" clearable options={serverOptions} onChange={(event, data) => setValue(data.value)} {...props}/>);
}

ServerDropdown.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  servers: Servers.makeSelector(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    getServers: () => {
      dispatch(Servers.getServers());
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(ServerDropdown);
