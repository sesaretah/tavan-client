import React, { Component } from 'react';
import { NavLeft, Link, Page, Navbar, Icon, Row, Col, Card } from 'framework7-react';
import { dict } from '../../Dict';
import ModelStore from "../../stores/ModelStore";
import * as MyActions from "../../actions/MyActions";
import Framework7 from 'framework7/framework7.esm.bundle'
import HomeContent from "../layouts/HomeContent"

export default class HomePage extends Component {
  constructor() {
    super();
    this.getMutipleList = this.getMutipleList.bind(this);
    this.sortChange = this.sortChange.bind(this);
    
    this.loadData = this.loadData.bind(this);


    this.state = {
      token: window.localStorage.getItem('token'),
      tasks: null,
      works: null
    }
  }


  componentWillMount() {
    ModelStore.on("got_multiple_list", this.getMutipleList);
  }

  componentWillUnmount() {
    ModelStore.removeListener("got_multiple_list", this.getMutipleList);
  }

  componentDidMount() {
    if (this.state.token && this.state.token.length > 10) {

    }
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    const f7: Framework7 = Framework7.instance;
    f7.toast.show({ text: dict.receiving, closeTimeout: 2000, position: 'top' });
    MyActions.getMultipleList('home', this.state.page, {}, this.state.token);
  }

  getMutipleList() {
    var multiple = ModelStore.getMutipleList()
    var klass = ModelStore.getKlass()
    console.log(multiple)
    if (multiple && klass === 'TimeSheet') {
      this.setState({
        tasks: multiple.tasks,
        works: multiple.works,
      });
    }
  }

  sortChange(i) {
    MyActions.getList('tasks', this.state.page, { order: i.title }, this.state.token);
  }

  render() {
    const { token, tasks, works } = this.state;
    console.log(tasks)
    return (
      <Page className="no-swipe-panel">
        <Navbar>

          <NavLeft>
            <Link panelOpen="right">
              <Icon f7="bars"></Icon>
            </Link>
          </NavLeft>
        </Navbar>
        <HomeContent tasks={tasks} works={works} sortChange={this.sortChange} />
      </Page>
    );
  }
}