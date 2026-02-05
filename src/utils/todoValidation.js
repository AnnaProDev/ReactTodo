import { z } from "zod";

export const LIMITS = {
	todoTitle: 120,
	email: 254,
	password: 128,
};

export const todoTitleSchema = z
	.string()
	.trim()
	.min(1, "Title is required.")
	.max(
		LIMITS.todoTitle,
		`Title must be ${LIMITS.todoTitle} characters or less.`,
	);

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

export function isValidTodoTitle(title) {
	return title.trim() !== "";
}
