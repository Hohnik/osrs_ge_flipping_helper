/**
 * @typedef {Object} PriceItem
 * @property {number} profitFlat
 */

/**
 * Sort items by profit (highest first)
 * @param {Object.<string, PriceItem>} items - Dictionary of items with profitFlat property
 * @returns {PriceItem[]} Sorted array
 */
export function sortByProfitFlat(items) {
	return Object.values(items).sort(
		(a, b) => (b.profitFlat || -Infinity) - (a.profitFlat || -Infinity)
	);
}

/**
 * Format large numbers with commas for display
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export function formatNumber(num) {
	return num.toLocaleString();
}

/**
 * Calculate color class for volume indicator
 * @param {number} volume - Trading volume
 * @returns {string} CSS class name
 */
export function getVolumeColorClass(volume) {
	if (volume >= 3000) return 'bg-success/20';
	if (volume >= 1000) return 'bg-warning/20';
	return 'bg-error/20';
}

/**
 * Svelte rune utility for common page setup
 * @param {any} form - Form data from SvelteKit
 * @returns {Object} Page setup state
 */
export function usePageSetup(form) {
	let error = $state(null);

	$effect(() => {
		if (form?.error) {
			error = form.error;
		}
	});

	return {
		get error() {
			return error;
		},
		set error(value) {
			error = value;
		}
	};
}

/**
 * Generate placeholder data for testing/display
 * @param {number} count - Number of items
 * @returns {Object[]} Array of placeholder items
 */
export function generatePlaceholders(count = 8) {
	return Array.from({ length: count }, (_, i) => ({
		id: i,
		name: `Item ${i + 1}`,
		profit: 0
	}));
}

/**
 * Get maximum profit for a potion across all doses
 * @param {Object} potionPrices - Potion price data
 * @param {string} potion - Potion name
 * @returns {number|null} Max profit percentage or null
 */
export function getMaxProfit(potionPrices, potion) {
	let maxProfit = -Infinity;
	for (let dose = 1; dose <= 4; dose++) {
		const profit = potionPrices[potion]?.[dose]?.decantProfit;
		if (profit !== null && profit !== undefined) {
			maxProfit = Math.max(maxProfit, profit);
		}
	}
	return maxProfit === -Infinity ? null : maxProfit;
}

/**
 * Get maximum flat profit for a potion across all doses
 * @param {Object} potionPrices - Potion price data
 * @param {string} potion - Potion name
 * @returns {number|null} Max flat profit or null
 */
export function getMaxProfitFlat(potionPrices, potion) {
	let maxProfit = -Infinity;
	for (let dose = 1; dose <= 4; dose++) {
		const profit = potionPrices[potion]?.[dose]?.decantProfitFlat;
		if (profit !== null && profit !== undefined) {
			maxProfit = Math.max(maxProfit, profit);
		}
	}
	return maxProfit === -Infinity ? null : maxProfit;
}

/**
 * Sort potions by maximum flat profit (highest first)
 * @param {Object} potionPrices - Potion price data
 * @param {string[]} potions - Array of potion names
 * @returns {string[]} Sorted potion names
 */
export function sortPotionsByProfit(potionPrices, potions) {
	return (potions || []).sort((a, b) => {
		const profitA = getMaxProfitFlat(potionPrices, a) || -Infinity;
		const profitB = getMaxProfitFlat(potionPrices, b) || -Infinity;
		return profitB - profitA;
	});
}
