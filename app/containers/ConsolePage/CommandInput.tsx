
import * as React from 'react';
import { Form, Input } from 'semantic-ui-react';
import { DispatchProps } from '.';

import { connect } from 'react-redux';
import { compose } from 'redux';

import * as RemoteConsoles from '../../jsapi/remoteConsoles';

type Props = DispatchProps &
{
    id:number,
    sent:{[id:number]:{command:string, variable:string|undefined, response?:any}}
}

function CommandInput({id, send, sent}:Props)
{
    const [command, setCommand] = React.useState('');
    const [commandIndex, setCommandIndex] = React.useState(-1);
    const commandRef = React.useRef();

    function downHandler(e:KeyboardEvent)
    {  
        if (e.keyCode == 27)
        {
            setCommandIndex(-1);
            setCommand("");
        }
        else if (e.keyCode == 38) 
        {
            var keys = Object.keys(sent);

            // up arrow
            if (commandIndex < 0)
            {
                var index = keys.length - 1;
                setCommandIndex(index);

                if (index >= 0)
                {
                    var key = parseInt(keys[index]);
                    setCommand(sent[key].command);
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
                    var key = parseInt(keys[index]);
                    setCommand(sent[key].command);
                }
                else
                {
                    setCommand("");
                }
            }
        }
        else if (e.keyCode == 40 && commandIndex > -1) 
        {
            // down arrow
            var index = commandIndex + 1;

            var keys = Object.keys(sent);

            if (index < keys.length)
            {
                setCommandIndex(index);
                
                var key = parseInt(keys[index]);

                setCommand(sent[key].command);
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

    return <Form onSubmit={() => { send(id, command); setCommand(''); setCommandIndex(-1); }}>
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
}

const mapStateToProps = (state:RemoteConsoles.State, ownProps:{id:number}) => {
    return {
      sent: RemoteConsoles.makeSentSelector(ownProps.id)(state),
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

export default compose(withConnect)(CommandInput);