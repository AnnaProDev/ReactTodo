import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import controls from "../shared/styles/controls.module.css";
import styles from "./LoginPage.module.css";
import clsx from "clsx";

import { loginSchema, LIMITS } from "../utils/todoValidation";
import { sanitizeText } from "../utils/sanitize";

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

		setFormError("");

		try {
			const validated = loginSchema.parse({ email, password });

			const safeEmail = sanitizeText(validated.email).toLowerCase();
			const safePassword = sanitizeText(validated.password);

			const result = await login(safeEmail, safePassword);

			if (!result.success) {
				setFormError(result.error || "Login failed");
			}
		} catch (error) {
			// Handle validation errors safely
			if (error?.errors) {
				const message = error.errors.map((err) => err.message).join(" ");
				setFormError(message);
				return;
			}
			// Unknown error
			setFormError("Something went wrong. Please try again.");
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
							id="email"
							name="email"
							maxLength={LIMITS.email}
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
							maxLength={LIMITS.password}
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
