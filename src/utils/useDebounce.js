import { useState, useEffect } from "react";

// Custom hook that delays updating a value until
// the user stops changing it for the specified time
function useDebounce(value, delay) {
	// Stores the debounced version of the input value
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		// Update debounced value after the delay
		const timeoutId = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		// Clear timeout if value or delay changes
		// to avoid updating with stale data
		return () => {
			clearTimeout(timeoutId);
		};
	}, [value, delay]);

	return debouncedValue;
}

export default useDebounce;
