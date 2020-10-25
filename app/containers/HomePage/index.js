/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

import { Grid, Menu, Segment, Container, Divider, Header, Message, Icon } from 'semantic-ui-react'
import Navigation from '../Navigation';

export default function HomePage() 
{
  return (
    <Container>
        <Message icon>
        <Icon name='question' style={{verticalAlign:'unset'}}/>
        <Message.Content>
            <Message.Header>Did you know there's a new dashboard in the works?</Message.Header>
            <p>If you get the chance to give it a go, let Joel know your thoughts!</p>
            <a href='http://dash.townshiptale.com'>dash.townshiptale.com</a>
        </Message.Content>
        </Message>
      <Header>ATT Console</Header>
      <Divider/>
      <Navigation/>
    </Container>
  );
}
