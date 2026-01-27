import { useMemo } from "react";
import TodoListItem from "./TodoListItem";

function TodoList({
	todoList,
	onCompleteTodo,
	onUpdateTodo,
	onDeleteTodo,
	dataVersion,
}) {
	const filteredTodoList = useMemo(() => {
		return {
			version: dataVersion,
			todos: todoList,
		};
	}, [dataVersion, todoList]);

	return (
		<>
			{filteredTodoList.todos.length === 0 ? (
				<p>Add todo above to get started</p>
			) : (
				<ul className="todoList">
					{filteredTodoList.todos.map((todo) => (
						<TodoListItem
							key={todo.id}
							todo={todo}
							onCompleteTodo={onCompleteTodo}
							onUpdateTodo={onUpdateTodo}
							onDeleteTodo={onDeleteTodo}
						/>
					))}{" "}
				</ul>
			)}
		</>
	);
}

export default TodoList;
