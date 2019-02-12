import React, { Component } from 'react'
import { Modal, ModalHeader, ModalBody, Form, FormGroup, Input, Label, Col, Button } from 'reactstrap'
import fire from '../fire';

// Param: closeModal { function } - function that closes the post modal 
// Param: e { FormSubmitEventHandler } - handles the form submission
// Description: Handles the addition of a new skill session idea to the posts document in db
let addSkillSession = (closeModal,e) => {
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
      fire.firestore().collection('comments_posts').doc(postid).set({list: []})
    })
  
    // Toggle the modal to go back to main view
    closeModal()
}

let addEvent = (closeModal, e) => {
    e.preventDefault();
    let { title, description, host, location, datetime } = e.target;
    fire.firestore().collection('events').add({
        user: fire.auth().currentUser.email,
        title: title.value,
        description: description.value,
        host: host.value,
        location: location.value,
        datetime_scheduled: datetime.value,
        attendees: {
            going: [],
            not_going: []
        }

    }).then((doc) => {
        fire.firestore().collection('comments_events').doc(doc.id).set({list: []})
    })
    closeModal();
}

class AddContentModal extends Component{
    constructor(props){
        super(props);
        this.toggleAddContentModal = this.props.toggleAddContentModal;
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

        if(this.props.type === "Ideas"){
            return(
                <Modal isOpen={this.state.modalOpen} toggle={this.toggleAddContentModal} className={this.props.className}>
                    <ModalHeader toggle={this.toggleAddContentModal}>Add Skill Session</ModalHeader>
                    <ModalBody>

                        <Form onSubmit={addSkillSession.bind(this,this.toggleAddContentModal)}>
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
        }else if (this.props.type === "Events"){
            return(
                <Modal isOpen={this.state.modalOpen} toggle={this.toggleAddContentModal} className={this.props.className}>
                    <ModalHeader toggle={this.toggleAddContentModal}>Add Event</ModalHeader>
                    <ModalBody>

                        <Form onSubmit={addEvent.bind(this,this.toggleAddContentModal)}>
                            <FormGroup row>
                                <Label for="title" sm={2}>Event Title</Label>
                                <Col >
                                <Input type="title" name="title" placeholder="Event Title" />
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label sm={2}>Event Description</Label>
                                <Col>
                                <Input type="description" name="description" placeholder="Event Description" />
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label  sm={2}>Event Host</Label>
                                <Col>
                                <Input type="host" name="host" placeholder="Event Host" />
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label  sm={2}>Event Location</Label>
                                <Col>
                                <Input type="location" name="location" placeholder="Event Location" />
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label  sm={2}>Event Time</Label>
                                <Col>
                                <Input type="datetime-local" name="datetime" placeholder="Event Location" />
                                </Col>
                            </FormGroup>
                            <Button>Submit</Button>
                        </Form>
                    </ModalBody>
                </Modal>
            )
        }
    }
}

export default AddContentModal