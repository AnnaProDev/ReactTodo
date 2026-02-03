import { useSearchParams } from "react-router";
import controls from "../shared/styles/controls.module.css"

function StatusFilter() {
	const [searchParams, setSearchParams] = useSearchParams();
	const currentStatus = searchParams.get("status") || "all";

	const handleStatusChange = (status) => {
		if (status === "all") {
			// Remove status param for 'all' to keep URL clean
			searchParams.delete("status");
		} else {
			searchParams.set("status", status);
		}
		setSearchParams(searchParams);
	};

	return (
		<div>
			<label htmlFor="statusFilter" className={controls.label}>Show:</label>
			<select
				id="statusFilter"
				value={currentStatus}
				onChange={(e) => handleStatusChange(e.target.value)}
				className={controls.select}
			>
				<option value="all">All Todos</option>
				<option value="active">Active Todos</option>
				<option value="completed">Completed Todos</option>
			</select>
		</div>
	);
}

export default StatusFilter;
