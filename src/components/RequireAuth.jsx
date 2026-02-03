import { useLocation, useNavigate } from "react-router"
import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

function RequireAuth({ children }) {
	const { isAuthenticated } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		if (!isAuthenticated) {
			navigate("/login", {
				replace: true,
				state: { from: location },
			});
		}
	}, [isAuthenticated, navigate, location]);

	if (!isAuthenticated) {
		return <p className="subtitle">Redirecting to login…</p>;
	}

	return children;
}

export default RequireAuth;
