function Navbar(){
    return(
        <nav className="navbar navbar-expand-lg navbar-light fixed-top">
            <div className="container">
            <div className="navbar-center">
              <a className="nav-link" href="/unauth/signup">
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