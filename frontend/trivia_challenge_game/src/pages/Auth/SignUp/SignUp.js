import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { axiosJSON } from "../../../lib/axios";
const REACT_APP_USER_AUTH_REG_LAMBDA_API_GATEWAY = process.env.REACT_APP_USER_AUTH_REG_LAMBDA_API_GATEWAY;

function SignUp(){
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleInputChange = (event) => {
    const { name, value } = event.target
    if (name === 'email') setEmail(value)
    if (name === 'username') setUsername(value)
    if (name === 'password') setPassword(value)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const response = await axiosJSON.post(REACT_APP_USER_AUTH_REG_LAMBDA_API_GATEWAY + '/signup', JSON.stringify({"email": email,"username": username,"password": password }))
      const data = response.data
      if (data.authenticated) {
        // console.log('redirect')
        // User was successfully authenticated
        // You can redirect them to a protected route or update the UI
        alert('Sign up successful')
        const redirectURL = "unauth/login"
        const postURL = "/confirmemail"
        navigate('/unauth/confirm-email', { state: { username, email, redirectURL, postURL }})
      } else {
        alert(data.message)
        // There was an error authenticating the user
        // You can display an error message or handle the error in another way
      }
    } catch (error) {
      alert(error.response.data.message)
      console.error(error)
      // There was an error making the API call
      // You can display an error message or handle the error in another way
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Sign Up</h3>
      <div className="mb-3">
        <label>Email</label>
        <input
          type="email"
          name="email"
          className="form-control"
          placeholder="john@gmail.com"
          onChange={handleInputChange}
        />
      </div>
      <div className="mb-3">
        <label>Username</label>
        <input
          type="text"
          className="form-control"
          name="username"
          placeholder="Username"
          onChange={handleInputChange}
        />
      </div>
      <div className="mb-3">
        <label>Password</label>
        <input
          type="password"
          name="password"
          className="form-control"
          placeholder="Enter password"
          onChange={handleInputChange}
        />
      </div>
      <div className="d-grid">
        <button type="submit" className="btn btn-primary">
          Sign Up
        </button>
      </div>
      <p className="forgot-password text-right">
        Already registered?<a href="login">Login here!</a>
      </p>
    </form>
  )
}

export default SignUp