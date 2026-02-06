import { z } from "zod";

// Centralized input length limits to keep validation consistent
export const LIMITS = {
	todoTitle: 120,
	email: 254,
	password: 128,
};
// Schema for validating todo titles before submission
export const todoTitleSchema = z
	.string()
	.trim()
	.min(1, "Title is required.")
	.max(
		LIMITS.todoTitle,
		`Title must be ${LIMITS.todoTitle} characters or less.`,
	);
// Schema for validating login form input
// Ensures correct format and normalizes email value
export const loginSchema = z.object({
	email: z
		.string()
		.trim()
		.min(1, "Email is required.")
		.max(LIMITS.email, `Email must be ${LIMITS.email} characters or less.`)
		.email("Please enter a valid email address.")
		.transform((v) => v.toLowerCase()),
	password: z
		.string()
		.min(1, "Password is required.")
		.max(
			LIMITS.password,
			`Password must be ${LIMITS.password} characters or less.`,
		),
});
// Lightweight helper for quick title checks in UI logic
export function isValidTodoTitle(title) {
	return title.trim() !== "";
}
