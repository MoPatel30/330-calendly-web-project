import React, {useState} from 'react'
import "./Login.css"
import { connect } from 'react-redux'
import store from ".././Redux/index"
import {auth, provider, db} from "../firebase.js"
import firebase from "firebase"


export const Login = (props) => {
    const [userInfo, updateUserInfo] = useState(null)
    const [name, setName] = useState(store.getState().username)

    const signIn = () => {
        auth.setPersistence(firebase.auth.Auth.Persistence.SESSION)
            .then(function() {
                auth
                .signInWithPopup(provider)
                .then((result) =>{
                    console.log(result)  
                    updateUserInfo(result.user.displayName, result)
                    store.dispatch({     // store user info in global state 
                        type: "ADD_POST",
                        payload: {
                            username: result.user.displayName,
                            email: result.user.email,
                            userInfo: result.user,
                        } 
                    }) 
                    setName(result.user.displayName)
                    
                    var docRef = db.collection("users").doc(result.user.email);
                    // check if user credentials already exist. add new user data if they don't.
                    docRef.get().then((doc) => {
                        if (doc.exists) {
                            console.log("Document data:", doc.data());
                        } else {
                            // doc.data() will be undefined in this case
                            console.log("No such document!");
                            db.collection("users").doc(result.user.email).set({
                                name: result.user.displayName,
                                display_name: result.user.displayName
                                

                            })
                            .then(() => {
                                console.log("Document successfully written!")
                            })
                            .catch((error) => {
                                console.error("Error writing document: ", error)
                            })
                        }
                    }).catch((error) => {
                        console.log("Error getting document:", error)
                    })

                })
                .catch((error) => alert(error.message)) 
            })
    }
    
    return (
        <div className="background">

            <div className="body">
                <h1 className="header">iCalendar</h1>

                <h4 className="slogan">When it comes to planning... <em>Plan Better!</em></h4>

                <button className="google" onClick={signIn}>Google</button>   
            </div>
         
        </div>
    )
}


const mapStateToProps = (state) => ({
    username: state.username,
    userInfo: state.userInfo
})

const mapDispatchToProps = dispatch => {
    return {
        dispatch
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
