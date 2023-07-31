import React, { useState, useEffect } from "react";
import { localStorageUtil } from "../../util";

function Navbar(){
  const [link, setLink] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  
  useEffect(() => {
    if (localStorage.getItem("user") !== null) {
      setLink("/home");
      setLoggedIn(true);
    } else {
      setLink("/unauth/signup");
    }
  }, []);
  
  const logout = () => {
    // localStorageUtil.removeItem("user");
  }

  return(
    loggedIn ?
      <nav className="navbar navbar-expand-lg navbar-light fixed-top">
        <div className="container">
          <div className="navbar-center">
            <a className="nav-link" href={link}>
              Trivia Challenge Game
            </a>
          </div>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <a className="nav-link" href="/unauth/login" onClick={logout()}>
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    :
      <nav className="navbar navbar-expand-lg navbar-light">
          <div className="container">
          <div className="navbar-center">
            <a className="nav-link" href={link}>
              Trivia Challenge Game
            </a>
          </div>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <a className="nav-link" href="/unauth/login">
                Login
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/unauth/signup">
                Sign up
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar;