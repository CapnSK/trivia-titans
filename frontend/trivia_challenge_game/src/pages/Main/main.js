import "./main.css";
import { useState } from "react";
import Auth from "../Auth";


import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'

function Main({ userContextSetter }) {
    const [loggedInUserContext, loggedInUserContextSetter] = useState({});
    
    return (
        <>
            <Router>
                <Route exact path="/" element={<Auth />} />

            </Router>
        </>
    );
}

export default Main;