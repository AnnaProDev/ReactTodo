import { useAuth } from "../contexts/AuthContext.jsx";
import Logoff from "../features/Logoff.jsx";

const Header = () => {
	const { isAuthenticated } = useAuth();

	return (
		<div className="header">
			<h1 className="title">ToDo List</h1>
			{isAuthenticated && <Logoff />}
		</div>
	);
};

export default Header;
