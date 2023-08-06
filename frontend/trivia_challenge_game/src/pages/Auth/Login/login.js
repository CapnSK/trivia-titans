import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { axiosJSON } from '../../../lib/axios';

const lambdaApiGatewayURL = process.env.REACT_APP_USER_AUTH_REG_LAMBDA_API_GATEWAY_ABHINAV;
const cloudFunctionURL = process.env.REACT_APP_USER_AUTH_REG_CLOUD_FUNCTION_URL_ABHINAV; 
const SOCIAL_SIGN_IN_URL = "https://trivia-challenge-game.auth.us-east-1.amazoncognito.com/login?response_type=token&client_id=35iqreqj2np431biljuh0pro63&scope=aws.cognito.signin.user.admin+email+openid+phone+profile&redirect_uri=https://frontend-at3rcdcdla-ue.a.run.app/unauth/login"
const Login = () => {
  const [loggedinUsername, setLoggedinUsername] = useState('')
  const [loggedinEmail, setLoggedinEmail] = useState('')
  const [loggedinRole, setLoggedinRole] = useState('')
  const [access_token, setLoggedInAccessToken] = useState('')
  const [id_token, setLoggedInIdToken] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleInputChange = (event) => {
    const { name, value } = event.target
    if (name === 'email') setEmail(value)
    if (name === 'password') setPassword(value)
  }

  // Run this code when the login page loads
  window.addEventListener('load', async () => {
    // Check if the user is already logged in
    // If they are, redirect them to the home page
    setLoading(true)
    try{
      if (localStorage.getItem('user') === null) {
        // User is not logged in
        // Do nothing
        // console.log('User is not logged in')
        setLoading(false)
      }
      else{
        const user = JSON.parse(localStorage.getItem('user'))
        // Check if user obj has 4 keys and they are not null or empty
        if ((user.username !== '' && user.email !== '' && user.accessId !== '' && user.tokenId !== '')) {
          // console.log(user)
          const tokenId = user.tokenId
          // console.log(tokenId)
          const response = await axiosJSON.post(cloudFunctionURL + '/checkIfUserAlreadyAuthenticated', JSON.stringify({ "tokenId":tokenId }))
          const data = await response.data
          if (data.status === 200) {
            // User is already logged in
            // Redirect them to the home page
            // const username = user.username
            // const email = user.email
            // const access_token = user.accessId
            // send them to second factor authentication page.
            // setAuthContext({username, email, accessId: access_token, tokenId: tokenId});
            navigate('/home')
          }
        }
      }
    }
    catch (error) {
      // alert(error.response.data.message)
      console.error(error)
    }
    // Check if the 'access_token' parameter is present in the URL
    // const urlParams = new URLSearchParams(window.location.search);
    const urlHash = window.location.hash;
    const urlParams = new URLSearchParams(urlHash.substring(1));  
    if (urlParams.has('access_token')) {
      // Get the value of the 'access_token' parameter
      // Get username and email too
      const temp_access_token = urlParams.get('access_token');
      const temp_id_token = urlParams.get('id_token');
      try{
        const response = await axiosJSON.post(cloudFunctionURL + '/getUserDetails', JSON.stringify({ "accessToken":temp_access_token }))
        const data = await response.data
        alert('Login successful')
        if (data.status === 200) {
          setLoggedInAccessToken(temp_access_token);
          setLoggedInIdToken(temp_id_token);
          setLoggedinUsername(data.username)
          setLoggedinEmail(data.email)
          setLoggedinRole(data.role)
        }
      }
      catch (error) {
        alert(error.response.data.message)
        console.error(error)
      }
      // localStorage.setItem("access_token",access_token)
      // localStorage.setItem("id_token", id_token)
    } 
  });

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const response = await axiosJSON.post(lambdaApiGatewayURL + '/login', JSON.stringify({ email, password }))
      const data = await response.data
      if (data.authenticated) {
        // User was successfully authenticated
        // You can redirect them to a protected route or update the UI
        // localStorage.setItem("access_token",data.access_token)
        // localStorage.setItem("id_token",data.id_token)
        setLoggedinUsername(data.username)
        setLoggedinEmail(data.email)
        setLoggedInAccessToken(data.access_token)
        setLoggedInIdToken(data.id_token)
        setLoggedinRole(data.role)
        alert('Login successful')
        // navigate('/unauth/validate-2FA', { state: {"username":loggedinUsername, "email":loggedinEmail, access_token, id_token} })
      } else {
        alert(data.message)
        // There was an error authenticating the user
        // You can display an error message or handle the error in another way
      }
    } catch (error) {
      if (error.response.status === 401) {
        alert('User is not authorized to login. Please verify your email first.')
        const redirectURL = "/unauth/login"
        const postURL = "/confirmemail"
        navigate('/unauth/confirm-email', { state: { "username": email, "email": email, redirectURL, postURL }})
      }
      else{
        alert(error.response.data.message)
        console.error(error)
      }
      // There was an error making the API call
      // You can display an error message or handle the error in another way
    }
  }

  useEffect(() => {
    if (loggedinUsername && loggedinEmail && loggedinRole && access_token && id_token) {
      // Both state variables have been set
      // You can navigate to the next page here
      navigate('/unauth/validate-2FA', { state: {"username":loggedinUsername, "email":loggedinEmail, access_token, id_token, "role": loggedinRole} });
    }
  },
  // eslint-disable-next-line 
  [loggedinUsername, loggedinEmail, loggedinRole, access_token, id_token]);

  return (
    loading ?
      <div className="auth-inner">      
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>

    :
      <div className="auth-inner"> 
        <form onSubmit={handleSubmit}>
          <h3>Login</h3>
          <div className="mb-3">
            <label>Username or email</label>
            <input
              type="text"
              name="email"
              className="form-control"
              placeholder="Enter email"
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
          <div className="mb-3">
            <div className="custom-control custom-checkbox">
              <input
                type="checkbox"
                className="custom-control-input"
                id="customCheck1"
                onChange={handleInputChange}
              />
              <label className="custom-control-label" htmlFor="customCheck1">
                &nbsp; Remember me
              </label>
              <p className="forgot-password text-right">
                <a href="/unauth/forgot-password">Forgot password?</a>
              </p>
            </div>
          </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
          <div className="social-login">
            <br></br>
          <p>or login with:</p>
          <button type="button" className="btn btn-link btn-floating mx-1">
            <a href={SOCIAL_SIGN_IN_URL}>
              {/* <i className="fab fa-facebook-f" style={{ color: '#3b5998' }}></i> */}
              <FontAwesomeIcon icon={['fab', 'fa-facebook-f']} style={{ color: '#3b5998' }}/>
            </a>
          </button>
          <button type="button" className="btn btn-link btn-floating mx-1">
            <a href={SOCIAL_SIGN_IN_URL}>
              {/* <i className="fab fa-google" style={{ color: '#db4437' }}></i> */}
              <FontAwesomeIcon icon={['fab', 'google']} style={{ color: '#db4437' }}/>
            </a>
          </button>
          <button type="button" className="btn btn-link btn-floating mx-1">
            <a href={SOCIAL_SIGN_IN_URL}>
              {/* <i className="fab fa-amazon" style={{ color: '#ff9900' }}></i> */}
              <FontAwesomeIcon icon={['fab', 'amazon'] }  style={{ color: '#ff9900' }}/>
            </a>
          </button>
          </div>
       </form>
      </div>
  )
}
export default Login