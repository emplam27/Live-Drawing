import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'
import axios from 'axios'
class Room extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userId: '',
      title: '',
      body: '',
    }
  }
  changeHandler = e => {
    this.setState({ [e.target.name]: e.target.value })
  }
  submitHandler = e => {
    e.preventDefault()
    console.log(this.state)
    axios
      .post('http://localhost:8080/room', this.state)
      .then(response => {
          if(response.status===200){
            window.location = '/draw'
            console.log(response)
          }
      })
      .catch(error => {
        console.log(error)
      })
  }
  render() {
    const { userId, title, body } = this.state
    return (
      <div>
        <form onSubmit={this.submitHandler}>
          <div>
            <input
              type="text"
              name="userId"
              value={userId}
              onChange={this.changeHandler}
            ></input>
          </div>
          <div>
            <input
              type="text"
              name="title"
              value={title}
              onChange={this.changeHandler}
            ></input>
          </div>
          <div>
            <input
              type="text"
              name="body"
              value={body}
              onChange={this.changeHandler}
            ></input>
          </div>
          {/* <Link to="/draw/1234"> */}
          <button type="submit">Submit</button>
          {/* </Link> */}
        </form>
      </div>
    )
  }
}
export default Room