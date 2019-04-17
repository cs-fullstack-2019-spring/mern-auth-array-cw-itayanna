import React, { Component } from 'react';

class LoggedInData extends Component{
    constructor(props) {
        super(props);
        this.state={
            loggedIn: false,
            message: "",
        };
        console.log(this.props.logInfo);
    }

    BookSubmit=(e)=>{
        e.preventDefault();
        fetch('/users/addBook',{
            method: 'POST',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: this.props.logInfo.username,
                book: e.target.book.value,
            }),
        })
            .then(data=>data.text())
            .then(response=>this.setState({message: response}));
    };

    render(){
        if(!this.props.logInfo.loggedIn){
            return(<div>
                <h1>Please log In</h1>
            </div>);
        }
        else {
            return (
                <div>
                    <h1>Welcome {this.props.logInfo.username}</h1>
                    <form onSubmit={this.BookSubmit}>
                        <p>
                            <label htmlFor={"book"}>Add a new favorite book:</label>
                            <input type="text" id={"book"} name={"book"}/>
                        </p>
                        <button>Submit</button>
                    </form>
                    {this.state.message}
                </div>
            );
        }
    }
}

export default LoggedInData;