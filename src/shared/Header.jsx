import { useAuth } from "../contexts/AuthContext.jsx";
import Logoff from "../features/Logoff.jsx";

const Header = () => {
	const { isAuthenticated, email } = useAuth();

	return (
		<div className="header">
			<h1 className="title">ToDo List</h1>
			{isAuthenticated && 
			<> 
			<p className="subtitle">{email} is logged on.</p>
			<Logoff />
			</>
			
			}
		</div>
	);
};

export default Header;
