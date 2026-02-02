<<<<<<< HEAD
import "./App.css";
import { Routes, Route } from "react-router";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";
import TodosPage from "./pages/TodosPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";
import RequireAuth from "./components/RequireAuth";
import Header from "./shared/Header";
=======
import layout from "./shared/styles/layout.module.css";
import Logon from "./features/Logon.jsx";
import TodosPage from "./features/Todos/TodosPage.jsx";
import Header from "./shared/Header.jsx";
import { useAuth } from "./contexts/AuthContext.jsx";
>>>>>>> 7a6b18f (w12: css modules + loading + layout refactor)

function App() {
	return (
<<<<<<< HEAD
		<div className="app">
			<div className="container">
				<Header />
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/about" element={<AboutPage />} />
					<Route path="/login" element={<LoginPage />} />
					<Route
						path="/todos"
						element={
							<RequireAuth>
								<TodosPage />
							</RequireAuth>
						}
					/>
					<Route
						path="/profile"
						element={
							<RequireAuth>
								<ProfilePage />
							</RequireAuth>
						}
					/>
					<Route path="*" element={<NotFoundPage />} />
				</Routes>
=======
		<div className={layout.app}>
			<div className={layout.container}>
			<Header />
			{isAuthenticated ? (
				<TodosPage/>
			) : (
				<Logon/>
			)}
>>>>>>> 7a6b18f (w12: css modules + loading + layout refactor)
			</div>
		</div>
	);
}

export default App;
