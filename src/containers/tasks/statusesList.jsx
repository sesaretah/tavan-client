import React from "react";
import { List, ListItem, CardHeader, CardContent, CardFooter } from 'framework7-react';
import crypto from 'crypto-js';
import { dict } from "../../Dict";
import Moment from 'react-moment';
import JDate from 'jalali-date';
import 'moment-timezone';
import 'moment/locale/fa';

const StatusesList = (props) => {

  if (props.works) {
    return (
      <React.Fragment>
        <CardHeader>
          {props.header}
        </CardHeader>
        <CardContent className='h-120'>
          <List mediaList className='fs-11'>
            {props.works.map((work) =>
              <ListItem   className='fs-10' key={'workList'+work.id} title={work.title} text={work.task.title} after={alerts(work)} link={'/works/' + work.id}></ListItem>
            )}
          </List>
        </CardContent>
        <CardFooter>
        </CardFooter>
      </React.Fragment>

    )
  } else {
    return (<ul></ul>)
  }
}
export default StatusesList;
