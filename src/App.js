import React, {useEffect} from "react"
import './App.css';
import {connect} from "react-redux"
import Profile from "./Profile/Profile.js"
import { Login } from './Login/Login';
import { BrowserRouter as Router, Route, Link } from "react-router-dom"
import FindUser from './FindUser/FindUser';
import {auth, db} from "./firebase.js"
import store from "./Redux/index"
import firebase from "firebase"


function App({username,userInfo}) {

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) { 
        var docRef = db.collection("users").doc(user.email);
  
        docRef.get().then((doc) => {
          store.dispatch({  
              type: "ADD_POST",
              payload: {
                  username: user.displayName,
                  email: user.email,
                  userInfo: user,
              } 
          }) 
        })
      }
    })
  }, [])

  function signOut(){
    firebase.auth().signOut().then(function() {
      store.dispatch({  
        type: "ADD_POST",
        payload: {
            username: "",
            email: "",
            userInfo: "not logged in",
        } 
    }) 
      // Sign-out successful.
    }).catch(function(error) {
      // An error happened.
    });
  
  }

  return (
    <div className="App">
      {username ? (
      <Router>
        <div>
          <header >
            <h1 className="title">iCalendar
            <br/>Hello, {username}!
            </h1>
            
            <Link className ="optionBox" to="/find" >Find a User!</Link>
            <Link className ="optionBox" to="/profile" >Make Openings!</Link>
            <Link to="/profile" > 
              <a>
                <img className="home-pro-pic" alt="profile pic" src={userInfo.photoURL} />
              </a>
            </Link>     
            
          </header>

          <Route path="/find"  component={FindUser} />
          <Route path="/profile"  component={Profile} />
        </div>
      </Router>
      ) : (
        <div>
          <Login />
        </div>
      )
      }
    </div>
  );
}

const mapStateToProps = (state) => ({
  username: state.username,
  userInfo: state.userInfo
})

export default connect(mapStateToProps)(App)
