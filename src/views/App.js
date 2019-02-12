import React, { Component } from 'react';
import firebase from 'firebase'
import { Button, Dropdown, DropdownMenu, DropdownItem, DropdownToggle, Navbar, Nav, NavbarBrand } from 'reactstrap';
import Sidebar from 'react-sidebar'
import { MdAdd } from 'react-icons/md'

import fire from '../fire';
import { ContentListGroup, AddContentModal, ProfileModal, SidebarContent} from '../components'
import { getContent } from '../helpers/getContent'
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

    this.state = {
      db: null,
      user: null,
      addContentModalOpen: false,
      sidebarOpen: false,
      profileModalOpen: false,
      dropdownOpen: false,
      contentSelected: "Ideas",
      sidebarContent: "Initial",
      sidebarComments: [],
      content: {},
      comments: {}
    }

    // Bind Helper Functions to the component
    this.toggleDropdown = this.toggleDropdown.bind(this)
    this.toggleContentSelected = this.toggleContentSelected.bind(this)
    this.toggleSidebar = this.toggleSidebar.bind(this)
    this.toggleProfileModal = this.toggleProfileModal.bind(this)
    this.toggleAddContentModal = this.toggleAddContentModal.bind(this)
    this.updateDBListeners = this.updateDBListeners.bind(this)

    // View Selection Maps
    this.menuChoices = ["Ideas", "Events"]
    this.menuDBRefs = {
      "Ideas": "posts",
      "Events": "events"
    }
    this.commentDBRefs = {
      "Ideas": "comments_posts",
      "Events": "comments_events"
    }

  }

  toggleDropdown() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    })
  }
  toggleAddContentModal() {
    this.setState({
      addContentModalOpen: !this.state.addContentModalOpen
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
  toggleContentSelected(nextContent){
    this.setState({
      contentSelected: nextContent,
      content: {},
      comments: {}
    }, () => {
      this.updateDBListeners();

    })
  }

  updateDBListeners(){
    // Grab DB Refernce for the Main Content's collection
    let mainDBRef = this.state.db.collection(this.menuDBRefs[this.state.contentSelected]);
    mainDBRef.onSnapshot((snap) => {
      snap.docChanges().forEach((change) => {
        if (change.type === 'added' || change.type === 'modified') {

          let newObj = getContent(change, this.state.contentSelected)
          let curStateContent = Object.assign({}, this.state.content);
          curStateContent[newObj.id] = newObj;
          this.setState({ content: curStateContent });

        } else if (change.type === 'removed') {

          // Remove the post from the state posts and then reset the state
          let prevStateContent = Object.assign({}, this.state.content);
          delete prevStateContent[change.doc.id]
          this.setState({ content: prevStateContent })
        }
      });
    });

    let commentsDBRef = this.state.db.collection(this.commentDBRefs[this.state.contentSelected]);
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

  // Set up reference to firestore database
  componentWillMount = () => {
    this.setState({ db: fire.firestore(), user: fire.auth() });
  }

  // Component has mounted, so load data and adjust the state for rendering
  componentDidMount = () => {
    this.updateDBListeners()
  }

 // Determine that it should only re-render if the posts have been updated
  shouldComponentUpdate = (nextProps, nextState) => {
    return (
      this.state.comments !== nextState.comments || 
      this.state.content !== nextState.content || 
      this.state.addContentModalOpen !== nextState.addContentModalOpen || 
      this.state.profileModalOpen !== nextState.profileModalOpen || 
      this.state.user !== nextState.user || 
      this.state.sidebarOpen !== nextState.sidebarOpen || 
      this.state.sidebarComments !== nextState.sidebarComments ||  
      this.state.sidebarContent !== nextState.sidebarContent ||
      this.state.contentSelected !== nextState.contentSelected ||
      this.state.dropdownOpen !== nextState.dropdownOpen)
  }


  render() {
    console.log(this.state.comments)
    let sidebar_postid = (this.state.sidebarContent) ? this.state.sidebarContent.id : null;
    // Remove the current display from dropdown options
    let dropdownOptions = this.menuChoices.filter((item) => item !== this.state.contentSelected)
    return (
      <div className="App">
        <Sidebar
          open={this.state.sidebarOpen}
          onSetOpen={this.toggleSidebar}
          pullRight={true}
          touchHandleWidth={20}
          sidebar={<SidebarContent curUser={this.state.user.currentUser} deleteCommentHelper={deleteComment.bind(this,sidebar_postid, this.commentDBRefs[this.state.contentSelected])} addCommentHelper={addCommentToPost.bind(this,this.state.sidebarContent,this.commentDBRefs[this.state.contentSelected])} comments={this.state.sidebarComments} content={this.state.sidebarContent} closeSidebar={() => this.toggleSidebar(false, null, null)} />}
          sidebarClassName="Sidebar"
        />
        <Navbar className="App-header">
          <NavbarBrand href="/" tag="h1" className="mr-auto">
              <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggleDropdown}>
                Skill Sessions >>  
                <DropdownToggle caret>
                  {this.state.contentSelected}
                </DropdownToggle>
                <DropdownMenu>
                  {dropdownOptions.map((op) => (<DropdownItem key={op} onClick={() => this.toggleContentSelected(op)}>{op}</DropdownItem>))}
                </DropdownMenu>
              </Dropdown>
          </NavbarBrand>
          <Nav className="ml-auto">
            <Button color="link" className="navbarButtons" onClick={() => this.toggleProfileModal()}>Profile</Button>
            <Button color="link" className="navbarButtons" onClick={() => handleSignOut(this.state.user)}>Sign Out</Button>
          </Nav>
        </Navbar>

        <ContentListGroup sidebarToggle={this.toggleSidebar} user={this.state.user} db={this.state.db} comments={this.state.comments} content={this.state.content} type={this.state.contentSelected} />
        <Button onClick={this.toggleAddContentModal} color="primary" className="addContentButton"><MdAdd /></Button>

        <AddContentModal type={this.state.contentSelected} toggleAddContentModal={this.toggleAddContentModal} modalOpen={this.state.addContentModalOpen} />
        <ProfileModal toggleProfileModal={this.toggleProfileModal} modalOpen={this.state.profileModalOpen} />
        


      </div>
    );
  }
}
export default App;
