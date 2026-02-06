// Reducer manages all todo-related state transitions
// Centralizing logic here makes state changes predictable and testable

export const TODO_ACTIONS = {
	// Async fetch lifecycle
	FETCH_START: "FETCH_START",
	FETCH_SUCCESS: "FETCH_SUCCESS",
	FETCH_ERROR: "FETCH_ERROR",

	// Add todo operations
	ADD_TODO_START: "ADD_TODO_START",
	ADD_TODO_SUCCESS: "ADD_TODO_SUCCESS",
	ADD_TODO_ERROR: "ADD_TODO_ERROR",

	// Complete todo operations
	COMPLETE_TODO_START: "COMPLETE_TODO_START",
	COMPLETE_TODO_SUCCESS: "COMPLETE_TODO_SUCCESS",
	COMPLETE_TODO_ERROR: "COMPLETE_TODO_ERROR",

	// UPDATE todo operations
	UPDATE_TODO_START: "UPDATE_TODO_START",
	UPDATE_TODO_SUCCESS: "UPDATE_TODO_SUCCESS",
	UPDATE_TODO_ERROR: "UPDATE_TODO_ERROR",

	// DELETE todo operations
	DELETE_TODO_START: "DELETE_TODO_START",
	DELETE_TODO_SUCCESS: "DELETE_TODO_SUCCESS",
	DELETE_TODO_ERROR: "DELETE_TODO_ERROR",

	//UI operations
	SET_SORT: "SET_SORT",
	SET_FILTER: "SET_FILTER",
	CLEAR_ERROR: "CLEAR_ERROR",
	CLEAR_FILTER_ERROR: "CLEAR_FILTER_ERROR",
	RESET_FILTERS: "RESET_FILTERS",
	// Forces a refetch/useEffect re-run when remote data changes
	BUMP_DATA_VERSION: "BUMP_DATA_VERSION",
};

export const initialTodoState = {
	todoList: [],
	error: "",
	filterError: "",
	isTodoListLoading: true,
	sortBy: "creationDate",
	sortDirection: "desc",
	filterTerm: "",
	dataVersion: 0,
};

export function todoReducer(state, action) {

	switch (action.type) {
		// ---------------- FETCH ----------------
		case TODO_ACTIONS.FETCH_START:
			// Start loading and clear previous errors
			return {
				...state,
				isTodoListLoading: true,
				error: "",
				filterError: "",
			};
		case TODO_ACTIONS.FETCH_SUCCESS:
			// Replace list with fresh data from the server
			return {
				...state,
				isTodoListLoading: false,
				todoList: action.payload,
				error: "",
				filterError: "",
			};
		case TODO_ACTIONS.FETCH_ERROR: {
			// Split errors: main fetch errors vs filter/sort-related errors
			const message = action.payload?.message ?? "Unknown error";
			return {
				...state,
				isTodoListLoading: false,
				error: action.payload?.isFilteringOrSorting
					? ""
					: `Error fetching todos: ${message}`,
				filterError: action.payload?.isFilteringOrSorting ? message : "",
			};
		}
		// ---------------- ADD ----------------
		case TODO_ACTIONS.ADD_TODO_START:
			// Optimistically insert a temporary todo while the request is in-flight
			return {
				...state,
				todoList: [action.payload, ...state.todoList],
				error: "",
			};
		case TODO_ACTIONS.ADD_TODO_SUCCESS:
			// Replace the temporary todo with the server response
			return {
				...state,
				todoList: state.todoList.map((todo) =>
					todo.id === action.payload.newTodo.id ? action.payload.data : todo,
				),
			};
		case TODO_ACTIONS.ADD_TODO_ERROR:
			// Roll back: remove the temporary todo and show an error message
			return {
				...state,
				todoList: state.todoList.filter(
					(todo) => todo.id !== action.payload.newTodo.id,
				),
				error: action.payload.error
					? `Error: ${action.payload.error.name} | ${action.payload.error.message}`
					: "Error: Request failed",
			};
		// ---------------- COMPLETE ----------------
		case TODO_ACTIONS.COMPLETE_TODO_START:
			// Optimistically update list (payload already contains updated todos)
			return {
				...state,
				todoList: action.payload,
			};
		case TODO_ACTIONS.COMPLETE_TODO_SUCCESS:
			// Clear error on successful completion update
			return {
				...state,
				error: "",
			};
		case TODO_ACTIONS.COMPLETE_TODO_ERROR:
			// Roll back: restore the original todo if the request failed
			return {
				...state,
				todoList: state.todoList.map((todo) =>
					todo.id === action.payload.id ? action.payload.originalTodo : todo,
				),
				error: `Error: ${action.payload.error.name} | ${action.payload.error.message}`,
			};
		// ---------------- UPDATE ----------------
		case TODO_ACTIONS.UPDATE_TODO_START:
			// Optimistically update list (payload already contains updated todos)
			return {
				...state,
				todoList: action.payload,
			};
		case TODO_ACTIONS.UPDATE_TODO_SUCCESS:
			// Clear error on successful update
			return {
				...state,
				error: "",
			};
		case TODO_ACTIONS.UPDATE_TODO_ERROR:
			// Roll back: restore the previous version of the todo
			return {
				...state,
				todoList: state.todoList.map((todo) =>
					todo.id === action.payload.id ? action.payload : todo,
				),
				error: `Error: ${action.payload.error.name} | ${action.payload.error.message}`,
			};
		// ---------------- DELETE ----------------
		case TODO_ACTIONS.DELETE_TODO_START:
			// Optimistically remove todo from the list (payload is the updated list)
			return {
				...state,
				todoList: action.payload,
			};
		case TODO_ACTIONS.DELETE_TODO_SUCCESS:
			// Clear error on successful delete
			return {
				...state,
				error: "",
			};
		case TODO_ACTIONS.DELETE_TODO_ERROR:
			// Roll back: re-insert the deleted todo if the request failed
			return {
				...state,
				todoList: [action.payload.originalToDo, ...state.todoList],
				error: `Error: ${action.payload.error.name} | ${action.payload.error.message}`,
			};
		// ---------------- UI ----------------
		case TODO_ACTIONS.SET_SORT:
			// Update sorting options; clear filter-related error state
			return {
				...state,
				sortBy: action.payload.sortBy,
				sortDirection: action.payload.sortDirection,
				filterError: "",
			};
		case TODO_ACTIONS.SET_FILTER:
			// Update the search/filter term used by the UI
			return {
				...state,
				filterTerm: action.payload,
			};
		case TODO_ACTIONS.CLEAR_ERROR:
			// Clear general (non-filter) errors
			return {
				...state,
				error: "",
			};
		case TODO_ACTIONS.CLEAR_FILTER_ERROR:
			// Clear filter/sort error message without affecting general errors
			return {
				...state,
				filterError: "",
			};
		case TODO_ACTIONS.RESET_FILTERS:
			// Reset filter + sort UI state back to defaults
			return {
				...state,
				filterTerm: "",
				sortBy: "creationDate",
				sortDirection: "desc",
				filterError: "",
			};
		case TODO_ACTIONS.BUMP_DATA_VERSION:
			// Increment version to trigger a refetch/useEffect dependency update
			return {
				...state,
				dataVersion: state.dataVersion + 1,
			};
		default:
			throw new Error(`Unknown action type: ${action.type}`);
	}
}
