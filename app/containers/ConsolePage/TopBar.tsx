
import * as React from 'react';
import { Menu, Button } from 'semantic-ui-react';
import { DispatchProps } from '.';

import { connect } from 'react-redux';
import { compose } from 'redux';

import * as RemoteConsoles from '../../jsapi/remoteConsoles';

type Props = DispatchProps &
{
    id:number
}

function TopBar({id, clear, disconnect}:Props)
{
    return <Menu secondary>
        <Menu.Item>
        <Button onClick={() => clear(id)}>Clear</Button>
        </Menu.Item>
        <Menu.Menu position='right'>
        <Button color="red" onClick={() => disconnect(id)}>Disconnect</Button>
        </Menu.Menu>
    </Menu>
}

const mapStateToProps = (state:RemoteConsoles.State, ownProps:{id:number}) => {
    return {
      remoteConsole: RemoteConsoles.makeSelectorSingle(ownProps.id)(state),
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

export default compose(withConnect)(TopBar);