/**
 *
 * ServersPage
 *
 */

import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import _ from 'lodash';

import * as RemoteConsoles from 'jsapi/remoteConsoles';

import {
  Table,
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
  Checkbox,
  Dropdown,
  Sidebar,
  Accordion,
  Header,
} from 'semantic-ui-react';
import { consoles } from '../../jsapi/remoteConsoles';

const allLogs = [
  'TraceLog',
  'DebugLog',
  'InfoLog',
  'WarnLog',
  'ErrorLog',
  'FatalLog',
];

const allLogs2 = [...allLogs, 'OffLog'];

export function ConsolePage({
  id,
  disconnect,
  remoteConsole,
  subscribe,
  unsubscribe,
  clear,
  send
}) {
  RemoteConsoles.inject();

  const [newSubscribe, setSubscribe] = React.useState('');
  const [selected, setSelected] = React.useState(undefined);
  const [eventSearch, setEventSearch] = React.useState('');
  const [command, setCommand] = React.useState('');
  const [commandIndex, setCommandIndex] = React.useState(-1);
  const commandRef = React.useRef();
  
  function downHandler(e) 
  {
      e = e || window.event;
  
      if (e.keyCode == '27')
      {
        setCommandIndex(-1);
        setCommand("");
      }
      else if (e.keyCode == '38') 
      {
        // up arrow
        if (commandIndex < 0)
        {
          var index = remoteConsole.sent.length - 1;
          setCommandIndex(index);

          if (index >= 0)
          {
            setCommand(remoteConsole.sent[index]);
          }
          else
          {
            setCommand("");
          }
        }
        else if (commandIndex >= 0)
        {
          var index = commandIndex - 1;
          setCommandIndex(index);

          if (index >= 0)
          {
            setCommand(remoteConsole.sent[index]);
          }
          else
          {
            setCommand("");
          }
        }
      }
      else if (e.keyCode == '40' && commandIndex > -1) 
      {
        // down arrow
          var index = commandIndex + 1;

          if (index < remoteConsole.sent.length)
          {
            setCommandIndex(index);
            setCommand(remoteConsole.sent[index]);
          }
          else
          {
            setCommandIndex(-1);
            setCommand("");
          }
      }
  }

  React.useEffect(() =>
  {
    window.addEventListener('keydown', downHandler);

    return () =>
    {
      window.removeEventListener('keydown', downHandler);
    }
  });

  const logToggle = (label, events) => {
    const isEnabled = events.every(event =>
      remoteConsole.subscriptions.includes(event),
    );

    return (
      <Menu.Item>
        <Checkbox
          toggle
          label={label}
          checked={isEnabled}
          onChange={() =>
            events.forEach(event =>
              isEnabled ? unsubscribe(id, event) : subscribe(id, event),
            )
          }
        />
      </Menu.Item>
    );
  };
  
  const logToggleDropdown = (label, events) => {
    const isEnabled = events.every(event =>
      remoteConsole.subscriptions.includes(event),
    );

    return (
      <Dropdown.Item>
        <Checkbox
          toggle
          label={label}
          checked={isEnabled}
          onChange={() =>
            events.forEach(event =>
              isEnabled ? unsubscribe(id, event) : subscribe(id, event),
            )
          }
        />
      </Dropdown.Item>
    );
  };

  const isSubscribeMatch = remoteConsole.subscriptions.includes(newSubscribe);

  const eventSearchRegex = new RegExp(eventSearch, "i");

  return (
    <Grid fluid columns='equal'>
      <Grid.Column>
      <div>
        <Menu secondary>
          <Menu.Item>
            <Button onClick={() => clear(id)}>Clear</Button>
          </Menu.Item>
          <Menu.Menu position='right'>
            <Button color="red" onClick={() => disconnect(id)}>Disconnect</Button>
          </Menu.Menu>
        </Menu>
        <Menu>
          {logToggle('Trace', ['TraceLog'])}
          {logToggle('Debug', ['DebugLog'])}
          {logToggle('Info', ['InfoLog'])}
          {logToggle('Warn', ['WarnLog'])}
          {logToggle('Error', ['ErrorLog'])}
          {logToggle('Fatal', ['FatalLog'])}
          {logToggle('All Logs', allLogs)}
          <Dropdown item text='Other' closeOnChange={false} multiple open={remoteConsole.eventsOpen} simple>
            <Dropdown.Menu>
              <Input icon='search' iconPosition='left' name='search' value={eventSearch} onChange={(event, args) => setEventSearch(args.value)} />
              {remoteConsole.info.Events.filter(name => name.match(eventSearchRegex)).map(item => item == 'None' || allLogs2.includes(item) ? null : logToggleDropdown(item, [item]))}
            </Dropdown.Menu>
          </Dropdown>
        </Menu>
        <div style={{paddingLeft: '1px', paddingRight:'12px', paddingTop: '15px'}}>
          <Table attached='top' structured celled striped size='small' fixed> 
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell width={1}>Type</Table.HeaderCell>
                <Table.HeaderCell width={1}>Time</Table.HeaderCell>
                <Table.HeaderCell width={1}>Event</Table.HeaderCell>
                <Table.HeaderCell width={1}>Logger</Table.HeaderCell>
                <Table.HeaderCell width={5}>Message</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
          </Table>
        </div>
      </div>
      <div style={{overflowY:'scroll', overflowX:'hidden', maxHeight:'calc(100vh - 320px)', paddingLeft:'1px', paddingRight:'1px', display:'flex', flexDirection:'column-reverse'}}>
        <Table attached='bottom' structured celled striped size='small' fixed selectable>
          <Table.Body>
            {remoteConsole.messages.map(item => (
              <Table.Row 
                key={item.id}
                warning={item.eventType == 'WarnLog'} 
                negative={item.eventType == 'ErrorLog' || item.eventType == 'FatalLog'} 
                positive={!allLogs.includes(item.eventType)}
                onClick={() => setSelected(item.id)}
                style={selected == item.id ? undefined : {cursor:'pointer'}}>
                <Table.Cell width={1} singleLine={selected != item.id} content={item.type} />
                <Table.Cell width={1} singleLine={selected != item.id}  content={item.data.timeStamp || item.timeStamp} />
                <Table.Cell width={1} singleLine={selected != item.id}  content={item.eventType} />
                <Table.Cell width={1} singleLine={selected != item.id}  content={item.data.logger} />
                <Table.Cell width={5} singleLine={selected != item.id}  content={typeof item.data == 'string' ? item.data : item.data.message} />
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>

      <Form onSubmit={() => { send(id, command); setCommand(''); setCommandIndex(-1); }}>
        <Input
          fluid
          action={{
            type: 'submit',
            content: 'Send',
          }}
          placeholder="player kill Joel"
          value={command}
          onChange={(event, data) => setCommand(data.value)}
          ref={commandRef}
          />
      </Form>
      </Grid.Column>
      <Grid.Column width={3} style={{ maxHeight: 'calc(100vh - 50px)', overflowY:'auto'}}>
        <Accordion styled vertical panels={remoteConsole.info.Modules.sort(sortByName).map(renderModule)}/>
      {/* <Sidebar
      as={Menu}
      animation='push'
      direction='right'
      inverted
      vertical
      visible={true}
    >
      <Menu.Item as='a' header>
        File Permissions
      </Menu.Item>
      <Menu.Item as='a'>Share on Social</Menu.Item>
      <Menu.Item as='a'>Share by E-mail</Menu.Item>
      <Menu.Item as='a'>Edit Permissions</Menu.Item>
      <Menu.Item as='a'>Delete Permanently</Menu.Item>
    </Sidebar> */}
    </Grid.Column>
    </Grid>
  );
}

function sortByName(a, b)
{
  if (!!a.Name) return 1;
  if (!!b.Name) return -1;

  return a.Name > b.Name ? 1 : -1;
}

function renderModule(item)
{
  return {
    title: item.Name,
    content: {
      content: 
      [
        item.Submodules.length > 0 ? <Header as='h5'>Submodules</Header> : null,
        item.Submodules.length > 0 ? <Accordion.Accordion panels={item.Submodules.sort(sortByName).map(renderModule)} /> : null,
        item.Commands.length > 0 ? <Header as='h5'>Commands</Header> : null,
        item.Commands.length > 0 ? <Accordion.Accordion exclusive={false} panels={item.Commands.sort(sortByName).map(renderCommand)} /> : null
      ]
    }
  };
}

function renderCommand(item)
{
  return {
    title: item.Name || "(Default)",
    content: {
      content: [...item.Parameters.map(param => <p><b>{param.Name}</b> <i>({param.Type})</i></p>),
        <p>{item.Description}</p>]
    }
  };
}

ConsolePage.propTypes = {
  id: PropTypes.number.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    remoteConsole: RemoteConsoles.makeSelectorSingle(ownProps.id)(state),
  };
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    send: (id, command) =>
    {
      dispatch(RemoteConsoles.send(id, command))
    },
    clear: id => {
      dispatch(RemoteConsoles.clear(id));
    },
    disconnect: id => {
      dispatch(RemoteConsoles.disconnect(id));
    },
    subscribe: (id, eventType) => {
      dispatch(RemoteConsoles.subscribe(id, eventType));
    },
    unsubscribe: (id, eventType) => {
      dispatch(RemoteConsoles.unsubscribe(id, eventType));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(ConsolePage);
