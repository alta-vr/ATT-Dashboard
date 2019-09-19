/**
 *
 * ServersPage
 *
 */

import * as React from 'react';
import styled from 'styled-components';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import * as _ from 'lodash';

import * as RemoteConsoles from '../../jsapi/remoteConsoles';

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
import { EventType } from 'att-websockets';
import TopBar from './topBar';
import SubscriptionBar, { allLogs } from './SubscriptionBar';
import CommandInput from './CommandInput';
import MessageTable from './MessageTable';
import ModulesSidebar from './ModulesSidebar';


type Props =
{
  id: number,
}


export type DispatchProps =
{
  disconnect: (id:number)=>void,
  subscribe: (id:number, type:EventType)=>void,
  unsubscribe: (id:number, type:EventType)=>void,
  clear: (id:number)=>void,
  send: (id:number, command:string, variable?:string)=>void,
}

export function ConsolePage({id}:Props) {
  RemoteConsoles.inject();
  return (
    <Grid fluid columns='equal'>
      <Grid.Column>
      <TopBar id={id}/>
      <SubscriptionBar id={id}/>
      <MessageTable id={id}/>      
      <CommandInput id={id}/>
      </Grid.Column>
      <ModulesSidebar id={id}/>
    </Grid>
  );
}


ConsolePage.propTypes = {
  id: PropTypes.number.isRequired
};

const mapStateToProps = (state:RemoteConsoles.State, ownProps:{id:number}) => {
  return { };
};

function mapDispatchToProps(dispatch:any) { return {} };

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(ConsolePage);
