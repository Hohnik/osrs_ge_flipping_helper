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
		if (price && item?.highalch) {
			const profit = calcProfit(price.high, item.highalch, FIRE_RUNE_COST);
			result[item.name] = {
				name: item.name,
				gePrice: price.high,
				highAlch: item.highalch,
				lowAlch: item.lowalch,
				profitHigh: profit?.pct || null,
				profitHighFlat: profit?.flat || null,
				volume: volumes[id] || 0,
				members: item.members || false,
				buyLimit: item.limit || 0
			};
		}
	});
	return result;
}
