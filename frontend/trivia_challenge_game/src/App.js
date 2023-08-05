import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { AuthContextProvider, ChatContextProvider, InGameContextProvider } from "./contexts";
import Chat from './pages/Chat';
import Main from './pages/Main';
import Navbar from './pages/Navbar';
import CreateTeam from './pages/TeamManagement/createTeam';
import InviteTeam from './pages/TeamManagement/inviteTeam';
import HandleRequest from "./pages/TeamManagement/handleRequest";
import { BrowserRouter as Router} from 'react-router-dom'


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

		<Router>
		 <div className="App">
		
			<AuthContextProvider>
				<ChatContextProvider>
					<InGameContextProvider>
						<Navbar></Navbar>
						<div className="auth-wrapper">
						<Main ></Main>
						</div>
						<Chat></Chat>
					</InGameContextProvider>
				</ChatContextProvider>
			</AuthContextProvider>
		</div>
		</Router>

	);
}

export default App;
