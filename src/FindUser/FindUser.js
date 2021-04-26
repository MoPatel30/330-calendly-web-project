import React, { useEffect, useState } from 'react'
import { db } from "../firebase"
import './FindUser.css'
function FindUser() {
   
    const [users,setUsers] = useState([]);

    //Gets Users from DB
    useEffect(() => { 
        db.collection('users').onSnapshot(snapshot => {          
            setUsers(snapshot.docs.map(doc => doc.data()))  
        })
    }, [])
    
    
    return (
        <div>
            {users.map((user) =>(
                <div className ="user-board">
                    <div className ="img-container">
                        <img className = "profile-pic" alt="profile pic" src={user.pic} />
                    </div>
                    <div>
                        {user.name}
                    </div>
                    <div>
                        View Opennings!
                    </div>
                    
                </div>
            )
            
            )}
        </div>
    )
}

  

export default FindUser
