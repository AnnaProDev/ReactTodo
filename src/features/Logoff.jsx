<<<<<<< HEAD
import { useAuth } from "./../contexts/AuthContext";
import { useNavigate } from "react-router";
=======
import { useAuth } from "./../contexts/AuthContext"
import controls from "../shared/styles/controls.module.css"
import clsx from "clsx";
>>>>>>> 7a6b18f (w12: css modules + loading + layout refactor)

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

<<<<<<< HEAD
export default Logoff;
=======
  return (
	 <div>
		<button className={clsx(controls.btn, controls.btnSecondary)} onClick={handleLogout}>Logoff</button>
	 </div>
  )
}

export default Logoff
>>>>>>> 7a6b18f (w12: css modules + loading + layout refactor)
