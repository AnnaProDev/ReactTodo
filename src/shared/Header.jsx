import { useAuth } from "../contexts/AuthContext.jsx";
import Logoff from "../features/Logoff.jsx";
<<<<<<< HEAD
import Navigation from "./Navigation.jsx";
=======
import styles from "./Header.module.css"
>>>>>>> 7a6b18f (w12: css modules + loading + layout refactor)

const Header = () => {
	const { isAuthenticated } = useAuth();

	return (
<<<<<<< HEAD
		<div className="header">
			<h1 className="title">ToDo List</h1>
			<Navigation />
			{isAuthenticated && <Logoff />}
=======
		<div className={styles.header}>
			<h1 className={styles.title}>ToDo List</h1>
			{isAuthenticated && 
			<> 
			<p className={styles.subtitle}>{email} is logged on.</p>
			<Logoff />
			</>
			}
>>>>>>> 7a6b18f (w12: css modules + loading + layout refactor)
		</div>
	);
};

export default Header;
