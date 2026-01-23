import { useAuth } from "../contexts/AuthContext.jsx";
import Logoff from "../features/Logoff.jsx";

const Header = () => {
	const { isAuthenticated, email } = useAuth();

	return (
		<>
			<h1>ToDo List</h1>
			{isAuthenticated && 
			<> 
			<p>{email} is logged on.</p>
			<Logoff />
			</>
			
			}
		</>
	);
};

export default Header;
