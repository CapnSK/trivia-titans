import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { AuthContextProvider, ChatContextProvider } from "./contexts";
import Chat from './pages/Chat';
import Main from './pages/Main';

import Navbar from './pages/Navbar';


function App() {

	return (
		<div className="App">
			<AuthContextProvider>
				<ChatContextProvider>
					<div className="auth-wrapper">
						<div className="auth-inner">
							<Main ></Main>
						</div>
					</div>
					<Chat></Chat>
				</ChatContextProvider>
				<Navbar></Navbar>
			</AuthContextProvider>
		</div>

	);
}

export default App;
