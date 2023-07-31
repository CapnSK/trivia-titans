import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { AuthContextProvider, ChatContextProvider } from "./contexts";
import Chat from './pages/Chat';
import Main from './pages/Main';
import Navbar from './pages/Navbar';


function App() {

	return (

		// <div className="App">
		// 	<BrowserRouter>
		// 		<Routes>
		// 			<Route element={<CreateTeam />} path="/createTeam" />
		// 			<Route element={<InviteTeam />} path="/inviteTeam/:teamId" />
		// 			<Route
		// 				path="/invitation-request/:teamId"
		// 				component={HandleRequest}
		// 			/>
		// 		</Routes>
		// 	</BrowserRouter>
		// </div>

		
		 <div className="App">
			<AuthContextProvider>
				<ChatContextProvider>
					<Navbar></Navbar>
					<div className="auth-wrapper">
					<Main ></Main>
					</div>
					<Chat></Chat>
				</ChatContextProvider>
			</AuthContextProvider>
		</div>

	);
}

export default App;
