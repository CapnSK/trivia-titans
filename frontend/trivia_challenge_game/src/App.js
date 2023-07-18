import "./App.css";
import Chat from './pages/Chat';
import Header from './pages/Header';
import Main from './pages/Main';

import { useState } from "react";

function App() {
	const [loggedInUserContext, loggedInUserContextSetter] = useState({});
	return (
		<div className="App">
			<Header loggedInUserContext={loggedInUserContext}></Header>
			<Main userContextSetter={loggedInUserContextSetter}></Main>
			<Chat></Chat>
			{/* {
				loggedInUserInfo ? 
				<>
					
				</> :
				<Auth userContextSetter={loggedInUserInfoSetter}></Auth>
			} */}
		</div>
	);
}

export default App;
