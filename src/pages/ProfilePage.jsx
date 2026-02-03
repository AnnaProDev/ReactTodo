import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";

const ProfilePage = () => {
	const { email, token, isAuthenticated } = useAuth();
	const [todoStats, setTodoStats] = useState({
		total: 0,
		completed: 0,
		active: 0,
	});
	const [isLoading, setLoading] = useState(false);
	const [error, setError] = useState();


	const baseUrl = import.meta.env.VITE_BASE_URL;

	useEffect(() => {
		async function fetchTodoStats() {
			if (!token) return;

			try {
				setLoading(true);
				setError("");

				const options = {
					method: "GET",
					headers: { "X-CSRF-TOKEN": token },
					credentials: "include",
				};

				const response = await fetch(`${baseUrl}/tasks`, options);

				if (response.status === 401) {
					throw new Error("Unauthorized");
				}

				if (!response.ok) {
					throw new Error("Failed to fetch todos");
				}

				const todos = await response.json();

				// Calculate statistics
				const total = todos.length;
				const completed = todos.filter((todo) => todo.isCompleted).length;
				const active = total - completed;

				setTodoStats({ total, completed, active });
			} catch (err) {
				setError(`Error loading statistics: ${err.message}`);
			} finally {
				setLoading(false);
			}
		}

		fetchTodoStats();
	}, [token, baseUrl, setTodoStats]);


	const completionPercent = useMemo(() => {
		if (todoStats.total === 0) return 0;
		return Math.round((todoStats.completed / todoStats.total) * 100);
	}, [todoStats.total, todoStats.completed]);

	return (
		<div className="card">
			<div className="header">
				<div>
					<h1 className="title">Profile</h1>
					<p className="subtitle">Your info and todo statistics</p>
				</div>
			</div>

			<div className="section">
				<h2 className="sectionTitle">User</h2>
				<p>
					<span>Name: {email}</span>
				</p>
				<p>
					<span >Status: {isAuthenticated ? "Authenticated" : "Guest"}</span>
					
				</p>
			</div>

			<div className="section">
				<h2 className="sectionTitle">Todo stats</h2>
				{error && (
					<div className="errorRow">
						<div className="errorText">{error}</div>
					</div>
				)}
				{isLoading ? (
					<p>Loading ...</p>
				) : (
					<>
						<p>Total: {todoStats.total}</p>
						<p>Completed: {todoStats.completed}</p>
						<p>Active: {todoStats.active}</p>

						{todoStats.total > 0 ? (
							<p>Completion: {completionPercent}%</p>
						) : (
							<p className="subtitle">No todos yet.</p>
						)}
					</>
				)}
			</div>
		</div>
	);
};

export default ProfilePage;
