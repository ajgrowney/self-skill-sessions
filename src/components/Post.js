import React, { Component } from 'react'
import { MdEdit, MdClose } from 'react-icons/md'
import { Button, ListGroupItem, ListGroupItemHeading, ListGroupItemText, Modal, ModalHeader, ModalBody, Tooltip, Form, Label, Input, FormGroup, Col } from 'reactstrap'
import './Post.css'

let votePost = (db, email, post_id) => {
    if (db) {
        db.collection('posts').doc(post_id).get().then((doc) => {
            if (doc.exists) {
                let current = doc.data().likes;
                db.collection('posts').doc(post_id).update({ likes: current.concat(email) })
            }
        });
    } else {
        // Database connection error: determine what to do
    }
}

let unvotePost = (db, email, post_id) => {
    if (db) {
        db.collection('posts').doc(post_id).get().then((doc) => {
            if (doc.exists) {
                let current = doc.data().likes;
                db.collection('posts').doc(post_id).update({ likes: current.filter(item => item !== email) })
            }
        });
    } else {
        // Database connection error: determine what to do
    }
}


class Post extends Component {
    constructor(props) {
        super(props);
        this.toggleTooltip = this.toggleTooltip.bind(this)
        this.deletePost = this.deletePost.bind(this)
        this.editPost = this.editPost.bind(this)
        this.state = {
            user: props.user,
            db: props.db,
            tooltipOpen: false,
            editPostOpen: false
        }
        this.clickHandler = this.props.clickHandler;
    }


    componentWillReceiveProps(newProps) {
        this.props = newProps.props
    }

    toggleTooltip = () => {
        this.setState({
            tooltipOpen: !this.state.tooltipOpen
        })
    }

    toggleEditPost = () => {
        this.setState({
            editPostOpen: !this.state.editPostOpen
        })
    }

    deletePost = (id) => {
        this.state.db.collection('posts').doc(id).delete()
    }
    editPost = (e) => {
        e.preventDefault()
        let update = {}
        let newtitle = e.target.title.value
        let newdescription = e.target.description.value
        if (newtitle) update["title"] = newtitle
        if (newdescription) update["description"] = newdescription
        this.state.db.collection('posts').doc(this.props.post.id).update(update)
        this.toggleEditPost()
    }
    render() {

        // Determine if the user has liked the post or not yet and apply respective click event (only applicable if not the creator of post)
        let userIsCreator = (this.state.user.currentUser.email === this.props.post.user);

        let userLikedPost = (this.props.post.likes.includes(this.state.user.currentUser.email));
        let clickEvent = userLikedPost ? (() => unvotePost(this.state.db, this.state.user.currentUser.email, this.props.post.id)) : (() => votePost(this.state.db, this.state.user.currentUser.email, this.props.post.id));
        let outline = userLikedPost ? false : true;

        return (
            <ListGroupItem className="listItem">
                <div className="postContentContainer">
                    <div onClick={this.clickHandler} className="postContentTitleUser">
                        <ListGroupItemHeading>{this.props.post.title}</ListGroupItemHeading>
                        <ListGroupItemText >{this.props.post.user}</ListGroupItemText>
                    </div>

                    <div className="postContentLikes" style={{ "marginLeft": "1em" }}>
                        {(userIsCreator) ?
                            (<Button id={`numLikesButton-${this.props.post.id}`} color="secondary">{this.props.post.likes.length}</Button>) : // User created the post
                            (<Button id={`numLikesButton-${this.props.post.id}`} onClick={clickEvent} outline={outline} color="primary">{this.props.post.likes.length}</Button>) // User didn't create the post
                        }
                        {
                            (userIsCreator) ?
                                (<div><MdClose key={`delete-${this.props.post.id}`} onClick={() => this.deletePost(this.props.post.id)} /> <MdEdit key={`edit-${this.props.post.id}`} onClick={this.toggleEditPost} /> </div>) : (<div />)
                        }
                    </div>
                </div>
                <Tooltip isOpen={this.state.tooltipOpen} toggle={this.toggleTooltip} trigger="hover" autohide={false} placement="top" target={`numLikesButton-${this.props.post.id}`}>{(this.props.post.likes.length !== 0) ? this.props.post.likes.join(", ") : "None"}</Tooltip>

                <Modal isOpen={this.state.editPostOpen} toggle={this.toggleEditPost} className={this.props.className}>
                    <ModalHeader toggle={this.toggleEditPost}>Add Skill Session</ModalHeader>
                    <ModalBody>

                        <Form onSubmit={this.editPost}>
                            <FormGroup row>
                                <Label for="title" sm={2}>Edit Title</Label>
                                <Col >
                                    <Input type="title" name="title" id="exampleTitle" placeholder={this.props.post.title} />
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Label for="exampleDescription" sm={2}>Edit Description</Label>
                                <Col>
                                    <Input type="description" name="description" id="exampleDescription" placeholder={this.props.post.description} />
                                </Col>
                            </FormGroup>
                            <Button>Submit</Button>
                        </Form>
                    </ModalBody>
                </Modal>
            </ListGroupItem>
        )
    }
}
export default Post