import { getPrices, getMapping, getVolume, calcProfit } from "./api.js";

const POTIONS = [
	"Super combat potion",
	"Prayer potion",
	"Stamina potion",
	"Saradomin brew",
	"Super restore",
	"Super antifire potion",
	"Extended antifire",
	"Anti-venom+"
];

export async function fetchPotionPrices(potions = POTIONS) {
	const prices = await getPrices();
	const mapping = await getMapping();
	const itemIds = new Set();

	potions.forEach(p => {
		for (let d = 1; d <= 4; d++) itemIds.add(mapping[`${p}(${d})`]);
	});

	const volumes = await getVolume([...itemIds].filter(Boolean));
	const result = {};

	potions.forEach(potion => {
		const ids = [1, 2, 3, 4].map(d => mapping[`${potion}(${d})`]).filter(Boolean);
		if (!ids.length) return;

		const sell4 = prices[ids[3]]?.high;
		result[potion] = { volume: {} };

		[1, 2, 3, 4].forEach(dose => {
			const id = mapping[`${potion}(${dose})`];
			const price = prices[id];
			if (!price) return;

			result[potion].volume[dose] = volumes[id] || 0;

			if (dose < 4 && sell4) {
				const buyCost = price.high * (4 / dose);
				const profit = calcProfit(buyCost, sell4);
				result[potion][dose] = {
					high: price.high,
					low: price.low,
					pricePerDose: price.high / dose,
					decantProfit: profit?.pct || null,
					decantProfitFlat: profit?.flat || null
				};
			} else if (dose === 4) {
				result[potion][dose] = {
					high: price.high,
					low: price.low,
					pricePerDose: null,
					decantProfit: null,
					decantProfitFlat: null
				};
			}
		});

		const vols = Object.values(result[potion].volume).filter(v => v > 0);
		result[potion].avgVolume = vols.length ? Math.round(vols.reduce((a, b) => a + b) / vols.length) : 0;
	});

	return result;
}
