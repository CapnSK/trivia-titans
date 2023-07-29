import "./main.css";
import Auth from "../Auth";
import Login from "../Auth/Login";
import RouteGuard from "../RouteGuard";
import Landing from "../Landing";
import SignUp from "../Auth/SignUp";
import ConfirmEmail from "../Auth/ConfirmEmail";
import ForgotPassword from "../Auth/ForgotPassword";
import ResetPassword from "../Auth/ResetPassword";
import SecondFactorAuthentication from "../Auth/SecondFactorAuthentication";
import Leaderboard from "../Leaderboard";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'

function Main() {
    return (
        <>
            <Router>
                <Routes>
                    <Route exact path="/unauth" element={<Auth />}>
                        <Route exact element={<Login/>} path="/unauth/login"/>
                        <Route path="/unauth" element={<Navigate to="/unauth/login" replace />}/>
                        <Route exact element={<SignUp/>} path="/unauth/signup"/>
                        <Route element={<ForgotPassword/>} path="/unauth/forgot-password" exact/>
                        <Route element={<ResetPassword/>} path="/unauth/reset-password" exact/>
                        <Route element={<ConfirmEmail/>} path="/unauth/confirm-email" exact/>
                        <Route element={<SecondFactorAuthentication/>} path="/unauth/validate-2FA" exact/>
                    </Route>
                    <Route path="/" element={<RouteGuard/>} exact>
                        <Route element={<Landing/>} path="/home"/>
                        <Route path="/" element={<Navigate to="/leaderboard" replace/>}/>
                        <Route element={<Leaderboard/>} path="/leaderboard"/>
                    </Route>
                </Routes>
            </Router>
        </>
    );
}

export default Main;