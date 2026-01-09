import { useState } from "react";
import "./App.css";
import Logon from "./features/Logon.jsx";
import TodosPage from "./features/Todos/TodosPage.jsx";
import Header from "./shared/Header.jsx";

function App() {
	const [email, setEmail] = useState("");
	const [token, setToken] = useState("");


	return (
		<div>
			<Header email={email}/>
			{token ? (
				<TodosPage token={token} />
			) : (
				<Logon onSetEmail={setEmail} onSetToken={setToken} />
			)}
		</div>
	);
}

export default App;
