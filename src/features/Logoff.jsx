import { useAuth } from "./../contexts/AuthContext";
import { useNavigate } from "react-router";

const Logoff = () => {
	const { logout } = useAuth();
	const navigate = useNavigate();

	const handleLogout = async () => {
		const result = await logout();

		if (result.success) {
			navigate("/login");
		} else {
			console.error(result.error);
		}
	};

	return (
		<div>
			<button className="btn btn--secondary" onClick={handleLogout}>
				Logoff
			</button>
		</div>
	);
};

export default Logoff;
