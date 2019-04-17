import React, { Component } from 'react';

class AddUser extends Component{
    constructor(props) {
        super(props);
        this.state={
            data:"",
        };
    }

    submitAddUserForm=(e)=>{
        e.preventDefault();
        fetch('/users/newuser',
            {
                method: 'POST',
                headers:{
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: e.target.username.value,
                    password: e.target.password.value,
                }),
            })
            .then(data=>{ return data.text()})
    };

    render(){
        return(
            <div>
                <h1>Register New User</h1>
                <form onSubmit={this.submitAddUserForm}>
                    <input type="text" name='username' placeholder="Enter username" autoFocus/>
                    <input type="password" name='password' placeholder="Enter password" />
                    <button>Sign In</button>
                </form>
                {this.state.data}
            </div>
        );
    }
}

export default AddUser;
