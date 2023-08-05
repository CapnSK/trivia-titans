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
import QuestionForm from "../question";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'
import QuestionList from "../question/questionList";
import InGame from "../InGame/ingame";
import Leaderboard from "../Leaderboard";
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
import UserProfile from "../UserProfile/UserProfile";
import TeamAffiliations from "../UserProfile/TeamAffiliations";
import TriviaGame from "../Game/triviagame";
import GameTable from "../Game/triviagameList";

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
                        
                        
                        <Route path="/unauth/home/in-game" element={<InGame/>}/>
                    </Route>
                    <Route path="/" element={<RouteGuard/>} exact>
                        <Route element={<Landing/>} path="/home">
                            {/* <Route path="/in-game" element={<InGame/>}/> */}
                        </Route>
                        <Route path="/" element={<Navigate to="/home" replace/>}/>
                        <Route path="/in-game" element={<InGame/>}/>
                        {/* <Route path="/" element={<Navigate to="/leaderboard" replace/>}/> */}
                        <Route element={<Leaderboard/>} path="/leaderboard"/>
                        <Route element={<ViewUserProfile />} path="/userProfile" />
                        <Route element={<UserProfile />} path="/edituserProfile" />
                        <Route element={<CompareUsers />} path="/compareStat" />
                        <Route element={<StatusUsers />} path="/userStat" />
                        <Route element={<Displaygames />} path="/joinGame" />
                        <Route element={<TeamAffiliations />} path="/teamAffiliations" />
                        <Route element={<CreateTeam />} path="/createTeam" />
		    			<Route element={<JoinTeam />} path="/joinTeam/:teamId" />
                        <Route element={<ManageTeam/>} path="/manageTeam"/>
                        <Route element={<QuestionForm/>} path="/admin/question"/>
                        <Route element={<QuestionList/>} path="/admin/question/list"/>
                        <Route element={<TriviaGame/>} path="/admin/triviagame"/>
                        <Route element={<GameTable/>} path="/admin/triviagame/list"/>
                        
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