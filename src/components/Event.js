import React, { Component } from 'react'
import { ListGroupItem, ListGroupItemHeading, ListGroupItemText } from 'reactstrap'

class Event extends Component {
    constructor(props){
        super(props);
        this.eventTitle = props.event.title
        this.eventDescription = props.event.description
        this.eventDate = new Date(props.event.datetime_scheduled).toString()
    }

    render(){
        return(
            <ListGroupItem>
                <ListGroupItemHeading>{this.eventTitle}</ListGroupItemHeading>
                <ListGroupItemText>
                    {this.eventDescription}
                    <br />
                    {this.eventDate}
                </ListGroupItemText>
            </ListGroupItem>
        )
    }
}

export default Event;