import styles from "./AboutPage.module.css";
import layout from "../shared/styles/layout.module.css";
import clsx from "clsx";

const AboutPage = () => {
	return (
		<div className={clsx(layout.card, styles.about)}>
			<div className={layout.pageHead}>
				<h1 className={layout.pageTitle}>About</h1>
				<p className={layout.pageSubtitle}>
					This Todo app helps you manage tasks, track progress, and stay
					organized with a clean and simple interface.
				</p>
			</div>

			<div className={layout.section}>
				<h2 className={layout.sectionTitle}>Features</h2>
				<ul className={styles.aboutList}>
					<li className={styles.aboutItem}>Create and delete tasks</li>
					<li className={styles.aboutItem}>Mark tasks as completed</li>
					<li className={styles.aboutItem}>User authentication</li>
					<li className={styles.aboutItem}>Protected routes</li>
				</ul>
			</div>

			<div className={layout.section}>
				<h2 className={layout.sectionTitle}>Technologies</h2>
				<div className={styles.aboutTechGrid}>
					<div className={styles.aboutTechCard}>
						<div className={styles.aboutTechTitle}>React</div>
						<div className={styles.aboutTechText}>UI components and hooks</div>
					</div>
					<div className={styles.aboutTechCard}>
						<div className={styles.aboutTechTitle}>React Router</div>
						<div className={styles.aboutTechText}>Navigation and routing</div>
					</div>
					<div className={styles.aboutTechCard}>
						<div className={styles.aboutTechTitle}>Vite</div>
						<div className={styles.aboutTechText}>
							Fast development build tool
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AboutPage;
