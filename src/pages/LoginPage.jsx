import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { useAuth } from "../contexts/AuthContext";

function LoginPage() {
	const { login, isAuthenticated } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [formError, setFormError] = useState("");

	// Get intended destination from location state, default to /todos
	const from = location.state?.from?.pathname || "/todos";

	// Redirect if already authenticated
	useEffect(() => {
		if (isAuthenticated) {
			navigate(from, { replace: true });
		}
	}, [isAuthenticated, navigate, from]);

	// Handle login form submission
	async function handleSubmit(e) {
		e.preventDefault();
		// ... existing login logic
		setFormError("");
		const result = await login(email, password);

		if (!result.success) {
			setFormError(result.error || "Login failed");
		}

		if (result.success) {
			// useEffect will handle redirect
		
		}
	}

	// ... rest of component with form JSX

	return (
		<div className="auth_form">
			<div>
				<label className="label" htmlFor="email">
					Email:
				</label>
				<input
					required
					type="email"
					value={email}
					onChange={(event) => {
						setEmail(event.target.value);
					}}
					className="input"
				/>
			</div>
			<div>
				<label className="label" htmlFor="password">
					Password:
				</label>
				<input
					required
					type="password"
					name="password"
					id="password"
					value={password}
					onChange={(event) => {
						setPassword(event.target.value);
					}}
					className="input"
				/>
			</div>
			<div className="errorText">{formError}</div>
			<button
				className="btn"
				type="submit"
				onClick={handleSubmit}
				disabled={isAuthenticated}
			>
				{isAuthenticated ? "Logging in..." : "Log in"}
			</button>
		</div>
	);
}

export default LoginPage;
