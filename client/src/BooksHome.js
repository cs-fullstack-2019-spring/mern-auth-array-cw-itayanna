import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import UserBooks from "./UserBooks";
import AddUser from "./AddUser";
import Loggedout from "./Loggedout";
import LoggedInData from "./LoggedInData";
import LogIn from "./LogIn";

class BooksHome extends Component{

    constructor(props) {
        super(props);
        this.state={
            logInfo:{
                username: null,
                loggedIn: false,
            },
        };
    }

    componentDidMount() {
        this.checkForUser();
    }

    checkForUser(){
        fetch('/users')
            .then(data=>{
                return data.text();
            })
            .then(response=>{

                if(response) {
                    this.setState(
                        {
                            logInfo:{
                                username: response,
                                loggedIn: true,
                            }
                        });
                }
                else {
                    this.setState(
                        {
                            logInfo: {
                                username: null,
                                loggedIn: false,
                            }
                        });
                }

            });
    }


    logInfo =(username, loggedIn)=>{
        this.setState({
            logInfo:{
                username: username,
                loggedIn: loggedIn,
            }
        });
    };

    logUserOut=()=>{
        fetch('/users/logout')
            .then(data=>{return data.text()})
            .then(data=>console.log(data))
            .then(()=>this.loggedInUserInfo(undefined, false))
            .catch(()=>console.log("Test"));
    };

    render(){
        return(
            <div>
                <Router>
                    <h1>We love books!</h1>

                    <Link className="linkSpacing" to='/'>Home</Link>
                    <Link className="linkSpacing" to='/login'>Sign In</Link>
                    <Link className="linkSpacing" to='/adduser'>Add User</Link>
                    <Link className="linkSpacing" to='/loggedout' onClick={this.logUserOut}>Log Out</Link>
                    <Route exact path='/' component={()=>{return <UserBooks logInfo={this.state.logInfo} loggedInUserInfo={this.logInfo} />} }/>
                    <Route exact path='/adduser' component={AddUser}/>
                    <Route exact path='/loggedIn' component={()=>{return <LoggedInData logInfo={this.state.logInfo} loggedInUserInfo={this.logInfo}/>} }/>
                    <Route exact path='/loggedout' component={()=>{return <Loggedout/>} }/>
                    <Route exact path='/login' component={()=>{return <LogIn logInfo={this.logInfo}/>} }/>
                </Router>
            </div>
        );
    }
}
export default BooksHome;