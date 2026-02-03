import controls from "../shared/styles/controls.module.css"

export const FilterInput = ({filterTerm, onFilterChange}) => {
	return (
		<div>
			<label className={controls.label} htmlFor="filterInput">Search todos: </label>
			<input
				type="text"
				name="filterInput"
				id="filterInput"
				value={filterTerm}
				onChange={(e) => {
					onFilterChange(e.target.value);
				}}
				placeholder='Search by title...'
				className={controls.input}
			/>
		</div>
	);
};

export default FilterInput
