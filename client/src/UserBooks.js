import React, { Component } from 'react';

class UserBooks extends Component{
    // constructor to set states
    constructor(props) {
        super(props);
        this.state={
            books:"",
            mappedBooks:[],
        };
    }

    // fetch data
    componentDidMount() {
        this.fetchUserBookData();
    }

    // log in a user and create a cookie
    signInUser=(e)=>{
        e.preventDefault();
        fetch('/users/login',
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
            .then(response=>{if(response) {
                this.props.loggedInUserInfo(response, true);
                return this.fetchUserBookData();
            }
            else
                return this.props.loggedInUserInfo(response, false)});
    };

    fetchUserBookData(){
        fetch('/users/grabook')
            .then(data=>data.json())
            .then(response=> {
                return this.setState({books: response.books}, () => this.mappedBooksFunction())
            });
    }

    // Map the user's books
    mappedBooksFunction(){
        let mapArray = [];
        let tempArray = [];
        if(this.state.books)
            tempArray = this.state.books;
        if(tempArray.length>0) {
            mapArray = this.state.books.map(
                (eachElement, index) => {
                    return (<div key={index}>
                        <p>{eachElement}</p>
                    </div>)
                }
            );
        }
        else {
            mapArray = [];
        }
        this.setState({mappedBooks:mapArray});
    }

    render(){
        return(
            <div>
                {/*If a user is logged in*/}
                {this.props.logInfo.loggedIn?
                    (<div>
                        <h1>{this.props.logInfo.username}'s data</h1>
                        {this.state.mappedBooks}
                    </div>):
                    // If the user is not logged in.
                    (<div>
                            <p>Please log in</p>
                            <form onSubmit={this.signInUser}>
                                <p>
                                    <label htmlFor={"username"}>Enter username:</label>
                                    <input type="text" name={"username"} id={"username"}/>
                                </p>
                                <p>
                                    <label htmlFor={"password"}>Enter password:</label>
                                    <input type="text" name={"password"} id={"password"}/>
                                </p>
                                <button>Sign In</button>
                            </form>
                        </div>
                    )}
            </div>
        );
    }
}
export default UserBooks;