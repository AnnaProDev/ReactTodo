export const FilterInput = (filterTerm, onFilterChange) => {
	return (
		<div>
			<label htmlFor="filterInput">Search todos: </label>
			<input
				type="text"
				name="filterInput"
				id="filterInput"
				value={filterTerm}
				onChange={(e) => {
					onFilterChange(e.target.value);
				}}
				placeholder='Search by title...'
			/>
		</div>
	);
};

export default FilterInput
