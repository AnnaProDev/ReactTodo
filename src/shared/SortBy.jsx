import controls from "../shared/styles/controls.module.css"

const SortBy = ({
	sortBy,
	sortDirection,
	onSortByChange,
	onSortDirectionChange,
}) => {
	return (
		<div className="filters">
			<div>
				<label className={controls.label} htmlFor="sortBy">
					Sort by
				</label>
				<select
					name="sortBy"
					id="sortBy"
					value={sortBy}
					onChange={(event) => onSortByChange(event.target.value)}
					className={controls.select} 
				>
					<option value="creationDate">Creation Date </option>
					<option value="title">Title</option>
				</select>
			</div>

			<div>
				<label className={controls.label}  htmlFor="order">
					Order
				</label>
				<select
					name="order"
					id="order"
					value={sortDirection}
					onChange={(event) => onSortDirectionChange(event.target.value)}
					className={controls.select} 
				>
					<option value="desc">Descending</option>
					<option value="asc">Ascending</option>
				</select>
			</div>
		</div>
	);
};

export default SortBy;
