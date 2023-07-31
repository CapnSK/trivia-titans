import React, { useState, useEffect } from "react";
import {useNavigate} from 'react-router-dom';
import { localStorageUtil } from '../../util';

function Navbar(){
  // const [link, setLink] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (localStorage.getItem("user") !== null) {
      // setLink("/home");
      setLoggedIn(true);
    }
  }, []);
  
  const logout = () => {
    localStorageUtil.removeItem("user");
    navigate("/unauth/login")
  }

  return(
    loggedIn ?
      <nav className="navbar navbar-expand-lg navbar-light">
        <div className="container">
          <div className="navbar-center">
            <button className="nav-link" onClick={() => {navigate('/home')}}>
              Trivia Challenge Game
            </button>
          </div>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <button className="nav-link" onClick={logout}>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    :
      <nav className="navbar navbar-expand-lg navbar-light">
          <div className="container">
          <div className="navbar-center">
            <button className="nav-link" onClick={() => {navigate('/unauth/signup')}}>
              Trivia Challenge Game
            </button>
          </div>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <button className="nav-link" onClick={() => {navigate('/unauth/login')}}>
                Login
              </button>
            </li>
            <li className="nav-item">
              <button className="nav-link" onClick={() => {navigate('/unauth/signup')}}>
                Sign up
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar;