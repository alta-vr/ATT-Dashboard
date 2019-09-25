
import * as React from 'react';
import { Menu, Button, Dropdown, Input, Checkbox, Divider } from 'semantic-ui-react';
import { DispatchProps } from '.';

import { connect } from 'react-redux';
import { compose } from 'redux';

import * as RemoteConsoles from '../../jsapi/remoteConsoles';

import { consoles } from '../../jsapi/remoteConsoles';
import { EventType } from 'att-websockets';

import Responsive from 'react-responsive';

export const allLogs:string[] = [
    EventType.TraceLog,
    EventType.DebugLog,
    EventType.InfoLog,
    EventType.WarnLog,
    EventType.ErrorLog,
    EventType.FatalLog,
  ];
  
const hiddenEvents:string[] = [EventType.OffLog, EventType.None];

const hiddenAndLogEvents:string[] = [...allLogs, ...hiddenEvents];

type Props = DispatchProps &
{
    id:number,
    subscriptions:string[],
    events:{name:string, type:any}[]
}

function SubscriptionBar({id, subscribe, unsubscribe, subscriptions, events}:Props)
{
    const [newSubscribe, setSubscribe] = React.useState(EventType.None);
    const [eventSearch, setEventSearch] = React.useState('');

    const logToggle = (label:string, events:string[]) => {
      const isEnabled = events.every(event => subscriptions.includes(event));
  
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
    
    const logToggleDropdown = (label:string, events:string[]) => {
  
      const isEnabled = events.every(event => subscriptions.includes(event));
  
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

    const logOptions = () =>
    {
      return <React.Fragment>
        {logToggle('Trace', [EventType.TraceLog])}
        {logToggle('Debug', [EventType.DebugLog])}
        {logToggle('Info', [EventType.InfoLog])}
        {logToggle('Warn', [EventType.WarnLog])}
        {logToggle('Error', [EventType.ErrorLog])}
        {logToggle('Fatal', [EventType.FatalLog])}
        {logToggle('All Logs', allLogs)}
      </React.Fragment>;
    }

    const isSubscribeMatch = subscriptions.includes(newSubscribe);
  
    const eventSearchRegex = new RegExp(eventSearch, "i");

    return <Menu fluid stackable>
        <Responsive minDeviceWidth={1224}>
          {logOptions()}
          <Dropdown item text='Other' closeOnChange={false} multiple simple>
            <Dropdown.Menu>
                <Input icon='search' iconPosition='left' name='search' value={eventSearch} onChange={(event, args) => setEventSearch(args.value)} />
                {!events ? null : events.filter((event) => event.name.match(eventSearchRegex)).map((item) => hiddenAndLogEvents.includes(item.name) ? null : logToggleDropdown(item.name, [item.name]))}
            </Dropdown.Menu>
          </Dropdown>
        </Responsive>
        <Responsive maxDeviceWidth={1224}>
          <Input icon='search' iconPosition='left' name='search' value={eventSearch} onChange={(event, args) => setEventSearch(args.value)} />
          {events.filter((event) => event.name.match(eventSearchRegex)).map((event) => hiddenEvents.includes(event.name) ? null : logToggle(event.name, [event.name]))}
        </Responsive>
    </Menu>
}

const mapStateToProps = (state:RemoteConsoles.State, ownProps:{id:number}) => {
    return {
      subscriptions: RemoteConsoles.makeSubscriptionsSelector(ownProps.id)(state),
      events: RemoteConsoles.makeEventsSelector(ownProps.id)(state),
    };
  };
  
function mapDispatchToProps(dispatch:any) {
var result:DispatchProps = 
{
    send: (id, command, variable) =>
    {
    dispatch(RemoteConsoles.send(id, command, variable))
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

return result;
}

const withConnect = connect(
mapStateToProps,
mapDispatchToProps,
);

export default compose(withConnect)(SubscriptionBar);