import DOMPurify from "dompurify";

export function sanitizeText(input) {
	return DOMPurify.sanitize(String(input).trim(), {
		ALLOWED_TAGS: [],
		ALLOWED_ATTR: [],
	});
}

