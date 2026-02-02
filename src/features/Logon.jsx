import { useState } from "react";
import { useAuth } from "./../contexts/AuthContext";
<<<<<<< HEAD
=======
import styles from "./Auth.module.css";
import controls from "../shared/styles/controls.module.css";
>>>>>>> 7a6b18f (w12: css modules + loading + layout refactor)

const Logon = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [formError, setFormError] = useState("");

	const { login, isAuthenticated } = useAuth();

	const handleSubmit = async (event) => {
		event.preventDefault();
		setFormError("");

		const result = await login(email, password);

		if (!result.success) {
			setFormError(result.error);
		}
	};

	return (
<<<<<<< HEAD
		<div className="auth_form">
			<div>
				<label className="label" htmlFor="email">
=======
		<div className={styles.authForm}>
			<div className={styles.field}>
				<label className={controls.label} htmlFor="email">
>>>>>>> 7a6b18f (w12: css modules + loading + layout refactor)
					Email:{" "}
				</label>
				<input
					required
					type="email"
					id="email"
					value={email}
					onChange={(event) => {
						setEmail(event.target.value);
					}}
					className={controls.input}
				/>
			</div>
<<<<<<< HEAD
			<div>
				<label className="label" htmlFor="password">
=======
			<div className={styles.field}>
				<label className={controls.label} htmlFor="password">
>>>>>>> 7a6b18f (w12: css modules + loading + layout refactor)
					Password:{" "}
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
<<<<<<< HEAD
			<div className='errorText'>{formError}</div>
			<button
				className="btn"
=======
			{formError && <div className={styles.error}>{formError}</div>}
			<button
				className={controls.btn}
>>>>>>> 7a6b18f (w12: css modules + loading + layout refactor)
				type="submit"
				onClick={handleSubmit}
				disabled={isAuthenticated}
			>
				{isAuthenticated ? "Logging in..." : "Log in"}
			</button>
		</div>
	);
};

export default Logon;
