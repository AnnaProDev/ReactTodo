import "./App.css";
import Logon from "./features/Logon.jsx";
import TodosPage from "./features/Todos/TodosPage.jsx";
import Header from "./shared/Header.jsx";
import { useAuth } from "./contexts/AuthContext.jsx";

function App() {

const { isAuthenticated } = useAuth();

	return (
		<div className="app">
			<div className="container">
			<Header />
			{isAuthenticated ? (
				<TodosPage/>
			) : (
				<Logon/>
			)}
			</div>
		</div>
	);
}

export default App;
