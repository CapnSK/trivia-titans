import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { axiosJSON } from "../../../lib/axios";

const REACT_APP_USER_AUTH_REG_LAMBDA_API_GATEWAY_ABHINAV = process.env.REACT_APP_USER_AUTH_REG_LAMBDA_API_GATEWAY_ABHINAV

const ResetPassword = () => {
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const location = useLocation()
  const navigate = useNavigate()
  const { username, redirectURL, postURL, maskedEmail } = location.state

  const handleInputChange = (event) => {
    const { name, value } = event.target
    if (name === 'code') setCode(value)
    if (name === 'password') setPassword(value)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const response = await axiosJSON.post(REACT_APP_USER_AUTH_REG_LAMBDA_API_GATEWAY_ABHINAV + postURL, JSON.stringify({ "username": username,"password": password,"code": code }))
      const data = await response.data
      if (data.authenticated) {
        console.log('redirect')
        // User was successfully authenticated
        // You can redirect them to a protected route or update the UI
        alert('Successfully updated the password!')
        navigate(redirectURL)
      } else {
        alert(data.message)
        // There was an error authenticating the user
        // You can display an error message or handle the error in another way
      }
    } catch (error) {
      alert(error.response.data.message)
      console.log(error)
      // There was an error making the API call
      // You can display an error message or handle the error in another way
    }
  }

  return (
    <div className="auth-inner">
    <form onSubmit={handleSubmit}>
      <h3>Verify your email</h3>
      <div className="mb-3">
        <label>Enter the code sent to your registerd email at {maskedEmail}</label>
        <input
          type="text"
          className="form-control"
          name="code"
          placeholder="Enter the code sent to your email..."
          onChange={handleInputChange}
        />
      </div>
      <div className="mb-3">
        <label>New Password</label>
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
          Reset Password
        </button>
      </div>
    </form>
    </div>
  )
}

export default ResetPassword