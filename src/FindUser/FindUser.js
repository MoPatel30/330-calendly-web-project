import React, { useEffect, useState } from 'react'
import { db } from "../firebase"
import Dialog from '@material-ui/core/Dialog';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Calendar from 'react-calendar'
import './FindUser.css'
import {connect} from "react-redux"
import firebase from "firebase"


function FindUser({email, username, userInfo}) {
    const [users, setUsers] = useState([]);
    //Variable for true/false if open + The clicked user info
    const [open, setOpen] = useState(false);
    const [clickUser, setClickUser] = useState(undefined)

    //start time val for DB
    var  startTime = [];

    //Date variables for modal calendar
    const[calDate,setCalDate] = useState(new Date());

    var dayName = calDate.toUTCString().substring(0,16)

    //Array for search
    const [filteredUsers, setFilteredUsers] = useState([])

    
    //used for search bar
    const [search, setSearch] = useState("");

    //Open Close Functions for modal
    const handleClickOpen = (user) => {
        setOpen(true)
        setClickUser(user)
      }
    
      const handleClose = () => {
        setOpen(false)
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
      
    //Gets Users from DB
    useEffect(() => { 
        db.collection('users').onSnapshot(snapshot => {  
            setUsers(snapshot.docs.map(doc => doc))  
        })
    }, [])

    useEffect(() => { 
        setFilteredUsers(
            users.filter((user) =>
            user.data().name.toLowerCase().includes(search.toLowerCase())
            )
        )
      }, [search, users]);
    
    function joinMeeting(dayName, meetingName){
        db.collection('users').doc(email).set({
            meeting: {
                [dayName]: {
                    [clickUser.data()[dayName][meetingName].meetingName]: {
                        description: clickUser.data()[dayName][meetingName].meetingDescription,
                        end_time: clickUser.data()[dayName][meetingName].endTime,
                        start_time: clickUser.data()[dayName][meetingName].startTime,
                        zoom_link: clickUser.data()[dayName][meetingName].zoomLink,
                        creator: clickUser.id
                    }
                }
            }
        }, {merge: true})

        db.collection('users').doc(clickUser.id).set({
            [dayName]: {
                [meetingName]: {
                    people: firebase.firestore.FieldValue.arrayUnion(email)
                }
            }
        }, {merge: true})
    }
    
    
    return (
        <div>
            <div className="searchbar">
                <input
                    type="text"
                    placeholder="Search for a User"
                    onChange={(e) => setSearch(e.target.value)}
                />
                <i className="fas fa-search" id="searchGlass"></i>
            </div>

            {filteredUsers.length === 0 ? (
                <h3 style={{color: "white"}}>Sorry, no users have been found.</h3>
            ) : (
                filteredUsers.map((user) => (
                    <div>
                        <div className="flip-card">
                            <div className="flip-card-inner">                      
                                <div id="spanner">
                                    <h2><u>{user.data().name}</u></h2>
                                    <hr style={{width: "100%"}} />
                                </div>
                                <br />
                                <div id="Midspanner">                                 
                                    <img className = "profile-pic" alt="profile pic" src={user.data().pic} />
                                </div>
                                <br />
                                <hr style={{width: "100%"}} />
                                <br />
                                <div id="spanner"> 
                                    <div onClick={() => handleClickOpen(user)} className="view-btn">
                                        View Opennings!
                                    </div>                                
                                </div>         
                            </div>
                        </div>
                    </div>    
            )
            ))}

            <Dialog style = {{maxWidth: "100%"}} fullScreen open = {open}>
                <Toolbar style = {{maxWidth: "90%", margin: "0 auto"}}> 
                    <IconButton className="close-btn" edge="start" color="black" onClick={handleClose} aria-label="close">
                        <p> Close </p>
                    </IconButton>
                </Toolbar>
                <div className="title-open">
                   <div>

                    {clickUser !== undefined ? (
                        <div>
                            <div>
                                <h2 style={{textAlign: "center", marginBottom: "3%"}}>{clickUser.data().name}'s Schedule</h2> 
                                    <Calendar 
                                        value = {calDate}
                                        onChange={setCalDate}
                                    /> 
                            </div>
                            
                            <div style={{marginTop: "5%"}}>
                                {clickUser.data()[dayName] ? (
                                //sets the second param for db access
                                Object.keys(clickUser.data()[dayName]).map( (key) => (
                                    startTime.push(key)
                                )),
                                //display contents of second param usgin clickUser[dayName][startTime].name,.X.Y.Z....
                                startTime.length === 0 ? (
                                    <div style={{textAlign: "center"}}>{clickUser.data().name} has no meetings planned!</div>
                                ) : (
                                startTime.map((meetingName) =>(
                                    <div id="time-slot">
                                        <div>
                                        Meeting Name: {meetingName}
                                        </div>
                                        <div>
                                        Duration: {tConvert(clickUser.data()[dayName][meetingName].startTime)} - {tConvert(clickUser.data()[dayName][meetingName].endTime)}
                                        </div>
                                        <div>
                                        Current Number of People: {clickUser.data()[dayName][meetingName].people.length} / {clickUser.data()[dayName][meetingName].maxNumOfPeople}
                                        </div>
                                        <div style={{maxWidth: "50vw", minWidth: "50vw"}}>
                                        Description: {clickUser.data()[dayName][meetingName].meetingDescription}
                                        </div>
                                        <div>
                                        Zoom Link: Will be provided after join meeting session
                                        </div>    
                                        {console.log(clickUser.data().name, username)} 
                                        { clickUser.data()[dayName][meetingName].people.length < clickUser.data()[dayName][meetingName].maxNumOfPeople ? (
                                            <button className="optionBox" style={{marginTop: "2%", marginBottom: "2%"}} onClick={() => joinMeeting(dayName, meetingName)}>Join Meeting</button>
                                        ) : (
                                            <p></p>
                                        )
                                        }                    
                                    </div>
                                )))
                                ) : (
                                    <div style={{marginLeft: "9rem"}}>{clickUser.data().name} has no meetings planned!</div>
                                )} 
                            </div>
                        </div>
                     ) : (
                         <p></p>
                     )}  
                    </div>          
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

export default  connect(mapStateToProps)(FindUser)
