import React, { useState, useEffect} from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import './Schedule.css';
import moment from 'moment'
import {connect} from "react-redux"
import { db } from "../firebase"
import firebase from "firebase"


function Schedule({email, username, userInfo}) {
    const [schedule, editSchedule] = useState(true)
    const [date, setDate] = useState(new Date());
    const userRef = db.collection("users")
    const [datesMeeting, setDatesMeeting] = useState({})


    useEffect(() => {
        userRef.doc(email).get((doc) => {
            setDatesMeeting(doc.data().meetings)
        })
    }, [date])

    function showSchedule(){
        editSchedule(!schedule)
    }

    function tConvert (time) {
        // Check correct time format and split into components
        time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
      
        if (time.length > 1) { // If time format correct
          time = time.slice (1);  // Remove full string match value
          time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
          time[0] = +time[0] % 12 || 12; // Adjust hours
        }
        return time.join (''); // return adjusted time or original string
    }

    function enterSchedule(e){
        e.preventDefault()
        const startTime = document.getElementById("start").value
        const endTime = document.getElementById("end").value
        const maxNumOfPeople = document.getElementById("num-people").value
        const meetingName = document.getElementById("meeting-name").value
        const meetingDescription = document.getElementById("description").value
        let zoomLink = document.getElementById("zoom-link").value
        const people = []

        if(zoomLink.length === 0){
            zoomLink = "https://zoom.us/"
        }
        let data = {startTime, endTime, maxNumOfPeople, meetingName, meetingDescription, zoomLink, people}
        
        console.log(data)

        //Create a new 'date' object with appointments
        userRef.doc(email).set({
            [date.toUTCString().substring(0,16)]: {
                [data.meetingName]: data
            }
        }, { merge: true })
        editSchedule(!schedule)
    }   
        
    return (
        <div className="scheduler">
            <div className = "simpleBorder">
                {date.toUTCString().substring(0,16)}
            </div>

            {schedule ? (
                <div className="calendarPos">
                    <Calendar 
                        value = {date}
                        onChange = {setDate}
                    />     
                    <button className ="schedBTN" onClick = {showSchedule}>Create Openning</button>
                </div>
            ) : (
                <div>
                    <form id="form">
                        <fieldset>
                            <label>Starting Time</label>
                            <input id="start" type="time" placeholder="Starting time"></input>
                            
                            <label>Ending Time</label>
                            <input id="end" type="time" placeholder="Ending time"></input>

                            <br/>
                            <label>Max Number of People</label>
                            <input id="num-people" type="number" min="0" max="50" placeholder="##"></input>
                            <br/>
                            <label>Meeting Name</label>
                            <input id="meeting-name" type="text" placeholder="Meeting Name"></input>
                            <br />
                            <label>Meeting Description</label>
                            <textarea
                                    id="description"
                                    rows="3"
                                    cols="50"
                                    maxLength="144"
                                    type="text" 
                                    placeholder="Notes about meeting">
                            </textarea>

                            <label>Personal Zoom Link</label>
                            <input id="zoom-link" type="text" placeholder="www.zoom.us/"></input>
                            <p style={{color: "maroon"}}>Please input zoom link for planned meeting</p>
                        </fieldset>
                        <button className ="schedBTN"onClick = {showSchedule}>Back</button>
                        <button className = "schedBTN"onClick ={(e) => enterSchedule(e)}>Submit Openning</button>
                    </form>
                </div>
            )}        
        </div>
    )
    
}

const mapStateToProps = (state) => ({
    username: state.username,
    email: state.email,
    userInfo: state.userInfo
  })

export default connect(mapStateToProps)(Schedule)
