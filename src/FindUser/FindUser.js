import React, { useEffect, useState } from 'react'
import { db } from "../firebase"
import Dialog from '@material-ui/core/Dialog';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Calendar from 'react-calendar'


import './FindUser.css'
function FindUser() {
   
    const [users,setUsers] = useState([]);
    //Variable for true/false if open + The clicked user info
    const [open, setOpen] = useState(false);
    const [clickUser,setClickUser] = useState([])

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
            setUsers(snapshot.docs.map(doc => doc.data()))  
        })
    }, [])

    useEffect(() => {
        setFilteredUsers(
          users.filter((user) =>
            user.name.toLowerCase().includes(search.toLowerCase())
          )
        )

      }, [search, users]);
    
    
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
                    <div className ="user-board">
                        <div className ="img-container">
                            <img className = "profile-pic" alt="profile pic" src={user.pic} />
                        </div>
                        <div>
                            {user.name}
                        </div>
                        <div>
                            View Schedule!
                        </div>  
                        <div>
                            {user.name}
                        </div>
                        <div onClick={() => handleClickOpen(user)} className="view-btn">
                            View Opennings!
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
                    Check Out {clickUser.name}'s Schedule
                    <Calendar 
                        value = {calDate}
                        onChange={setCalDate}
                    /> 
                    {clickUser[dayName] ? (
                    //sets the second param for db access
                    Object.keys(clickUser[dayName]).map( (key) => (
                        startTime.push(key)
                    )),
                    //display contents of second param usgin clickUser[dayName][startTime].name,.X.Y.Z....
                    startTime.map((time) =>(
                        <div style={{color: "blue", borderBottom: "1px solid black"}}>
                            <div>
                            Duration: {tConvert(time)} - {tConvert(clickUser[dayName][time].endTime)}
                            </div>
                            <div>
                            Number of People allowed: {clickUser[dayName][time].maxNumOfPeople}
                            </div>
                            <div>
                            People Joined: {clickUser[dayName][time].people.map((person)=>(
                                <span>{person}</span>
                            ))}
                            </div>
                            <div>
                            Description: {clickUser[dayName][time].meetingDescription}
                            </div>
                            <div>
                            Zoom Link: {clickUser[dayName][time].zoomLink}
                            </div>                         
                        </div>
                    ))
                    ) : (
                        <div>No Opennings Here!</div>
                    )}              
                </div>
            </Dialog> 
        </div>
    )
}

  

export default FindUser
