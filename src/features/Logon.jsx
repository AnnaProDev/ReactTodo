import { useState } from "react";
import { useAuth } from "./../contexts/AuthContext";

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
		<div className="auth_form">
			<div>
				<label className="label" tmlFor="email">
					Email:{" "}
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
					className="input"
				/>
			</div>
			<div className='errorText'>{formError}</div>
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
};

export default Logon;
