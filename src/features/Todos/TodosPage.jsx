import { useCallback, useEffect, useReducer } from "react";
import {
	todoReducer,
	initialTodoState,
	TODO_ACTIONS,
} from "../../reducers/todoReducer";
import TodoList from "../../features/Todos/TodoList/TodoList.jsx";
import TodoForm from "../../features/Todos/TodoForm.jsx";
import SortBy from "../../shared/SortBy.jsx";
import useDebounce from "../../utils/useDebounce.js";
import FilterInput from "../../shared/FilterInput.jsx";
import { useAuth } from "../../contexts/AuthContext.jsx";

const TodosPage = () => {
	const [state, dispatch] = useReducer(todoReducer, initialTodoState);

	const { token } = useAuth();

	const {
		todoList,
		isTodoListLoading,
		error,
		filterError,
		filterTerm,
		sortBy,
		sortDirection,
		dataVersion,
	} = state;

	const baseUrl = import.meta.env.VITE_BASE_URL;
	const debouncedFilterTerm = useDebounce(filterTerm, 300);

	const invalidateCache = useCallback(() => {
		dispatch({ type: TODO_ACTIONS.BUMP_DATA_VERSION });
	}, []);

	useEffect(() => {
		async function fetchTodos() {
			dispatch({ type: TODO_ACTIONS.FETCH_START });

			try {
				const paramsObject = {
					sortBy,
					sortDirection,
				};
				if (debouncedFilterTerm) {
					paramsObject.find = debouncedFilterTerm;
				}
				const params = new URLSearchParams(paramsObject);

				const response = await fetch(`${baseUrl}/tasks?${params}`, {
					method: "GET",
					headers: { "X-CSRF-TOKEN": token },
					credentials: "include",
				});

				if (response.status === 401) {
					throw new Error("Unauthorized");
				}

				if (response.status === 404) {
					dispatch({
						type: TODO_ACTIONS.FETCH_ERROR,
						payload: {
							message: "No todos found",
							isFilteringOrSorting: true,
						},
					});
					return;
				}

				if (!response.ok) {
					throw new Error(`HTTP error ${response.status}`);
				}

				const data = await response.json();

				dispatch({
					type: TODO_ACTIONS.FETCH_SUCCESS,
					payload: data,
				});
			} catch (error) {
				const message = error?.message ?? "Unknown error";

				const isFilteringOrSorting =
					debouncedFilterTerm ||
					sortBy !== "creationDate" ||
					sortDirection !== "desc";

				dispatch({
					type: TODO_ACTIONS.FETCH_ERROR,
					payload: { message, isFilteringOrSorting },
				});
			}
		}

		if (token) fetchTodos();
	}, [token, baseUrl, sortBy, sortDirection, debouncedFilterTerm]);

	async function addTodo(title) {
		const newTodo = {
			id: Date.now(),
			title: title,
			isCompleted: false,
		};

		dispatch({ type: TODO_ACTIONS.ADD_TODO_START, payload: newTodo });

		try {
			const response = await fetch(`${baseUrl}/tasks`, {
				method: "POST",
				body: JSON.stringify({ title, isCompleted: false }),
				headers: { "Content-Type": "application/json", "X-CSRF-TOKEN": token },
				credentials: "include",
			});
			const data = await response.json();

			if (response.ok) {
				dispatch({
					type: TODO_ACTIONS.ADD_TODO_SUCCESS,
					payload: { data, newTodo },
				});

				invalidateCache();
			} else {
				dispatch({ type: TODO_ACTIONS.ADD_TODO_ERROR, payload: { newTodo } });
			}
		} catch (error) {
			dispatch({
				type: TODO_ACTIONS.ADD_TODO_ERROR,
				payload: { newTodo, error },
			});
		}
	}

	async function completeTodo(id) {
		const originalTodo = todoList.find((todo) => todo.id === id);
		if (!originalTodo) return;

		const updatedList = todoList.filter((todo) => todo.id !== id);

		dispatch({ type: TODO_ACTIONS.COMPLETE_TODO_START, payload: updatedList });

		try {
			const response = await fetch(`${baseUrl}/tasks/${id}`, {
				method: "DELETE",
				// body: JSON.stringify({
				// 	createdTime: originalTodo.createdTime,
				// 	isCompleted: true,
				// }),
				headers: {  "X-CSRF-TOKEN": token },
				credentials: "include",
			});

			if (response.ok) {
				dispatch({ type: TODO_ACTIONS.COMPLETE_TODO_SUCCESS });
			} else {
				dispatch({
					type: TODO_ACTIONS.COMPLETE_TODO_ERROR,
					payload: {
						id,
						originalTodo,
						error: { name: "Request", message: "Request failed" },
					},
				});
				invalidateCache();
			}
		} catch (error) {
			dispatch({
				type: TODO_ACTIONS.COMPLETE_TODO_ERROR,
				payload: { id, originalTodo, error },
			});
		}
	}

	async function updateTodo(editedTodo) {
		const originalToDo = todoList.find((todo) => todo.id === editedTodo.id);
		if (!originalToDo) return;

		const updatedTodos = todoList.map((todo) => {
			if (todo.id === editedTodo.id) {
				return { ...todo, ...editedTodo };
			} else {
				return todo;
			}
		});

		dispatch({ type: TODO_ACTIONS.UPDATE_TODO_START, payload: updatedTodos });

		try {
			const response = await fetch(`${baseUrl}/tasks/${editedTodo.id}`, {
				method: "PATCH",
				body: JSON.stringify({
					title: editedTodo.title,
					isCompleted: editedTodo.isCompleted,
					createdTime: originalToDo.createdTime,
				}),
				headers: { "Content-Type": "application/json", "X-CSRF-TOKEN": token },
				credentials: "include",
			});
			if (response.ok) {
				dispatch({ type: TODO_ACTIONS.UPDATE_TODO_SUCCESS });
				invalidateCache();
			}
			if (!response.ok) {
				dispatch({
					type: TODO_ACTIONS.UPDATE_TODO_ERROR,
					payload: {
						id: editedTodo.id,
						originalToDo,
						error: { name: "Request", message: "Request failed" },
					},
				});
			}
		} catch (error) {
			dispatch({
				type: TODO_ACTIONS.UPDATE_TODO_ERROR,
				payload: { id: editedTodo.id, originalToDo, error },
			});
		}
	}

	function handleFilterChange(newTerm) {
		dispatch({ type: TODO_ACTIONS.SET_FILTER, payload: newTerm });
	}

	function handleSortByChange(newSortBy) {
		dispatch({
			type: TODO_ACTIONS.SET_SORT,
			payload: { sortBy: newSortBy, sortDirection },
		});
	}

	function handleSortDirectionChange(newDir) {
		dispatch({
			type: TODO_ACTIONS.SET_SORT,
			payload: { sortBy, sortDirection: newDir },
		});
	}

	return (
		<>
			{error && (
				<div style={{ display: "flex" }}>
					<div style={{ color: "#de1818" }}>{error}</div>
					<button
						onClick={() => dispatch({ type: TODO_ACTIONS.CLEAR_ERROR })}
						style={{ color: "#de1818" }}
					>
						Clear error
					</button>
				</div>
			)}
			{filterError && (
				<div>
					<p>Error filtering/sorting todos:{filterError}</p>
					<button
						onClick={() => dispatch({ type: TODO_ACTIONS.CLEAR_FILTER_ERROR })}
						style={{ color: "#de1818" }}
					>
						Clear Filter Error
					</button>
					<button
						onClick={() => {
							dispatch({ type: TODO_ACTIONS.RESET_FILTERS });
						}}
						style={{ color: "#de1818" }}
					>
						Reset Filters
					</button>
				</div>
			)}
			<p>{isTodoListLoading ? "Loading..." : ""}</p>
			<TodoForm onAddTodo={addTodo} />
			<TodoList
				todoList={todoList}
				onCompleteTodo={completeTodo}
				onUpdateTodo={updateTodo}
				dataVersion={dataVersion}
			/>
			<FilterInput
				filterTerm={filterTerm}
				onFilterChange={handleFilterChange}
			/>
			<SortBy
				sortby={sortBy}
				sortDirection={sortDirection}
				onSortByChange={handleSortByChange}
				onSortDirectionChange={handleSortDirectionChange}
			/>
		</>
	);
};

export default TodosPage;
