// AuthContext provides global authentication state
// It stores the current user and token and exposes login/logout helpers

import { createContext, useContext, useState } from "react";

// Create authentication context
const AuthContext = createContext();

// Custom hook to safely access AuthContext
// Throws an error if used outside of AuthProvider
export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}

export function AuthProvider({ children }) {
	// Persist authentication state across page reloads
	const [email, setEmail] = useState(localStorage.getItem("auth_email") ?? "");
	const [token, setToken] = useState(localStorage.getItem("auth_token") ?? "");
	// Backend API base URL (injected via Vite environment variables)
	const baseUrl = import.meta.env.VITE_BASE_URL;

	const login = async (userEmail, password) => {
		try {
			// Send credentials to backend authentication endpoint
			const options = {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email: userEmail, password }),
				credentials: "include",
			};

			const res = await fetch(`${baseUrl}/user/logon`, options);
			const data = await res.json();

			if (res.status === 200 && data.name && data.csrfToken) {
				// Successful login: store user info and token in state and localStorage
				setEmail(data.name);
				setToken(data.csrfToken);
				localStorage.setItem("auth_email", data.name);
				localStorage.setItem("auth_token", data.csrfToken);
				return { success: true };
			} else {
				// Authentication failed: return backend-provided message if available
				return {
					success: false,
					error: `Authentication failed: ${data?.message}`,
				};
			}
		} catch (error) {
			// Network or unexpected error during login request
			return {
				success: false,
				error: "Network error during login. Error" + error.message,
			};
		}
	};
	// Clears all authentication-related state and storage
	const clearAuth = () => {
		setEmail("");
		setToken("");
		localStorage.removeItem("auth_email");
		localStorage.removeItem("auth_token");
	};

	const logout = async () => {
		// If no token exists, just clear local auth state
		if (!token) {
			clearAuth();
			return { success: true };
		}

		try {
			// Notify backend to invalidate the current session/token
			const options = {
				method: "POST",
				headers: { "X-CSRF-TOKEN": token },
				credentials: "include",
			};

			const res = await fetch(`${baseUrl}/user/logoff`, options);

			if (res.ok) {
				// Successful logout on server
				clearAuth();
				return { success: true };
			} else {
				// Backend responded with an error status
				return {
					success: false,
					error: `Logout failed: HTTP ${res.status}`,
				};
			}
		} catch (error) {
			// Network or unexpected error during logout
			return {
				success: false,
				error: `Network error during logout: ${error.message}`,
			};
		} finally {
			// Always clear local auth state to prevent stale sessions
			clearAuth();
		}
	};

	// Values exposed to the rest of the application
	const value = {
		email,
		token,
		isAuthenticated: !!token,
		login,
		logout,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
