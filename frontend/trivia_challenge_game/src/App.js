import "./App.css";
import Auth from './pages/Auth';
import Chat from './pages/Chat';
import Header from './pages/Header';
import Main from './pages/Main';

import { useState } from "react";

function App() {
	const [loggedInUserInfo, loggedInUserInfoSetter] = useState({});
	return (
		<div className="App">
			{
				loggedInUserInfo ? 
				<>
					<Header></Header>
					<Main></Main>
					<Chat></Chat>
				</> :
				<Auth userContextSetter={loggedInUserInfoSetter}></Auth>
			}
		</div>
	);
}

export default App;
