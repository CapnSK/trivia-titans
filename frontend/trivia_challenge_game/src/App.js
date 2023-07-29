import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { AuthContextProvider } from "./contexts";
import Chat from './pages/Chat';
import Main from './pages/Main';
import Navbar from './pages/Navbar';



function App() {
	return (
		<div className="App">
			<AuthContextProvider>
				<Navbar></Navbar>
				<div className="auth-wrapper">
				<Main ></Main>
				</div>
				<Chat></Chat>
			</AuthContextProvider>
		</div>
		
	);
}

export default App;
