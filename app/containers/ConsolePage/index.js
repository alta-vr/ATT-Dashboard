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
} from 'semantic-ui-react';
import { consoles } from '../../jsapi/remoteConsoles';

export function ConsolePage({
  id,
  disconnect,
  remoteConsole,
  subscribe,
  unsubscribe,
}) {
  RemoteConsoles.inject();

  const [newSubscribe, setSubscribe] = React.useState('');
  const [command, setCommand] = React.useState('');
  const [column, setColumn] = React.useState('date');
  const [direction, setDirection] = React.useState('ascending');

  function send(type, eventType, content) {
    consoles[id].send(JSON.stringify({ type, eventType, content }));
  }

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

  const handleSort = clickedColumn => () => {
    if (column !== clickedColumn) {
      setColumn(clickedColumn);
      setDirection('ascending');
      return;
    }

    setDirection(direction === 'ascending' ? 'descending' : 'ascending');
  };

  const isSubscribeMatch = remoteConsole.subscriptions.includes(newSubscribe);

  console.log(isSubscribeMatch);

  switch (column) {
    case 'type':
    case 'date':
    case 'event':
      var items = _.sortBy(remoteConsole.messages, [column]);
      break;
  }

  if (direction == 'descending') {
    items = items.reverse();
  }

  return (
    <div>
      <Menu>
        <Menu.Item>
          <Button color="red" onClick={() => disconnect(id)}>
            Disconnect
          </Button>
        </Menu.Item>
        <Menu.Item>
          <Input
            action={{
              content: isSubscribeMatch ? 'Unsubscribe' : 'Subscribe',
              onClick: () =>
                isSubscribeMatch
                  ? unsubscribe(id, newSubscribe)
                  : subscribe(id, newSubscribe),
            }}
            placeholder="InfoLog"
            value={newSubscribe}
            onChange={(event, data) => setSubscribe(data.value)}
          />
        </Menu.Item>
      </Menu>
      <Menu>
        {logToggle('Trace', ['TraceLog'])}
        {logToggle('Debug', ['DebugLog'])}
        {logToggle('Info', ['InfoLog'])}
        {logToggle('Warn', ['WarnLog'])}
        {logToggle('Error', ['ErrorLog'])}
        {logToggle('Fatal', ['FatalLog'])}
        {logToggle('All', [
          'TraceLog',
          'DebugLog',
          'InfoLog',
          'WarnLog',
          'ErrorLog',
          'FatalLog',
        ])}
      </Menu>

      <Input
        fluid
        action={{
          content: 'Send',
          onClick: () => send('Command', undefined, command),
        }}
        placeholder="player kill Joel"
        value={command}
        onChange={(event, data) => setCommand(data.value)}
      />

      <Table celled striped singleLine fixed selectable sortable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell
              sorted={column === 'type' ? direction : null}
              onClick={handleSort('type')}
              width={1}
            >
              Type
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={column === 'time' ? direction : null}
              onClick={handleSort('time')}
              width={1}
            >
              Time
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={column === 'event' ? direction : null}
              onClick={handleSort('event')}
              width={1}
            >
              Event
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={column === 'logger' ? direction : null}
              onClick={handleSort('logger')}
              width={3}
            >
              Logger
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={column === 'message' ? direction : null}
              onClick={handleSort('message')}
              width={7}
            >
              Message
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {items.map(item => (
            <Table.Row>
              <Table.Cell content={item.type} />
              <Table.Cell content={item.data.TimeStamp || item.time} />
              <Table.Cell content={item.eventType} />
              <Table.Cell content={item.data.LoggerName} />
              <Table.Cell content={item.data.Message} />
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}

ConsolePage.propTypes = {
  id: PropTypes.number.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  console.log(ownProps);

  return {
    remoteConsole: RemoteConsoles.makeSelectorSingle(ownProps.id)(state),
  };
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
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
