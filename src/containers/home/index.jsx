import React from "react";
import { Page, Navbar, Row, BlockTitle, Col, Fab, Icon, Card, Link, CardContent, CardHeader } from 'framework7-react';
import TaskList from "../tasks/list"
import WorkList from "../tasks/workList"
import NotificationList from "../notifications/homeList"
import ReportList from "../reports/homeList"
import VisitChart from "../visits/timeseries"


import { dict } from '../../Dict';

const HomeIndex = (props) => {

    return (
        <Page onPageAfterIn={props.pageAfterIn.bind(this)}>
            <Navbar title={dict.home} >
                <Link panelOpen="right">
                    <Icon f7="bars"></Icon>
                </Link>
            </Navbar>
            <Row>
                <Col width='100' tabletWidth='50'>
                    <Card>
                        <TaskList tasks={props.tasks} header={dict.your_tasks} sortChange={props.sortChange} />
                    </Card>
                </Col>

                <Col width='100' tabletWidth='50'>
                    <VisitChart tasksVisits={props.tasksVisits} header={dict.your_newest_works} sortChange={props.sortChange} />
                </Col>



            </Row>
            <Row>
                <Col width='100' tabletWidth='50'>
                    <Card>
                        <WorkList works={props.works} header={dict.your_newest_works} sortChange={props.sortChange} />
                    </Card>
                </Col>
                <Col width='100' tabletWidth='50'>
                    <Card>
                        <CardHeader>{dict.events_calendar}</CardHeader>
                        <CardContent className='home'>
                        <div className="block block-strong no-padding">
                            <div id="demo-calendar-inline-container"></div>
                        </div>
                        </CardContent>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col width='100' tabletWidth='50'>
                    <NotificationList notifications={props.notifications} header={dict.your_newest_works} sortChange={props.sortChange} />
                </Col>

                <Col width='100' tabletWidth='50'>
                    <ReportList reports={props.reports} header={dict.your_newest_works} sortChange={props.sortChange} />
                </Col>
            </Row>

            <Row>


            </Row>

        </Page>
    )
}
export default HomeIndex;
