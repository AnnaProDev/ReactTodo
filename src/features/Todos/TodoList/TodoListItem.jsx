import TextInputWithLabel from "../../../shared/TextInputWithLabel";
import { isValidTodoTitle } from "../../../utils/todoValidation";
import { useEditableTitle } from "../../../hooks/useEditableTitle";
import styles from "./TodoListItem.module.css"
import controls from "../../../shared/styles/controls.module.css"
import clsx from "clsx";

function TodoListItem({ todo, onCompleteTodo, onUpdateTodo, onDeleteTodo }) {
	const {
		isEditing,
		workingTitle,
		startEditing,
		cancelEdit,
		updateTitle,
		finishEdit,
	} = useEditableTitle(todo.title);

	function handleUpdate(event) {
		if (!isEditing) return;
		event.preventDefault();
		const finalTitle = finishEdit();
		onUpdateTodo({ ...todo, title: finalTitle });
	}

	return (
		<li>
			<form onSubmit={handleUpdate} className={styles.todoItem}>
				{isEditing ? (
					<>
						<TextInputWithLabel
							value={workingTitle}
							onChange={(event) => updateTitle(event.target.value)}
						/>

						<div className={controls.btnMulti}>
							<button
								type="button"
								disabled={!isValidTodoTitle(workingTitle)}
								onClick={handleUpdate}
								className={clsx(controls.btn, controls.btnGhost)}
							>
								Update
							</button>
							<button
								className={clsx(controls.btn, controls.btnGhost)}
								type="button"
								onClick={cancelEdit}
							>
								Cancel
							</button>
						</div>
					</>
				) : (
					<>
						<div>
							<label>
								<input
									type="checkbox"
									id={`checkbox${todo.id}`}
									checked={todo.isCompleted}
									onChange={() => onCompleteTodo(todo.id)}
									className={styles.checkbox}
								/>
							</label>
							<span className={styles.todoText} onClick={startEditing}>
								{todo.title}
							</span>
						</div>
						<button
							type="button"
							className={clsx(controls.btn, controls.btnGhost)}
							onClick={() => onDeleteTodo(todo.id)}
						>
							Delete
						</button>
					</>
				)}
			</form>
		</li>
	);
}

export default TodoListItem;
