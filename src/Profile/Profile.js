import React, { Component } from 'react'
import "./Profile.css"

export class Profile extends Component {
    constructor(){
        //not sure which other things we need for a profile this is just generic for now
        super();
        this.state = {
            name:"Fake Name",
            title:'admin',
        }
    }

    render() {
        return (
            <div>
                <h1>{this.state.name}</h1>
                <p>Position: {this.state.title}</p>

                <button className = "styled-btn">View Schedule</button> 
            </div>
        )
    }
}

export default Profile

