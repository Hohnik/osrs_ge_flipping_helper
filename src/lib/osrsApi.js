// OSRS Wiki API utilities for fetching item prices and mappings

const BASE_URL = "https://prices.runescape.wiki/api/v1/osrs";
const HEADERS = { "User-Agent": "OSRS Potion Price Checker" };

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
 * Fetch item ID mapping (name to ID)
 * @returns {Promise<Object>} Item mapping keyed by item name
 */
export async function fetchItemMapping() {
	const response = await fetch(`${BASE_URL}/mapping`, { headers: HEADERS });
	if (!response.ok) {
		throw new Error(`Failed to fetch mapping (Status: ${response.status})`);
	}
	const items = await response.json();
	return Object.fromEntries(items.map(item => [item.name, item.id]));
}

/**
 * Fetch volume data for items from timeseries API
 * @param {number[]} itemIds - Array of item IDs
 * @returns {Promise<Object>} Volume data keyed by item ID
 */
export async function fetchVolumeData(itemIds) {
	const volumeData = {};

	try {
		// Fetch last 24 hours of data (timestep=1h)
		for (const itemId of itemIds) {
			try {
				const response = await fetch(`${BASE_URL}/timeseries?id=${itemId}&timestep=1h`, { headers: HEADERS });
				if (response.ok) {
					const data = await response.json();
					if (data.data && data.data.length > 0) {
						// Calculate average volume from last 24 hours
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
				// Skip individual item errors, continue with others
				console.error(`Failed to fetch volume for item ${itemId}:`, error);
			}
		}
	} catch (error) {
		console.error("Error fetching volume data:", error);
	}

	return volumeData;
}

/**
 * Get guide price (matches in-game guide price)
 * @param {number} high - High price
 * @param {number} low - Low price
 * @returns {number} Guide price
 */
export function getAveragePrice(high, low) {
	return high;
}

/**
 * Calculate decanting profit
 * @param {number} buyPrice - Buy price per dose (what you pay when buying)
 * @param {number} dose - Number of doses in the potion
 * @param {number} sellPrice4Dose - Selling price for 4-dose potion (what you get when selling)
 * @returns {Object|null} Object with profitPct and profitFlat, or null if not calculable
 */
export function calculateDecantingProfit(buyPrice, dose, sellPrice4Dose) {
	if (dose >= 4 || !sellPrice4Dose) return null;

	const totalBuyCost = buyPrice * (4 / dose);
	const GE_CUT = 0.02; // 2% Grand Exchange tax on sales
	const totalSellRevenue = sellPrice4Dose * (1 - GE_CUT); // Subtract 2% GE tax from sell price
	const profitFlat = totalSellRevenue - totalBuyCost;
	const profitPct = (profitFlat / totalBuyCost) * 100;

	return { profitPct, profitFlat };
}

/**
 * Fetch potion prices and calculate decanting profits
 * @param {string[]} potions - List of potion names to fetch
 * @returns {Promise<Object>} Price data organized by potion and dose
 */
export async function fetchPotionPrices(potions) {
	try {
		const [pricesData, itemMapping] = await Promise.all([
			fetchLatestPrices(),
			fetchItemMapping()
		]);

		// Collect all item IDs we need volume for
		const itemIds = new Set();
		for (const potion of potions) {
			for (let dose = 1; dose <= 4; dose++) {
				const potionName = `${potion}(${dose})`;
				const itemId = itemMapping[potionName];
				if (itemId) {
					itemIds.add(itemId);
				}
			}
		}

		// Fetch volume data for all items
		const volumeData = await fetchVolumeData(Array.from(itemIds));

		const potionData = {};

		for (const potion of potions) {
			potionData[potion] = {
				volume: {} // Store volume info per potion
			};

			// Get (4) dose selling price (use low for selling)
			const potion4Name = `${potion}(4)`;
			const item4Id = itemMapping[potion4Name];
			let price4Sell = null;

			if (item4Id && pricesData[item4Id]) {
				const priceInfo = pricesData[item4Id];
				const { low } = priceInfo;
				if (low) {
					price4Sell = low; // Use low price (what you get when selling)
				}
			}

			// Process all doses
			for (let dose = 1; dose <= 4; dose++) {
				const potionName = `${potion}(${dose})`;
				const itemId = itemMapping[potionName];

				if (itemId && pricesData[itemId]) {
					const priceInfo = pricesData[itemId];
					const { high, low } = priceInfo;

					if (high && low) {
						const guidePrice = getAveragePrice(high, low); // Display guide price
						const buyPrice = high; // Use high price for buying (what you pay)
						const pricePerDose = buyPrice / dose;
						const profitData = calculateDecantingProfit(buyPrice, dose, price4Sell);

						potionData[potion][dose] = {
							name: potionName,
							avgPrice: guidePrice,
							pricePerDose,
							decantProfit: profitData?.profitPct || null,
							decantProfitFlat: profitData?.profitFlat || null,
							high,
							low
						};

						// Store volume data for this item
						if (volumeData[itemId]) {
							potionData[potion].volume[dose] = volumeData[itemId].avgVolume;
						}
					} else {
						potionData[potion][dose] = {
							name: potionName,
							error: "Price data unavailable"
						};
					}
				} else {
					potionData[potion][dose] = {
						name: potionName,
						error: "Not found in API"
					};
				}
			}

			// Calculate average volume across all doses for the potion
			const volumes = Object.values(potionData[potion].volume).filter(v => v > 0);
			potionData[potion].avgVolume = volumes.length > 0 ? Math.round(volumes.reduce((a, b) => a + b, 0) / volumes.length) : 0;
		}

		return potionData;
	} catch (error) {
		throw new Error(`Failed to fetch potion prices: ${error.message}`);
	}
}
