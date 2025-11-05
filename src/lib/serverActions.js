/**
 * Factory function to create a refresh server action
 * Eliminates repetitive try/catch pattern across all strategy routes
 *
 * @param {Function} fetchFn - Async function that fetches and returns data
 * @returns {Object} Actions object with refresh handler
 *
 * @example
 * import { createRefreshAction } from '$lib/serverActions';
 * import { fetchAlchPrices } from '$lib/alchingApi';
 *
 * export const actions = createRefreshAction(fetchAlchPrices);
 */
export function createRefreshAction(fetchFn) {
	return {
		refresh: async () => {
			try {
				const data = await fetchFn();
				return {
					success: true,
					data
				};
			} catch (error) {
				return {
					success: false,
					error: error.message
				};
			}
		}
	};
}

/**
 * Factory function for multiple data fetch server action
 * Useful for routes that fetch multiple data sets
 *
 * @param {Object.<string, Function>} fetchFns - Map of name -> fetch function
 * @returns {Object} Actions object with refresh handler
 *
 * @example
 * export const actions = createMultiRefreshAction({
 *   prices: fetchPrices,
 *   volumes: fetchVolumes
 * });
 */
export function createMultiRefreshAction(fetchFns) {
	return {
		refresh: async () => {
			try {
				const data = {};
				for (const [key, fn] of Object.entries(fetchFns)) {
					data[key] = await fn();
				}
				return {
					success: true,
					data
				};
			} catch (error) {
				return {
					success: false,
					error: error.message
				};
			}
		}
	};
}
