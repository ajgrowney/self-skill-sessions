import React, { Component } from 'react'
import { Button, Card, CardHeader, CardText, CardTitle, CardSubtitle, CardBody, Collapse, Form, Input } from 'reactstrap'
import { MdClose, MdExpandMore, MdExpandLess, MdAddCircleOutline } from 'react-icons/md'
import './SidebarContent.css'

// Param: comment { Object } - holds attributes text, user, created at
class SidebarComment extends Component{
  constructor(props) {
    super(props);
  }
  
  render() {
    if(this.props.deleteComment === null){
      return(
      <CardBody>
        <div>
          <CardTitle>{this.props.comment.text}</CardTitle>
          <CardSubtitle>{this.props.comment.user}</CardSubtitle>
        </div>
      </CardBody>
      );
    }else{
      return(
        <CardBody className="userDeleteComment">
          <div className="commentBody">
            <CardTitle>{this.props.comment.text}</CardTitle>
            <CardSubtitle>{this.props.comment.user}</CardSubtitle>
          </div>
          <Button onClick={this.props.deleteComment.bind(this,this.props.comment)} className="commentDeleteButton">
            <MdClose  />
          </Button>
        </CardBody>
      )
    }
  }
}

// Param: content { Object } - Holds attributes title, user, description, likes
// Param: comments { Array <Object> - Holds objects with attributes text, user, created_at
// Param: closeSidebar { function } - Closes the sidebar upon click event
class SidebarContent extends Component {
  constructor(props) {
    super(props);
    this.content = this.props.content;
    this.state = {
      commentsOpen: true,
      commentsButton: <MdExpandLess onClick={this.toggleCommentsOpen}/>
    }
    this.toggleCommentsOpen = this.toggleCommentsOpen.bind(this)
  }

  toggleCommentsOpen = () => {
    if(!this.state.commentsOpen){
      this.setState({
        commentsOpen: true,
        commentsButton: <MdExpandLess onClick={this.toggleCommentsOpen} />
      })
    }else{
      this.setState({
        commentsOpen: false,
        commentsButton: <MdExpandMore onClick={this.toggleCommentsOpen} />
      })
    }
  }

  render() {
    let contentExists = (this.props.content && this.props.content.likes)
    if (contentExists) {
      let likesText = (this.props.content.likes.length === 0) ? "None" : this.props.content.likes.join(", ")
      return(
        <div>
          <Card>
            <CardHeader className="cardHeaderContainer">
              <div className="cardHeaderTitle">{this.props.content.title}</div>
              <div className="cardHeaderExitButton">
                <Button onClick={this.props.closeSidebar}><MdClose /></Button>
              </div>
            </CardHeader>
            <CardBody>
              <CardText>{this.props.content.description}</CardText>
              <CardText>Likes: {likesText}</CardText>
            </CardBody>
            <div className="postCommentsContainer">
              <div className="postCommentsHeader">
                <div className="postCommentsTitle">Comments ({this.props.comments.length})</div>
                <div className="postCommentsExpandButton">{this.state.commentsButton}</div>
              </div>
              <Collapse isOpen={this.state.commentsOpen} className="postCommentsContent">
                {this.props.comments.map( com => 
                  {
                    let deleteCommentFcn = (com.user === this.props.curUser.email) ? this.props.deleteCommentHelper : null;
                    return(<SidebarComment comment={com} deleteComment={deleteCommentFcn} className="postCommentElement" />);
                  }
                )} 
              </Collapse>
              <Form onSubmit={this.props.addCommentHelper} className="addCommentContainer">
                <Input name="commentAddText" placeholder="Add a comment..." type="string" />
                <Button><MdAddCircleOutline /></Button>
              </Form>
            </div>
          </Card>
        </div>
      )
    }else{
      // No content for the sidebar
      return(<div></div>)
    }
  }
}

export default SidebarContent
