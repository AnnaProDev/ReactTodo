import {  useState } from "react";
import TodoList from "../../features/Todos/TodoList/TodoList.jsx";
import TodoForm from "../../features/Todos/TodoForm.jsx";

const TodosPage = () => {
	const [todoList, setTodoList] = useState([]);
	// const [error, setError] = useState("");
	// const [isTodoListLoading, setIsTodoListLoading] = useState(false);

	// const baseUrl = import.meta.env.VITE_BASE_URL;

	// useEffect(() => {
	// 	const fetchTodos = async () => {
	// 		setIsTodoListLoading(true);
	// 		try {
	// 			const response = await fetch(`${baseUrl}/tasks`, {
	// 				method: "GET",
	// 				headers: { "X-CSRF-TOKEN": token },
	// 				credentials: "include",
	// 			});
	// 			const data = await response.json();

	// 			if (response.status === 401) {
	// 				throw new Error("unauthorized");
	// 			} else if (!response.ok) {
	// 				throw new Error(`HTTP error ${response.status}`);
	// 			} else if (response.status === 200) {
	// 				const dataToDoList = data.parse.JSON;
	// 				setTodoList(dataToDoList);
	// 			}
	// 		} catch (error) {
	// 			setError(`Error: ${error.name} | ${error.message}`);
	// 		} finally {
	// 			setIsTodoListLoading(false);
	// 		}
	// 	};
	// }, [token, baseUrl]);

	function addTodo(title) {
		const newTodo = {
			id: Date.now(),
			title: title,
			isCompleted: false,
		};

		setTodoList([newTodo, ...todoList]);
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
			{/* <p>{error}</p>
			<p>{isTodoListLoading ? "Loading..." : ""}</p> */}
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
