import './App.css';
import {connect} from "react-redux"
import Profile from "./Profile/Profile.js"
import { Login } from './Login/Login';

function App({username,userInfo}) {
  return (
    
    <div className="App">
      {username ? (
      <div>
      <h1>Calendar Project</h1>
      <Profile/>
      </div>
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
