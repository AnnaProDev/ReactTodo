const AboutPage = () => {
	return (
		<div className="card about">
			<div className="aboutHeader">
				<h1 className="title">About</h1>
				<p className="aboutDescription">
					This Todo app helps you manage tasks and stay organized.
				</p>
			</div>

			<div className="aboutSection">
				<h2 className="sectionTitle">Features</h2>
				<ul className="aboutList">
					<li className="aboutItem">Create and delete tasks</li>
					<li className="aboutItem">Mark tasks as completed</li>
					<li className="aboutItem">User authentication</li>
					<li className="aboutItem">Protected routes</li>
				</ul>
			</div>

			<div className="aboutSection">
				<h2 className="sectionTitle">Technologies</h2>
				<div className="aboutTechGrid">
					<div className="aboutTechCard">
						<div className="aboutTechTitle">React</div>
						<div className="aboutTechText">UI components and hooks</div>
					</div>
					<div className="aboutTechCard">
						<div className="aboutTechTitle">React Router</div>
						<div className="aboutTechText">Navigation and routing</div>
					</div>
					<div className="aboutTechCard">
						<div className="aboutTechTitle">Vite</div>
						<div className="aboutTechText">Fast development build tool</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AboutPage;
