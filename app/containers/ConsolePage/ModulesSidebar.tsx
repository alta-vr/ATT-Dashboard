
import * as React from 'react';
import { Header, Accordion, Grid } from 'semantic-ui-react';
import { DispatchProps } from '.';

import { connect } from 'react-redux';
import { compose } from 'redux';

import * as RemoteConsoles from '../../jsapi/remoteConsoles';

type Props = 
{
    id:number,
    modules:Module[]
}

function ModulesSidebar({id, modules}:Props)
{
    if (modules.length == 0)
    {
        return null;
    }

    return <Grid.Column width={3} style={{ maxHeight: 'calc(100vh - 50px)', overflowY:'auto'}}>
      <Accordion styled vertical panels={modules.sort(sortByName).map(renderModule)}/>
    </Grid.Column>;
}


function sortByName(a:{Name:string}, b:{Name:string})
{
  if (!!a.Name) return 1;
  if (!!b.Name) return -1;

  return a.Name > b.Name ? 1 : -1;
}

type Module =
{
  Name:string,
  Submodules:Module[],
  Commands:Command[]
}

function renderModule(item:Module)
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

type Command =
{
  Name:string,
  Description:string,
  Parameters:Parameter[]
}

type Parameter =
{
  Name:string,
  Type:string
}

function renderCommand(item:Command)
{
  return {
    title: item.Name || "(Default)",
    content: {
      content: [...item.Parameters.map(param => <p><b>{param.Name}</b> <i>({param.Type})</i></p>),
        <p>{item.Description}</p>]
    }
  };
}

const mapStateToProps = (state:RemoteConsoles.State, ownProps:{id:number}) => {
    return {
      modules: RemoteConsoles.makeModulesSelector(ownProps.id)(state),
    };
  };
  
function mapDispatchToProps(dispatch:any) { return {} };

const withConnect = connect(
mapStateToProps,
mapDispatchToProps,
);

export default compose(withConnect)(ModulesSidebar);