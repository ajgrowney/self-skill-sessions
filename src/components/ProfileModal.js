import React, { Component } from 'react'
import { Modal, ModalHeader, ModalBody, Form, FormGroup, Input, Label, Col, Button } from 'reactstrap'
import fire from '../fire';

let updateProfile = (closeProfileModal, e) => {
    e.preventDefault();
    if (e.target.newpassword.value === e.target.passwordConfirm.value) {
      fire.auth().currentUser.updatePassword(e.target.newpassword.value)
      .then(() => closeProfileModal())
      .catch((e) => document.getElementById("alertPasswordMessage").innerText = e.message)
    } else {
      document.getElementById("alertPasswordMessage").innerText = "Passwords entered do not match"
    }
}

class ProfileModal extends Component{
    constructor(props){
        super(props);
        this.toggleProfileModal = this.props.toggleProfileModal;
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
            <Modal isOpen={this.state.modalOpen} toggle={this.toggleProfileModal} className={this.props.className}>
                <ModalHeader toggle={this.toggleProfileModal}>Add Skill Session</ModalHeader>
                <ModalBody>

                    <Form onSubmit={updateProfile.bind(this,this.toggleProfileModal)}>
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
        )
    }
}

export default ProfileModal