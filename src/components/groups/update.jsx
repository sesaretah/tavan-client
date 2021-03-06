import React, { Component } from 'react';
import {
  Page,
  Navbar,
  List,
  ListItem,
  ListInput,
  Toggle,
  BlockTitle,
  Row,
  Button,
  Range,
  Block,
  Icon
} from 'framework7-react';
import { dict} from '../../Dict';
import ModelStore from "../../stores/ModelStore";
import * as MyActions from "../../actions/MyActions";
import GroupForm from "../../containers/groups/form"
import Framework7 from 'framework7/framework7.esm.bundle';
import { conf } from '../../conf';

export default class GroupCreate extends Component {
  constructor() {
    super();
    this.submit = this.submit.bind(this);
    this.setInstance = this.setInstance.bind(this);
    this.handleChangeValue = this.handleChangeValue.bind(this);
    this.loadGrouping = this.loadGrouping.bind(this);
    this.removeGrouping = this.removeGrouping.bind(this);
    this.getInstance = this.getInstance.bind(this);

    this.state = {
      token: window.localStorage.getItem('token'),
      group: {},
      title: null,
      id: null,
      grouping: [],
    }
  }


  componentWillMount() {
    ModelStore.on("got_instance", this.getInstance);
    ModelStore.on("set_instance", this.setInstance);
  }

  componentWillUnmount() {
    ModelStore.removeListener("got_instance", this.getInstance);
    ModelStore.removeListener("set_instance", this.setInstance);
  }

  componentDidMount() {
    MyActions.getInstance('groups', this.$f7route.params['groupId'], this.state.token);
  }

  submit(){
    var data = {id: this.state.id, title: this.state.title, grouping: this.state.grouping}
    MyActions.updateInstance('groups', data, this.state.token);
  }


  handleChangeValue(obj) {
    this.setState(obj);
  }

  setInstance(){
    const self = this;
    this.$f7router.navigate('/groups/');
  }

  removeGrouping(id){
    this.setState({
      grouping: this.state.grouping.filter(function (profile) {
        return profile.id !== id
      })
    });
  }

  pageAfterIn() {
    this.loadGrouping();
  }

  getInstance() {
    var group = ModelStore.getIntance()
    var klass = ModelStore.getKlass()
    if (group && klass === 'Group') {
      this.setState({
        group: group,
        id: group.id,
        title: group.title,
        grouping: group.tag_grouping
      });
    }
  }


  loadGrouping() {
    const self = this;
    const app = self.$f7;
    app.autocomplete.create({
      openIn: 'popup', //open in page
      openerEl: '#time-sheet-grouping', //link that opens autocomplete
      multiple: true, //allow multiple values
      valueProperty: 'id', //object's "value" property name
      textProperty: 'fullname', //object's "text" property name
      searchbarDisableText: dict.cancel,
      popupCloseLinkText: dict.close,
      notFoundText: dict.not_found,
      limit: 50,
      searchbarPlaceholder: dict.search,
      //preloader: true, //enable preloader
      source: function (query, render) {
        var autocomplete = this;
        var results = [];
        if (query.length === 0) {
          render(results);
          return;
        }
        // Show Preloader
       // autocomplete.preloaderShow();
        // Do Ajax request to Autocomplete data
        app.request({
          url: conf.server + '/profiles/search',
          method: 'GET',
          dataType: 'json',
          //send "query" to server. Useful in case you generate response dynamically
          data: {
            q: query
          },
          success: function (item) {
            // Find matched items
            for (var i = 0; i < item.data.length; i++) {
               results.push(item.data[i]);
            }
            // Hide Preoloader
            //autocomplete.preloaderHide();
            // Render items by passing array with result items
            render(results);
          }
        });
      },
      on: {
        change: function (value) {
          if (value && value[value.length - 1]) {
            self.setState({ grouping: self.state.grouping.concat({ fullname: value[value.length - 1].fullname, id: value[value.length - 1].id }) })
          }
        },
      },
    });
  }



  render() {
    const {group, grouping, title, id} = this.state;
    return (
      <Page onPageAfterIn={this.pageAfterIn.bind(this)}>
        <Navbar title={dict.group_form} backLink={dict.back} />
        <BlockTitle>{dict.group_form}</BlockTitle>
        <GroupForm 
        group={group} submit={this.submit} editing={true} grouping={grouping}
        id={id} title={title}
        handleChange={this.handleChangeValue} removeGrouping={this.removeGrouping}
        
        />
      </Page>
    );
  }
}
