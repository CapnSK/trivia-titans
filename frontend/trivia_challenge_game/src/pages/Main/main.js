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
import InGame from "../InGame/ingame";
import Leaderboard from "../Leaderboard";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from "../Navbar";
import CreateTeam from "../TeamManagement/createTeam";
import InviteTeam from "../TeamManagement/inviteTeam";
import HandleRequest from "../TeamManagement/handleRequest";
import ManageTeam from "../TeamManagement/manageTeam";
import CompareUsers from "../UserProfile/CompareUsers";
import ViewUserProfile from "../UserProfile/ViewUserProfile";
import StatusUsers from "../UserProfile/StatusUsers";
import Displaygames from "../JoinGame/Displaygames";
import JoinTeam from "../TeamManagement/joinTeam";

function Main() {
    return (
        <>
            {/* <Router> */}
                <Routes>
                    {/* <Navbar></Navbar> */}
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
                        <Route element={<Landing/>} path="/home">
                            <Route path="/home/in-game" element={<InGame/>}/>
                        </Route>
                        <Route path="/" element={<Navigate to="/home" replace/>}/>
                        {/* <Route path="/" element={<Navigate to="/leaderboard" replace/>}/> */}
                        <Route element={<Leaderboard/>} path="/leaderboard"/>
                        <Route element={<ViewUserProfile />} path="/userProfile" />
                        <Route element={<CompareUsers />} path="/compareStat" />
                        <Route element={<StatusUsers />} path="/userStat" />
                        <Route element={<Displaygames />} path="/joinGame" />
                        <Route element={<CreateTeam />} path="/createTeam" />
		    			<Route element={<JoinTeam />} path="/joinTeam/:teamId" />
                        <Route element={<ManageTeam/>} path="/manageTeam"/>
		     			<Route
		     				path="/invitation-request/:teamId"
		     				component={HandleRequest}
		     			/>
                    </Route>
                </Routes>
            {/* </Router> */}
        </>
    );
}

export default Main;