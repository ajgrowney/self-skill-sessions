import React, { Component } from 'react'
import { ListGroupItem, ListGroupItemHeading, ListGroupItemText } from 'reactstrap'

class Event extends Component {
    constructor(props){
        super(props);
        this.eventTitle = props.event.title
        this.eventDescription = props.event.description
        this.eventDate = new Date(props.event.datetime_scheduled)
    }

    render(){
        return(
            <ListGroupItem>
                <ListGroupItemHeading>{this.eventTitle}</ListGroupItemHeading>
                <ListGroupItemText>
                    {this.eventDescription}
                    <br />
                    {this.eventDate.getMonth()+1}/{this.eventDate.getDate()}
                </ListGroupItemText>
            </ListGroupItem>
        )
    }
}

export default Event;