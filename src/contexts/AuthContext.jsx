import { createContext, useContext, useState } from "react";

// Create the context
const AuthContext = createContext();

// Custom hook with error checking
export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}

export function AuthProvider({ children }) {
	// State for authentication
	const [email, setEmail] = useState(localStorage.getItem("auth_email") ?? "");
	const [token, setToken] = useState(localStorage.getItem("auth_token") ?? "");

	const baseUrl = import.meta.env.VITE_BASE_URL;

	const login = async (userEmail, password) => {
		try {
			const options = {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email: userEmail, password }),
				credentials: "include",
			};

			const res = await fetch(`${baseUrl}/user/logon`, options);
			const data = await res.json();

			if (res.status === 200 && data.name && data.csrfToken) {
				// Success: Update state
				setEmail(data.name);
				setToken(data.csrfToken);
				localStorage.setItem("auth_email", data.name);
				localStorage.setItem("auth_token", data.csrfToken);
				return { success: true };
			} else {
				// Failure: Return error
				return {
					success: false,
					error: `Authentication failed: ${data?.message}`,
				};
			}
		} catch (error) {
			return {
				success: false,
				error: "Network error during login. Error" + error.message,
			};
		}
	};

	const clearAuth = () => {
		setEmail("");
		setToken("");
		localStorage.removeItem("auth_email");
		localStorage.removeItem("auth_token");
	};

	const logout = async () => {
		if (!token) {
			clearAuth();
			return { success: true };
		}

		try {
			const options = {
				method: "POST",
				headers: { "X-CSRF-TOKEN": token },
				credentials: "include",
			};

			const res = await fetch(`${baseUrl}/user/logoff`, options);

			if (res.ok) {
				clearAuth();
				return { success: true };
			} else {
				// Failure: Return error
				return {
					success: false,
					error: `Logout failed: HTTP ${res.status}`,
				};
			}
		} catch (error) {
			return {
				success: false,
				error: `Network error during logout: ${error.message}`,
			};
		} finally {
			clearAuth();
		}
	};

	// Context value object
	const value = {
		email,
		token,
		isAuthenticated: !!token,
		login,
		logout,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
