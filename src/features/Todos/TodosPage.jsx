import { useCallback, useEffect, useState } from "react";
import TodoList from "../../features/Todos/TodoList/TodoList.jsx";
import TodoForm from "../../features/Todos/TodoForm.jsx";
import SortBy from "../../shared/SortBy.jsx";
import useDebounce from "../../utils/useDebounce.js";
import FilterInput from "../../shared/FilterInput.jsx";

const TodosPage = ({ token }) => {
	const [todoList, setTodoList] = useState([]);
	const [error, setError] = useState("");
	const [isTodoListLoading, setIsTodoListLoading] = useState(false);
	const [sortBy, setSortBy] = useState("creationDate");
	const [sortDirection, setSortDirection] = useState("desc");
	const [filterTerm, setFilterTerm] = useState("");
	const [dataVersion, setDataVersion] = useState(0);
	const [filterError, setFilterError] = useState("");

	const baseUrl = import.meta.env.VITE_BASE_URL;
	const debouncedFilterTerm = useDebounce(filterTerm, 300);

	useEffect(() => {
		async function fetchTodos() {
			setIsTodoListLoading(true);

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

				if (!response.ok) {
					throw new Error(`HTTP error ${response.status}`);
				}

				const data = await response.json();
				setTodoList(data);
				setFilterError("");
			} catch (error) {
				if (
					debouncedFilterTerm ||
					sortBy !== "creationDate" ||
					sortDirection !== "desc"
				) {
					setFilterError(`Error filtering/sorting todos: ${error.message}`);
				} else {
					setError(`Error fetching todos: ${error.message}`);
				}
			} finally {
				setIsTodoListLoading(false);
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

		setTodoList((prev) => {
			const next = [newTodo, ...prev];
			return next;
		});

		try {
			const response = await fetch(`${baseUrl}/tasks`, {
				method: "POST",
				body: JSON.stringify({ title, isCompleted: false }),
				headers: { "Content-Type": "application/json", "X-CSRF-TOKEN": token },
				credentials: "include",
			});
			const data = await response.json();
			console.log(data);
			if (response.ok) {
				setTodoList((prev) => {
					const renewedToDoList = prev.map((todo) =>
						todo.id === newTodo.id ? data : todo
					);
					return renewedToDoList;
				});
				invalidateCache();
			} else {
				setTodoList((prev) => {
					const filteredTodoList = prev.filter(
						(todo) => todo.id !== newTodo.id
					);
					return filteredTodoList;
				});
				setError("Error: Request failed");
			}
		} catch (error) {
			setTodoList((prev) => {
				const filteredTodoList = prev.filter((todo) => todo.id !== newTodo.id);
				return filteredTodoList;
			});
			setError(`Error: ${error.name} | ${error.message}`);
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

		setTodoList(updatedList);

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
			const data = await response.json();
			if (!response.ok) {
				setTodoList((prev) =>
					prev.map((todo) => (todo.id === id ? originalTodo : todo))
				);
				setError(
					`HTTP ${response.status} | ${data?.message ?? "Request failed"}`
				);
				invalidateCache();
			}
		} catch (error) {
			setTodoList((prev) =>
				prev.map((todo) => (todo.id === id ? originalTodo : todo))
			);
			setError(`Error: ${error.name} | ${error.message}`);
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

		setTodoList(updatedTodos);

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
			if (!response.ok) {
				setTodoList((prev) => {
					prev.map((todo) =>
						todo.id === originalToDo.id ? originalToDo : todo
					);
				});
			}
			invalidateCache();
		} catch (error) {
			setTodoList((prev) => {
				prev.map((todo) => (todo.id === originalToDo.id ? originalToDo : todo));
			});
			setError(`Error: ${error.message} | ${error.message}`);
		}
	}

	function handleFilterChange(newTerm) {
		setFilterTerm(newTerm);
	}

	const invalidateCache = useCallback(() => {
		setDataVersion((prev) => prev + 1);
		console.log("Invalidating memo cache after todo mutation");
	}, []);

	return (
		<>
			{error && (
				<div style={{ display: "flex" }}>
					<div style={{ color: "#de1818" }}>{error}</div>
					<button onClick={() => setError("")} style={{ color: "#de1818" }}>
						Clear error
					</button>
				</div>
			)}
			{filterError && (
				<div>
					<p>Error filtering/sorting todos:{filterError.message}</p>
					<button
						onClick={() => setFilterError("")}
						style={{ color: "#de1818" }}
					>
						Clear Filter Error
					</button>
					<button
						onClick={() => {
							setFilterTerm("");
							setSortBy("creationDate");
							setSortDirection('desc');
							setFilterError('');
						}}
						style={{ color: "#de1818" }}
					>
						Clear Filter Error
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
			<FilterInput onFilterChange={handleFilterChange} />
			<SortBy
				sortby={sortBy}
				sortDirection={sortDirection}
				onSortByChange={setSortBy}
				onSortDirectionChange={setSortDirection}
			/>
		</>
	);
};

export default TodosPage;
