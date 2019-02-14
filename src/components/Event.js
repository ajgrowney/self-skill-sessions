import React, { Component } from 'react'
import fire from '../fire'
import { MdEventBusy, MdEventAvailable, MdEventNote } from 'react-icons/md'
import { Dropdown, DropdownMenu, DropdownItem, DropdownToggle, ListGroupItem, ListGroupItemHeading, ListGroupItemText } from 'reactstrap'
import './Event.css'
import Events from './Event.css'
class Event extends Component {
    constructor(props){
        console.log(props.event)
        super(props);
        this.eventTitle = props.event.title
        this.eventDescription = props.event.description
        this.eventDate = new Date(props.event.datetime_scheduled)
        this.eventAttending = props.event.attendees.going;
        this.eventNotAttending = props.event.attendees.not_going;

        this.attendanceStatus = "";
        let curUserEmail = fire.auth().currentUser.email;
        if(this.eventAttending.indexOf(curUserEmail) > -1){
            this.attendanceStatus = "Going";
        }else if(this.eventNotAttending.indexOf(curUserEmail) > -1){
            this.attendanceStatus = "Not Going";
        }else{
            this.attendanceStatus = "Undecided";
        }

        this.state = {
            dropdownOpen: false,
            attendanceStatus: this.attendanceStatus
        }
        this.toggleDropdown = this.toggleDropdown.bind(this)

        // Attendance Selection Options
        this.attendanceOptions = ["Going", "Not Going", "Undecided"]
        this.attendanceIcons = {
            "Going": <MdEventAvailable />,
            "Not Going": <MdEventBusy />,
            "Undecided": <MdEventNote />
        }
        this.attendanceIconsColor = {
            "Going": "success",
            "Not Going": "danger",
            "Undecided": "secondary"
        }

    }
    toggleDropdown() {
        this.setState({
        dropdownOpen: !this.state.dropdownOpen
        })
    }
    toggleAttendanceStatus(option){
        this.setState({
            dropdownOpen: !this.state.dropdownOpen,
            attendanceStatus: option
        })
    }

    render(){


        let dropdownOptions = this.attendanceOptions.filter((item) => item !== this.state.attendanceStatus)
        return(
            <ListGroupItem className="eventCardContainer">

                <div className="eventDateTimeContainer">
                    {this.eventDate.getMonth()+1}/{this.eventDate.getDay()}
                    <br />
                    {this.eventDate.toLocaleString('en-US', {hour: 'numeric', minute: 'numeric', hour12: true})}
                </div>

                <div className="eventInfoContainer">
                    <ListGroupItemHeading>{this.eventTitle}</ListGroupItemHeading>
                    <ListGroupItemText>
                        {this.eventDescription}
                        <br />
                        {this.eventAttending.length} going
                        {'\t'}
                        {this.eventNotAttending.length} not going
                    </ListGroupItemText>
                </div>

                <div className="eventAttendanceContainer">
                    <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggleDropdown}>
                        <DropdownToggle color={this.attendanceIconsColor[this.state.attendanceStatus]} caret>
                            {this.attendanceIcons[this.state.attendanceStatus]}
                        </DropdownToggle>
                        <DropdownMenu>
                            {dropdownOptions.map((op) => (<DropdownItem key={op} onClick={() => this.toggleAttendanceStatus(op)} > {this.attendanceIcons[op]} </DropdownItem>))}
                        </DropdownMenu>
                    </Dropdown>
                </div>
                
            </ListGroupItem>
        )
    }
}

export default Event;