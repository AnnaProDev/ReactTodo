import { Link } from "react-router";

function NotFoundPage() {
	return (
		<div className="card notFound">
			<div className="notFoundHeader">
				<h1 className="title">404</h1>
				<p className="subtitle">
					Sorry, the page you are looking for does not exist.
				</p>
			</div>

			<div className="notFoundActions">
				<Link to="/" className="btn">
					Home
				</Link>

				<Link to="/todos" className="btn btn--secondary">
					Todos
				</Link>

				<Link to="/about" className="btn btn--ghost">
					About
				</Link>
			</div>
		</div>
	);
}

export default NotFoundPage