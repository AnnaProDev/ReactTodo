import { NavLink } from "react-router";
import { useAuth } from "../contexts/AuthContext";

function Navigation() {
	const { isAuthenticated } = useAuth();

	function navLinkStyle({ isActive }) {
		return {
			fontWeight: isActive ? "bold" : "normal",
			textDecoration: isActive ? "underline" : "none",
		};
	}

	return (
		<nav>
			<ul className="listStyle">
				<li>
					<NavLink to="/about" style={navLinkStyle}>
						About
					</NavLink>
				</li>

				{isAuthenticated ? (
					<>
						<li>
							<NavLink to="/todos" style={navLinkStyle}>
								Todos
							</NavLink>
						</li>
						<li>
							<NavLink to="/profile" style={navLinkStyle}>
								Profile
							</NavLink>
						</li>
					</>
				) : (
					<li>
						<NavLink to="/login" style={navLinkStyle}>
							Login
						</NavLink>
					</li>
				)}
			</ul>
		</nav>
	);
}

export default Navigation;
