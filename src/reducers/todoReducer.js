export const TODO_ACTIONS = {
	// Fetch operations
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

	//UI operations
	SET_SORT: "SET_SORT",
	SET_FILTER: "SET_FILTER",
	CLEAR_ERROR: "CLEAR_ERROR",
	CLEAR_FILTER_ERROR: "CLEAR_FILTER_ERROR",
	RESET_FILTERS: "RESET_FILTERS",
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
	console.log('Dispatched action:', action.type, action.payload);
	console.log(state)
	switch (action.type) {
		// ---------------- FETCH ----------------
		case TODO_ACTIONS.FETCH_START:
			return {
				...state,
				isTodoListLoading: true,
				error: "",
				filterError: "",
			};
		case TODO_ACTIONS.FETCH_SUCCESS:
			return {
				...state,
				isTodoListLoading: false,
				todoList: action.payload,
				error: "",
				filterError: "",
			};
		case TODO_ACTIONS.FETCH_ERROR: {
			const message = action.payload?.message ?? "Unknown error";
			return {
				...state,
				isTodoListLoading: false,
				error: action.payload?.isFilteringOrSorting
					? ""
					: `Error fetching todos: ${message}`,
				filterError: action.payload?.isFilteringOrSorting
					? message
					: "",
			};
		}
		// ---------------- ADD ----------------
		case TODO_ACTIONS.ADD_TODO_START:
			return {
				...state,
				todoList: [action.payload, ...state.todoList],
				error: "",
			};
		case TODO_ACTIONS.ADD_TODO_SUCCESS:
			return {
				...state,
				todoList: state.todoList.map((todo) =>
					todo.id === action.payload.newTodo.id ? action.payload.data : todo,
				),
			};
		case TODO_ACTIONS.ADD_TODO_ERROR:
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
			return {
				...state,
				todoList: action.payload,
			};
		case TODO_ACTIONS.COMPLETE_TODO_SUCCESS:
			return {
				...state,
				error: "",
			};
		case TODO_ACTIONS.COMPLETE_TODO_ERROR:
			return {
				...state,
				todoList: state.todoList.map((todo) =>
					todo.id === action.payload.id ? action.payload.originalTodo : todo,
				),
				error: `Error: ${action.payload.error.name} | ${action.payload.error.message}`,
			};
		// ---------------- UPDATE ----------------
		case TODO_ACTIONS.UPDATE_TODO_START:
			return {
				...state,
				todoList: action.payload,
			};
		case TODO_ACTIONS.UPDATE_TODO_SUCCESS:
			return {
				...state,
				error: "",
			};
		case TODO_ACTIONS.UPDATE_TODO_ERROR:
			return {
				...state,
				todoList: state.todoList.map((todo) =>
					todo.id === action.payload.id ? action.payload : todo,
				),
				error: `Error: ${action.payload.error.name} | ${action.payload.error.message}`,
			};
		// ---------------- UI ----------------
		case TODO_ACTIONS.SET_SORT:
			return {
				...state,
				sortBy: action.payload.sortBy,
				sortDirection: action.payload.sortDirection,
				filterError: ""
			};
		case TODO_ACTIONS.SET_FILTER:
			return {
				...state,
				filterTerm: action.payload
			};
		case TODO_ACTIONS.CLEAR_ERROR:
			return {
				...state,
				error: "",
			};
		case TODO_ACTIONS.CLEAR_FILTER_ERROR:
			return {
				...state,
				filterError: "",
			};
		case TODO_ACTIONS.RESET_FILTERS:
			return {
				...state,
				filterTerm: "",
				sortBy: "creationDate",
				sortDirection: "desc",
				filterError: "",
			};
		case TODO_ACTIONS.BUMP_DATA_VERSION:
			return {
				...state,
				dataVersion: state.dataVersion + 1
			};
		default:
			throw new Error(`Unknown action type: ${action.type}`);
	}
}
