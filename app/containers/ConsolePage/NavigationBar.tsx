
import * as React from 'react';
import { Menu, Button, Dropdown, Input, Checkbox, Divider } from 'semantic-ui-react';
import { DispatchProps } from '.';

import { connect } from 'react-redux';
import { compose } from 'redux';

import Responsive from 'react-responsive';

type Props =
{
    options:{name:string, content:()=>React.ReactNode}[],
}

export default function NavigationBar({options}:Props)
{
    const [tab, setTab] = React.useState(options[0].name);

    const handleClick = (e:any, args:any) => setTab(args.id);

    return <React.Fragment>
        <Menu fluid widths={3}>
            {options.map(item => <Menu.Item 
                id={item.name}
                name={item.name}
                active={tab === item.name}
                onClick={handleClick}/>)}
        </Menu>
        {options.find(item => item.name == tab).content()}
    </React.Fragment>;
}