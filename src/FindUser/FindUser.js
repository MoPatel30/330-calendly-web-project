import React, { useEffect, useState } from 'react'
import { db } from "../firebase"
import './FindUser.css'
function FindUser() {
   
    const [users,setUsers] = useState([]);
    
    //Array for search
    const [filteredUsers, setFilteredUsers] = useState([])

    
    //used for search bar
    const [search, setSearch] = useState("");

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
                        
                    </div>
                ))
            )
            }   
           
        </div>
    )
}

  

export default FindUser
