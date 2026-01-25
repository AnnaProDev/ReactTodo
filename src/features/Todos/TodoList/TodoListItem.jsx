import TextInputWithLabel from "../../../shared/TextInputWithLabel";
import { isValidTodoTitle } from "../../../utils/todoValidation";
import { useEditableTitle } from "../../../hooks/useEditableTitle";

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
			<form onSubmit={handleUpdate} className="todoItem">
				{isEditing ? (
					<>
						<TextInputWithLabel
							value={workingTitle}
							onChange={(event) => updateTitle(event.target.value)}
						/>

						<div className="btn--multi">
							<button
								type="button"
								disabled={!isValidTodoTitle(workingTitle)}
								onClick={handleUpdate}
								className="btn btn--ghost"
							>
								Update
							</button>
							<button
								className="btn btn--ghost"
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
									className="checkbox"
								/>
							</label>
							<span className="todoText" onClick={startEditing}>
								{todo.title}
							</span>
						</div>
						<button
							type="button"
							className="btn btn--ghost"
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
