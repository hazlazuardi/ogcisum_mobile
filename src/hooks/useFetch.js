import { useState, useEffect, useCallback } from 'react';

// Reference:
// *    Title: useAsync
// *    Author: Ragland, G
// *    Date: January 14, 2020
// *    Code version: 1.0
// *    Availability: https://usehooks.com
//

/**
 *
 * @param {Function} asyncFunction - Async function to use.
 * @param {boolean} immediate - Flag to indicate whether to run asynFunction
 * immediately or not.
 * @returns {object} Object containing response status, data, and error.
 */
export default function useFetch(asyncFunction, immediate = true) {
	const [status, setStatus] = useState('idle');
	const [value, setValue] = useState(null);
	const [error, setError] = useState(null);
	// The execute function wraps asyncFunction and
	// handles setting state for pending, value, and error.
	// useCallback ensures the below useEffect is not called
	// on every render, but only if asyncFunction changes.
	const execute = useCallback(() => {
		setStatus('pending');
		setValue(null);
		setError(null);
		return asyncFunction()
			.then((response) => {
				setValue(response);
				setStatus('success');
			})
			.catch((e) => {
				setError(e);
				setStatus('error');
			});
	}, [asyncFunction]);
	// Call execute if we want to fire it right away.
	// Otherwise execute can be called later, such as
	// in an onClick handler.
	useEffect(() => {
		if (immediate) {
			execute();
		}
	}, [execute, immediate]);
	return { execute, status, value, error };
}
