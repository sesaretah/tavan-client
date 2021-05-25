import React from "react";
import { List, ListInput, Chip, Block, Link, Button, Card, CardHeader, CardFooter } from 'framework7-react';
import { dict } from '../../Dict';
import InputTrigger from 'react-input-trigger';


const CommentForm = (props) => {
  function replyTo(){
    if(props.replyTo){
      var content = ''
      props.comments.map((cm) => { if(cm.id === props.replyTo){content = cm.content}})
      return(<Chip text={dict.in_reply_to + ': '+ content.substring(0,20)} deleteable onClick={ props.removeReply } />)
    }
    
  }
  return (
    <Card>
      <CardHeader>{dict.comment_form} {replyTo()}</CardHeader>
     <List >
        <ListInput
          label={dict.comment}
          inputId={"cm-form-"+props.rnd}
          type="textarea"
          placeholder='...'
          maxlength='300'
          resizable
          clearButton={true}
          onInput={(e) => {
            props.handleChange({ commentContent: e.target.value })
          }}
        />
        </List>
      <CardFooter>
        <Link></Link>
        <Link className="btn-notice"></Link>
        <Button className="col btn" fill onClick={props.submit}>{dict.submit}</Button>
      </CardFooter>
    </Card>
  )
}
export default CommentForm;
