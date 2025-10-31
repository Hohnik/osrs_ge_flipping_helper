import { getPrices, getMappingById, getVolume, calcProfit } from "./api.js";

const FIRE_RUNE_COST = 5;
const MIN_ALCH_VALUE = 1000;

export async function fetchAlchPrices() {
	const prices = await getPrices();
	const mappingById = await getMappingById();
	const itemIds = Object.keys(mappingById)
		.map(Number)
		.filter(id => mappingById[id]?.highalch >= MIN_ALCH_VALUE);

	const volumes = await getVolume(itemIds);

	const result = {};
	itemIds.forEach(id => {
		const item = mappingById[id];
		const price = prices[id];
		if (price && item?.highalch && typeof price.high === 'number') {
			const profitHigh = calcProfit(price.high, item.highalch, FIRE_RUNE_COST);
			const profitLow = item.lowalch ? calcProfit(price.high, item.lowalch, FIRE_RUNE_COST) : null;
			result[item.name] = {
				itemId: id,
				name: item.name,
				gePrice: Number(price.high),
				highAlch: Number(item.highalch),
				lowAlch: item.lowalch || 0,
				profitHigh: (profitHigh && typeof profitHigh.pct === 'number') ? profitHigh.pct : null,
				profitHighFlat: (profitHigh && typeof profitHigh.flat === 'number') ? profitHigh.flat : null,
				profitLow: (profitLow && typeof profitLow.pct === 'number') ? profitLow.pct : null,
				profitLowFlat: (profitLow && typeof profitLow.flat === 'number') ? profitLow.flat : null,
				volume: volumes[id] || 0,
				members: item.members || false,
				buyLimit: Number(item.limit || 0)
			};
		}
	});
	return result;
}
