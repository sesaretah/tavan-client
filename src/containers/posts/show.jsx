import React from "react";
import { Page, Navbar, List, BlockTitle, ListItem, Fab, Icon,Preloader, Block, Row, Col, Button} from 'framework7-react';
import { stateToHTML } from "draft-js-export-html";
import { EditorState, convertFromRaw } from "draft-js";
import { Editor } from 'react-draft-wysiwyg';
import { dict} from '../../Dict';
import RecordList from "../auxiliary_records/list";
import InteractionMenu from "../interactions/menu"
import ShareMenu from "../shares/menu"

const PostShow = (props) => {
  if (props.post){
    const contentState = convertFromRaw(props.post.draft);
    const editorState = EditorState.createWithContent(contentState);
    return(
      <React.Fragment>
        <Block>
          <Row noGap>
            <Col width='60'></Col>
            <Col width="20">
              <Button><ShareMenu model={props.post} submit={props.submit} channels={props.channels} klass='Post' sheetOpened={props.sheetOpened} handleChange={props.handleChange} klass='Channel' interaction={props.interaction}/></Button>
            </Col>
            <Col width="20">
              <Button><InteractionMenu model={props.post} klass='Post' interaction={props.interaction}/></Button>
            </Col>
          </Row>
        </Block>
        <BlockTitle>{dict.title}</BlockTitle>
        <List simple-list>
          <ListItem>{props.post.title}</ListItem>
        </List>

        <BlockTitle>{dict.content}</BlockTitle>
        <Editor editorState={editorState}
          toolbar={{options: [],   inline: { options: []}}}
          readOnly={true} />
      </React.Fragment>
    )
  } else {
    return(null)
  }
}
export default PostShow;