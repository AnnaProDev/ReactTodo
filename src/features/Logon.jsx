import { useState } from "react";

const Logon = ({ onSetEmail, onSetToken }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [authError, setAuthError] = useState("");
	const [isLoggingOn, setIsLoggingOn] = useState(false);


	const baseUrl = import.meta.env.VITE_BASE_URL;

	const handleSubmit = async (event) => {

		event.preventDefault();
		setIsLoggingOn(true)

		try {
			const response = await fetch(`${baseUrl}/user/logon`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({ email, password }),
			});
			const data = await response.json();
			if (response.status === 200 && data.name && data.csrfToken) {
				onSetEmail(data.name);
				onSetToken(data.csrfToken);
			} else {
				setAuthError(`Authentication failed: ${data?.message}`);
			}
		} catch (error) {
			setAuthError(`Error: ${error.name} | ${error.message}`);
		} finally {
			setIsLoggingOn(false);
		}
	};

	return (
		<div className="auth_form">
			<div>
				<label htmlFor="email">Email: </label>
				<input
					required
					type="email"
					value={email}
					onChange={(event) => {
						setEmail(event.target.value);
					}}
				/>
			</div>
			<div>
				<label htmlFor="password">Password: </label>
				<input
					required
					type="password"
					name="password"
					id="password"
					value={password}
					onChange={(event) => {
						setPassword(event.target.value);
					}}
				/>
			</div>
			<div style={{ color: "#de1818" }}>{authError}</div>
			<button type="submit" onClick={handleSubmit} disabled={isLoggingOn}>
				{isLoggingOn ? "Logging in..." : "Log in"}
			</button>
		</div>
	);
};

export default Logon;
