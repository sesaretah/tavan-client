import React from "react";
import { Page, Navbar, List, BlockTitle, Row, Col, Icon, Preloader, Block, Button } from 'framework7-react';
import SurveillanceList from "./list"
import { dict } from '../../Dict';

const SurveillanceIndex = (props) => {
  function stopBtn() {
    if (props.stream && props.stream.getVideoTracks()[0]) {
      props.stream.getVideoTracks()[0].stop()
      props.stopRecording()
    }
  }
  return (
    <Page>
      <Navbar title={dict.surveillances} backLink={dict.back} >
      </Navbar>
      <Block>
        <Row>
          <Col width="25" className='ml-4'>
            <Button fill onClick={props.startRecording}>
              <i class="fa fa-play ml-4" aria-hidden="true"></i>
              {dict.start}
            </Button>
          </Col>
          <Col width="25">
            <Button fill onClick={() => stopBtn()}>
              <i class="fa fa-stop ml-4" aria-hidden="true"></i>
              {dict.stop}
            </Button>
          </Col>
          <Col width="25">
            <Button fill onClick={props.uploadFromDb}>
              <i class="fa fa-up ml-4" aria-hidden="true"></i>
              {dict.stop}
            </Button>
          </Col>
          <Col width="25">

          </Col>
        </Row>
        <video autoPlay playsInline loop src={props.videoSrc} width='640'></video>
      </Block>
      <BlockTitle>{dict.list}</BlockTitle>
      <SurveillanceList surveillances={props.surveillances} />
    </Page>
  )
}
export default SurveillanceIndex;
