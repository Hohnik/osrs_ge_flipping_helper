const BASE_URL = "https://prices.runescape.wiki/api/v1/osrs";
const HEADERS = { "User-Agent": "OSRS Trade" };
const GE_TAX = 0.02;

async function fetchAPI(endpoint) {
	const response = await fetch(`${BASE_URL}${endpoint}`, { headers: HEADERS });
	if (!response.ok) throw new Error(`API Error (${response.status})`);
	return response.json();
}

export async function getPrices() {
	const data = await fetchAPI("/latest");
	return data.data;
}

export async function getMapping() {
	const items = await fetchAPI("/mapping");
	return Object.fromEntries(items.map(item => [item.name, item.id]));
}

export async function getMappingById() {
	const items = await fetchAPI("/mapping");
	return Object.fromEntries(items.map(item => [item.id, item]));
}

export async function getVolume(itemIds) {
	const volumeData = {};
	for (const itemId of itemIds) {
		try {
			const data = await fetchAPI(`/timeseries?id=${itemId}&timestep=1h`);
			if (data.data?.length > 0) {
				const volumes = data.data.map(d => (d.highPriceVolume || 0) + (d.lowPriceVolume || 0));
				volumeData[itemId] = Math.round(volumes.reduce((a, b) => a + b) / volumes.length);
			}
		} catch (e) {
			// Skip items with errors
		}
	}
	return volumeData;
}

export function calcProfit(buyPrice, sellPrice, cost = 0) {
	if (!buyPrice || !sellPrice) return null;
	const revenue = sellPrice * (1 - GE_TAX);
	const flat = revenue - buyPrice - cost;
	return { flat, pct: (flat / buyPrice) * 100 };
}

export async function fetchItems(pairs, config = {}) {
	const { nameKey = "name", pairKey = "id", costFn } = config;
	const prices = await getPrices();
	const mapping = await getMapping();
	const itemIds = Object.keys(pairs).flatMap(k => [parseInt(k), pairs[k][pairKey]]);
	const volumes = await getVolume([...new Set(itemIds)]);

	const result = {};
	for (const [id, pair] of Object.entries(pairs)) {
		const buyId = parseInt(id);
		const sellId = pair[pairKey];
		const buyPrice = prices[buyId]?.high;
		const sellPrice = prices[sellId]?.high;

		if (buyPrice && sellPrice) {
			const cost = costFn?.(pair) || 0;
			const profit = calcProfit(buyPrice, sellPrice, cost);
			result[pair[nameKey]] = {
				name: pair[nameKey],
				buy: buyPrice,
				sell: sellPrice,
				profit: profit?.pct || null,
				profitFlat: profit?.flat || null,
				volume: (volumes[buyId] + volumes[sellId]) / 2 || 0
			};
		}
	}
	return result;
}
