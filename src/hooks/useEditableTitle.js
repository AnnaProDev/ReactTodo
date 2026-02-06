import { useState } from "react";

// Custom hook that encapsulates inline editing logic for a todo title
// Keeps edit state and handlers out of UI components

export function useEditableTitle(initialTitle) {
	// Tracks whether the title is currently in edit mode
	const [isEditing, setIsEditing] = useState(false);
	// Local working copy of the title while editing
	const [workingTitle, setWorkingTitle] = useState(initialTitle);

	const startEditing = () => {
		// Reset working value when entering edit mode
		setWorkingTitle(initialTitle);
		setIsEditing(true);
	};

	const cancelEdit = () => {
		// Discard changes and restore original title
		setWorkingTitle(initialTitle);
		setIsEditing(false);
	};

	const updateTitle = (newTitle) => {
		// Update working value on each input change
		setWorkingTitle(newTitle);
	};

	const finishEdit = () => {
		// Exit edit mode and return the final title to the caller
		setIsEditing(false);
		return workingTitle;
	};

	return {
		isEditing,
		workingTitle,
		startEditing,
		cancelEdit,
		updateTitle,
		finishEdit,
	};
}
