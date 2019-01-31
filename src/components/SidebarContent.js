import React, { Component } from 'react'
import { Button, Card, CardHeader, CardText, CardTitle, CardSubtitle, CardBody } from 'reactstrap'
import { MdClose } from 'react-icons/md'
import './SidebarContent.css'

// Param: comment { Object } - holds attributes text, user, created at
class SidebarComment extends Component{
  constructor(props) {
    super(props);
  }
  
  render() {
    return(
    <CardBody>
      <CardTitle>{this.props.comment.text}</CardTitle>
      <CardSubtitle>{this.props.comment.user}</CardSubtitle>
    </CardBody>
    );
  }
}

// Param: content { Object } - Holds attributes title, user, description, likes
// Param: comments { Array <Object> - Holds objects with attributes text, user, created_at
// Param: closeSidebar { function } - Closes the sidebar upon click event
class SidebarContent extends Component {
  constructor(props) {
    super(props);
    this.content = this.props.content;
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
	      {this.props.comments.map( com => <SidebarComment comment={com} />)} 
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
