import React from "react";
import { List, ListItem, Link, Card, CardHeader, CardContent, CardFooter } from 'framework7-react';
import crypto from 'crypto-js';
import { dict } from "../../Dict";

const NotificationList = (props) => {
  if (props.notifications && props.notifications.length > 0) {
    function profileLink(profile) {
      return (<Link href='/profiles/'>{profile.fullname}</Link>)
    }

    function colorClass(notification) {
      if (!notification.seen) {
        return 'bg-blonde'
      }
    }

    function item(notification) {
      if(notification && notification.notification_text) {
      return (
        <ListItem
          className={'fs-11 ' + colorClass(notification)}
          key={crypto.lib.WordArray.random(32)}
          link={'/' + notification.target_type + '/' + notification.target_id}
          title={profileLink(notification.profile)}
          text={notification.notification_text.title}
        >
          <img slot="media" src={notification.profile.avatar} width="32" height="32" />
        </ListItem>
      )
      }
    }
    return (
      <Card>
        <CardHeader>{dict.new_notifications}</CardHeader>
        <CardContent className='h-120'>
          <List mediaList>
            {props.notifications.map((notification) =>
              item(notification)
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
export default NotificationList;
