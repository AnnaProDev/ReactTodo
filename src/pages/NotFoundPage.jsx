import { Link } from "react-router";
import layout from "../shared/styles/layout.module.css"
import controls from "../shared/styles/controls.module.css"
import styles from "./NotFoundPage.module.css"
import clsx from "clsx";

function NotFoundPage() {
	return (
		<div className={clsx(layout.card, styles.noFound)}>
			<div className={styles.notFoundHeader}>
				<h1 className={styles.title}>404</h1>
				<p className={styles.subtitle}>
					Sorry, the page you are looking for does not exist.
				</p>
			</div>

			<div className={styles.notFoundActions}>
				<Link to="/" className={clsx(styles.notFoundActionsBtn, controls.btn)}>
					Home
				</Link>

				<Link to="/todos" className={clsx(styles.notFoundActionsBtn, controls.btn, controls.btnSecondary)}>
					Todos
				</Link>

				<Link to="/about" className={clsx(styles.notFoundActionsBtn, controls.btn, controls.btnGhost)}>
					About
				</Link>
			</div>
		</div>
	);
}

export default NotFoundPage