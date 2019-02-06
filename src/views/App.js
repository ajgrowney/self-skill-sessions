import React, { Component } from 'react';
import firebase from 'firebase'
import { Button, Dropdown, DropdownMenu, DropdownItem, DropdownToggle, ListGroup, Navbar, Nav, NavbarBrand } from 'reactstrap';
import Sidebar from 'react-sidebar'
import { MdAdd } from 'react-icons/md'

import fire from '../fire';
import {Post, PostModal, ProfileModal, SidebarContent} from '../components'
import './App.css';

// Param: user { Object }
let handleSignOut = (user) => {
  user.signOut();
  window.location.href = "../"
}



// Param: post { Object } - object that contains the id of the post id
// Param: e { FormSubmitEventHandler } - handles form submission with the comment data
// Description: Appends the comment object to the list 
let addCommentToPost = (post, commentdb, e) => {
  console.log(commentdb)
  e.preventDefault();
  let comment_text = e.target.commentAddText.value;
  e.target.reset()
  if(comment_text !== ""){
    fire.firestore().collection(commentdb).doc(post.id).update({
      list: firebase.firestore.FieldValue.arrayUnion(
        {
          user: fire.auth().currentUser.email,
          text: comment_text,
          created_at: Date.now()
        }
      )
    })
  }
}

let deleteComment = (postid, commentdb, comment, e) => {
  fire.firestore().collection(commentdb).doc(postid).update({
    list: firebase.firestore.FieldValue.arrayRemove(comment)
  })
}




class App extends Component {
  constructor(props) {
    super(props);

    this.menuChoices = ["Ideas", "Events"]
    this.menuDBRefs = {
      "Ideas": "posts",
      "Events": "events"
    }
    this.commentDBRefs = {
      "Ideas": "comments_posts",
      "Events": "comments_events"
    }

    this.state = {
      db: null,
      user: null,
      postModalOpen: false,
      sidebarOpen: false,
      profileModalOpen: false,
      dropdownOpen: false,
      mainContent: "Ideas",
      sidebarContent: "Initial",
      sidebarComments: [],
      posts: {},
      comments: {}
    }
    
    // Bind Helper Functions to the component
    this.toggleDropdown = this.toggleDropdown.bind(this)
    this.toggleMainContent = this.toggleMainContent.bind(this)
    this.toggleSidebar = this.toggleSidebar.bind(this)
    this.toggleProfileModal = this.toggleProfileModal.bind(this)
    this.togglePostModal = this.togglePostModal.bind(this)
  }

  toggleDropdown() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    })
  }
  togglePostModal() {
    this.setState({
      postModalOpen: !this.state.postModalOpen
    });
  }
  toggleProfileModal() {
    this.setState({
      profileModalOpen: !this.state.profileModalOpen
    });
  }
  toggleSidebar(open, content, comments) {
    this.setState({
      sidebarContent: content,
      sidebarComments: comments,
      sidebarOpen: open
    })
  }
  toggleMainContent(nextContent){
    this.setState({
      mainContent: nextContent
    })
  }

  // Set up reference to firestore database
  componentWillMount = () => {
    this.setState({ db: fire.firestore(), user: fire.auth() });
  }

  // Component has mounted, so load data and adjust the state for rendering
  componentDidMount = () => {

    // Grab DB Refernce for the Main Content's collection
    let mainDBRef = this.state.db.collection(this.menuDBRefs[this.state.mainContent]);
    mainDBRef.onSnapshot((snap) => {
      snap.docChanges().forEach((change) => {
        if (change.type === 'added' || change.type === 'modified') {

          // Object destructuring to extract the change's title, description, user, likes, and id
          let { title, user, likes, description } = change.doc.data()
          let { id } = change.doc

          // Create the post object and update the state with the new post
          let post = { id, title, user, likes, description }
          let curStatePosts = Object.assign({}, this.state.posts);
          curStatePosts[id] = post;
          this.setState({ posts: curStatePosts });

        } else if (change.type === 'removed') {

          // Remove the post from the state posts and then reset the state
          let prevStatePosts = Object.assign({}, this.state.posts);
          delete prevStatePosts[change.doc.id]
          this.setState({ posts: prevStatePosts })
        }
      });
    });
    
    let commentsDBRef = this.state.db.collection(this.commentDBRefs[this.state.mainContent]);
    commentsDBRef.onSnapshot( (snap) => {
      snap.docChanges().forEach( (change) => {
        if(change.type === 'added') {
          let { list } = change.doc.data()
          let { id } = change.doc
          let curStateComments = Object.assign({}, this.state.comments);
          curStateComments[id] = list;
          this.setState({comments: curStateComments });
        } else if(change.type === 'modified') {
          let { list } = change.doc.data()
          let { id } = change.doc
          
          let prevStateComments = Object.assign({}, this.state.comments);
          prevStateComments[id] = list
          this.setState({comments: prevStateComments, sidebarComments: prevStateComments[id]})
          
        }else if (change.type === 'removed') {
          // Not handling removes
        }
      });
    });
  }

 // Determine that it should only re-render if the posts have been updated
  shouldComponentUpdate = (nextProps, nextState) => {
    return (
      this.state.comments !== nextState.comments || 
      this.state.posts !== nextState.posts || 
      this.state.postModalOpen !== nextState.postModalOpen || 
      this.state.profileModalOpen !== nextState.profileModalOpen || 
      this.state.user !== nextState.user || 
      this.state.sidebarOpen !== nextState.sidebarOpen || 
      this.state.sidebarComments !== nextState.sidebarComments ||  
      this.state.sidebarContent !== nextState.sidebarContent ||
      this.state.mainContent !== nextState.mainContent ||
      this.state.dropdownOpen !== nextState.dropdownOpen)
  }


  render() {
    // Grab all the posts
    let postArr = Object.values(this.state.posts);

    // Sort the posts by number of likes
    let sortedPostArr = postArr.sort((a, b) => ((a.likes.length < b.likes.length) ? 1 : -1));

    let sidebar_postid = (this.state.sidebarContent) ? this.state.sidebarContent.id : null;
    let dropdownOptions = this.menuChoices.filter((item) => item !== this.state.mainContent)
    
    return (
      <div className="App">
        <Sidebar
          open={this.state.sidebarOpen}
          onSetOpen={this.toggleSidebar}
          pullRight={true}
          touchHandleWidth={20}
          sidebar={<SidebarContent curUser={this.state.user.currentUser} deleteCommentHelper={deleteComment.bind(this,sidebar_postid, this.commentDBRefs[this.state.mainContent])} addCommentHelper={addCommentToPost.bind(this,this.state.sidebarContent,this.commentDBRefs[this.state.mainContent])} comments={this.state.sidebarComments} content={this.state.sidebarContent} closeSidebar={() => this.toggleSidebar(false, null, null)} />}
          sidebarClassName="Sidebar"
        />
        <Navbar className="App-header">
          <NavbarBrand href="/" tag="h1" className="mr-auto">
              <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggleDropdown}>
                Skill Sessions >>  
                <DropdownToggle caret>
                  {this.state.mainContent}
                </DropdownToggle>
                <DropdownMenu>
                  {dropdownOptions.map((op) => (<DropdownItem onClick={() => this.toggleMainContent(op)}>{op}</DropdownItem>))}
                </DropdownMenu>
              </Dropdown>
          </NavbarBrand>
          <Nav className="ml-auto">
            <Button color="link" className="navbarButtons" onClick={() => this.toggleProfileModal()}>Profile</Button>
            <Button color="link" className="navbarButtons" onClick={() => handleSignOut(this.state.user)}>Sign Out</Button>
          </Nav>
        </Navbar>

        <ListGroup id="main-posts">
          {
            (this.state.mainContent === 'Ideas') ? 
              sortedPostArr.map((post) => { return (<Post key={post.id} clickHandler={() => { this.toggleSidebar(true, this.state.posts[post.id], this.state.comments[post.id]) }} db={this.state.db} user={this.state.user} post={post} />) })
            :
              []
          }
        </ListGroup>
        <Button onClick={this.togglePostModal} color="primary" className="addPostButton"><MdAdd /></Button>

        <PostModal togglePostModal={this.togglePostModal} modalOpen={this.state.postModalOpen} />
        <ProfileModal toggleProfileModal={this.toggleProfileModal} modalOpen={this.state.profileModalOpen} />
        


      </div>
    );
  }
}
export default App;
