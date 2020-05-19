import React from "react";
import { Page, Navbar, Row, BlockTitle, Col, Fab, Icon, Card, Link } from 'framework7-react';
import TaskList from "../tasks/list"
import WorkList from "../tasks/workList"
import { dict } from '../../Dict';

const HomeContent = (props) => {
    console.log('ppp')
    if(props.tasks) {
        
  return (
      <Row>
        <Col width='100' tabletWidth='50'>
          <Card>
              kk
            <TaskList tasks={props.tasks} header={dict.your_tasks} sortChange={props.sortChange} />
          </Card>
        </Col>
        <Col width='100' tabletWidth='50'>
          <Card>
            <WorkList works={props.works} header={dict.your_newest_works} sortChange={props.sortChange} />
          </Card>
        </Col>

      </Row>
  )
} else
{
    return('hhh')
}

}
export default HomeContent;
