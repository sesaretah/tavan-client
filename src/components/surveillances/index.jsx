import React from "react"
import { Page, Fab, Icon } from 'framework7-react';
import ModelStore from "../../stores/ModelStore";
import SurveillanceIndex from "../../containers/surveillances/index"
import * as MyActions from "../../actions/MyActions";
import { dict } from '../../Dict';
import Framework7 from 'framework7/framework7.esm.bundle';
import crypto from 'crypto-js';
//import ConcatenateBlobs  from 'concatenateblobs';

export default class Layout extends React.Component {
  constructor() {
    super();
    this.getList = this.getList.bind(this);
    this.startRecording = this.startRecording.bind(this);
    this.addScreenCastDb = this.addScreenCastDb.bind(this);
    this.uploadFromDb = this.uploadFromDb.bind(this);
    this.stopRecording = this.stopRecording.bind(this);
    
    this.state = {
      token: window.localStorage.getItem('token'),
      surveillances: null,
      chunks: [],
      stream: null,
      recorder: null,
      videoSrc: null,
      startTime: null,
      endTime: null,
      db: null,
      sessionId: null
    }
  }
  componentWillMount() {
    ModelStore.on("got_list", this.getList);
  }

  componentWillUnmount() {
    ModelStore.removeListener("got_list", this.getList);
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    const f7: Framework7 = Framework7.instance;
    f7.toast.show({ text: dict.receiving, closeTimeout: 2000, position: 'top' });
    MyActions.getList('surveillances', this.state.page, {}, this.state.token);
  }

  stopRecording() {
    clearInterval(window.intervalHandle);
  }

  async startRecording() {
    var self = this;
    var supportedConstraints = navigator.mediaDevices.getSupportedConstraints();
    console.log(supportedConstraints);
    this.setState({ sessionId: crypto.lib.WordArray.random(32) })
    

    var stream = await navigator.mediaDevices.getDisplayMedia({
      video: { mediaSource: "screen", frameRate: 6, width: 768, height: 480 },
    })
    this.setState({ stream: stream })
    this.setState({ startTime: new Date() })
    var recorder = new MediaRecorder(stream);
    var self = this;
    var chunks = [];
    window.intervalHandle = null;
    window.intervalHandle = setInterval(function () {
      if (recorder.state !== 'inactive') {
        recorder.stop();
      }
      setTimeout(function () {
        try {
          recorder.start();
        }
        catch (err) { }
      }, 2000);
    }, 3000);

    stream.getVideoTracks()[0].onended = function(event) { 
      clearInterval(window.intervalHandle);
    }


    recorder.ondataavailable = (e) => {
      chunks.push(e.data);
    };

    recorder.onpause = (e) => {
      //console.log(chunks);
      console.log(e.data);
    };

    recorder.onstop = (e) => {
      //this.setState({ endTime: new Date() })
      const completeBlob = new Blob(chunks, { type: chunks[0].type });
      //this.setState({ videoSrc: URL.createObjectURL(completeBlob) });
     // var data = [{ label: 'file', value: completeBlob }, { label: 'surveillance[start_time]', value: crypto.lib.WordArray.random(32) }]
      //MyActions.generalFilePost('surveillances', data, this.state.token)
      this.addScreenCastDb(completeBlob, self.state.sessionId)
      // var data = [{ label: 'file', value: completeBlob }, { label: 'surveillance[start_time]', value: crypto.lib.WordArray.random(32) }]
      // MyActions.generalFilePost('surveillances', data, this.state.token)
      //video.src = URL.createObjectURL(completeBlob);
    };
  }



  addScreenCastDb(blob, sessionId) {
    // IndexedDB
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

      var transaction = db.transaction(["screenCastFiles"], "readwrite");
      console.log('added')
      transaction.objectStore("screenCastFiles").put({blob: blob, sessionId: sessionId} );
    }

    request.onupgradeneeded = function (event) {
      var db = event.target.result;
      console.log("running onupgradeneeded");
      if (!db.objectStoreNames.contains("screenCastFiles")) {
        console.log("I need to make the screenCast objectstore");
        db.createObjectStore("screenCastFiles", { autoIncrement : true });
      }
    }
  }

  uploadFromDb() {
    var self = this;
    console.log('Started')
    var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.OIndexedDB || window.msIndexedDB,
      IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.OIDBTransaction || window.msIDBTransaction,
      dbVersion = 2;

    // Create/open database
    var request = indexedDB.open("screenCastFiles", dbVersion);
    request.onsuccess = function (event) {
      console.log("Success creating/accessing IndexedDB database");
      var db = request.result;

      db.onerror = function (event) {
        console.log("Error creating/accessing IndexedDB database");
      };
      // db.createObjectStore("screenCast");
      var transaction = db.transaction(["screenCast"], "readwrite");
      var parts = []
      transaction.objectStore("screenCast").getAll().onsuccess = function (event) {
        console.log(event.target.result);
        window.ConcatenateBlobs(event.target.result, "video/x-matroska;codecs=avc1", function (resultingBlob) {
          //const completeBlob = new Blob(parts, { type: "video/x-matroska;codecs=avc1" });
          console.log(resultingBlob)
          self.setState({ videoSrc: URL.createObjectURL(resultingBlob) })
        }
        );

      }
    }
  }


  getList() {
    var surveillances = ModelStore.getList()
    var klass = ModelStore.getKlass()
    if (surveillances && klass === 'Surveillance') {
      this.setState({
        surveillances: surveillances,
      });
    }
  }

  render() {
    const { surveillances, stream, videoSrc } = this.state;
    return (<SurveillanceIndex
      videoSrc={videoSrc}
      stream={stream}
      surveillances={surveillances}
      uploadFromDb={this.uploadFromDb}
      stopRecording={this.stopRecording}
      startRecording={this.startRecording} />)
  }
}
