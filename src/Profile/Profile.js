import React, { useState, useEffect} from 'react'
import { db } from "../firebase"
import {connect} from "react-redux"
import "./Profile.css"
import Schedule from '../Schedule/Schedule';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import PublishIcon from '@material-ui/icons/Publish';


function Profile({username, userInfo, email}) {
    const [todayDate, setTodayDate] = useState("")
    const [todayMeetings, setTodayMeetings] = useState([])
    const [todaySchedule, setTodaySchedule] = useState([])
    const [schedule, setSchedule] = useState(false)
    const [meeting, setMeeting] = useState(false)
    const [tempOccupation, setTempOccupation] = useState("")
    const [editOccupation, setEditOccupation] = useState(false)
    const [occupation, setOccupation] = useState("Student at Loyola University Chicago")
    const [tempBio, setTempBio] = useState("")
    const [editBio, setEditBio] = useState(false)
    const [bio, setBio] = useState(`Hi, my name is ${userInfo.displayName}`)
    
    useEffect(() => {
    }, [todayMeetings])

    useEffect(() => {
        var docRef = db.collection("users").doc(email);

        docRef.get().then((doc) => {
            if (doc.exists) {
                console.log("Document data:", doc.data());
                let date = String(new Date()).substring(0, 15)
                let day = date.split(' ')
                let newDate = day[0] + ", " + day[2] + " " + day[1] + " " + day[3]
                setTodayDate(newDate)
                setTodayMeetings(doc.data().meeting[newDate])
                setTodaySchedule(doc.data()[newDate])
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error)
        })
    }, [])

    function changeOccupation(){
        setEditOccupation(!editOccupation)
    }

    function saveOccupation(){
        setEditOccupation(!editOccupation)
        setOccupation(tempOccupation)

        if(tempBio.length > 140){
            alert("New occupation is too long. Please shorten it.")
        }
        else{
            var docRef = db.collection("users").doc(email)
            docRef.update({occupation: tempOccupation})
        }
    }

    function changeBio(){
        setEditBio(!editBio)
    }

    function saveBio(){
        setEditBio(!editBio)
        setBio(tempBio)

        if(tempBio.length > 140){
            alert("New bio is too long. Please shorten it.")
        }
        else{
            var docRef = db.collection("users").doc(email)
            docRef.update({bio: tempBio})
        }
    }

    function scheduleClose(){
        setSchedule(!schedule)
    }
    function meetingClose(){
        setMeeting(!meeting)
    }
   
    return (
        <div>
            <div id="right-profile-section">       
                <div className="profile-section">
                    <h2>{username}</h2>
                    <img id="pro-pic" src={userInfo.photoURL} />
                    {editOccupation ? (
                        <div className = "bio-size"> 
                            <textarea
                                style={{marginTop: "24px"}}
                                type="text" 
                                maxLength="140"
                                rows = "3"
                                cols = "50"
                                defaultValue={occupation}
                                onChange={(e) => setTempOccupation(e.target.value)}
                            />

                            <PublishIcon onClick={saveOccupation} style={{cursor: "pointer"}} />
                            <DeleteIcon onClick={changeOccupation} style={{cursor: "pointer"}} />
                        </div>
                    ) 
                    : (
                        <div className="bio-section">
                            <h3 id="bio">{occupation}</h3> 
                            <EditIcon onClick={changeOccupation} style={{cursor: "pointer", marginLeft: "5px"}} />
                        </div>
                    )}    
                     {editBio ? (
                        <div className = "bio-size"> 
                            <textarea
                                style={{marginTop: "24px"}}
                                type="text" 
                                maxLength="140"
                                rows = "3"
                                cols = "50"
                                defaultValue={bio}
                                onChange={(e) => setTempBio(e.target.value)}
                            />

                            <PublishIcon onClick={saveBio} style={{cursor: "pointer"}} />
                            <DeleteIcon onClick={changeBio} style={{cursor: "pointer"}} />
                        </div>
                    ) 
                    : (
                        <div className="bio-section">
                            <h3 id="bio">{bio}</h3> 
                            <EditIcon onClick={changeBio} style={{cursor: "pointer", marginLeft: "5px"}} />
                        </div>
                    )}    
             
                    <br />
                    <button onClick={scheduleClose}>View Schedule</button>
                    <button onClick={meetingClose}>View Meetings</button>
                </div>
            </div>
            
            <div id="left-profile-section">
                <div className="schedule-maker">
                    <Schedule />
                </div>              
            </div>

            <Dialog fullWidth maxWidth={'sm'} open = {schedule}>
                <IconButton edge="start" color="black" onClick={scheduleClose} aria-label="close">
                    <p>Close</p>
                </IconButton>
                <div id="today-schedule">
                    <h1>Today's Schedule</h1>
                    <h2>{todayDate}</h2>
                    {Object.keys(todaySchedule).length === 0 ? (
                        <p>You currently have no openings Scheduled. Use the calendar to create opennings!</p>
                    ) : (
                        Object.keys(todaySchedule).map((openning) => (
                            <div className="dates">
                                <p className="info">Meeting Name: {openning}</p>
                                <p className="info">Start Time: {todaySchedule[openning].startTime}</p>
                                <p className="info">End Time: {todaySchedule[openning].endTime}</p>
                                <p className="info">Description: {todaySchedule[openning].meetingDescription}</p>
                                <p>Zoom Link: {todaySchedule[openning].zoomLink}</p>
                                <p>Current People: {todaySchedule[openning].people.length}/{todaySchedule[openning].maxNumOfPeople}</p>
                            </div>
                        ))       
                    )
                    }
                </div>   
            </Dialog>

            <Dialog fullWidth maxWidth={'sm'} open = {meeting}>
                <IconButton edge="start" color="black" onClick={meetingClose} aria-label="close">
                    <p>Close</p>
                </IconButton>
                <div id="upcoming-meetings">
                    <h1>Upcoming Meetings Today</h1>
                    <h2>{todayDate}</h2>
                    {Object.keys(todayMeetings).length === 0 ? (
                        <p>You currently have no upcoming meetings</p>
                    ) : (
                        Object.keys(todayMeetings).map((meeting) => (
                            <div className="dates">
                                <p className="info">Meeting Name: {meeting}</p>
                                <p className="info">Start Time: {todayMeetings[meeting].start_time}</p>
                                <p className="info">End Time: {todayMeetings[meeting].end_time}</p>
                                <p className="info">Description: {todayMeetings[meeting].description}</p>
                                <p>Zoom Link: {todayMeetings[meeting].zoom_link}</p>
                            </div>
                        ))       
                    )
                    }
                </div>   
            </Dialog>

          

        </div>
    
    )
}   

const mapStateToProps = (state) => ({
    username: state.username,
    email: state.email,
    userInfo: state.userInfo
  })

  export default connect(mapStateToProps)(Profile)

