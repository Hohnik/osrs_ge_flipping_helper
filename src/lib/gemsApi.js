// OSRS Wiki API utilities for gem cutting

const BASE_URL = "https://prices.runescape.wiki/api/v1/osrs";
const HEADERS = { "User-Agent": "OSRS Gem Cutter" };

// Gem mapping: uncut gem ID -> cut gem ID with crafting requirements
const GEM_PAIRS = {
	1617: { uncut: "Uncut ruby", cut: "Ruby", cutId: 1619, level: 40 },
	1619: { uncut: "Uncut sapphire", cut: "Sapphire", cutId: 1621, level: 20 },
	1621: { uncut: "Uncut emerald", cut: "Emerald", cutId: 1623, level: 30 },
	1623: { uncut: "Uncut diamond", cut: "Diamond", cutId: 1625, level: 40 },
	6573: { uncut: "Uncut dragonstone", cut: "Dragonstone", cutId: 6575, level: 55 },
	6572: { uncut: "Uncut onyx", cut: "Onyx", cutId: 6577, level: 67 },
	6575: { uncut: "Uncut zenyte", cut: "Zenyte", cutId: 9244, level: 78 },
	4676: { uncut: "Uncut opal", cut: "Opal", cutId: 4677, level: 1 },
	4678: { uncut: "Uncut red topaz", cut: "Red topaz", cutId: 4679, level: 16 },
	4680: { uncut: "Uncut jade", cut: "Jade", cutId: 4681, level: 13 }
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
 * Calculate gem cutting profit
 * @param {number} uncutPrice - Price of uncut gem
 * @param {number} cutPrice - Price of cut gem
 * @returns {Object|null} Object with profitPct and profitFlat, or null if not calculable
 */
export function calculateCuttingProfit(uncutPrice, cutPrice) {
	if (!uncutPrice || !cutPrice) return null;

	const GE_CUT = 0.02;
	const revenue = cutPrice * (1 - GE_CUT);
	const profitFlat = revenue - uncutPrice;
	const profitPct = (profitFlat / uncutPrice) * 100;

	return { profitPct, profitFlat };
}

/**
 * Fetch gem prices and calculate cutting profits
 * @returns {Promise<Object>} Gem data with prices and profits
 */
export async function fetchGemPrices() {
	try {
		// Get all item IDs we need
		const allItemIds = new Set();
		for (const [uncutId, data] of Object.entries(GEM_PAIRS)) {
			allItemIds.add(parseInt(uncutId));
			allItemIds.add(data.cutId);
		}

		// Fetch prices
		const pricesData = await fetchLatestPrices();

		// Fetch volume data
		const volumeData = await fetchVolumeData(Array.from(allItemIds));

		const gemData = {};

		for (const [uncutId, gemInfo] of Object.entries(GEM_PAIRS)) {
			const uncutIdNum = parseInt(uncutId);
			const cutIdNum = gemInfo.cutId;

			const uncutPrice = pricesData[uncutIdNum];
			const cutPrice = pricesData[cutIdNum];

			if (uncutPrice && cutPrice) {
				const uncutHigh = uncutPrice.high;
				const cutHigh = cutPrice.high;

				const profitData = calculateCuttingProfit(uncutHigh, cutHigh);

				gemData[gemInfo.uncut] = {
					name: gemInfo.uncut,
					cutName: gemInfo.cut,
					level: gemInfo.level,
					uncutId: uncutIdNum,
					cutId: cutIdNum,
					uncutPrice: uncutHigh,
					cutPrice: cutHigh,
					profit: profitData?.profitPct || null,
					profitFlat: profitData?.profitFlat || null,
					uncutVolume: volumeData[uncutIdNum]?.avgVolume || 0,
					cutVolume: volumeData[cutIdNum]?.avgVolume || 0,
					avgVolume:
						((volumeData[uncutIdNum]?.avgVolume || 0) + (volumeData[cutIdNum]?.avgVolume || 0)) / 2
				};
			}
		}

		return gemData;
	} catch (error) {
		throw new Error(`Failed to fetch gem prices: ${error.message}`);
	}
}
