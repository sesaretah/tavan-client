import React, { Component } from 'react';
import { NavLeft, Link, Page, Navbar, Icon, Row, Col, Card } from 'framework7-react';
import { dict } from '../../Dict';
import ModelStore from "../../stores/ModelStore";
import * as MyActions from "../../actions/MyActions";
import Framework7 from 'framework7/framework7.esm.bundle'
import HomeContent from "../../containers/home/index"

export default class HomePage extends Component {
  constructor() {
    super();
    this.getMutipleList = this.getMutipleList.bind(this);
    this.sortChange = this.sortChange.bind(this);

    this.loadData = this.loadData.bind(this);
    this.loadCalender = this.loadCalender.bind(this);
    this.pageAfterIn = this.pageAfterIn.bind(this);
    

    this.state = {
      token: window.localStorage.getItem('token'),
      tasks: null,
      works: null,
      notifications: null,
      reports: null,
      events: null,
      statusChanges: null,
      taskPage: 1,
      taskPp: 10,
    }
  }


  componentWillMount() {
    ModelStore.on("got_multiple_list", this.getMutipleList);
  }

  componentWillUnmount() {
    ModelStore.removeListener("got_multiple_list", this.getMutipleList);
  }

  loadCalender() {
   // this.$$('.page-content').scrollTop(this.$$('#status-card')[0].offsetTop)
    const self = this;
    const app = self.$f7;
    var events = []
    if (self.state.events) {
      self.state.events.map((ev) =>{
        events.push({date: new window.ODate(ev.date), color: ev.color})
      })
    }

    console.log(events)


    var monthNames = ['فروردين', 'ارديبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند']
    var calendarInline = app.calendar.create({
      containerEl: '#demo-calendar-inline-container',
      value: [new Date()],
      weekHeader: false,
      events: events,
      renderToolbar: function () {
        return '<div class="toolbar calendar-custom-toolbar no-shadow">' +
          '<div class="toolbar-inner">' +
          '<div class="left">' +
          '<a href="#" class="link icon-only"><i class="icon icon-back ' + (app.theme === 'md' ? 'color-black' : '') + '"></i></a>' +
          '</div>' +
          '<div class="center"></div>' +
          '<div class="right">' +
          '<a href="#" class="link icon-only"><i class="icon icon-forward ' + (app.theme === 'md' ? 'color-black' : '') + '"></i></a>' +
          '</div>' +
          '</div>' +
          '</div>';
      },
      on: {
        init: function (c) {
          self.$$('.calendar-custom-toolbar .center').text(monthNames[c.currentMonth] + ', ' + c.currentYear);
          self.$$('.calendar-custom-toolbar .left .link').on('click', function () {
            calendarInline.prevMonth();
          });
          self.$$('.calendar-custom-toolbar .right .link').on('click', function () {
            calendarInline.nextMonth();
          });
        },
        monthYearChangeStart: function (c) {
          self.$$('.calendar-custom-toolbar .center').text(monthNames[c.currentMonth] + ', ' + c.currentYear);
        },
        dayClick: function (calendar, dayEl, year, month, day) {
          console.log(year, month, day)
        }
      }
    });
  }


  pageAfterIn() {
   
  }

  componentDidMount() {
    this.loadData();
   
  }

  loadData() {
    const f7: Framework7 = Framework7.instance;
    f7.toast.show({ text: dict.receiving, closeTimeout: 2000, position: 'top' });
    var data = {task_page: this.state.taskPage, task_pp: this.state.taskPp}
    MyActions.getMultipleList('home', this.state.page, data, this.state.token);
  }

  getMutipleList() {
    var multiple = ModelStore.getMutipleList()
    var klass = ModelStore.getKlass()
    console.log(multiple)
    if (multiple && klass === 'Home') {
      this.setState({
        tasks: multiple.tasks,
        works: multiple.works,
        notifications: multiple.notifications,
        reports: multiple.reports,
        tasksVisits: multiple.tasks_visits,
        events: multiple.events,
        statusChanges: multiple.status_change,
      }, () => this.loadCalender());
    }
    
  }

  sortChange(i) {
    MyActions.getList('tasks', this.state.page, { order: i.title }, this.state.token);
  }

  render() {
    const { tasks, works, notifications, reports, tasksVisits,statusChanges } = this.state;
    return (<HomeContent 
      notifications={notifications} tasksVisits={tasksVisits}
       reports={reports} tasks={tasks} works={works} sortChange={this.sortChange} 
       pageAfterIn={this.pageAfterIn} statusChanges={statusChanges}
       />)
  }
}