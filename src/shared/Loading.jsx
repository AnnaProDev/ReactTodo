import styles from "./Loading.module.css";

const Loading = () => {
	return (
		<span
			className={styles.loader}
			aria-label="Loading"
		/>
	);
};

export default Loading;