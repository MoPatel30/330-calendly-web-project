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
                    <div className="flip-card">
                        <div className="flip-card-inner">                      
                            <div id="spanner">
                                <h2><u>{instance.data().name}</u></h2>
                                <hr style={{width: "100%"}} />
                            </div>
                            <br />
                            <div id="Midspanner">                                 
                               
                            </div>
                            <br />
                            <hr style={{width: "100%"}} />
                            <br />
                            <div id="spanner">                                 
                            </div>         
                        </div>
                    </div>
                </div>        
                )))
            } 
        </div>
    )
}

export default DisplayUsers
