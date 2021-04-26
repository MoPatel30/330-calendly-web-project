import './App.css';
import {connect} from "react-redux"
import Profile from "./Profile/Profile.js"
import { Login } from './Login/Login';
import { BrowserRouter as Router, Route, Link } from "react-router-dom"
import FindUser from './FindUser/FindUser';


function App({username,userInfo}) {
  return (
    
    <div className="App">
      {username ? (
      <Router>
        <div>
          <header >
            <h1 className="title">iCalendar
              <br/>Hello, {username}
              </h1>
            
            <Link className ="optionBox" to="/find" >Find a User!</Link>
            <Link className ="optionBox" to="/profile" >Make Opennings!</Link>
            <Link to="/profile"> 
              <a>
                <img className="home-pro-pic" alt="profile pic" src={userInfo.photoURL} />
              </a>
          </Link>   
          
          </header>

          
          

          <Route path="/find"  component={FindUser} />
          <Route path="/profile"  component={Profile} />
        </div>
      </Router>
      ):(
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
