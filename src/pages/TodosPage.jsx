import { useCallback, useEffect, useReducer } from "react";
import { useSearchParams } from "react-router";
import {
	todoReducer,
	initialTodoState,
	TODO_ACTIONS,
} from "../reducers/todoReducer.js";
import TodoList from "../features/Todos/TodoList/TodoList.jsx";
import TodoForm from "../features/Todos/TodoForm.jsx";
import SortBy from "../shared/SortBy.jsx";
import useDebounce from "../utils/useDebounce.js";
import FilterInput from "../shared/FilterInput.jsx";
import StatusFilter from "../shared/StatusFilter.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import Loading from "../shared/Loading.jsx";
import clsx from "clsx";
import controls from "../shared/styles/controls.module.css";
import styles from "./TodosPage.module.css";
import layout from "../shared/styles/layout.module.css";
import { todoTitleSchema } from "../utils/todoValidation";
import { sanitizeText } from "../utils/sanitize";

const TodosPage = () => {
	const { token } = useAuth();
	const [searchParams] = useSearchParams();

	const statusFilter = searchParams.get("status") || "all";

	const [
		{
			todoList,
			isTodoListLoading,
			error,
			filterError,
			filterTerm,
			sortBy,
			sortDirection,
			dataVersion,
		},
		dispatch,
	] = useReducer(todoReducer, initialTodoState);

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
		const parsed = todoTitleSchema.safeParse(title);

		if (!parsed.success) {
			dispatch({
				type: TODO_ACTIONS.FETCH_ERROR,
				payload: {
					message: parsed.error.issues?.[0]?.message || "Invalid title.",
				},
			});
			return;
		}

		const safeTitle = sanitizeText(parsed.data);

		const newTodo = {
			id: Date.now(),
			title: safeTitle,
			isCompleted: false,
		};

		dispatch({ type: TODO_ACTIONS.ADD_TODO_START, payload: newTodo });

		try {
			const response = await fetch(`${baseUrl}/tasks`, {
				method: "POST",
				body: JSON.stringify({ title: safeTitle, isCompleted: false }),
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

		const updatedList = todoList.map((todo) => {
			if (todo.id === id) {
				return { ...todo, isCompleted: true };
			} else {
				return todo;
			}
		});

		dispatch({ type: TODO_ACTIONS.COMPLETE_TODO_START, payload: updatedList });

		try {
			const response = await fetch(`${baseUrl}/tasks/${id}`, {
				method: "PATCH",
				body: JSON.stringify({
					createdTime: originalTodo.createdTime,
					isCompleted: true,
				}),
				headers: { "Content-Type": "application/json", "X-CSRF-TOKEN": token },
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

		const parsed = todoTitleSchema.safeParse(editedTodo.title);

		if (!parsed.success) {
			dispatch({
				type: TODO_ACTIONS.UPDATE_TODO_ERROR,
				payload: {
					id: editedTodo.id,
					originalToDo,
					error: {
						name: "Validation",
						message: parsed.error.issues[0].message,
					},
				},
			});
			return;
		}

		const safeTitle = sanitizeText(parsed.data);

		const safeEditedTodo = { ...editedTodo, title: safeTitle };

		const updatedTodos = todoList.map((todo) => {
			if (todo.id === safeEditedTodo.id) {
				return { ...todo, ...safeEditedTodo };
			} else {
				return todo;
			}
		});

		dispatch({ type: TODO_ACTIONS.UPDATE_TODO_START, payload: updatedTodos });

		try {
			const response = await fetch(`${baseUrl}/tasks/${safeEditedTodo.id}`, {
				method: "PATCH",
				body: JSON.stringify({
					title: safeEditedTodo.title,
					isCompleted: safeEditedTodo.isCompleted,
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
						id: safeEditedTodo.id,
						originalToDo,
						error: { name: "Request", message: "Request failed" },
					},
				});
			}
		} catch (error) {
			dispatch({
				type: TODO_ACTIONS.UPDATE_TODO_ERROR,
				payload: { id: safeEditedTodo.id, originalToDo, error },
			});
		}
	}

	async function deleteTodo(id) {
		const originalToDo = todoList.find((todo) => todo.id === id);
		if (!originalToDo) return;

		const updatedTodos = todoList.filter((todo) => todo.id !== id);

		dispatch({ type: TODO_ACTIONS.DELETE_TODO_START, payload: updatedTodos });

		try {
			const response = await fetch(`${baseUrl}/tasks/${id}`, {
				method: "DELETE",
				headers: { "Content-Type": "application/json", "X-CSRF-TOKEN": token },
				credentials: "include",
			});
			if (response.ok) {
				dispatch({ type: TODO_ACTIONS.DELETE_TODO_SUCCESS });
				invalidateCache();
			}
			if (!response.ok) {
				dispatch({
					type: TODO_ACTIONS.DELETE_TODO_ERROR,
					payload: {
						id: id,
						originalToDo,
						error: { name: "Request", message: "Request failed" },
					},
				});
			}
		} catch (error) {
			dispatch({
				type: TODO_ACTIONS.DELETE_TODO_ERROR,
				payload: { id: id, originalToDo, error },
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
		<div className={styles.page}>
			<section className={layout.card}>
				<div className={layout.pageHead}>
					<h1 className={layout.pageTitle}>Todos</h1>
					<p className={layout.pageSubtitle}>
						Sort, filter and manage your tasks
					</p>
				</div>
				<div className={styles.cardHeaderCompact}>
					<h2 className={layout.sectionTitle}>Add todo</h2>
					<p className={styles.cardHint}>Write a short title and press Add</p>
				</div>

				<div className={styles.block}>
					<TodoForm onAddTodo={addTodo} />
				</div>
			</section>
			
			{error && (
				<div className={styles.alert}>
					<div className={styles.alertText}>{error}</div>
					<button
						onClick={() => dispatch({ type: TODO_ACTIONS.CLEAR_ERROR })}
						className={clsx(controls.btn, controls.btnDanger, styles.alertBtn)}
					>
						Clear error
					</button>
				</div>
			)}

			<section className={layout.card}>
				<div className={styles.cardHeaderCompact}>
					<h2 className={layout.sectionTitle}>List</h2>
					<p className={styles.cardHint}>
						{isTodoListLoading
							? "Loading…"
							: `Showing ${todoList?.length ?? 0} todos`}
					</p>
				</div>

				{isTodoListLoading && (
					<div className={styles.loadingRow}>
						<Loading />
					</div>
				)}

				<TodoList
					todoList={todoList}
					onCompleteTodo={completeTodo}
					onUpdateTodo={updateTodo}
					dataVersion={dataVersion}
					onDeleteTodo={deleteTodo}
					statusFilter={statusFilter}
				/>
			</section>

			{filterError && (
				<div className={styles.alert}>
					<div className={styles.alertText}>
						Error filtering/sorting todos: {filterError}
					</div>
					<button
						onClick={() => dispatch({ type: TODO_ACTIONS.CLEAR_FILTER_ERROR })}
						className={clsx(controls.btn, controls.btnDanger, styles.alertBtn)}
					>
						Clear Filter Error
					</button>
				</div>
			)}

			<section className={layout.card}>
				<div className={styles.cardHeader}>
					<div className={styles.cardHeaderText}>
						<h2 className={layout.sectionTitle}>Filters</h2>
						<p className={styles.cardHint}>
							Use search and sorting to find tasks faster
						</p>
					</div>
					<button
						type="button"
						className={clsx(controls.btn, styles.btnPrimary)}
						onClick={() => dispatch({ type: TODO_ACTIONS.RESET_FILTERS })}
						disabled={
							!filterTerm &&
							sortBy === "creationDate" &&
							sortDirection === "desc"
						}
					>
						Reset all
					</button>
				</div>
				<div className={styles.filtersGrid}>
					<div className={styles.filters}>
						<div className={clsx(styles.block, styles.searchRow)}>
							<FilterInput
								filterTerm={filterTerm}
								onFilterChange={handleFilterChange}
							/>
							<button
								type="button"
								className={clsx(controls.btn, styles.btnPrimary)}
								onClick={() => dispatch({ type: TODO_ACTIONS.RESET_FILTERS })}
								disabled={!filterTerm}
							>
								Reset filter
							</button>
						</div>
						<div className={styles.block}>
							<StatusFilter />
						</div>
					</div>
					<div className={styles.block}>
						<SortBy
							sortby={sortBy}
							sortDirection={sortDirection}
							onSortByChange={handleSortByChange}
							onSortDirectionChange={handleSortDirectionChange}
						/>
					</div>
				</div>
			</section>
		</div>
	);
};

export default TodosPage;
