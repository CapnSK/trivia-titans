import React, { useState } from 'react'
import { useLocation,useNavigate } from 'react-router-dom'
import { axiosJSON } from "../../../lib/axios";

const REACT_APP_USER_AUTH_REG_LAMBDA_API_GATEWAY_ABHINAV = process.env.REACT_APP_USER_AUTH_REG_LAMBDA_API_GATEWAY_ABHINAV
const REACT_APP_APIGATEWAY_URL_ARPIT =  process.env.REACT_APP_APIGATEWAY_URL_ARPIT

const ConfirmEmail = () => {
  const [code, setCode] = useState('')
  const location = useLocation()
  const navigate = useNavigate()
  const { username, email, redirectURL, postURL } = location.state

  const handleInputChange = (event) => {
    const { name, value } = event.target
    if (name === 'code') setCode(value)
  }

  const resendConfirmationCode = async (event) => {
    event.preventDefault();
    try {
      const response = await axiosJSON.post(REACT_APP_USER_AUTH_REG_LAMBDA_API_GATEWAY_ABHINAV + '/resendconfirmationcode', JSON.stringify({ "username": username }))
      const data = await response.data
      if (data.authenticated) {
        alert("Confirmation code sent to your email again. Please check your email.")
      }
    }
    catch (error) {
      alert(error.response.data.message)
      console.log(error)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const response = await axiosJSON.post(REACT_APP_USER_AUTH_REG_LAMBDA_API_GATEWAY_ABHINAV + postURL, JSON.stringify({ "username": username, "code":code }))
      const data = await response.data
      if (data.authenticated) {
        console.log('redirect')
        // User was successfully authenticated
        // You can redirect them to a protected route or update the UI
        alert('Successfully Verified!')
        try{
          // eslint-disable-next-line
          const sendSNSResponse = await axiosJSON.post(REACT_APP_APIGATEWAY_URL_ARPIT + '/create_sns', { email: email})
          alert("SNS Subscription Mail Sent. You will receive a mail shortly. You must confirm the subscription to receive emails from us.")
        }
        catch(error){
          // alert(error.response.data.message)
          console.log(error)
        }
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
      <br></br>
      {/* A button to resend the confirmation code with a timeout */}
      {/* Add timeout */}
      <div className="d-grid">
        <button type="button" className="btn btn-primary" onClick={resendConfirmationCode}>
          Resend Confirmation Code
        </button>
      </div>
    </div>
  )
}

export default ConfirmEmail