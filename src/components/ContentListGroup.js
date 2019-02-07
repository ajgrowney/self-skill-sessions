import React, { Component } from 'react'
import { ListGroup } from 'reactstrap'
import { sortContent } from '../helpers/sortContent'
import Post from './Post'
import Event from './Event'

  

class ContentListGroup extends Component {
    constructor(props){
        super(props);

    }

    render(){
        let contentArr = Object.values(this.props.content);
        // Sort the posts by number of likes
        let sortedContentArr = sortContent(contentArr, this.props.type)
        if(this.props.type === "Ideas"){
            return(
                <ListGroup id="main-posts">
                    {
                        sortedContentArr.map((post) => { return (<Post key={post.id} clickHandler={() => { this.props.sidebarToggle(true, this.props.content[post.id], this.props.comments[post.id]) }} db={this.props.db} user={this.props.user} post={post} />) })
                    }
                </ListGroup>
            )
        }else if(this.props.type === "Events"){
            return(
                <ListGroup id="main-events">
                    {
                        sortedContentArr.map((event) => <Event key={event.id} event={event} />)
                    }
                </ListGroup>
            )
        }
    }
}

export default ContentListGroup;