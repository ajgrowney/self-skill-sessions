import React, { Component } from 'react'
import { Modal, ModalHeader, ModalBody, Form, FormGroup, Input, Label, Col, Button } from 'reactstrap'
import fire from '../fire';

// Param: closePost { function } - function that closes the post modal 
// Param: e { FormSubmitEventHandler } - handles the form submission
// Description: Handles the addition of a new skill session idea to the posts document in db
let addSkillSession = (closePost,e) => {
    e.preventDefault(); // Prevent Form Refresh
  
    let event_title = e.target.title.value;
    let event_description = e.target.description.value;
    fire.firestore().collection('posts').add({
      user: fire.auth().currentUser.email,
      title: event_title,
      description: event_description,
      timestamp_created: Date.now(),
      likes: []
    }).then((doc) => {
      // Add a blank set of comments for it
      let postid = doc.id
      fire.firestore().collection('comments').doc(postid).set({list: []})
    })
  
    // Toggle the modal to go back to main view
    closePost()
  }

class PostModal extends Component{
    constructor(props){
        super(props);
        this.togglePostModal = this.props.togglePostModal;
        this.state = {
            modalOpen: this.props.modalOpen
    
        }
    }
    componentDidUpdate = (prevProps, prevState) => {
        if(prevState.modalOpen !== this.state.modalOpen){
            this.setState({state: this.state.modalOpen})
        }
    }
    static getDerivedStateFromProps = (nextProps, prevState) => {
        if(nextProps.modalOpen !== prevState.modalOpen){
            return({modalOpen: nextProps.modalOpen})
        }else{
            return null;
        }
    }

    render(){
        return(
            <Modal isOpen={this.state.modalOpen} toggle={this.togglePostModal} className={this.props.className}>
                <ModalHeader toggle={this.togglePostModal}>Add Skill Session</ModalHeader>
                <ModalBody>

                    <Form onSubmit={addSkillSession.bind(this,this.togglePostModal)}>
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
        )
    }
}

export default PostModal