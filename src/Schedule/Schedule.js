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
    const [timeSlots, setTimeSlots] = useState([])  //Default Time Slots
    const userRef = db.collection("users")
    const [datesMeeting, setDatesMeeting] = useState({})

    //Creating Time Slots
    const createSlots = (fromTime, toTime) =>{
        let start = moment(fromTime, 'hh:mm A');
        let end = moment(toTime, 'hh:mm A');
        if (end.isBefore(start)){
            end.add(1,'day');
        }
        let arr =[];
        while(start <= end) {
            arr.push(new moment(start).format('hh:mm A'));
            start.add(1, 'hour');
        }
        return arr;
    }

    useEffect(() => {
        setTimeSlots(createSlots('8:00 AM', '6:00 PM'));
    }, [])

    useEffect(() => {
        userRef.doc(email).get((doc) => {
            setDatesMeeting(doc.data().meetings)
        })
    }, [date])
    function showSchedule(){
        editSchedule(!schedule)
    }
    
    function enterSchedule(){

        const startTime = document.getElementById("start").value
        const endTime = document.getElementById("end").value
        const meetingDescription = document.getElementById("meeting-name").value
        const maxNumOfPeople = document.getElementById("num-people").value
        const zoomLink = document.getElementById("zoom-link").value
        const people = []
        let data = {startTime, endTime, meetingDescription, maxNumOfPeople, zoomLink, people}

        console.log(data)

        //Create a new 'date' object with appointments
        userRef.doc(email).set({
            [date.toUTCString().substring(0,16)]: {
                [data.startTime]: data
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

                            <label>Meeting Name</label>
                            <input id="meeting-name" type="text" placeholder="Meeting Name"></input>

                            <label>Max Number of People</label>
                            <input id="num-people" type="number" min="0" max="50" placeholder="Max number of people"></input>
                            
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
                            <p>Important: Not inputing a zoom link will generate a random one for the meeting</p>
                        </fieldset>
                        <button className ="schedBTN"onClick = {showSchedule}>Back</button>
                        <button className = "schedBTN"onClick ={() => enterSchedule()}>Submit Openning</button>
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
