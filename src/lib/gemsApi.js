import { getPrices, getVolume, calcProfit } from "./api.js";

const GEM_PAIRS = {
	1617: { uncut: "Uncut ruby", cutId: 1619, level: 40 },
	1619: { uncut: "Uncut sapphire", cutId: 1621, level: 20 },
	1621: { uncut: "Uncut emerald", cutId: 1623, level: 30 },
	1623: { uncut: "Uncut diamond", cutId: 1625, level: 40 },
	6573: { uncut: "Uncut dragonstone", cutId: 6575, level: 55 },
	6572: { uncut: "Uncut onyx", cutId: 6577, level: 67 },
	6575: { uncut: "Uncut zenyte", cutId: 9244, level: 78 },
	4676: { uncut: "Uncut opal", cutId: 4677, level: 1 },
	4678: { uncut: "Uncut red topaz", cutId: 4679, level: 16 },
	4680: { uncut: "Uncut jade", cutId: 4681, level: 13 }
};

export async function fetchGemPrices() {
	const prices = await getPrices();
	const itemIds = Object.keys(GEM_PAIRS).flatMap(id => [parseInt(id), GEM_PAIRS[id].cutId]);
	const volumes = await getVolume([...new Set(itemIds)]);

	const result = {};
	Object.entries(GEM_PAIRS).forEach(([id, gem]) => {
		const uncutId = parseInt(id);
		const cutId = gem.cutId;
		const uncutPrice = prices[uncutId]?.high;
		const cutPrice = prices[cutId]?.high;

		if (uncutPrice && cutPrice) {
			const profit = calcProfit(uncutPrice, cutPrice);
			result[gem.uncut] = {
				name: gem.uncut,
				uncutId,
				cutId,
				level: gem.level,
				uncutPrice,
				cutPrice,
				profit: profit?.pct || null,
				profitFlat: profit?.flat || null,
				uncutVolume: volumes[uncutId] || 0,
				cutVolume: volumes[cutId] || 0,
				avgVolume: (volumes[uncutId] + volumes[cutId]) / 2 || 0
			};
		}
	});

	return result;
}
