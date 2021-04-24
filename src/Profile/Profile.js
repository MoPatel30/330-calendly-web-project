import React, { useState, useEffect} from 'react'
import { db } from "../firebase"
import {connect} from "react-redux"
import "./Profile.css"
import Schedule from '../Schedule/Schedule';
import moment from 'moment';

function Profile({username,email}) {
    const [name,setName] = useState(username)
    



     useEffect(() => {
        var docRef = db.collection("users").doc(email);

        docRef.get().then((doc) => {
            if (doc.exists) {
                console.log("Document data:", doc.data());
                setName(doc.data().name)
                
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error)
        })

    }, [])


       
        return (
            <div>
                <h1>{name}</h1>
            <h3>Occupation: Student at Loyola University Chicago</h3>
            
                
            <div>
                <Schedule />
            </div>

        
            
           
            </div>
        
        )
}   
const mapStateToProps = (state) => ({
    username: state.username,
    email: state.email,
    userInfo: state.userInfo
  })

  export default connect(mapStateToProps)(Profile)

