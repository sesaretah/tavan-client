import React from "react";
import { List, ListItem, Link, Card, CardHeader, CardContent, CardFooter } from 'framework7-react';
import crypto from 'crypto-js';
import { dict } from "../../Dict";

const ReportList = (props) => {
console.log(props)
  if (props.reports && props.reports.length > 0) {
    function profileLink(profile) {
      return (<Link href='/profiles/'>{profile.fullname}</Link>)
    }

    return (
      <Card>
        <CardHeader>{dict.new_reports}</CardHeader>
        <CardContent className='h-120'>
          <List mediaList>
            {props.reports.map((report) =>
              <ListItem
                className={'fs-11 '}
                key={crypto.lib.WordArray.random(32)}
                link={'/reports/' + report.id}
                text={profileLink(report.profile)}
                title={report.title}
              >
                <img slot="media" src={report.profile.avatar} width="32" height="32" />
              </ListItem>
            )}
          </List>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    )
  } else {
    return (<ul></ul>)
  }
}
export default ReportList;
