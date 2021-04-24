import React, { Component, useState, useEffect} from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import './Schedule.css';
import moment from 'moment'

function Schedule() {
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
    
        
        return (
            <div>
                <div className = "simpleBorder">
                        Selected Date: {date.toUTCString().substring(0,16)}
                </div>
                {schedule ? (
                <div className="calendarPos">
                    <Calendar 
                        value = {date}
                        onChange={setDate}
                    />     
                <button onClick = {showSchedule}>Edit Schedule</button>
                </div>
                
                ):(

                <div>
            <h2>Select Available Times:</h2>
            <select multiple="yes" size={timeSlots.length + 1}>
            {timeSlots.map((time,index) =>{
                if(timeSlots[index + 1]){
                    return(
                        <option className = "slot">
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
            <button onClick = {showSchedule}>Edit Schedule</button>
            </div>

                )}

                
            </div>
        )
    
}

export default Schedule
