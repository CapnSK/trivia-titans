import "./App.css";
import Auth from './pages/Auth';
import Chat from './pages/Chat';
import Header from './pages/Header';
import Main from './pages/Main';
import { Routes, Route, BrowserRouter } from "react-router-dom";

import { useState } from "react";
import CreateTeam from "./pages/TeamManagement/createTeam";
import InviteTeam from "./pages/TeamManagement/inviteTeam";
import HandleRequest from "./pages/TeamManagement/handleRequest";

function App() {
	const [loggedInUserInfo, loggedInUserInfoSetter] = useState({});
	return (
		// <div className="App">
		// 	{
		// 		loggedInUserInfo ? 
		// 		<>
		// 			<Header></Header>
		// 			<Main></Main>
		// 			<Chat></Chat>
		// 		</> :
		// 		<Auth userContextSetter={loggedInUserInfoSetter}></Auth>
		// 	}
		// </div>

		<div className="App">
			<BrowserRouter>
				<Routes>
					<Route element={<CreateTeam />} path="/createTeam" />
					<Route element={<InviteTeam />} path="/inviteTeam" />
					<Route
						path="/invitation-request/:teamId"
						component={HandleRequest}
					/>
				</Routes>
			</BrowserRouter>
		</div>
		
	);
}

export default App;
