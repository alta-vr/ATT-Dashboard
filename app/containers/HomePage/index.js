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
      <Header>ATT Console</Header>
      <Divider/>
      <Navigation/>
    </Container>
  );
}
