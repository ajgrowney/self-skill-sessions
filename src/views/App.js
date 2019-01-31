import React, { Component } from 'react';
import firebase from 'firebase'
import { Button, ListGroup, Navbar, Nav, NavbarBrand, Modal, ModalHeader, ModalBody, Form, Label, Input, FormGroup, Col } from 'reactstrap';
import Sidebar from 'react-sidebar'
import SidebarContent from '../components/SidebarContent'
import fire from '../fire';
import Post from '../components/Post'
import './App.css';


let handleSignOut = (user) => {
  user.signOut();
  window.location.href = "../"
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      db: null,
      user: null,
      postModalOpen: false,
      sidebarOpen: false,
      profileModalOpen: false,
      sidebarContent: "Initial",
      sidebarComments: [],
      posts: {},
      comments: {}
    }
    // Bind Helper Functions to the component
    this.toggleSidebar = this.toggleSidebar.bind(this)
    this.toggleProfileModal = this.toggleProfileModal.bind(this)
    this.togglePostModal = this.togglePostModal.bind(this)
    this.addSkillSession = this.addSkillSession.bind(this)
    this.addCommentToPost = this.addCommentToPost.bind(this)
    this.updateProfile = this.updateProfile.bind(this)
  }

  addSkillSession = (e) => {
    e.preventDefault(); // Prevent Form Refresh

    let event_title = e.target.title.value;
    let event_description = e.target.description.value;
    fire.firestore().collection('posts').add({
      user: fire.auth().currentUser.email,
      title: event_title,
      description: event_description,
      timestamp_created: firebase.firestore.FieldValue.serverTimestamp(),
      likes: []
    }).then((doc) => {
      // Add a blank set of comments for it
      let postid = doc.id
      fire.firestore().collection('comments').doc(postid).set({list: []})
    })

    // Toggle the modal to go back to main view
    this.togglePostModal()
  }
  
  addCommentToPost = (post, e) => {
    e.preventDefault();
    let comment_text = e.target.commentAddText.value;
    if(comment_text !== ""){

      fire.firestore().collection('comments').doc(post.id).update({
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

  updateProfile = (e) => {
    e.preventDefault();
    if (e.target.newpassword.value === e.target.passwordConfirm.value) {
      fire.auth().currentUser.updatePassword(e.target.newpassword.value)
      .then(() => this.toggleProfileModal())
      .catch((e) => document.getElementById("alertPasswordMessage").innerText = e.message)
    } else {
      document.getElementById("alertPasswordMessage").innerText = "Passwords entered do not match"
    }
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

  // Set up reference to firestore database
  componentWillMount = () => {
    this.setState({ db: fire.firestore(), user: fire.auth() });
  }

  // Component has mounted, so load data and adjust the state for rendering
  componentDidMount = () => {

    // Grab DB Refernce for Posts collection
    let postsDBRef = this.state.db.collection('posts');
    postsDBRef.onSnapshot((snap) => {
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
    
    let commentsDBRef = this.state.db.collection('comments');
    commentsDBRef.onSnapshot( (snap) => {
      snap.docChanges().forEach( (change) => {
	if(change.type === 'added' || change.type === 'modified') {
	  let { list } = change.doc.data()
	  let { id } = change.doc

	  let comment = { id, list }
	  let curStateComments = Object.assign({}, this.state.comments);
	  curStateComments[id] = comment;
	  this.setState({comments: curStateComments });
	} else if (change.type === 'removed') {
	  let prevStateComments = Object.assign({}, this.state.comments);
	  delete prevStateComments[change.doc.id]
	  this.setState({ comments: prevStateComments })
	}
      });
    });
  }

  // Determien that it should only re-render if the posts have been updated
  shouldComponentUpdate = (nextProps, nextState) => {
    return (this.state.comments !== nextState.comments || this.state.posts !== nextState.posts || this.state.postModalOpen !== nextState.postModalOpen || this.state.profileModalOpen !== nextState.profileModalOpen || this.state.user !== nextState.user || this.state.sidebarOpen !== nextState.sidebarOpen || this.state.sidebarComments !== nextState.sidebarComments ||  this.state.sidebarContent !== nextState.sidebarContent)
  }


  render() {
    // Grab all the posts
    let postArr = Object.values(this.state.posts);

    // Sort the posts by number of likes
    let sortedPostArr = postArr.sort((a, b) => ((a.likes.length < b.likes.length) ? 1 : -1));

    return (
      <div className="App">
        <Sidebar
          open={this.state.sidebarOpen}
          onSetOpen={this.toggleSidebar}
          pullRight={true}
          touchHandleWidth={20}
          sidebar={<SidebarContent addCommentHelper={this.addCommentToPost.bind(this,this.state.sidebarContent)} comments={this.state.sidebarComments} content={this.state.sidebarContent} closeSidebar={() => this.toggleSidebar(false, null, null)} />}
          sidebarClassName="Sidebar"
        />
        <Navbar className="App-header">
          <NavbarBrand href="/" tag="h1" className="mr-auto">Skill Sessions</NavbarBrand>
          <Nav className="ml-auto">
            <Button color="link" className="navbarButtons" onClick={() => this.toggleProfileModal()}>Profile</Button>
            <Button color="link" className="navbarButtons" onClick={() => handleSignOut(this.state.user)}>Sign Out</Button>
          </Nav>
        </Navbar>

        <ListGroup id="main-posts">
          {sortedPostArr.map((post) => { return (<Post key={post.id} clickHandler={() => { this.toggleSidebar(true, this.state.posts[post.id], this.state.comments[post.id].list) }} db={this.state.db} user={this.state.user} post={post} />) })}
        </ListGroup>
        <Button onClick={this.togglePostModal} color="primary" className="addPostButton">+</Button>


        <Modal isOpen={this.state.postModalOpen} toggle={this.togglePostModal} className={this.props.className}>
          <ModalHeader toggle={this.togglePostModal}>Add Skill Session</ModalHeader>
          <ModalBody>

            <Form onSubmit={this.addSkillSession}>
              <FormGroup row>
                <Label for="title" sm={2}>Title</Label>
                <Col >
                  <Input type="title" name="title" id="exampleTitle" placeholder="Event Title" />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="exampleDescription" sm={2}>Description</Label>
                <Col>
                  <Input type="description" name="description" id="exampleDescription" placeholder="Event Description" />
                </Col>
              </FormGroup>
              <Button>Submit</Button>
            </Form>
          </ModalBody>
        </Modal>

        <Modal isOpen={this.state.profileModalOpen} toggle={this.toggleProfileModal} className={this.props.className}>
          <ModalHeader toggle={this.toggleProfileModal}>Add Skill Session</ModalHeader>
          <ModalBody>

            <Form onSubmit={this.updateProfile}>
              <FormGroup row>
                <Label for="new-password" sm={2}>Update Password</Label>
                <Col >
                  <Input type="password" name="newpassword" id="new-password" placeholder="New Password" />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="passwordConfirm" sm={2}>Confirm Password</Label>
                <Col>
                  <Input type="password" name="passwordConfirm" id="examplepasswordConfirm" placeholder="Confirm password" />
                </Col>
              </FormGroup>
              <Button>Submit</Button>
              <span style={{"padding-left": "3%", color: "red"}} id="alertPasswordMessage"></span>
            </Form>
          </ModalBody>
        </Modal>


      </div>
    );
  }
}
export default App;
