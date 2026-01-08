import { useState } from "react";
import TextInputWithLabel from "../../shared/TextInputWithLabel";
import { isValidTodoTitle } from "../../utils/todoValidation";

function TodoForm({ onAddTodo }) {
	const [workingTodoTitle, setWorkingTodoTitle] = useState("");

	const handleAddTodo = (event) => {
		event.preventDefault();
		onAddTodo(workingTodoTitle);
		setWorkingTodoTitle("");
	};

	return (
		<form onSubmit={handleAddTodo}>
			<TextInputWithLabel
				elementId={"todoTitle"}
				labelText={"Todo "}
				onChange={(event) => {
					setWorkingTodoTitle(event.target.value);
				}}
				value={workingTodoTitle}
			/>
			<button disabled={!isValidTodoTitle(workingTodoTitle)}>Add Todo</button>
		</form>
	);
}

export default TodoForm;
