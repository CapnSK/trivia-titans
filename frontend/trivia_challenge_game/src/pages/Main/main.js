import "./main.css";
import { useState } from "react";
import Auth from "../Auth";
import Login from "../Auth/Login";
import RouteGuard from "../RouteGuard";
import Landing from "../Landing";


import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'

function Main({ userContextSetter }) {
    const [loggedInUserContext, loggedInUserContextSetter] = useState({});
    console.info("Inside main component");
    return (
        <>
            <Router>
                <Routes>
                    <Route exact path="/" element={<Auth />}>
                        <Route element={<Login/>} path="/login" exact/>
                        <Route path="/" element={<Navigate to="/login" replace />}/>
                        {/* <Route element={<SignUp/>} path="/signup" exact/>
                        <Route element={<ForgotPassword/>} path="/forgot-password" exact/>
                        <Route element={<ConfirmEmail/>} path="/confirm-email" exact/>
                         */}
                    </Route>
                    <Route path="/auth" element={<RouteGuard/>} exact>
                        <Route element={<Landing/>} path="/auth/home"/>
                        <Route path="/auth" element={<Navigate to="/auth/home" replace/>}/>
                    </Route>
                </Routes>
            </Router>
        </>
    );
}

export default Main;