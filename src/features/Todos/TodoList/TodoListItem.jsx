import TextInputWithLabel from "../../../shared/TextInputWithLabel";
import { isValidTodoTitle } from "../../../utils/todoValidation";
import { useEditableTitle } from "../../../hooks/useEditableTitle";
import styles from "./TodoListItem.module.css";
import controls from "../../../shared/styles/controls.module.css";
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
						<div className={styles.textRow}>
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
						<svg
							onClick={() => onDeleteTodo(todo.id)}
							className={styles.deleteIcon}
							role="button"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<polyline points="3 6 5 6 21 6" />
							<path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
							<path d="M10 11v6" />
							<path d="M14 11v6" />
							<path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
						</svg>
					</>
				)}
			</form>
		</li>
	);
}

export default TodoListItem;
