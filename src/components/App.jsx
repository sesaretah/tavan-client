import React, { Component } from 'react';
import {
  App,
  Panel,
  View,
  Statusbar,
} from 'framework7-react';
import ModelStore from "../stores/ModelStore";
import * as MyActions from "../actions/MyActions";
import { messaging } from "../init-fcm.js";
import crypto from 'crypto-js';

import routes from '../routes';

export default class extends React.Component {
  constructor() {
    super();
    this.uploadFromDb = this.uploadFromDb.bind(this);

    this.state = {
      token: window.localStorage.getItem('token'),
    }
  }
  async componentDidMount() {
    const self = this;
    const app = self.$f7;

    if (messaging) {
      messaging.requestPermission()
        .then(async function () {
          const token = await messaging.getToken();
          var data = { token: token }
          if (self.state.token && self.state.token.length > 10) {
            MyActions.setInstance('devices', data, self.state.token);
          }
        })
        .catch(function (err) {
          console.log("Unable to get permission to notify.", err);
        });
    }
    navigator.serviceWorker.addEventListener("message", (message) => {

      app.notification.create({
        icon: '',

        title: message.data.firebaseMessaging.payload.notification.title,
        titleRightText: '',
        cssClass: 'notification',
        subtitle: message.data.firebaseMessaging.payload.notification.body,
        closeTimeout: 5000,
      }).open();
    });

    setInterval(function () {
      self.uploadFromDb();
    }, 30000);


  }

  uploadFromDb() {
    var self = this;
    console.log('DB Sync. Started')
    var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.OIndexedDB || window.msIndexedDB,
      IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.OIDBTransaction || window.msIDBTransaction,
      dbVersion = 3;

    // Create/open database
    var request = indexedDB.open("screenCastFiles", dbVersion);
    request.onsuccess = function (event) {
      console.log("Success creating/accessing IndexedDB database");
      var db = request.result;

      db.onerror = function (event) {
        console.log("Error creating/accessing IndexedDB database");
      };
      // db.createObjectStore("screenCast");
      var transaction = db.transaction(["screenCastFiles"], "readwrite");
      var object_store = transaction.objectStore("screenCastFiles");
      var r = object_store.openCursor();

      r.onerror = function (event) {
        console.err("error fetching data");
      };
      r.onsuccess = function (event) {
        let cursor = event.target.result;
        if (cursor) {
          let key = cursor.primaryKey;
          let value = cursor.value;
          console.log(key, value);
          var data = [{ label: 'file', value: value.blob }, { label: 'surveillance[start_time]', value: crypto.lib.WordArray.random(32) }]
          MyActions.generalFilePost('surveillances', data, self.state.token)
          transaction.objectStore("screenCastFiles").delete(key);
          cursor.continue();
        }
        else {
          // no more results
        }
      };
      /*
     var transaction = db.transaction(["screenCastFiles"], "readwrite");
     transaction.objectStore("screenCastFiles").getAll().onsuccess = function (event) {
       var cursor = event.target.result;
       if (cursor) {
           var key = cursor.primaryKey;
           var value = cursor.value;
           console.log(key, value)
           var data = [{ label: 'file', value: value.blob }, { label: 'surveillance[start_time]', value: crypto.lib.WordArray.random(32) }]
           MyActions.generalFilePost('surveillances', data, self.state.token)
           transaction.objectStore("screenCastFiles").delete(key);
           cursor.continue();
       }
      
       console.log(event);
       
       event.target.result.map((item, index) => {
         console.log(item, index)
         var data = [{ label: 'file', value: item.blob }, { label: 'surveillance[start_time]', value: crypto.lib.WordArray.random(32) }]
         MyActions.generalFilePost('surveillances', data, self.state.token)
         transaction.objectStore("screenCastFiles").delete(index);
         //this.addScreenCastDb(completeBlob)
       });
    }*/
  }
}
// Framework7 parameters here

render() {
  const f7params = {
    id: 'io.framework7.testapp', // App bundle ID
    name: 'Framework7', // App name
    theme: 'aurora', // Automatic theme detection
    panel: {
      rightBreakpoint: 960,
    },
    view: {
      //ignoreCache: true,
      //reloadCurrent: true
    },
    // App routes
    routes,
  };

  //const server = React.createContext('http://localhost:3001/v1/');
  return (
    <App params={f7params}>
      {/* Statusbar */}
      <Statusbar />

      {/* Left Panel */}
      <Panel left cover themeDark>
        <View url="/panel-left/" />
      </Panel>

      {/* Right Panel */}
      <Panel right reveal themeDark>
        <View url="/panel-right/" />
      </Panel>

      {/* Main View */}
      <View id="main-view" url="/app" pushState={true} main className="safe-areas" />

    </App>
  );
}
};
