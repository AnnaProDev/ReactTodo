import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import controls from "../shared/styles/controls.module.css";
import styles from "./LoginPage.module.css";
import clsx from "clsx";

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

	return (
		<div className={styles.page}>
			<div className={styles.card}>
				<div className={styles.header}>
					<h1 className={styles.title}>Log in</h1>
					<p className={styles.subtitle}>Use your account to access todos</p>
				</div>

				<div className={styles.form}>
					<div className={styles.field}>
						<label className={controls.label} htmlFor="email">
							Email
						</label>
						<input
							required
							type="email"
							value={email}
							onChange={(event) => {
								setEmail(event.target.value);
							}}
							className={controls.input}
						/>
					</div>

					<div className={styles.field}>
						<label className={controls.label} htmlFor="password">
							Password
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
							className={controls.input}
						/>
					</div>

					{formError && <div className={styles.error}>{formError}</div>}

					<button
						className={clsx(controls.btn, styles.btnPrimary)}
						type="submit"
						onClick={handleSubmit}
						disabled={isAuthenticated}
					>
						{isAuthenticated ? "Logging in..." : "Log in"}
					</button>
				</div>
			</div>
		</div>
	);
}

export default LoginPage;
