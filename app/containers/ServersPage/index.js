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

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectServersPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';


import * as Servers from 'jsapi/servers';
import * as RemoteConsoles from 'jsapi/remoteConsoles';

import { changeTab } from '../Navigation/actions';

import {
  Grid,
  Menu,
  Segment,
  Input,
  Form,
  Button,
  Message,
  Card,
  Icon,
  Feed,
  List,
  Image,
  Divider,
} from 'semantic-ui-react';

export function ServersPage({ servers, getServers, connect, disconnect }) {
  useInjectReducer({ key: 'serversPage', reducer });
  useInjectSaga({ key: 'serversPage', saga });

  Servers.inject();
  RemoteConsoles.inject();

  if (!servers.servers && !servers.isRequesting && !servers.error) {
    getServers();
  }

  return (
    <div>
      {!!servers.error && (
        <Message error header="Error!" content={servers.error} />
      )}
      <Menu>
        <Menu.Item>
          <Button primary onClick={() => getServers()}>
            Refresh
          </Button>
          <Button
            onClick={() =>
              connect(
                "Local",
                -1,
                '192.168.0.2',
                1760,
              )
            }
          >
            Test
          </Button>
        </Menu.Item>
      </Menu>
      <Card.Group>
        {servers.servers &&
          servers.servers
            .sort((a, b) => b.online_players.length - a.online_players.length)
            .map(item => (
              <Card key={item.id}>
            <Card.Content>
                  <Card.Header>{item.name}</Card.Header>
              <Card.Meta>{item.region}</Card.Meta>
              <Divider/>
                  <Grid columns={2}>
                <Grid.Row verticalAlign='middle'>
                      <Grid.Column>
                    <Icon name='user' />
                        {item.online_players.length} Online
                  </Grid.Column>
                  <Grid.Column>
                    <Button basic color='green' onClick={() => connect(item.name, item.id)}>Connect</Button>                
                      </Grid.Column>
                </Grid.Row>
                  </Grid>
              <Divider/>
                  <List>
                {item.online_players.map(player =>
                      <List.Item>
                    <Image avatar src='https://townshiptale.com/static/media/skull.ece1749d.svg'/>
                        <List.Content>
                          <List.Header>{player.username}</List.Header>
                          <List.Description>{player.id}</List.Description>
                    </List.Content>
                  </List.Item>)}
                  </List>
            </Card.Content>
          </Card>))}
      </Card.Group>
    </div>
  );
}

ServersPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  serversPage: makeSelectServersPage(),
  servers: Servers.makeSelector(),
  remoteConsoles: RemoteConsoles.makeSelector(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    getServers: () => {
      dispatch(Servers.getServers());
    },
    connect: (name, id, ip, port) => {
      dispatch(RemoteConsoles.connect(name, id, ip, port));
      dispatch(changeTab(id));
    },
    disconnect: id => {
      dispatch(RemoteConsoles.disconnect(id));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(ServersPage);
