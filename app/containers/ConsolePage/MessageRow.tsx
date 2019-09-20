/**
 *
 * ServersPage
 *
 */

import * as React from 'react';
import styled, { css } from 'styled-components';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import * as _ from 'lodash';

import * as RemoteConsoles from '../../jsapi/remoteConsoles';

import {
  Grid,
  Accordion,
  Header,
} from 'semantic-ui-react';
import { consoles } from '../../jsapi/remoteConsoles';
import { EventType } from 'att-websockets';
import TopBar from './topBar';
import SubscriptionBar, { allLogs } from './SubscriptionBar';
import CommandInput from './CommandInput';

import { BodyRow, Column, Wrapper } from './MessageTable';

import ResizeObserver from 'react-resize-observer';

import Responsive from 'react-responsive';

const MobileRow = styled.div`

    display: flex;
    flex-direction: row;
`;

const MobileHeader = styled.div`

    flex 0 0 85px;

    font-weight: bold;
`;

const MobileValue = styled.div`

    width: 0px;
    min-width: 0px;

    flex 1 0 0;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const Selected = css`

    ${MobileHeader}
    {
        flex 0 0 19px;
    }

    ${MobileValue}
    {
        width: 100%;

        flex unset;

        overflow: auto;
        text-overflow: initial;
        white-space: pre;
    }

    >${MobileRow}
    {
        flex-direction: column;
    }
`;

const MobileSupportedWrapper = styled.div`

    ${(props: { selected?: boolean }) => props.selected ? Selected : null};

    display: flex;
	flex-direction: row;
    width: 100%;

    @media (max-width: 1224px)
    {
		flex-direction: column;
    }
`;

type Props =
{
  id: number,
  style: any,
  messageId: number,
  message: any,
  setSelected: (id:number)=>void,
  selected:boolean,
  onResize: (rect:{width:number, height:number})=>void
}

function MessageRow({
  id,
  style,
  messageId,
  message,
  setSelected,
  selected,
  onResize
}:Props) 
{  
  var item = fitToTable(message);

  return (<BodyRow 
        key={item.id}
        selected={selected}
        color={item.color}
        onClick={() => setSelected(item.id)}
        style={style}
        >       
        <MobileSupportedWrapper selected={selected} >
            <Responsive minDeviceWidth={1224}>
                <Column>{item.type}</Column>
                <Column>{item.timeStamp}</Column>
                <Column>{item.eventType}</Column>
                <Column>{item.logger}</Column>
                <Column>{item.message}</Column>
            </Responsive>
            <Responsive maxDeviceWidth={1224}>
                <MobileRow><MobileHeader>Type</MobileHeader><MobileValue>{item.type}</MobileValue></MobileRow>
                <MobileRow><MobileHeader>Time</MobileHeader><MobileValue>{item.timeStamp}</MobileValue></MobileRow>
                <MobileRow><MobileHeader>Event</MobileHeader><MobileValue>{item.eventType}</MobileValue></MobileRow>
                <MobileRow><MobileHeader>Logger</MobileHeader><MobileValue>{item.logger}</MobileValue></MobileRow>
                <MobileRow><MobileHeader>Message</MobileHeader><MobileValue>{item.message}</MobileValue></MobileRow> 
            </Responsive>
            <ResizeObserver onResize={onResize}/> 
        </MobileSupportedWrapper>
    </BodyRow>
  );
}

type TableRow =
{
  id:number,
  type?:string,
  timeStamp?:string,
  eventType?:EventType,
  logger?:string,
  message?:string,
  color?:string,
}

function fitToTable(item:any) : TableRow
{
    if (!item)
    {
        console.error("Item undefined!");
        return { id: -1};
    }

  var result:TableRow = { id: item.id };

  result.color = 'normal';
  result.type = item.type;
  result.timeStamp = item.data.timeStamp || item.timeStamp;
  result.eventType = item.eventType;
  result.logger = item.data.logger;

  if (item.eventType == EventType.WarnLog)
  {
    result.color = 'warning';
  }
  else if (item.eventType == EventType.ErrorLog || item.eventType == EventType.FatalLog)
  {
    result.color = 'error';
  }
  else if (!allLogs.includes(item.eventType))
  {
    result.color = 'success';
  }

  
  if (typeof item.data == 'string')
  {
    result.message = item.data;
  }
  else if (!!item.data.message)
  {
    result.message = item.data.message;
  }
  else if (!!item.data.Result)
  {
    result.message = JSON.stringify(item.data.Result, null, 4);
  }
  else if (!!item.data.StringResult)
  {
    result.message = item.data.StringResult;
  }

  if (!!item.data.Exception)
  {
    result.color = 'error';
    result.message = item.data.Exception.Message;
  }

  return result;
}

const mapStateToProps = (state:RemoteConsoles.State, ownProps:{id:number, messageId:number}) => {
  return {
    message: RemoteConsoles.makeMessageSelector(ownProps.id, ownProps.messageId)(state),
  };
};

function mapDispatchToProps(dispatch:any) {
  return {};
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(MessageRow);
