import React, { Component } from 'react'
import { Button, Card, CardHeader, CardText, CardBody } from 'reactstrap'
import { MdClose } from 'react-icons/md'
import './SidebarContent.css'

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