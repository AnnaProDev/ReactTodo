import { useEffect, useState } from "react";
import TodoList from "../../features/Todos/TodoList/TodoList.jsx";
import TodoForm from "../../features/Todos/TodoForm.jsx";

const TodosPage = ({ token }) => {
	const [todoList, setTodoList] = useState([]);
	const [error, setError] = useState("");
	const [isTodoListLoading, setIsTodoListLoading] = useState(false);

	const baseUrl = import.meta.env.VITE_BASE_URL;

	useEffect(() => {
		async function fetchTodos() {
			setIsTodoListLoading(true);

			try {
				const response = await fetch(`${baseUrl}/tasks`, {
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
			} catch (error) {
				setError(`Error: ${error.name} | ${error.message}`);
			} finally {
				setIsTodoListLoading(false);
			}
		}

		if (token) fetchTodos();
	}, [token, baseUrl]);

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
			}
		} catch (error) {
			setTodoList((prev) =>
				prev.map((todo) => (todo.id === id ? originalTodo : todo))
			);
			setError(`Error: ${error.name} | ${error.message}`);
		}
	}

	function updateTodo(editedTodo) {
		const updatedTodos = todoList.map((todo) => {
			if (todo.id === editedTodo.id) {
				return { ...todo, ...editedTodo };
			} else {
				return todo;
			}
		});

		setTodoList(updatedTodos);
	}

	return (
		<>
			<p style={{ color: "#de1818" }}>{error}</p>
			<p>{isTodoListLoading ? "Loading..." : ""}</p>
			<TodoForm onAddTodo={addTodo} />
			<TodoList
				todoList={todoList}
				onCompleteTodo={completeTodo}
				onUpdateTodo={updateTodo}
			/>
		</>
	);
};

export default TodosPage;
