import React, { Component } from 'react';
import {
  Page,
  Navbar,
  Link,
  BlockTitle,
  Icon, Fab
} from 'framework7-react';
import { dict } from '../../Dict';
import ModelStore from "../../stores/ModelStore";
import * as MyActions from "../../actions/MyActions";
import ReportShow from "../../containers/reports/show";
import crypto from 'crypto-js';

export default class Layout extends Component {
  constructor() {
    super();
    this.getInstance = this.getInstance.bind(this);
    this.setInstance = this.setInstance.bind(this);
    this.handleChangeValue = this.handleChangeValue.bind(this);
    this.getList = this.getList.bind(this);
    this.submitComment = this.submitComment.bind(this);
    this.deleteComment = this.deleteComment.bind(this);
    this.deleteCommentConfirm = this.deleteCommentConfirm.bind(this);
    this.loadMore = this.loadMore.bind(this);
    this.replyToComment = this.replyToComment.bind(this);
    this.removeReply = this.removeReply.bind(this);




    this.state = {
      report: null,
      id: null,
      page: 1,
      selectedChannel: null,
      sheetOpened: false,
      commentContent: '',
      comments: null,
      access: null,
      replyTo: null,
      token: window.localStorage.getItem('token'),
      rnd: crypto.lib.WordArray.random(32),

    }
  }

  componentWillMount() {
    ModelStore.on("got_instance", this.getInstance);
    ModelStore.on("set_instance", this.setInstance);
    ModelStore.on("got_list", this.getList);
    ModelStore.on("deleted_instance", this.getInstance);

  }

  componentWillUnmount() {
    ModelStore.removeListener("got_instance", this.getInstance);
    ModelStore.removeListener("set_instance", this.setInstance);
    ModelStore.removeListener("got_list", this.getList);
    ModelStore.removeListener("deleted_instance", this.getInstance);
  }

  componentDidMount() {
    MyActions.getInstance('reports', this.$f7route.params['reportId'], this.state.token);
  }

  getInstance() {
    var report = ModelStore.getIntance()
    var klass = ModelStore.getKlass()
    if (report && klass === 'Report') {
      this.setState({
        report: report,
        id: report.id,
        comments: report.the_comments,
        access: report.user_access,
        replyTo: null,
      });
    }
  }

  getList() {

  }

  setInstance() {
    var report = ModelStore.getIntance()
    var klass = ModelStore.getKlass()
    if (report && klass === 'Report') {
      this.setState({
        report: report,
        comments: report.the_comments,
        page: 1
      });
    }
    this.$$('#cm-form-'+this.state.rnd).val('');
  }

  loadMore() {
    this.setState({ page: this.state.page + 1 }, () => {
      MyActions.getInstance('reports', this.$f7route.params['reportId'], this.state.token, this.state.page);
    });
  }

  fab() {
    if (this.state.report) {
      return (
        <Fab href={"/reports/" + this.state.report.id + "/edit"} target="#main-view" position="left-bottom" slot="fixed" color="lime">
          <Icon ios="f7:edit" aurora="f7:edit" md="material:edit"></Icon>
          <Icon ios="f7:close" aurora="f7:close" md="material:close"></Icon>
        </Fab>
      )
    }
  }

  handleChangeValue(obj) {
    this.setState(obj);
  }



  submitComment() {
    var data = { commentable_type: 'Report', commentable_id: this.state.id, content: this.state.commentContent , reply_id: this.state.replyTo }
    MyActions.setInstance('comments', data, this.state.token);
  }


  deleteCommentConfirm(id) {
    const self = this;
    const app = self.$f7;
    app.dialog.confirm(dict.are_you_sure, dict.alert, () => self.deleteComment(id))
  }

  deleteComment(id) {
    var data = { id: id }
    MyActions.removeInstance('comments', data, this.state.token, this.state.page);
  }

  replyToComment(id) {
    this.setState({ replyTo: id })
    this.$$('#cm-form').focus()
  }

  removeReply() {
    this.setState({ replyTo: null })
  }



  render() {
    const { report, comments , access, replyTo, rnd} = this.state;
    return (
      <Page>
        <Navbar title={dict.reports} >
        <Link panelOpen="right">
          <Icon f7="bars"></Icon>
        </Link>
      </Navbar>
        <BlockTitle></BlockTitle>
        {this.fab()}
        <ReportShow 
          report={report} comments={comments} submitComment={this.submitComment}
          deleteCommentConfirm={this.deleteCommentConfirm} submit={this.submit} 
          handleChange={this.handleChangeValue} loadMore={this.loadMore} 
          access={access}
          replyToComment={this.replyToComment} replyTo={replyTo} removeReply={this.removeReply}
          rnd={rnd}
          />
      </Page>
    );
  }
}
