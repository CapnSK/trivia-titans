import "./main.css";
import { useState } from "react";
import Auth from "../Auth";
import Login from "../Auth/Login";
import RouteGuard from "../RouteGuard";
import Landing from "../Landing";


import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'

function Main() {
    console.info("Inside main component");
    return (
        <>
            <Router>
                <Routes>
                    <Route exact path="/unauth" element={<Auth />}>
                        <Route exact element={<Login/>} path="/unauth/login"/>
                        <Route path="/unauth" element={<Navigate to="unauth/login" replace />}/>
                        {/* <Route element={<SignUp/>} path="/signup" exact/>
                        <Route element={<ForgotPassword/>} path="/forgot-password" exact/>
                        <Route element={<ConfirmEmail/>} path="/confirm-email" exact/>
                         */}
                    </Route>
                    <Route path="/" element={<RouteGuard/>} exact>
                        <Route element={<Landing/>} path="/home"/>
                        <Route path="/" element={<Navigate to="/home" replace/>}/>
                    </Route>
                </Routes>
            </Router>
        </>
    );
}

export default Main;