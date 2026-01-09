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
			title: title,
			isCompleted: false,
		};

		try {
			const response = await fetch(`${baseUrl}/tasks`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify(newTodo),
			});
			const data = await response.json();
			console.log(data);
			if (response.status === 200) {
				console.log("Respond 200", data);
			} else {
				console.log("Remove the failed todo");
				setError(`Error: ${error.name} | ${error.message}`);
			}
		} catch (error) {
			setError(`Error: ${error.name} | ${error.message}`);
		}
	}

	function completeTodo(id) {
		const updatedList = todoList.map((todo) => {
			if (todo.id === id) {
				return { ...todo, isCompleted: true };
			} else {
				return todo;
			}
		});

		setTodoList(updatedList);
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
			<p>{error}</p>
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
