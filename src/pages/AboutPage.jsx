import styles from "./AboutPage.module.css";
import layout from "../shared/styles/layout.module.css"
import clsx from "clsx";

const AboutPage = () => {
	return (
		<div className={clsx(layout.card, styles.about)}>
			<div className={styles.aboutHeader}>
				<h1 className="title">About</h1>
				<p className={styles.aboutDescription}>
					This Todo app helps you manage tasks and stay organized.
				</p>
			</div>

			<div className={styles.aboutSection}>
				<h2 className={styles.sectionTitle}>Features</h2>
				<ul className={styles.aboutList}>
					<li className={styles.aboutItem}>Create and delete tasks</li>
					<li className={styles.aboutItem}>Mark tasks as completed</li>
					<li className={styles.aboutItem}>User authentication</li>
					<li className={styles.aboutItem}>Protected routes</li>
				</ul>
			</div>

			<div className={styles.aboutSection}>
				<h2 className={styles.sectionTitle}>Technologies</h2>
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
						<div className={styles.aboutTechText}>Fast development build tool</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AboutPage;
