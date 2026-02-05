import DOMPurify from "dompurify";

export function sanitizeText(input) {
	return DOMPurify.sanitize(String(input).trim(), {
		ALLOWED_TAGS: [],
		ALLOWED_ATTR: [],
	});
}

export function sanitizeSvgIcon({ svgString }) {
	// SAFE - DOMPurify removes script tags and other dangerous elements
	const sanitizedSvg = DOMPurify.sanitize(svgString, {
		USE_PROFILES: { svg: true, svgFilters: true },
	});

	return <span dangerouslySetInnerHTML={{ __html: sanitizedSvg }} />;
}
