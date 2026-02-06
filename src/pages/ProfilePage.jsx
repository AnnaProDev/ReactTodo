import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import layout from "../shared/styles/layout.module.css";
import styles from "./ProfilePage.module.css";
import Loading from "../shared/Loading.jsx";
import clsx from "clsx";

const ProfilePage = () => {
	const { email, token, isAuthenticated } = useAuth();

	const [todos, setTodos] = useState([]);
	const total = todos.length;
	const completed = todos.filter((todo) => todo.isCompleted).length;
	const active = total - completed;

	const [isLoading, setLoading] = useState(false);
	const [error, setError] = useState();

	const baseUrl = import.meta.env.VITE_BASE_URL;

	useEffect(() => {
		async function fetchTodoStats() {
			if (!token) return;

			try {
				setLoading(true);
				setError("");

				const options = {
					method: "GET",
					headers: { "X-CSRF-TOKEN": token },
					credentials: "include",
				};

				const response = await fetch(`/tasks`, options);

				if (response.status === 401) {
					throw new Error("Unauthorized");
				}

				if (!response.ok) {
					throw new Error("Failed to fetch todos");
				}

				const todos = await response.json();

				setTodos(todos);
			} catch (err) {
				setError(`Error loading statistics: ${err.message}`);
			} finally {
				setLoading(false);
			}
		}

		fetchTodoStats();
	}, [token, baseUrl, setTodos]);

	const completionPercent = useMemo(() => {
		if (total === 0) return 0;
		return Math.round((completed / total) * 100);
	}, [total, completed]);

	return (
		<div className={clsx(layout.card, styles.profile)}>

				<div className={layout.pageHead}>
					<h1 className={layout.pageTitle}>Profile</h1>
					<p className={layout.pageSubtitle}>Your info and todo statistics</p>
				</div>


			<div className={layout.section}>
				
				<h2 className={layout.sectionTitle}>User</h2>

				<div className={styles.kvList}>
					<div className={styles.kvRow}>
						<span className={styles.kvKey}>Name</span>
						<span className={styles.badge}>{email}</span>
					</div>

					<div className={styles.kvRow}>
						<span className={styles.kvKey}>Status</span>
						<span
							className={
								isAuthenticated ? styles.badgeSuccess : styles.badgeMuted
							}
						>
							{isAuthenticated ? "Authenticated" : "Guest"}
						</span>
					</div>
				</div>
			</div>

			<div className={layout.section}>
				<h2 className={layout.sectionTitle}>Todo stats</h2>

				{error && (
					<div className={styles.errorRow}>
						<div className={styles.errorText}>{error}</div>
					</div>
				)}

				{isLoading ? (
					<div className={styles.loadingRow}>
						<Loading />
					</div>
				) : (
					<>
						<div className={styles.statsGrid}>
							<div className={styles.statCard}>
								<div className={styles.statLabel}>Total</div>
								<div className={styles.statValue}>{total}</div>
							</div>

							<div className={styles.statCard}>
								<div className={styles.statLabel}>Completed</div>
								<div className={styles.statValue}>{completed}</div>
							</div>

							<div className={styles.statCard}>
								<div className={styles.statLabel}>Active</div>
								<div className={styles.statValue}>{active}</div>
							</div>
						</div>

						{total > 0 ? (
							<div className={styles.progressBlock}>
								<div className={styles.progressTop}>
									<span className={styles.progressLabel}>Completion</span>
									<span className={styles.progressValue}>
										{completionPercent}%
									</span>
								</div>

								<div className={styles.progressTrack}>
									<div
										className={styles.progressFill}
										style={{ width: `${completionPercent}%` }}
									/>
								</div>
							</div>
						) : (
							<p className={layout.subtitle}>No todos yet.</p>
						)}
					</>
				)}
			</div>
		</div>
	);
};

export default ProfilePage;
