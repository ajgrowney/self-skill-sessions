import React, { Component } from 'react'
import fire from '../fire'
import { MdEventBusy, MdEventAvailable, MdEventNote } from 'react-icons/md'
import { Dropdown, DropdownMenu, DropdownItem, DropdownToggle, ListGroupItem, ListGroupItemHeading, ListGroupItemText } from 'reactstrap'
import './Event.css'


class Event extends Component {
    constructor(props){
        super(props);
        this.eventTitle = props.event.title
        this.eventDescription = props.event.description
        this.eventDate = new Date(props.event.datetime_scheduled)
        this.eventAttending = props.event.attendees.going;
        this.eventNotAttending = props.event.attendees.not_going;
        this.eventId = props.event.id;

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
    toggleAttendanceStatus(prev, option){
        const userEmail = fire.auth().currentUser.email;
        if(prev === "Going"){
          this.eventAttending = this.eventAttending.filter((user) => user !== userEmail);
        }else if(prev === "Not Going"){
          this.eventNotAttending = this.eventNotAttending.filter((user) => user !== userEmail);
        }

        if(option === "Going"){
          this.eventAttending.push(userEmail);
        }else if(option === "Not Going"){
          this.eventNotAttending.push(userEmail);
        }

        console.log(prev,option, userEmail)
        console.log(this.eventAttending,this.eventNotAttending)

        fire.firestore().collection('events').doc(this.eventId).update({
          attendees: {
            going: this.eventAttending,
            not_going: this.eventNotAttending
          }
        });
        // Update the state
        this.setState({
            dropdownOpen: !this.state.dropdownOpen,
            attendanceStatus: option
        })
    }

    render(){

        console.log(this.state)
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
                        {this.eventAttending.length} Going
                        {'\t '}
                        {this.eventNotAttending.length} Not Going
                    </ListGroupItemText>
                </div>

                <div className="eventAttendanceContainer">
                    <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggleDropdown}>
                        <DropdownToggle color={this.attendanceIconsColor[this.state.attendanceStatus]} caret>
                            {this.attendanceIcons[this.state.attendanceStatus]}
                        </DropdownToggle>
                        <DropdownMenu>
                            {dropdownOptions.map((op) => (<DropdownItem key={op} onClick={() => this.toggleAttendanceStatus(this.state.attendanceStatus, op)} > {this.attendanceIcons[op]} </DropdownItem>))}
                        </DropdownMenu>
                    </Dropdown>
                </div>

            </ListGroupItem>
        )
    }
}

export default Event;
