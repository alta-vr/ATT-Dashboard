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

import { VariableSizeList } from 'react-window';

import Responsive from 'react-responsive';

const { useMediaQuery } = require('react-responsive')

import
{
    Grid,
    Accordion,
    Header,
} from 'semantic-ui-react';
import { consoles } from '../../jsapi/remoteConsoles';
import TopBar from './topBar';
import SubscriptionBar, { allLogs } from './SubscriptionBar';
import CommandInput from './CommandInput';
import MessageRow from './MessageRow';
import AutoSizer from 'react-virtualized-auto-sizer';
import { StringLiteral } from '@babel/types';


const Table = styled.div`

    height: calc(100vh - 300px);
    
    @media (max-width: 1224px)
    {
		height: calc(100vh - 180px);
    }
`;


export const Column = styled.div`

    flex-grow: 0;
    flex-shrink: 0;
    vertical-align: top;

    font-size: 14px;
    -webkit-font-smoothing: antialiased;

    width: 100px;
    padding-right: 20px;
    
    min-height: max-content;
    height: unset;

    :nth-child(1)
    {
        width: 150px;
    }
    :nth-child(2)
    {
        width: 150px;
    }
    :nth-child(3)
    {
        width: 100px;
    }
    :nth-child(4)
    {
        width: 150px;
    }
    :nth-child(5)
    {
        width: calc(100% - 550px);
    }
`;

const Unselected = css`

    height: 44px;

    ${Column}
    {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
`;

const Selected = css`

    height: max-content !important;
    

    ${Column}
    {
        overflow: auto;
    };
    
    ${Column}:nth-child(5)
    {
        white-space: pre;
    };
`;

const Row = styled.div`

    display: flex;
    flex-direction: row;
    flex-wrap: no-wrap;
    width: 100%;
    padding: 12px;
    border-bottom: 1px solid #DCE1EA;
    box-sizing: border-box;

    align-items: stretch;
    
    font-family: 'Courier New';

    ${(props: { selected?: boolean }) => props.selected ? Selected : Unselected};
`;

export const HeaderRow = styled(Row)`

    box-shadow: 0 1px 2px 0 #E9EFFA;

    text-transform: uppercase;
    font-size: 12px;
    font-weight: bold;
`;

const colors : {[type:string]:string} =
{
    ['success'] : "#C5F9D8",
    ['normal'] : "#EDF4F7",
    ['warning'] : "#F9F0C5",
    ['error'] : "#F9C5C5",
}

export const BodyRow = styled(Row)`

    color: #333333;
    background-color: ${(props:{color:string}) => colors[props.color]}50;

    cursor: pointer;

    :hover
    {
		background-color: ${(props:{color:string}) => colors[props.color]}A0;
		box-shadow: 0 1px 2px 0 ${(props:{color:string}) => colors[props.color]};
    }
`

export const Wrapper = styled.div`

    display: flex;
	flex-direction: row;
    width: 100%;

    @media (max-width: 1224px)
    {
		flex-direction: column;
    }
`;


//https://codepen.io/jonstuebe/pen/XgKpzq

export const List = styled(VariableSizeList)`

    display: flex;
    flex-direction: column-reverse;

    >div
    {
        flex-shrink: 0;
        flex-grow: 0;

        position: relative;
    }
`;


export default function MessageTable(props: { id: number })
{
    const desktop = useMediaQuery({query: '(min-device-width: 1224px)'});

    return <Table>
        <Responsive minDeviceWidth={1224}>   
            <HeaderRow>
                <Wrapper>
                    <Column>Type</Column>
                    <Column>Time</Column>
                    <Column>Event</Column>
                    <Column>Logger</Column>
                    <Column>Message</Column>
                </Wrapper>
            </HeaderRow>
        </Responsive>
        <TableBody id={props.id} desktop={desktop} />
    </Table>;
}

type Props =
    {
        id: number,
        messages: any[],
        desktop: boolean,
    }

function TableBodyRaw({
    id,
    messages,
    desktop
}: Props)
{
    const [selected, setSelected] = React.useState(undefined);
    const [lastCount, setLastCount] = React.useState(0);

    const [selectedHeight, setSelectedHeight] = React.useState(44);

    const listRef = React.useRef();

    if (lastCount != messages.length)
    {
        var current = listRef.current;

        if (current != undefined)
        {
            //Force it to stick to the bottom
            (current as any)._onScrollVertical({currentTarget: (current as any)._outerRef})
        }
        
        setLastCount(messages.length);
    }

    var rowHeight = desktop ? 44 : 120;
    
    return (
            <AutoSizer>
            {({height, width}) => {

            var listHeight = desktop ? height - rowHeight : height;
            var extraHeight = desktop ? 24 : 48;

            return <List
                ref={listRef}
                height={listHeight} width={width}
                itemKey={(index:any, data:any) => data[index].id}
                itemData={messages}
                itemCount={messages.length}
                estimatedItemSize={rowHeight}
                itemSize={(index:number) => selected == messages[index].id ? selectedHeight + 24 : rowHeight}
            >
                {({ index, style }) =>
                    <MessageRow
                        id={id}
                        messageId={messages[index].id}
                        style={style}
                        selected={selected == messages[index].id}
                        onResize={rect =>
                        {
                            console.log(rect.height);
                            
                            if (rect.height != selectedHeight && rect.height > rowHeight)
                            {
                                setSelectedHeight(rect.height);
                            }

                            var current = listRef.current;

                            if (current != undefined)
                            {
                                (current as VariableSizeList).resetAfterIndex(index, true);
                            }
                        }}
                        setSelected={value => 
                        {
                            if (selected == value)
                            {
                                setSelected(-1);
                            }
                            else
                            {
                                setSelected(value);
                            }
                        }}
                    />
                }
            </List>;}}
            </AutoSizer>
    );
}

const mapStateToProps = (state: RemoteConsoles.State, ownProps: { id: number }) =>
{
    return {
        messages: RemoteConsoles.makeMessagesSelector(ownProps.id)(state),
    };
};

function mapDispatchToProps(dispatch: any)
{
    return {};
}

const withConnect = connect(
    mapStateToProps,
    mapDispatchToProps,
);

const TableBody = compose(withConnect)(TableBodyRaw);
