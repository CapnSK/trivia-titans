import React, { useState } from 'react'
import { useLocation,useNavigate } from 'react-router-dom'
import { axiosJSON } from "../../../lib/axios";

const REACT_APP_USER_AUTH_REG_LAMBDA_API_GATEWAY = process.env.REACT_APP_USER_AUTH_REG_LAMBDA_API_GATEWAY

const ConfirmEmail = () => {
  const [code, setCode] = useState('')
  const location = useLocation()
  const navigate = useNavigate()
  const { username, email, redirectURL, postURL } = location.state

  const handleInputChange = (event) => {
    const { name, value } = event.target
    if (name === 'code') setCode(value)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const response = await axiosJSON.post(REACT_APP_USER_AUTH_REG_LAMBDA_API_GATEWAY + postURL, JSON.stringify({ "username": username, "code":code }))
      const data = await response.data
      if (data.authenticated) {
        console.log('redirect')
        // User was successfully authenticated
        // You can redirect them to a protected route or update the UI
        alert('Successfully Verified!')
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
    <form onSubmit={handleSubmit}>
      <h3>Verify your email</h3>
      <div className="mb-3">
        <label>Enter the code sent to your email at {email}</label>
        <input
          type="text"
          className="form-control"
          name="code"
          placeholder="Enter the code sent to your email..."
          onChange={handleInputChange}
        />
      </div>
      <div className="d-grid">
        <button type="submit" className="btn btn-primary">
          Verify
        </button>
      </div>
    </form>
  )
}

export default ConfirmEmail