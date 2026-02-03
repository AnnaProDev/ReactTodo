import { useAuth } from "../contexts/AuthContext.jsx";
import Logoff from "../features/Logoff.jsx";
import Navigation from "./Navigation.jsx";
import styles from "./Header.module.css";

const Header = () => {
	const { isAuthenticated } = useAuth();

	return (
		<header className={styles.header}>
			<div className={styles.inner}>
				<div className={styles.brand}>
					<div className={styles.logoIcon}>✓</div>
					<span className={styles.logoText}>ToDo</span>
				</div>

				<div className={styles.center}>
					<Navigation />
				</div>

				<div className={styles.actions}>{isAuthenticated && <Logoff />}</div>
			</div>
		</header>
	);
};

export default Header;
