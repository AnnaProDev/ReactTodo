import { NavLink } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import styles from "./Navigation.module.css";

function Navigation() {
	const { isAuthenticated } = useAuth();

	const linkClass = ({ isActive }) =>
		isActive ? `${styles.link} ${styles.linkActive}` : styles.link;

	return (
		<nav className={styles.nav} aria-label="Main navigation">
			<ul className={styles.list}>
				<li>
					<NavLink to="/about" className={linkClass}>
						About
					</NavLink>
				</li>

				{isAuthenticated ? (
					<>
						<li>
							<NavLink to="/todos" className={linkClass}>
								Todos
							</NavLink>
						</li>
						<li>
							<NavLink to="/profile" className={linkClass}>
								Profile
							</NavLink>
						</li>
					</>
				) : (
					<li>
						<NavLink to="/login" className={linkClass}>
							Login
						</NavLink>
					</li>
				)}
			</ul>
		</nav>
	);
}

export default Navigation;
