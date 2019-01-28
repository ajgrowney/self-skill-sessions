import React, { Component } from 'react';
import { Button, Card, CardHeader, CardTitle, CardText, CardBody, ListGroup, Navbar, Nav, NavbarBrand, Modal, ModalHeader, ModalBody, Form, Label, Input, FormGroup, Col } from 'reactstrap';
import Sidebar from 'react-sidebar'
import fire from './fire';
import Post from './Post'
import './App.css';

let handleSignOut = (user) => {
  user.signOut();
  window.location.href = "/"
}

class SidebarContent extends Component{
  constructor(props){
    super(props);
    this.content = this.props.content;

  }
  render(){
    console.log(this.props.content)
    return(this.props.content ? (
      <div>
        <Button onClick={this.props.closeSidebar}>x</Button>
        <Card>
        <CardHeader>{this.props.content.message}</CardHeader>
          <CardBody>
            <CardText>{"Text description"}</CardText>
          </CardBody>
        </Card>
      </div>
    ) : (<div></div>))
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      db: null,
      user: null,
      modalOpen: false,
      sidebarOpen: false,
      sidebarContent: "Initial",
      posts: {}
    }
    // Bind Helper Functions to the component
    this.toggleSidebar = this.toggleSidebar.bind(this)
    this.toggleModal = this.toggleModal.bind(this)
    this.addSkillSession = this.addSkillSession.bind(this)
  }

  addSkillSession = (e) => {
    e.preventDefault(); // Prevent Form Refresh

    let event_title = e.target.title.value;
    fire.firestore().collection('posts').add({
      user: fire.auth().currentUser.email,
      message: event_title,
      likes: []
    })
    this.toggleModal()
  }
  toggleModal() {
    this.setState({
      modalOpen: !this.state.modalOpen
    });
  }
  toggleSidebar(open, content){
    this.setState({
      sidebarContent: content,
      sidebarOpen: open
    })
  }

  // Set up reference to firestore database
  componentWillMount = () => {
    this.setState({ db: fire.firestore(), user: fire.auth() });
  }

  // Component has mounted, so load data and adjust the state for rendering
  componentDidMount = () => {
    let postsDBRef = this.state.db.collection('posts');
    postsDBRef.onSnapshot((snap) => {
      snap.docChanges().forEach((change) => {
        if (change.type === 'added' || change.type === 'modified') {
          
          // Object destructuring to extract the change's message, user, likes, and id
          let { message, user, likes } = change.doc.data()
          let { id } = change.doc

          // Create the post object and update the state with the new post
          let post = { id, message, user, likes }
          let curStatePosts = Object.assign({}, this.state.posts);
          curStatePosts[id] = post;
          this.setState({ posts: curStatePosts });

        }else if(change.type === 'removed'){

          // Remove the post from the state posts and then reset the state
          let prevStatePosts = Object.assign({}, this.state.posts);
          delete prevStatePosts[change.doc.id]
          this.setState({posts: prevStatePosts})
        }
      });
    });
  }

  // Determien that it should only re-render if the posts have been updated
  shouldComponentUpdate = (nextProps, nextState) => {
    return (this.state.posts !== nextState.posts || this.state.modalOpen !== nextState.modalOpen || this.state.user !== nextState.user || this.state.sidebarOpen !== nextState.sidebarOpen || this.state.sidebarContent !== nextState.sidebarContent) 
  }


  render() {
    // Grab all the posts
    let postArr = Object.keys(this.state.posts).map(post => this.state.posts[post]);
    // Sort the posts by number of likes
    let sortedPostArr = postArr.sort((a, b) => ((a.likes.length < b.likes.length) ? 1 : -1));

    return (
      <div className="App">
        <Navbar className="App-header">
          <NavbarBrand href="/" tag="h1" className="mr-auto">Skill Sessions</NavbarBrand>
          <Nav className="ml-auto">
            <Button color="link" style={{"color": "white"}} onClick={() => alert("Oops, Mitch hasn't added the functionality to this yet")}>Profile</Button>
            <Button color="link" style={{"color": "white"}} onClick={() => handleSignOut(this.state.user)}>Sign Out</Button>
          </Nav>
        </Navbar>

        <Sidebar 
          open={this.state.sidebarOpen}
          onSetOpen={this.toggleSidebar}
          pullRight={true}
          sidebar={<SidebarContent content={this.state.sidebarContent} closeSidebar={() => this.toggleSidebar(false,null)} />}
          styles = {{ sidebar: {background: "white"}}}
        />

        <ListGroup id="main-posts">
          {sortedPostArr.map((post) => {return (<Post clickHandler={() => { this.toggleSidebar(true,post)}} db={this.state.db} user={this.state.user} post={post} />)})}
        </ListGroup>
        <Button onClick={this.toggleModal} color="primary" className="addPostButton">+</Button>


        <Modal isOpen={this.state.modalOpen} toggle={this.toggleModal} className={this.props.className}>
          <ModalHeader toggle={this.toggleModal}>Add Skill Session</ModalHeader>
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

      </div>
    );
  }
}
export default App;
