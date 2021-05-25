import React from "react";
import { List, ListItem} from 'framework7-react';
import crypto from 'crypto-js';

const SurveillanceList = (props) => {

  if (props.surveillances) {
    return (
      <List mediaList>
        {props.surveillances.map((surveillance) =>
          <ListItem>
            <video autoPlay controls playsInline loop src={surveillance.link} width='640'></video>
          </ListItem>
        )}
      </List>
    )} else {
      return (<ul></ul>)
    }
  }
  export default SurveillanceList;
