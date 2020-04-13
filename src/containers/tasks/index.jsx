import React from "react";
import { Page, Navbar, Row, BlockTitle, Col, Fab, Icon, Card, Block } from 'framework7-react';
import TaskList from "./list"
import { dict } from '../../Dict';

const TaskIndex = (props) => {
  return (
    <Page>
      <Navbar title={dict.tasks} backLink={dict.back} >
      </Navbar>
      <BlockTitle>{dict.list}</BlockTitle>
      <Fab href="/tasks/new" target="#main-view" position="left-bottom" slot="fixed" color="deeporange">
        <Icon ios="f7:add" aurora="f7:add" md="material:add"></Icon>
        <Icon ios="f7:close" aurora="f7:close" md="material:close"></Icon>
      </Fab>
      <Row>
        <Col width='100' tabletWidth='50'>
          <Card>
            <TaskList tasks={props.tasks} header={dict.recent_tasks} sortChange={props.sortChange} />
          </Card>
        </Col>
        <Col width='100' tabletWidth='50'>
          <Card>
            <TaskList tasks={props.tasks} header={dict.public_tasks} sortChange={props.sortChange} />
          </Card>
        </Col>

      </Row>

    </Page>
  )
}
export default TaskIndex;
