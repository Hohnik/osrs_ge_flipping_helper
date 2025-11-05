/**
 * Factory function to create SvelteKit load functions with streaming
 * Reduces boilerplate across all strategy route +page.js files
 *
 * @param {Function} fetchFn - Async function that fetches data
 * @param {Object} [options={}] - Additional data to return
 * @returns {Function} Load function compatible with SvelteKit
 *
 * @example
 * // In +page.js
 * import { createPageLoad } from '$lib/loadFunctions';
 * import { fetchAlchPrices } from '$lib/alchingApi';
 *
 * export const load = createPageLoad(fetchAlchPrices);
 */
export function createPageLoad(fetchFn, options = {}) {
	return () => {
		return {
			streamed: {
				itemData: fetchFn().catch((error) => ({
					error: error.message
				}))
			},
			...options
		};
	};
}

/**
 * Factory function for routes that need static data alongside streamed data
 *
 * @param {Function} fetchFn - Async function that fetches data
 * @param {Object} staticData - Static data to include in return
 * @returns {Function} Load function compatible with SvelteKit
 *
 * @example
 * // In decanting/+page.js
 * import { createPageLoadWithStatic } from '$lib/loadFunctions';
 * import { fetchPotionPrices } from '$lib/potionsApi';
 * const POTIONS = ['Prayer potion', 'Super restore', ...];
 *
 * export const load = createPageLoadWithStatic(
 *   fetchPotionPrices,
 *   { potions: POTIONS, dataKey: 'potionPrices' }
 * );
 */
export function createPageLoadWithStatic(fetchFn, staticData = {}) {
	const { dataKey = 'itemData', ...rest } = staticData;

	return () => {
		return {
			streamed: {
				[dataKey]: fetchFn().catch((error) => ({
					error: error.message
				}))
			},
			...rest
		};
	};
}
