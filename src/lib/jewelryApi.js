import { getPrices, getMappingById, getVolume } from "./api.js";

const GOLD_BAR_ID = 2357;
const GOLD_BAR_PRICE = 109;

// Jewelry types with gem requirements
const JEWELRY_TYPES = {
	sapphire: {
		gemId: 1635,      // Uncut sapphire
		gemName: "Uncut sapphire",
		items: [
			{ name: "Sapphire ring", id: 1637, type: "ring", level: 20 },
			{ name: "Sapphire necklace", id: 1656, type: "necklace", level: 22 },
			{ name: "Sapphire bracelet", id: 11072, type: "bracelet", level: 23 },
			{ name: "Sapphire amulet", id: 1694, type: "amulet", level: 24 }
		]
	},
	emerald: {
		gemId: 1633,      // Uncut emerald
		gemName: "Uncut emerald",
		items: [
			{ name: "Emerald ring", id: 1639, type: "ring", level: 27 },
			{ name: "Emerald necklace", id: 1658, type: "necklace", level: 29 },
			{ name: "Emerald bracelet", id: 11076, type: "bracelet", level: 30 },
			{ name: "Emerald amulet", id: 1696, type: "amulet", level: 31 }
		]
	},
	ruby: {
		gemId: 1631,      // Uncut ruby
		gemName: "Uncut ruby",
		items: [
			{ name: "Ruby ring", id: 1641, type: "ring", level: 34 },
			{ name: "Ruby necklace", id: 1660, type: "necklace", level: 40 },
			{ name: "Ruby bracelet", id: 11085, type: "bracelet", level: 42 },
			{ name: "Ruby amulet", id: 1698, type: "amulet", level: 50 }
		]
	},
	diamond: {
		gemId: 1629,      // Uncut diamond
		gemName: "Uncut diamond",
		items: [
			{ name: "Diamond ring", id: 1643, type: "ring", level: 43 },
			{ name: "Diamond necklace", id: 1662, type: "necklace", level: 56 },
			{ name: "Diamond bracelet", id: 11092, type: "bracelet", level: 57 },
			{ name: "Diamond amulet", id: 1700, type: "amulet", level: 70 }
		]
	}
};

export async function fetchJewelryProfits() {
	const prices = await getPrices();
	const mappingById = await getMappingById();

	const allJewelryIds = [];
	for (const gemType of Object.values(JEWELRY_TYPES)) {
		allJewelryIds.push(gemType.gemId);
		gemType.items.forEach(item => allJewelryIds.push(item.id));
	}

	const volumes = await getVolume(allJewelryIds);

	const result = {};

	for (const [gemName, gemData] of Object.entries(JEWELRY_TYPES)) {
		const gemPrice = Number(prices[gemData.gemId]?.high || 0);
		const goldBarPrice = GOLD_BAR_PRICE;

		result[gemName] = {
			gemName: gemData.gemName,
			gemPrice,
			goldBarPrice,
			items: gemData.items
				.map(item => {
					const craftedPrice = Number(prices[item.id]?.high || 0);
					const profitFlat = craftedPrice - (gemPrice + goldBarPrice);
					const profitPct = craftedPrice > 0 ? (profitFlat / craftedPrice) * 100 : 0;

					return {
						itemId: item.id,
						name: item.name,
						type: item.type,
						level: item.level,
						craftedPrice: craftedPrice,
						profitFlat: Math.round(profitFlat),
						profitPct: Number(profitPct.toFixed(1)),
						volume: volumes[item.id] || 0
					};
				})
				.sort((a, b) => b.profitFlat - a.profitFlat)
		};
	}

	return result;
}
