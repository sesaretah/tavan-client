import React from "react";
import { List, ListItem, Link, Card, CardHeader, CardContent, CardFooter } from 'framework7-react';
import crypto from 'crypto-js';
import { dict } from "../../Dict";

const StatusChange = (props) => {
    if (props.statusChanges && props.statusChanges.length > 0) {
        function profileLink(profile) {
            return (<Link href='/profiles/'>{profile.fullname}</Link>)
        }

        function chip(status, prev) {
            return (
                <div>

                    <div className="chip fs-11 ml-2" >
                        <div className="chip-media" style={{ backgroundColor: prev.color }} >
                            <i className="icon f7-icons if-not-md">plus_circle</i>
                            <i className="icon material-icons md-only"></i>
                        </div>
                        <div className="chip-label">{prev.title}</div>
                    </div>
                    {dict.to}
                    <div className="chip fs-11 " >
                        <div className="chip-media" style={{ backgroundColor: status.color }} >
                            <i className="icon f7-icons if-not-md">plus_circle</i>
                            <i className="icon material-icons md-only"></i>
                        </div>
                        <div className="chip-label">{status.title}</div>
                    </div>

                </div>
            )
        }

        function item(statusChange) {
            if (statusChange.prev_status && statusChange.prev_status.title !== statusChange.current_status.title) {
                return (
                    <ListItem
                        className={'fs-11 home-status'}
                        key={crypto.lib.WordArray.random(32)}
                        link={'/' + statusChange.statusable_type_pl + '/' + statusChange.statusable_id}
                        title={profileLink(statusChange.profile)}
                        text={statusChange.title}
                        after={chip(statusChange.current_status, statusChange.prev_status)}
                    >
                        <img slot="media" src={statusChange.profile.avatar} width="32" height="32" />
                    </ListItem>
                )
            }
        }

        return (
            <Card>
                <CardHeader>{dict.statusChanges}</CardHeader>
                <CardContent className='h-120'>
                    <List mediaList>
                        {props.statusChanges.map((statusChange) =>
                            item(statusChange)
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
export default StatusChange;
