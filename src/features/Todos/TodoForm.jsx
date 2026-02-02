import { useState } from "react";
import TextInputWithLabel from "../../shared/TextInputWithLabel";
import { isValidTodoTitle } from "../../utils/todoValidation";
import controls from "../../shared/styles/controls.module.css"
import layout from "../../shared/styles/layout.module.css"
import clsx from "clsx";

function TodoForm({ onAddTodo }) {
	const [workingTodoTitle, setWorkingTodoTitle] = useState("");

	const handleAddTodo = (event) => {
		event.preventDefault();
		onAddTodo(workingTodoTitle);
		setWorkingTodoTitle("");
	};

	return (
		<form className={clsx(layout.row, layout.rowActions)} onSubmit={handleAddTodo}>
			<TextInputWithLabel
				elementId={"todoTitle"}
				labelText={"Todo "}
				onChange={(event) => {
					setWorkingTodoTitle(event.target.value);
				}}
				value={workingTodoTitle}
			/>
			<button className={controls.btn} disabled={!isValidTodoTitle(workingTodoTitle)}>Add Todo</button>
		</form>
	);
}

export default TodoForm;
