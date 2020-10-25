/**
 *
 * ServersPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import styled from 'styled-components';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';

import { UserReports, UserReportStatus, Users } from 'alta-jsapi';

import * as Servers from 'jsapi/servers';
import * as RemoteConsoles from 'jsapi/remoteConsoles';

import { changeTab } from '../Navigation/actions';

import Responsive, { useMediaQuery } from 'react-responsive';

import {
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
  Dropdown
} from 'semantic-ui-react';

import {
  DateInput,
  TimeInput,
  DateTimeInput,
  DatesRangeInput
} from 'semantic-ui-calendar-react';
import memoizee from 'memoizee';

import ServerDropdown from './ServerDropdown';

export function ReportPage({ }) 
{
  const [filter, setFilter] = React.useState('');

  const [title, setTitle] = React.useState('');
  const [date, setDate] = React.useState();
  const [targetUser, setTargetUser] = React.useState('');
  const [targetUserId, setTargetUserId] = React.useState();
  const [server, setServer] = React.useState('');
  const [description, setDescription] = React.useState('');

  const isDesktop = useMediaQuery({query: '(min-device-width: 1224px)'});

  const filterRegex = new RegExp(filter, "i");

  var test = async () =>
  {
    try
    {
      for await (var result of UserReports.getUserReports(UserReportStatus.Unprocessed, [780967285]))
      {
        console.log(result);
      }

      console.log("Done!");
    }
    catch (error)
    {
      console.error(error);
    }
  }
  
  var test2 = async () =>
  {
    try
    {
      await UserReports.submitReport({ title : "Testing things!" });
    }
    catch (error)
    {
      console.error(error);
    }
  }

  var verifyUser = () =>
  {
    setTargetUserId(undefined);

    //341666325
    if (isNaN(targetUser))
    {
      Users.findUserByUsername(targetUser)
      .then(result => setTargetUserId(result.id))
      .catch(result => setTargetUserId(0));
    }
    else
    {
      Users.getInfo(targetUser)
      .then(result => setTargetUserId(parseInt(result.id)))
      .catch(result => setTargetUserId(0));
    }
  }

  const error = undefined;

  return (
    <div>
      {!!error && (
        <Message error header="Error!" content={error} />
      )}
      <Menu>
        <Menu.Item>
          <Button primary onClick={() => test2()}>
            Create
          </Button>
          <Button primary onClick={() => test()}>
            List
          </Button>
        </Menu.Item>
      </Menu>
      <Input fluid icon='search' onChange={(event, args) => setFilter(args.value)}/>
      <Divider/>
      <Form>
        <Form.Input label="Title" placeholder="A short description" value={title} onChange={(event, data) => setTitle(data.value)}/>
        <Form.Group widths='equal'>
          <Form.Input label="Target or Offender" error={targetUserId === 0 ? "Not found!" : undefined} action={!!targetUserId ? {content:"Verified!", icon:"check"} : {content:"Verify", icon:"search", onClick:verifyUser}} icon='male' iconPosition='left' placeholder="Username/ID" value={targetUser} 
          onChange={(event, data) => { 
            setTargetUserId(undefined);
            setTargetUser(data.value)
            }}/>
          <DateInput label="Incident Date" placeholder="When did this occur?" iconPosition='left' value={date} onChange={(event, data) => setDate(data.value)}/>
          <ServerDropdown fluid value={server} setValue={setServer}/>
        </Form.Group> 
        <Form.TextArea label="Description" placeholder="All the information!" value={description} onChange={(event, data) => setDescription(data.value)}/>
        <Form.Button floated='right'>Submit</Form.Button>
      </Form>
    </div>
  );
}

ReportPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(ReportPage);
