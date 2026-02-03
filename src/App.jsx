import { Routes, Route } from "react-router";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";
import TodosPage from "./pages/TodosPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";
import RequireAuth from "./components/RequireAuth";
import Header from "./shared/Header";
import layout from "./shared/styles/layout.module.css";


function App() {
	return (
		<div className={layout.app}>
			<div className={layout.container}>
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
			</div>
		</div>
	);
}

export default App;
