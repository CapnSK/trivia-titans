import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { axiosJSON } from "../../../lib/axios";
const REACT_APP_USER_AUTH_REG_LAMBDA_API_GATEWAY_ABHINAV = process.env.REACT_APP_USER_AUTH_REG_LAMBDA_API_GATEWAY_ABHINAV;

function SignUp(){
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('')
  const navigate = useNavigate()

  const handleInputChange = (event) => {
    const { name, value } = event.target
    if (name === 'email') setEmail(value)
    if (name === 'username') setUsername(value)
    if (name === 'password') setPassword(value)
    if (name === 'role') setRole(value)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const response = await axiosJSON.post(REACT_APP_USER_AUTH_REG_LAMBDA_API_GATEWAY_ABHINAV + '/signup', JSON.stringify({"email": email,"username": username,"password": password, "role": role }))
      const data = response.data
      if (data.authenticated) {
        // console.log('redirect')
        // User was successfully authenticated
        // You can redirect them to a protected route or update the UI
        alert('Sign up successful')
        const redirectURL = "/unauth/login"
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
    <div className="auth-inner"> 
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
        {/* Display a dropdown called Role -- Player and Admin*/}
        <div className='mb-3'>
          <label>Role</label>
          <select
            className="form-control"
            name="role"
            placeholder="Select Role"
            onChange={handleInputChange} required
          >
          <option value="">Select a Role</option>
          <option value="admin">Admin</option>
          <option value="player">Player</option>
          </select>
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
        <a href='/unauth/login'>
        <p className="forgot-password text-right">
          Already registered? Login here!
        </p>
        </a>
      </form>
    </div>
  )
}

export default SignUp