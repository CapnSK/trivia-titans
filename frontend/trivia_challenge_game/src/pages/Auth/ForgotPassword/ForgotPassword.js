import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { axiosJSON } from "../../../lib/axios";

const REACT_APP_USER_AUTH_REG_LAMBDA_API_GATEWAY_ABHINAV = process.env.REACT_APP_USER_AUTH_REG_LAMBDA_API_GATEWAY_ABHINAV

const ForgotPassword = () => {
  const [username, setUsername] = useState('')
  const [maskedEmail, setMaskedEmail] = useState('')
  const navigate = useNavigate()

  const handleInputChange = (event) => {
    const { name, value } = event.target
    if (name === 'username') setUsername(value)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const response = await axiosJSON.post(REACT_APP_USER_AUTH_REG_LAMBDA_API_GATEWAY_ABHINAV + '/forgotpassword', JSON.stringify({ "username": username }))
      const data = await response.data
      if (data.authenticated) {
        console.log('redirect')
        // User was successfully authenticated
        // You can redirect them to a protected route or update the UI
        alert('Confirmation code sent to your registered email!')
        setMaskedEmail(data.maskedEmail)
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

  // Use effect to check if usename and email are set, 
  // if yes, then redirect to the next page
  useEffect(() => {
    if (username && maskedEmail) {
      const redirectURL = "/unauth/login"
      const postURL = "/resetpassword"
      navigate('/unauth/reset-password', { state: {username, redirectURL, postURL, maskedEmail}})
    }
  },
  // eslint-disable-next-line 
  [username, maskedEmail]);


  return (
    <div className="auth-inner"> 
      <form onSubmit={handleSubmit}>
        <h3>Forgot Password?</h3>
        <div className="mb-3">
          <label>Enter your username: </label>
          <input
            type="text"
            className="form-control"
            name="username"
            placeholder="Enter your username"
            onChange={handleInputChange}
          />
        </div>
        <div className="d-grid">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    </div>
  )
}

export default ForgotPassword