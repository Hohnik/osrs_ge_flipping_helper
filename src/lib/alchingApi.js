// OSRS Wiki API utilities for alching

const BASE_URL = "https://prices.runescape.wiki/api/v1/osrs";
const HEADERS = { "User-Agent": "OSRS Alcher" };

// Fire rune cost (essentially negligible for alching, ~5gp)
const FIRE_RUNE_COST = 5;

// Minimum alch value to consider an item worth tracking (in gp)
const MIN_ALCH_VALUE = 1000;

/**
 * Fetch latest prices from OSRS Wiki API
 * @returns {Promise<Object>} Price data keyed by item ID
 */
export async function fetchLatestPrices() {
	const response = await fetch(`${BASE_URL}/latest`, { headers: HEADERS });
	if (!response.ok) {
		throw new Error(`Failed to fetch prices (Status: ${response.status})`);
	}
	return response.json().then(data => data.data);
}

/**
 * Fetch mapping data which includes highalch values and buy limits
 * @returns {Promise<Object>} Mapping data with highalch, lowalch, and buy limits
 */
export async function fetchItemMapping() {
	const response = await fetch(`${BASE_URL}/mapping`, { headers: HEADERS });
	if (!response.ok) {
		throw new Error(`Failed to fetch item mapping (Status: ${response.status})`);
	}
	const items = await response.json();
	const mapping = {};
	for (const item of items) {
		if (item.highalch || item.lowalch) {
			mapping[item.id] = {
				name: item.name,
				highalch: item.highalch || 0,
				lowalch: item.lowalch || 0,
				members: item.members || false,
				limit: item.limit || 0
			};
		}
	}
	return mapping;
}


/**
 * Calculate alching profit for both high and low alch
 * @param {number} gePrice - Current GE price of the item
 * @param {number} highAlchValue - High alch value of the item
 * @param {number} lowAlchValue - Low alch value of the item
 * @returns {Object} Object with profitPct and profitFlat for both high and low alch
 */
export function calculateAlchProfit(gePrice, highAlchValue, lowAlchValue) {
	if (!gePrice) return null;

	const results = {};

	if (highAlchValue) {
		const profitFlat = highAlchValue - gePrice - FIRE_RUNE_COST;
		const profitPct = (profitFlat / gePrice) * 100;
		results.high = { profitPct, profitFlat };
	}

	if (lowAlchValue) {
		const profitFlat = lowAlchValue - gePrice - FIRE_RUNE_COST;
		const profitPct = (profitFlat / gePrice) * 100;
		results.low = { profitPct, profitFlat };
	}

	return results;
}

/**
 * Fetch volume data for items from timeseries API
 * @param {number[]} itemIds - Array of item IDs
 * @returns {Promise<Object>} Volume data keyed by item ID
 */
export async function fetchVolumeData(itemIds) {
	const volumeData = {};

	try {
		for (const itemId of itemIds) {
			try {
				const response = await fetch(`${BASE_URL}/timeseries?id=${itemId}&timestep=1h`, { headers: HEADERS });
				if (response.ok) {
					const data = await response.json();
					if (data.data && data.data.length > 0) {
						const totalHighVolume = data.data.reduce((sum, d) => sum + (d.highPriceVolume || 0), 0);
						const totalLowVolume = data.data.reduce((sum, d) => sum + (d.lowPriceVolume || 0), 0);
						const avgVolume = (totalHighVolume + totalLowVolume) / (data.data.length * 2);

						volumeData[itemId] = {
							highVolume: totalHighVolume,
							lowVolume: totalLowVolume,
							avgVolume: Math.round(avgVolume),
							dataPoints: data.data.length
						};
					}
				}
			} catch (error) {
				console.error(`Failed to fetch volume for item ${itemId}:`, error);
			}
		}
	} catch (error) {
		console.error("Error fetching volume data:", error);
	}

	return volumeData;
}

/**
 * Fetch alching opportunities
 * @returns {Promise<Object>} Items with alch prices, current prices, and profit data
 */
export async function fetchAlchPrices() {
	try {
		// Get all prices
		const pricesData = await fetchLatestPrices();

		// Get item mapping with alch values
		const mappingData = await fetchItemMapping();

		const alchData = {};
		const itemIds = [];

		// First pass: collect all item IDs
		for (const [itemId, mappingInfo] of Object.entries(mappingData)) {
			const itemIdNum = parseInt(itemId);
			if (mappingInfo.highalch >= MIN_ALCH_VALUE) {
				itemIds.push(itemIdNum);
			}
		}

		// Fetch volume data for all items
		const volumeData = await fetchVolumeData(itemIds);

		// Second pass: process items with volume data
		for (const [itemId, mappingInfo] of Object.entries(mappingData)) {
			const itemIdNum = parseInt(itemId);
			const priceInfo = pricesData[itemIdNum];

			// Only include items with high alch value above minimum threshold
			if (priceInfo && mappingInfo && mappingInfo.highalch >= MIN_ALCH_VALUE) {
				const gePrice = priceInfo.high; // What you'd pay to buy
				const highAlch = mappingInfo.highalch;
				const lowAlch = mappingInfo.lowalch;

				const profitData = calculateAlchProfit(gePrice, highAlch, lowAlch);

				const key = `${mappingInfo.name}`;

				alchData[key] = {
					name: mappingInfo.name,
					itemId: itemIdNum,
					gePrice,
					highAlch,
					lowAlch,
					profitHigh: profitData?.high?.profitPct || null,
					profitHighFlat: profitData?.high?.profitFlat || null,
					profitLow: profitData?.low?.profitPct || null,
					profitLowFlat: profitData?.low?.profitFlat || null,
					members: mappingInfo.members,
					buyLimit: mappingInfo.limit,
					volume: volumeData[itemIdNum]?.avgVolume || 0
				};
			}
		}

		return alchData;
	} catch (error) {
		throw new Error(`Failed to fetch alching prices: ${error.message}`);
	}
}
