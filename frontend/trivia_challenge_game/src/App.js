import "./App.css";
import { AuthContextProvider } from "./contexts";
import Chat from './pages/Chat';
import Header from './pages/Header';
import Main from './pages/Main';

import { useState } from "react";

function App() {
	const [loggedInUserContext, loggedInUserContextSetter] = useState({});
	return (
		<div className="App">
			<AuthContextProvider>
				<Header loggedInUserContext={loggedInUserContext}></Header>
				<Main userContextSetter={loggedInUserContextSetter}></Main>
				<Chat></Chat>
			</AuthContextProvider>
		</div>
	);
}

export default App;
