import { getPrices, getMapping, getVolume, calcProfit } from "./api.js";

const HERB_PAIRS = {
	199: { grimy: "Grimy guam leaf", cleanId: 249, level: 3 },
	201: { grimy: "Grimy marrentill", cleanId: 251, level: 5 },
	203: { grimy: "Grimy tarromin", cleanId: 253, level: 11 },
	205: { grimy: "Grimy harralander", cleanId: 255, level: 20 },
	207: { grimy: "Grimy ranarr weed", cleanId: 257, level: 25 },
	209: { grimy: "Grimy irit leaf", cleanId: 259, level: 40 },
	211: { grimy: "Grimy avantoe", cleanId: 261, level: 48 },
	213: { grimy: "Grimy kwuarm", cleanId: 263, level: 54 },
	215: { grimy: "Grimy cadantine", cleanId: 265, level: 65 },
	217: { grimy: "Grimy dwarf weed", cleanId: 267, level: 70 },
	2485: { grimy: "Grimy lantadyme", cleanId: 2486, level: 67 },
	3051: { grimy: "Grimy snapdragon", cleanId: 3052, level: 59 }
};

export async function fetchHerbPrices() {
	const prices = await getPrices();
	const itemIds = Object.keys(HERB_PAIRS).flatMap(id => [parseInt(id), HERB_PAIRS[id].cleanId]);
	const volumes = await getVolume([...new Set(itemIds)]);

	const result = {};
	Object.entries(HERB_PAIRS).forEach(([id, herb]) => {
		const grimyId = parseInt(id);
		const cleanId = herb.cleanId;
		const grimyPrice = prices[grimyId]?.high;
		const cleanPrice = prices[cleanId]?.high;

		if (grimyPrice && cleanPrice) {
			const profit = calcProfit(grimyPrice, cleanPrice);
			result[herb.grimy] = {
				name: herb.grimy,
				grimyId,
				cleanId,
				level: herb.level,
				grimyPrice,
				cleanPrice,
				profit: profit?.pct || null,
				profitFlat: profit?.flat || null,
				grimyVolume: volumes[grimyId] || 0,
				cleanVolume: volumes[cleanId] || 0,
				avgVolume: (volumes[grimyId] + volumes[cleanId]) / 2 || 0
			};
		}
	});

	return result;
}
