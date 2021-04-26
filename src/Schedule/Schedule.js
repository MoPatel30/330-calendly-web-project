import React, { Component, useState, useEffect} from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import './Schedule.css';
import moment from 'moment'
import {connect} from "react-redux"
import { db } from "../firebase"
import firebase from "firebase"

import { $CombinedState } from 'redux';

function Schedule({email}) {
    const [schedule, editSchedule] = useState(true)
    const[date,setDate] = useState(new Date());
    const[openning,setOpenning] = useState(["12:30","1:15","6:45"])
    
     //Default Time Slots
     const [timeSlots,setTimeSlots] = useState([])

    //Creating Time Slots
    const createSlots = (fromTime,toTime) =>{
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


    function showSchedule(){
        editSchedule(!schedule)
    }
    
    function getValues(){
        const userRef = db.collection("users")

            var form = document.getElementById('timeList')[0];
            var selected = [];
            //Gets all selected values... want to store this in database 
            for (var option of document.getElementById('timeList').options)
            {
                if (option.selected) {
                    selected.push(option.value);
                }
            }
            //Create a new 'date' object with appointments
            userRef.doc(email).set({
                [date.toUTCString().substring(0,16)]: selected
            },{ merge: true })






    }   
        
        return (
            <div>
                <div className = "simpleBorder">
                        {date.toUTCString().substring(0,16)}
                </div>
                {schedule ? (
                <div className="calendarPos">
                    <Calendar 
                        value = {date}
                        onChange={setDate}
                    />     
                <button onClick = {showSchedule}>Select Times</button>
                </div>
                
                ):(

                <div>
            <h2>Select Available Times:</h2>
            <select id ="timeList" multiple="yes" size={timeSlots.length + 1}>
            {timeSlots.map((time,index) =>{
                if(timeSlots[index + 1]){
                    return(
                        <option value={timeSlots[index] + ' - ' + timeSlots[index + 1]} className = "slot">
                            {timeSlots[index] + ' - ' + timeSlots[index+1]}
                        </option>
                    )
                }
                else{
                    return (
                        console.log('empty')
                    )
                }
                
                })}
                
            </select>
            
            <button onClick = {showSchedule}>Back</button>
            <button onClick ={() => getValues()}>Enter Availibility</button>
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
