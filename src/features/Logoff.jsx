import { useNavigate } from "react-router";
import { useAuth } from "./../contexts/AuthContext"
import controls from "../shared/styles/controls.module.css"
import clsx from "clsx";

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
			<button className={clsx(controls.btn, controls.btnSecondary)} onClick={handleLogout}>
				Logoff
			</button>
		</div>
	);
};

export default Logoff;

