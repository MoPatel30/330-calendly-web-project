import React, { useEffect, useState } from 'react'
import { db } from "../firebase"
import Dialog from '@material-ui/core/Dialog';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';

import './FindUser.css'
function FindUser() {
   
    const [users,setUsers] = useState([]);
    //Variable for true/false if open + The clicked user info
    const [open, setOpen] = useState(false);
    const [clickUser,setClickUser] = useState([])

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
            {filteredUsers.map((user) =>(
                <div className ="user-board">
                    <div className ="img-container">
                        <img className = "profile-pic" alt="profile pic" src={user.pic} />
                    </div>
                    <div>
                        {user.name}
                    </div>
                    <div onClick={() => handleClickOpen(user)} className="view-btn">
                        View Opennings!
                    </div>
                    
                </div>
            )
            
            )}
            <Dialog style = {{maxWidth: "100%"}} fullScreen open = {open}>
                <Toolbar style = {{maxWidth: "90%", margin: "0 auto"}}> 
                    <IconButton className="close-btn" edge="start" color="black" onClick={handleClose} aria-label="close">
                        <p> Close </p>
                    </IconButton>
                </Toolbar>
                <div className="title-open">
                    Check Out {clickUser.name}'s Schedule
                </div>
            </Dialog> 
        </div>
    )
}

  

export default FindUser
