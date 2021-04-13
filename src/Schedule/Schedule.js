import React, { Component, useState } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import './Schedule.css';

function Schedule() {
    
    const[date,setDate] = useState(new Date());
    const[openning,setOpenning] = useState(["12:30","1:15","6:45"])
    console.log(date);
    
    
        
        return (
            <div>
                <div className="calendarPos">
                    <Calendar 
                        value = {date}
                        onChange={setDate}
                    />
                   
                       
                    </div>
                <div className = "simpleBorder">
                        Selected Date: {date.toUTCString()}
                </div>
            </div>
        )
    
}

export default Schedule
