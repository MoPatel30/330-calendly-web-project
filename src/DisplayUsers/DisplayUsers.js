import React, { useEffect, useState } from 'react'
import "./DisplayUsers.css"
import { db } from "../firebase"
import store from "../Redux/index"
import firebase from "firebase"


function DisplayUsers() {
    const [users, setUsers] = useState([])
    
    useEffect(() => {
        db.collection('users').onSnapshot(snapshot => {          
            setUsers(snapshot.docs.map(doc => doc))  
        })
 
    }, [])

    return (
        <div>
            <h1>Users Found</h1>
            {users.length === 0 ? (
                    <p style={{color: "white"}}>Sorry, no users have been found. Wait for users to join or invite friends onto our platform and spread the word!</p>
            ) : (
                users.map((instance) => (
                    <div>
                        <div className="userInfo">
                            <h3>{instance.data().display_name}</h3>
                            <h3>{instance.data().name}</h3>
                        </div>
                    </div>      
                )))
            } 
        </div>
    )
}

export default DisplayUsers
