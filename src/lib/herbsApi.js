// OSRS Wiki API utilities for herb cleaning

const BASE_URL = "https://prices.runescape.wiki/api/v1/osrs";
const HEADERS = { "User-Agent": "OSRS Herb Cleaner" };

// Herb mapping: grimy herb ID -> clean herb ID with herblore requirements
const HERB_PAIRS = {
	199: { grimy: "Grimy guam leaf", clean: "Guam leaf", cleanId: 249, level: 3 },
	201: { grimy: "Grimy marrentill", clean: "Marrentill", cleanId: 251, level: 5 },
	203: { grimy: "Grimy tarromin", clean: "Tarromin", cleanId: 253, level: 11 },
	205: { grimy: "Grimy harralander", clean: "Harralander", cleanId: 255, level: 20 },
	207: { grimy: "Grimy ranarr weed", clean: "Ranarr weed", cleanId: 257, level: 25 },
	209: { grimy: "Grimy irit leaf", clean: "Irit leaf", cleanId: 259, level: 40 },
	211: { grimy: "Grimy avantoe", clean: "Avantoe", cleanId: 261, level: 48 },
	213: { grimy: "Grimy kwuarm", clean: "Kwuarm", cleanId: 263, level: 54 },
	215: { grimy: "Grimy cadantine", clean: "Cadantine", cleanId: 265, level: 65 },
	217: { grimy: "Grimy dwarf weed", clean: "Dwarf weed", cleanId: 267, level: 70 },
	2485: { grimy: "Grimy lantadyme", clean: "Lantadyme", cleanId: 2486, level: 67 },
	3051: { grimy: "Grimy snapdragon", clean: "Snapdragon", cleanId: 3052, level: 59 }
};

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
 * Calculate herb cleaning profit
 * @param {number} grimyPrice - Price of grimy herb
 * @param {number} cleanPrice - Price of clean herb
 * @returns {Object|null} Object with profitPct and profitFlat, or null if not calculable
 */
export function calculateCleaningProfit(grimyPrice, cleanPrice) {
	if (!grimyPrice || !cleanPrice) return null;

	const GE_CUT = 0.02;
	const revenue = cleanPrice * (1 - GE_CUT);
	const profitFlat = revenue - grimyPrice;
	const profitPct = (profitFlat / grimyPrice) * 100;

	return { profitPct, profitFlat };
}

/**
 * Fetch herb prices and calculate cleaning profits
 * @returns {Promise<Object>} Herb data with prices and profits
 */
export async function fetchHerbPrices() {
	try {
		// Get all item IDs we need
		const allItemIds = new Set();
		for (const [grimyId, data] of Object.entries(HERB_PAIRS)) {
			allItemIds.add(parseInt(grimyId));
			allItemIds.add(data.cleanId);
		}

		// Fetch prices
		const pricesData = await fetchLatestPrices();

		// Fetch volume data
		const volumeData = await fetchVolumeData(Array.from(allItemIds));

		const herbData = {};

		for (const [grimyId, herbInfo] of Object.entries(HERB_PAIRS)) {
			const grimyIdNum = parseInt(grimyId);
			const cleanIdNum = herbInfo.cleanId;

			const grimyPrice = pricesData[grimyIdNum];
			const cleanPrice = pricesData[cleanIdNum];

			if (grimyPrice && cleanPrice) {
				const grimyHigh = grimyPrice.high;
				const cleanHigh = cleanPrice.high;

				const profitData = calculateCleaningProfit(grimyHigh, cleanHigh);

				herbData[herbInfo.grimy] = {
					name: herbInfo.grimy,
					level: herbInfo.level,
					grimyId: grimyIdNum,
					cleanId: cleanIdNum,
					grimyPrice: grimyHigh,
					cleanPrice: cleanHigh,
					profit: profitData?.profitPct || null,
					profitFlat: profitData?.profitFlat || null,
					grimyVolume: volumeData[grimyIdNum]?.avgVolume || 0,
					cleanVolume: volumeData[cleanIdNum]?.avgVolume || 0,
					avgVolume:
						((volumeData[grimyIdNum]?.avgVolume || 0) + (volumeData[cleanIdNum]?.avgVolume || 0)) / 2
				};
			}
		}

		return herbData;
	} catch (error) {
		throw new Error(`Failed to fetch herb prices: ${error.message}`);
	}
}
