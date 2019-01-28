import React, { Component } from 'react'
import { Button, ListGroupItem, ListGroupItemHeading, ListGroupItemText, Tooltip } from 'reactstrap'

let votePost = (db,email,post_id) => {
    if(db){
      db.collection('posts').doc(post_id).get().then((doc) => {
        if(doc.exists){
          let current = doc.data().likes;
          db.collection('posts').doc(post_id).update({likes: current.concat(email)})
        }
      });
    }
  }
let unvotePost = (db, email,post_id) => {
    if(db){
        db.collection('posts').doc(post_id).get().then((doc) => {
        if(doc.exists){
            let current = doc.data().likes;
            db.collection('posts').doc(post_id).update({likes: current.filter(item => item !== email)})
        }
        });
    }
}
  

class Post extends Component {
    constructor(props){
      super(props);
      this.toggleTooltip = this.toggleTooltip.bind(this)
      this.state = {
        user: props.user,
        db: props.db,
        tooltipOpen: false
      }
      this.clickHandler = this.props.clickHandler;
    }
  
    
    componentWillReceiveProps(newProps){
      this.props = newProps.props
    }
  
    toggleTooltip = () => {
      this.setState({
        tooltipOpen: !this.state.tooltipOpen
      })
    }
  
    
    render() {
  
      // Determine if the user has liked the post or not yet and apply respective click event (only applicable if not the creator of post)
      let userLikedPost = (this.props.post.likes.includes(this.state.user.currentUser.email));
      let clickEvent = userLikedPost ? (() => unvotePost(this.state.db, this.state.user.currentUser.email,this.props.post.id)) : (() => votePost(this.state.db, this.state.user.currentUser.email,this.props.post.id));
      let outline = userLikedPost ? false : true;
  
      return (
        <ListGroupItem onClick={this.clickHandler} className="listItem">
  
          <div>
            <ListGroupItemHeading>{this.props.post.message}</ListGroupItemHeading>
            <ListGroupItemText >{this.props.post.user}</ListGroupItemText>
          </div>
  
          <div style={{"marginLeft": "1em"}}>
            {(this.state.user.currentUser.email === this.props.post.user) ?
              (<Button id={`numLikesButton-${this.props.post.id}`} color="info">{this.props.post.likes.length}</Button>) : // User created the post
              (<Button id={`numLikesButton-${this.props.post.id}`} onClick={ clickEvent } outline={outline} color="primary">{this.props.post.likes.length}</Button>) // User didn't create the post
            }
          </div>
          <Tooltip isOpen={this.state.tooltipOpen} toggle={this.toggleTooltip} trigger="hover" autohide={false} placement="top" target={`numLikesButton-${this.props.post.id}`}>{(this.props.post.likes.length !== 0) ? this.props.post.likes.join(", ") : "None"}</Tooltip>
        
        </ListGroupItem>
      )
    }
}
export default Post