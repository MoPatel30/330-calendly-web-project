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
import firebase from "firebase"


function Profile({username, userInfo, email}) {
    const [todayDate, setTodayDate] = useState("")
    const [todayMeetings, setTodayMeetings] = useState(null)
    const [todaySchedule, setTodaySchedule] = useState(null)
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

        docRef.onSnapshot((doc) => {
            console.log(doc)
            if (doc.exists) {
                setBio(doc.data().bio)
                setOccupation(doc.data().occupation)
                console.log("Document data:", doc.data());
                let date = String(new Date()).substring(0, 15)
                let day = date.split(' ')
                let newDate = day[0] + ", " + day[2] + " " + day[1] + " " + day[3]
                setTodayDate(newDate)
                console.log(newDate)
                if(doc.data()[newDate]){
                    setTodaySchedule(doc.data()[newDate])
                }
                if(doc.data().meeting){              
                    if(doc.data().meeting[newDate]){
                        setTodayMeetings(doc.data().meeting[newDate])
                    }
                }
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
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
   
    function deleteFromSchedule(openning){
        let peopleJoined = todaySchedule[openning].people
        if(peopleJoined.length !== 0){
            for(let user of peopleJoined){
                db.collection('users').doc(user).set({
                    meeting: {
                        [todayDate]: {   
                            [openning]: firebase.firestore.FieldValue.delete()
                        }
                    }
                }, {merge: true})
            }
        }
        db.collection('users').doc(email).set({
            [todayDate]: {
                [openning]: firebase.firestore.FieldValue.delete()
            }
        }, {merge: true})
    }

    function deleteFromMeeting(meeting){
        db.collection('users').doc(email).set({
            meeting: {   
                [todayDate]: {
                    [meeting]: firebase.firestore.FieldValue.delete()
                }
            }
        }, {merge: true})
        db.collection('users').doc(todayMeetings[meeting].creator).set({
            [todayDate]: {   
                [meeting]: {
                    people: firebase.firestore.FieldValue.arrayRemove(email)
                }
            }
        }, {merge: true})
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
                            <span>
                                <h3 id="bio">{occupation}</h3>          
                            </span> 
                            <span>
                                <EditIcon onClick={changeOccupation} style={{cursor: "pointer", marginLeft: "5px"}} />
                            </span>
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
                            <span>
                                <h3 id="bio">{bio}</h3> 
                            </span>
                            <span>
                                <EditIcon onClick={changeBio} style={{cursor: "pointer", marginLeft: "5px"}} />
                            </span>
                        </div>
                    )}    
             
                    <br />
                    <button className="optionBox" style={{marginRight: "3%"}} onClick={scheduleClose}>View Schedule</button>
                    <button className="optionBox" style={{marginLeft: "3%"}} onClick={meetingClose}>View Meetings</button>
                </div>
            </div>
            
            <div id="left-profile-section">
                <div className="schedule-maker">
                    <Schedule />
                </div>              
            </div>

            <Dialog fullWidth maxWidth={'sm'} open = {schedule}>
                <IconButton edge="start" color="black" onClick={scheduleClose} aria-label="close">
                    <p style={{width: "fit-content"}}>Close</p>
                </IconButton>
                <div id="today-schedule">
                    <h1>Today's Schedule</h1>
                    <h2>{todayDate}</h2>
                    {todaySchedule === null ? (
                         <p style={{color: "white"}}>You currently have no openings Scheduled. Use the calendar to create openings!</p>
                    ) : Object.keys(todaySchedule).length === 0 ? (
                        <p style={{color: "white"}}>You currently have no openings Scheduled. Use the calendar to create openings!</p>
                    ) : (
                        Object.keys(todaySchedule).map((openning) => (
                            <div className="dates">
                                <h3 className="info">Meeting Name: {openning}</h3>
                                <h4 className="info">Start Time: {tConvert(todaySchedule[openning].startTime)}</h4>
                                <h4 className="info">End Time: {tConvert(todaySchedule[openning].endTime)}</h4>
                                <h4 className="info">Description: {todaySchedule[openning].meetingDescription}</h4>
                                <h4>Zoom Link: {todaySchedule[openning].zoomLink}</h4>
                                <h4>Current People: {todaySchedule[openning].people.length}/{todaySchedule[openning].maxNumOfPeople}</h4>
                                <div style={{float: "right"}}>
                                    <DeleteIcon onClick={() => deleteFromSchedule(openning)} style={{cursor: "pointer"}} />                     
                                </div>
                            </div>
                        ))       
                    )
                    }
                </div>   
            </Dialog>

            <Dialog fullWidth maxWidth={'sm'} open = {meeting}>
                <IconButton edge="start" color="black" onClick={meetingClose} aria-label="close">
                    <p style={{width: "fit-content"}}>Close</p>
                </IconButton>
                <div id="upcoming-meetings">
                    <h1>Upcoming Meetings Today</h1>
                    <h2>{todayDate}</h2>
                    {console.log(todayMeetings)}
                    {todayMeetings === null ? (
                        <p style={{color: "white"}}>You currently have no upcoming meetings</p>    
                    ) :  Object.keys(todayMeetings).length === 0 ? ( 
                        <p style={{color: "white"}}>You currently have no upcoming meetings</p>
                    ) : (
                        Object.keys(todayMeetings).map((meeting) => (
                            <div className="dates">
                                <h3 className="info">Meeting Name: {meeting}</h3>
                                <h3>Meeting Creator: {todayMeetings[meeting].creator}</h3>
                                <h4 className="info">Start Time: {tConvert(todayMeetings[meeting].start_time)}</h4>
                                <h4 className="info">End Time: {tConvert(todayMeetings[meeting].end_time)}</h4>
                                <h4 className="info">Description: {todayMeetings[meeting].description}</h4>
             
                                <h4>Zoom Link:  {"     "}
                                     <a target="_blank" href={todayMeetings[meeting].zoom_link}>
                                         {todayMeetings[meeting].zoom_link}
                                    </a>
                                </h4>
                                <div style={{float: "right"}}>
                                    <DeleteIcon onClick={() => deleteFromMeeting(meeting)} style={{cursor: "pointer"}} />
                                </div>
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

