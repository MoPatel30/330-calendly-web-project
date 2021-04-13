import React, { useState } from 'react'
import "./Profile.css"
import Schedule from '../Schedule/Schedule';

function Profile() {
    const [schedule, editSchedule] = useState(true)
    const [timings, setTimings] = useState(["9:00 - 10:00 -> Class"])
    
     // will convert to JS object later
     const [startingHour, setStartingHour] = useState(0)
     const [startingMinutes, setStartingMinutes] = useState(0)
     const [endingHour, setEndingHour] = useState(0)
     const [endingMinutes, setEndingMinutes] = useState(0)
     const [task, setTask] = useState("")

     function showSchedule(){
        editSchedule(!schedule)
    }

        function addToSchedule(){
            const newTask = `${startingHour}:${startingMinutes} - ${endingHour}:${endingMinutes} -> ${task}`
            
            setTimings([...timings, newTask])
            editSchedule(!schedule)
        }
    
        return (
            <div>
                <h1>John Doe</h1>
            <h3>Occupation: Student at Loyola University Chicago</h3>
            
                {schedule ? (
                <div>
                <Schedule />

                <div>
                {timings.map(timing => (
                    <div>
                        <p>{timing}</p>
                    </div>
                                        )
                            )
                }
                <button onClick = {showSchedule}>Edit Schedule</button>
            </div>
            </div>

         ):(
            <div className = "edit-form">
                    <p>Edit your schedule</p>
                    <label>Starting Hour</label>
                    <input onChange = {(e) => setStartingHour(e.target.value)} type = "number" max = "23" min = "0"></input>

                    <label>Starting Minute</label>
                    <input onChange = {(e) => setStartingMinutes(e.target.value)} type = "number" max = "59" min = "0"></input>

                    <label>Ending Hour</label>
                    <input onChange = {(e) => setEndingHour(e.target.value)} type = "number" max = "23" min = "0"></input>

                    <label>Ending Minute</label>
                    <input onChange = {(e) => setEndingMinutes(e.target.value)} type = "number" max = "59" min = "0"></input>

                    <label>Task</label>
                    <input onChange = {(e) => setTask(e.target.value)} type = "text"></input>

                    <button onClick = {showSchedule}>Cancel</button>
                    <button onClick = {addToSchedule}>Add time period</button>
                </div>
         )
            } 
           
            </div>
        
        )
}   


export default Profile

