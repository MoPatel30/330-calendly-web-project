import React, { useState } from 'react'
import "./Profile.css"
import Schedule from '../Schedule/Schedule';

function Profile() {
    const [name,setName] = useState("Fake Name");
    const [title,setTitle] = useState("Admin");
    const [showCal,setShowCal] = useState(false);
    

        function displayCalendar(){
            setShowCal(!showCal);
        }
    
        return (
            <div>
                <h1>{name}</h1>
                <p>Position: {title}</p>
                {showCal ?
                <Schedule />
                :
                <p></p>
                }   
                <button className = "styled-btn" onClick={displayCalendar} >View Schedule</button> 
            </div>
        )
}   


export default Profile

