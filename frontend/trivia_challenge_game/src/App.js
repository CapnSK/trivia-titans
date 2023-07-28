import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { AuthContextProvider } from "./contexts";
import Chat from './pages/Chat';
import Header from './pages/Header';
import Main from './pages/Main';
import { Routes, Route, BrowserRouter } from "react-router-dom";

import Navbar from './pages/Navbar';
import { useState } from "react";
import CreateTeam from "./pages/TeamManagement/createTeam";
import InviteTeam from "./pages/TeamManagement/inviteTeam";
import HandleRequest from "./pages/TeamManagement/handleRequest";
import webSocketClient from './lib/sockets/websockets';


function App() {
	// socket.on("connect", ()=>{
	// 	console.log("connected with websocket api of backend");
	// });
	// socket.connect();
	const URL = `${process.env.REACT_APP_WS_APIGATEWAY_URL}`;
	console.log(URL);
	try{
		webSocketClient.create({
			URL, 
			onOpen: (c) => {
				try{
					console.log("connection opened", c);
					webSocketClient.sendMessage({
						action: "sendMessage",
						data: "First web socket message sent"
					});
				} catch(e){
					console.log(e);
				}
			},
			onClose: (c) => console.log("connection closed", c) 
		});
	} catch(e){
		console.log(e);
	}



// const wsObj = new WebSocket(URL);
// wsObj.addEventListener("open", (ev) => {
// 	console.log("connectedto ws api", ev);
// });

return (
	<div className="App">
		<AuthContextProvider>
				<Navbar></Navbar>
				<div className="auth-wrapper">
					<div className="auth-inner">
						<Main ></Main>
					</div>
				</div>
				<Chat></Chat>
			</AuthContextProvider>
	</div>

);
}

export default App;
